#!/usr/bin/env node
/**
 * G-unit paper-over scan (GIP-C5). Not a 12th named gate.
 * Negative controls live in --self-test.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { listTrackedFiles, repoRoot } from './file-map.mjs'

const SKIP_CALLS = [
  ['it', '.skip'].join(''),
  ['test', '.skip'].join(''),
  ['describe', '.skip'].join('')
]
const ONLY_CALLS = [
  ['it', '.only'].join(''),
  ['test', '.only'].join(''),
  ['describe', '.only'].join('')
]
const XIT = ['x', 'it'].join('')
const XDESCRIBE = ['x', 'describe'].join('')

function callPattern(name) {
  return new RegExp(`${name.replaceAll('.', '\\.')}\\s*\\(`)
}

const SKIP_RES = [
  ...SKIP_CALLS.map(callPattern),
  new RegExp(`\\b${XIT}\\s*\\(`),
  new RegExp(`\\b${XDESCRIBE}\\s*\\(`)
]
const ONLY_RES = ONLY_CALLS.map(callPattern)
const VACUOUS_EXPECT_RE = /expect\s*\(\s*(?:true|false)\s*\)/
const FORCED_SUCCESS_RE =
  /\|\|\s*(?:true\b|exit\s+0\b|process\.exit\s*\(\s*0\s*\))/
const VACUOUS_SCRIPT_RE = /^(?:true|exit\s+0|process\.exit\s*\(\s*0\s*\))$/
// `--retry 2`, `--retry=2`, `--retries 2`, `--retries=2`; `0` is allowed.
const RETRY_FLAG_RE = /--retr(?:y|ies)(?:=|\s+)(?!0\b)\S+/

const CONFIG_EXTENSIONS = ['ts', 'mts', 'js', 'mjs']
// vitest.config.* takes precedence over vite.config.* when both exist.
export const VITEST_CONFIG_FILES = [
  ...CONFIG_EXTENSIONS.map((ext) => `vitest.config.${ext}`),
  ...CONFIG_EXTENSIONS.map((ext) => `vite.config.${ext}`)
]
export const PLAYWRIGHT_CONFIG_FILES = CONFIG_EXTENSIONS.map(
  (ext) => `playwright.config.${ext}`
)
const CONFIG_FILES = new Set([
  'package.json',
  ...VITEST_CONFIG_FILES,
  ...PLAYWRIGHT_CONFIG_FILES
])
const SCAN_ROOTS = ['tests/', 'e2e/', 'scripts/']
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs', '.cjs']

/**
 * Paths the live population must always contain. A filter that drops one of
 * these is a population regression (`population-missing`), not a quiet pass.
 */
export const REQUIRED_SCAN_TARGETS = [
  'package.json',
  'vite.config.ts',
  'playwright.config.ts',
  'tests/gate-integrity.test.ts',
  'e2e/specs/title.spec.ts',
  'scripts/write-test-registry.mjs'
]

// Second, independent statement of the population, used only to cross-check
// `shouldScanRelativePath` in `findPopulationProblems`.
const INDEPENDENT_TREE_RE = /^(?:tests|e2e|scripts)\/.+\.(?:ts|tsx|js|mjs|cjs)$/
const INDEPENDENT_CONFIG_RE =
  /^(?:package\.json|(?:vite|vitest|playwright)\.config\.(?:ts|mts|js|mjs))$/

export function shouldScanRelativePath(relativePath) {
  if (CONFIG_FILES.has(relativePath)) {
    return true
  }
  if (SCAN_ROOTS.some((root) => relativePath.startsWith(root))) {
    return SCAN_EXTENSIONS.some((ext) => relativePath.endsWith(ext))
  }
  return false
}

/**
 * Every `key: value` occurrence whose value is not the literal `0`.
 * Reads whole-file text, so a commented `// retries: 2` is reported too;
 * that is fail-closed by design.
 */
function nonZeroValues(text, key) {
  // Value is either one `{ ... }` object or a token ending at `,` `)` `}`,
  // a quote, or end of line. The key may be bare or quoted: retry, 'retry', "retry".
  const re = new RegExp(`(?:\\b|['"])${key}['"]?\\s*:\\s*(\\{[^}]*\\}|[^,\\n)}'"\`]*)`, 'g')
  const values = []
  for (const match of text.matchAll(re)) {
    const value = match[1].trim()
    if (value !== '0') values.push(value)
  }
  return values
}

export function findPaperOvers(text) {
  const hits = []
  for (const re of SKIP_RES) {
    re.lastIndex = 0
    if (re.test(text)) {
      hits.push({ code: 'skip-mark', detail: re.source })
      break
    }
  }
  for (const re of ONLY_RES) {
    re.lastIndex = 0
    if (re.test(text)) {
      hits.push({ code: 'only-mark', detail: re.source })
      break
    }
  }
  if (VACUOUS_EXPECT_RE.test(text)) {
    hits.push({ code: 'vacuous-expect', detail: 'expect(true|false)' })
  }
  for (const value of nonZeroValues(text, 'retry')) {
    hits.push({ code: 'test-retry-nonzero', detail: `retry: ${value}` })
  }
  for (const value of nonZeroValues(text, 'retries')) {
    hits.push({ code: 'e2e-retries-nonzero', detail: `retries: ${value}` })
  }
  return hits
}

export function findForcedSuccessInPackageJson(text, file = 'package.json') {
  const pkg = JSON.parse(text)
  const problems = []
  for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
    if (typeof cmd !== 'string') continue
    const trimmed = cmd.trim()
    if (FORCED_SUCCESS_RE.test(cmd) || VACUOUS_SCRIPT_RE.test(trimmed)) {
      problems.push({ code: 'forced-success', file, script: name, detail: cmd })
    }
    const flag = RETRY_FLAG_RE.exec(cmd)
    if (flag) {
      problems.push({ code: 'retry-flag', file, script: name, detail: flag[0] })
    }
  }
  return problems
}

export function findConfigProblems(relativePath, text) {
  const problems = []
  if (VITEST_CONFIG_FILES.includes(relativePath)) {
    if (!/\ballowOnly\s*:\s*false\b/.test(text)) {
      problems.push({ code: 'allow-only-missing', file: relativePath })
    }
    for (const value of nonZeroValues(text, 'retry')) {
      problems.push({
        code: 'vitest-retry-nonzero',
        file: relativePath,
        detail: `retry: ${value}`
      })
    }
  }
  if (PLAYWRIGHT_CONFIG_FILES.includes(relativePath)) {
    if (!/\bforbidOnly\s*:\s*true\b/.test(text)) {
      problems.push({ code: 'forbid-only-missing', file: relativePath })
    }
    if (!/\bretries\s*:\s*0\b/.test(text)) {
      problems.push({ code: 'retries-nonzero', file: relativePath })
    }
    for (const value of nonZeroValues(text, 'retries')) {
      problems.push({
        code: 'retries-nonzero',
        file: relativePath,
        detail: `retries: ${value}`
      })
    }
  }
  return problems
}

export function listScanTargets(root = repoRoot, filter = shouldScanRelativePath) {
  return listTrackedFiles(root).filter(filter).sort()
}

/**
 * Compare the scanned population against the required literals and the
 * independent statement of the population. `tracked` is the raw
 * `git ls-files -co --exclude-standard` list.
 */
export function findPopulationProblems(scanned, tracked) {
  const problems = []
  const scannedSet = new Set(scanned)
  const trackedSet = new Set(tracked)
  for (const required of REQUIRED_SCAN_TARGETS) {
    if (!trackedSet.has(required)) {
      problems.push({ code: 'population-missing', file: required, detail: 'not in tree' })
    } else if (!scannedSet.has(required)) {
      problems.push({ code: 'population-missing', file: required, detail: 'not scanned' })
    }
  }
  for (const rel of tracked) {
    const expected = INDEPENDENT_TREE_RE.test(rel) || INDEPENDENT_CONFIG_RE.test(rel)
    if (expected && !scannedSet.has(rel)) {
      problems.push({ code: 'population-missing', file: rel, detail: 'filter dropped it' })
    }
    if (!expected && scannedSet.has(rel)) {
      problems.push({ code: 'population-extra', file: rel })
    }
  }
  return problems
}

export function scanRepo(root = repoRoot) {
  const tracked = listTrackedFiles(root)
  const scanned = tracked.filter(shouldScanRelativePath).sort()
  const problems = findPopulationProblems(scanned, tracked)
  for (const relativePath of scanned) {
    const text = readFileSync(path.join(root, relativePath), 'utf8')
    if (relativePath === 'package.json') {
      problems.push(...findForcedSuccessInPackageJson(text, relativePath))
      continue
    }
    problems.push(...findConfigProblems(relativePath, text))
    if (
      VITEST_CONFIG_FILES.includes(relativePath) ||
      PLAYWRIGHT_CONFIG_FILES.includes(relativePath)
    ) {
      continue
    }
    for (const hit of findPaperOvers(text)) {
      problems.push({ ...hit, file: relativePath })
    }
  }
  return { problems, scanned }
}

export function scanRepoPaperOvers(root = repoRoot) {
  return scanRepo(root).problems
}

const codes = (hits) => hits.map((h) => h.code)

/**
 * Each control returns a failure string or null. The printed count is the
 * length of this list, never a hand-typed number.
 */
const SELF_TEST_CONTROLS = [
  {
    name: 'skip-mark',
    run() {
      const plant = `${SKIP_CALLS[0]}('hidden', () => {})`
      return codes(findPaperOvers(plant)).includes('skip-mark')
        ? null
        : 'skip-mark detector silent'
    }
  },
  {
    name: 'only-mark',
    run() {
      const plant = `${ONLY_CALLS[0]}('solo', () => {})`
      return codes(findPaperOvers(plant)).includes('only-mark')
        ? null
        : 'only-mark detector silent'
    }
  },
  {
    name: 'vacuous-expect',
    run() {
      const plant = ['expect', '(true)'].join('') + '.toBe(true)'
      return codes(findPaperOvers(plant)).includes('vacuous-expect')
        ? null
        : 'vacuous-expect detector silent'
    }
  },
  {
    name: 'clean-test-false-positive',
    run() {
      const clean =
        "it('keeps a real oracle', { retry: 0 }, () => { expect(value).toBe(true); expect(flag).toBeTruthy() })"
      return findPaperOvers(clean).length === 0
        ? null
        : 'false positive on toBeTruthy, expect(value).toBe(true), or retry: 0'
    }
  },
  {
    name: 'forced-success',
    run() {
      const plant = `vitest run || ${['process.exit', '(0)'].join('')}`
      const hits = findForcedSuccessInPackageJson(
        JSON.stringify({ scripts: { check: plant } })
      )
      return codes(hits).includes('forced-success')
        ? null
        : 'forced-success detector silent'
    }
  },
  {
    name: 'allow-only-missing',
    run() {
      const hits = findConfigProblems('vite.config.ts', 'export default { test: {} }')
      return codes(hits).includes('allow-only-missing')
        ? null
        : 'allow-only-missing detector silent'
    }
  },
  {
    name: 'retries-nonzero',
    run() {
      const missing = findConfigProblems(
        'playwright.config.ts',
        'export default { forbidOnly: true, retries: 1 }'
      )
      const projectLevel = findConfigProblems(
        'playwright.config.ts',
        'export default { forbidOnly: true, retries: 0, projects: [{ retries: 2 }] }'
      )
      if (!codes(missing).includes('retries-nonzero')) {
        return 'retries-nonzero detector silent on retries: 1'
      }
      if (!codes(projectLevel).includes('retries-nonzero')) {
        return 'retries-nonzero detector silent on project-level retries: 2 beside retries: 0'
      }
      return null
    }
  },
  {
    name: 'forbid-only-missing',
    run() {
      const absent = findConfigProblems(
        'playwright.config.ts',
        'export default { retries: 0 }'
      )
      const off = findConfigProblems(
        'playwright.config.ts',
        'export default { forbidOnly: false, retries: 0 }'
      )
      if (!codes(absent).includes('forbid-only-missing')) {
        return 'forbid-only-missing detector silent when forbidOnly is absent'
      }
      if (!codes(off).includes('forbid-only-missing')) {
        return 'forbid-only-missing detector silent on forbidOnly: false'
      }
      return null
    }
  },
  {
    name: 'vitest-retry-nonzero',
    run() {
      const numeric = findConfigProblems(
        'vite.config.ts',
        'export default { test: { allowOnly: false, retry: 2 } }'
      )
      const objectForm = findConfigProblems(
        'vitest.config.ts',
        'export default { test: { allowOnly: false, retry: { count: 1 } } }'
      )
      const clean = findConfigProblems(
        'vite.config.ts',
        'export default { test: { allowOnly: false, retry: 0 } }'
      )
      if (!codes(numeric).includes('vitest-retry-nonzero')) {
        return 'vitest-retry-nonzero detector silent on retry: 2 in vite.config.ts'
      }
      if (!codes(objectForm).includes('vitest-retry-nonzero')) {
        return 'vitest-retry-nonzero detector silent on retry: { count: 1 } in vitest.config.ts'
      }
      if (clean.length !== 0) {
        return 'vitest-retry-nonzero false positive on retry: 0'
      }
      return null
    }
  },
  {
    name: 'quoted-retry-keys',
    run() {
      const config = findConfigProblems(
        'vite.config.ts',
        'export default { test: { allowOnly: false, "retry": 2 } }'
      )
      const perTest = findPaperOvers("it('x', { 'retry': 2 }, () => {})")
      const e2e = findPaperOvers("test.describe.configure({ 'retries': 3 })")
      const clean = findPaperOvers("it('x', { 'retry': 0 }, () => {})")
      if (!codes(config).includes('vitest-retry-nonzero')) {
        return 'vitest-retry-nonzero detector silent on a quoted "retry" key'
      }
      if (!codes(perTest).includes('test-retry-nonzero')) {
        return "test-retry-nonzero detector silent on a quoted 'retry' key"
      }
      if (!codes(e2e).includes('e2e-retries-nonzero')) {
        return "e2e-retries-nonzero detector silent on a quoted 'retries' key"
      }
      if (clean.length !== 0) {
        return "quoted-retry-keys false positive on 'retry': 0"
      }
      return null
    }
  },
  {
    name: 'test-retry-nonzero',
    run() {
      const plant = "it('flaky', { retry: 2 }, () => {})"
      const hits = findPaperOvers(plant)
      if (!codes(hits).includes('test-retry-nonzero')) {
        return 'test-retry-nonzero detector silent on per-test retry: 2'
      }
      return null
    }
  },
  {
    name: 'e2e-retries-nonzero',
    run() {
      const plant = "test.describe.configure({ mode: 'serial', retries: 3 })"
      const hits = findPaperOvers(plant)
      if (!codes(hits).includes('e2e-retries-nonzero')) {
        return 'e2e-retries-nonzero detector silent on test.describe.configure retries: 3'
      }
      const clean = findPaperOvers('test.describe.configure({ retries: 0 })')
      if (clean.length !== 0) {
        return 'e2e-retries-nonzero false positive on retries: 0'
      }
      return null
    }
  },
  {
    name: 'retry-flag',
    run() {
      const hits = findForcedSuccessInPackageJson(
        JSON.stringify({
          scripts: {
            'test:e2e': 'playwright test --retries=2',
            test: 'vitest run --retry 1',
            ok: 'playwright test --retries=0'
          }
        })
      )
      const flagged = hits.filter((h) => h.code === 'retry-flag').map((h) => h.script)
      if (!flagged.includes('test:e2e')) {
        return 'retry-flag detector silent on playwright --retries=2'
      }
      if (!flagged.includes('test')) {
        return 'retry-flag detector silent on vitest --retry 1'
      }
      if (flagged.includes('ok')) {
        return 'retry-flag false positive on --retries=0'
      }
      return null
    }
  },
  {
    name: 'scan-filter-literals',
    run() {
      const mustScan = [
        'package.json',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'tests/gate-integrity.test.ts',
        'tests/helpers/repo-files.ts',
        'e2e/specs/title.spec.ts',
        'e2e/helpers/adult-sitting-controls.ts',
        'e2e/pages/title-screen.ts',
        'scripts/write-test-registry.mjs',
        'scripts/lib/pii-scan.mjs'
      ]
      const mustNotScan = [
        'src/app/App.tsx',
        'docs/testing-gauntlet.md',
        'tests/registry.json',
        'tools/check-gate-integrity.mjs',
        'README.md'
      ]
      for (const rel of mustScan) {
        if (!shouldScanRelativePath(rel)) return `filter drops ${rel}`
      }
      for (const rel of mustNotScan) {
        if (shouldScanRelativePath(rel)) return `filter admits ${rel}`
      }
      return null
    }
  },
  {
    name: 'population-regression',
    run() {
      const tracked = listTrackedFiles(repoRoot)
      const full = listScanTargets(repoRoot)
      if (full.length === 0) return 'live scan population is empty'
      const live = findPopulationProblems(full, tracked)
      if (live.length !== 0) {
        return `live population disagrees with the independent filter: ${JSON.stringify(live[0])}`
      }
      const narrowed = listScanTargets(
        repoRoot,
        (rel) => shouldScanRelativePath(rel) && !rel.startsWith('tests/')
      )
      const caught = findPopulationProblems(narrowed, tracked)
      if (!codes(caught).includes('population-missing')) {
        return 'population check silent when the filter drops tests/'
      }
      return null
    }
  }
]

export function runSelfTest() {
  const failures = []
  for (const control of SELF_TEST_CONTROLS) {
    const failure = control.run()
    if (failure) failures.push(`${control.name}: ${failure}`)
  }
  return failures
}

export function selfTestControlCount() {
  return SELF_TEST_CONTROLS.length
}

function main() {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const failures = runSelfTest()
    const total = SELF_TEST_CONTROLS.length
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      console.error(`gate-integrity self-test: ${total - failures.length}/${total} controls`)
      process.exitCode = 1
      return
    }
    console.log(`gate-integrity self-test: ${total}/${total} controls`)
    return
  }
  const { problems, scanned } = scanRepo()
  for (const problem of problems) console.error(JSON.stringify(problem))
  console.log(`gate-integrity: ${problems.length} problems over ${scanned.length} files`)
  if (problems.length > 0) process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
