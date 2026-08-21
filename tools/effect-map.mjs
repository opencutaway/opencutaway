#!/usr/bin/env node
/**
 * Generated effect map: one row per executable vitest test.
 * Do not hand-edit docs/effect-map.md.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderGeneratedPreamble, repoRoot } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'effect-map.md')

/** Per-file declarations small enough to stay true. */
export const FILE_META = {
  'tests/title.test.ts': {
    protects: 'The title names Open Cutaway and offers Get across and Lights.',
    doesNotProve: 'Sittings 3–11 or Challenge.',
    oracle: 'Literal title string Open Cutaway and control labels Get across and Lights.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-BOOTSTRAP-TITLE']
  },
  'tests/hit-target.test.ts': {
    protects: 'Child-facing hit targets stay at 44 CSS pixels; the busy block is SVG without WebGL.',
    doesNotProve: 'That 44px is enough for every future control, or that SVG is the only allowed 2D renderer.',
    oracle: 'Literal min-height and min-width 44px in src/index.css; BusyBlock contains <svg and not webgl.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-HIT-TARGET']
  },
  'tests/schema-examples.test.ts': {
    protects: 'Committed examples match schema; unsafe and cloud-sync instances fail.',
    doesNotProve: 'A filled catalog.',
    oracle: 'Ajv true/false with literal fixtures.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-SCHEMA-EXAMPLES', 'TEST-SCHEMA-INVALID']
  },
  'tests/pii-scan.test.ts': {
    protects: 'Tracked files have no email-like or user-folder markers; detector fires on constructed samples.',
    doesNotProve: 'Paraphrased personal facts.',
    oracle: 'Empty findings list; constructed samples match kinds.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-PII-SCRUB']
  },
  'tests/client-gates.test.ts': {
    protects: 'src/ has none of the banned client tokens; detector fires on a constructed token.',
    doesNotProve: 'A newly named SDK.',
    oracle: 'Empty findings; constructed getUserMedia is flagged.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-CLIENT-HARD-STOPS']
  },
  'tests/forbidden-dependencies.test.ts': {
    protects: 'package.json does not declare banned SDKs; detector fires on a sample openai entry.',
    doesNotProve: 'Transitive CVE scanning.',
    oracle: 'Empty name list for committed package.json.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-FORBIDDEN-DEPENDENCIES']
  },
  'tests/gate-integrity.test.ts': {
    protects: 'Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false.',
    doesNotProve: 'That G-e2e ran, or that a paraphrase of a skip exists in docs.',
    oracle: 'Planted skip/.only/expect(true)/forced-success fire; live scan is empty; vite.config.ts contains allowOnly: false.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-GATE-INTEGRITY']
  },
  'tests/workflow-graph.test.ts': {
    protects: 'Example workflow is build-time, capped, and has a kid-facing human gate.',
    doesNotProve: 'An executable runner.',
    oracle: 'Ajv plus literal locus and gate flags.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-WORKFLOW-GRAPH']
  },
  'tests/registry-coverage.test.ts': {
    protects: 'Every taxonomy category is named by a test or an exclusion, never both.',
    doesNotProve: 'That exclusions are the right product call.',
    oracle: 'Empty missing/extra/dual lists.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-REGISTRY-COVERAGE']
  },
  'tests/schema-inventory.test.ts': {
    protects: 'Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail.',
    doesNotProve: 'Sittings 3–11 or a filled object catalog.',
    oracle: 'Literal schema path list; Ajv true/false on fixtures.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-SCHEMA-INVENTORY']
  },
  'tests/widen-sitting-1.test.ts': {
    protects: 'Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer.',
    doesNotProve: 'Sittings 3–11, Challenge, or the human copy gate.',
    oracle: 'Ajv true/false plus literal names Traffic signal, Crosswalk, Crossing gates.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-WIDEN-SITTING-1']
  },
  'tests/widen-sitting-2.test.ts': {
    protects: 'Widen sitting 2 validates, uses real names, and keeps crossing objects quiet.',
    doesNotProve: 'Sittings 3–11, Challenge, the dam sitting, or the human copy gate.',
    oracle: 'Ajv true/false plus literal names Utility pole, Overhead conductor, Distribution transformer.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-WIDEN-SITTING-2']
  },
  'tests/hotspot-layout.test.ts': {
    protects: 'Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9).',
    doesNotProve: 'Rendered sizes in a browser; the Playwright reachability step proves those.',
    oracle: 'findHotspotLayoutProblems returns [] for the committed sittings and literal problem codes for planted overlapping, narrow, short, and off-block boxes.',
    platform: 'Node vitest',
    mutantFamily: 'none',
    evidence: 'vitest',
    registryIds: ['TEST-HOTSPOT-LAYOUT']
  }
}

const NON_VITEST_AUTOMATED = new Set([
  'TEST-BUILD',
  'TEST-E2E-TITLE',
  'TEST-E2E-STUB-MODES',
  'TEST-E2E-WIDEN-1',
  'TEST-E2E-WIDEN-2'
])

const IT_RE = /(?:^|\n)\s*(?:it|test)\(\s*(['"`])([\s\S]*?)\1/g

export function listTestFiles(root = repoRoot) {
  const dir = path.join(root, 'tests')
  const out = []
  function walk(abs, relPosix) {
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (entry.name === 'node_modules') continue
      const childAbs = path.join(abs, entry.name)
      const childRel = `${relPosix}/${entry.name}`
      if (entry.isDirectory()) {
        walk(childAbs, childRel)
        continue
      }
      if (entry.name.endsWith('.test.ts')) out.push(childRel)
    }
  }
  walk(dir, 'tests')
  return out.sort()
}

export function extractTests(relativePath, root = repoRoot) {
  const text = readFileSync(path.join(root, relativePath), 'utf8')
  const names = []
  for (const match of text.matchAll(IT_RE)) {
    names.push(match[2].replace(/\s+/g, ' ').trim())
  }
  return names
}

export function collectSuite(root = repoRoot) {
  const files = listTestFiles(root)
  const rows = []
  for (const file of files) {
    const names = extractTests(file, root)
    const meta = FILE_META[file]
    for (const name of names) {
      rows.push({ file, name, meta })
    }
  }
  return { files, rows }
}

export function generateMarkdown(suite = collectSuite()) {
  const lines = [
    ...renderGeneratedPreamble({
      title: 'Effect map',
      source: 'tools/effect-map.mjs',
      artifact: 'docs/effect-map.md',
      gate: 'G-effect',
      must: [
        'Every `tests/**/*.test.ts` file has a `FILE_META` row.',
        'Every `FILE_META.registryIds` id exists in `tests/registry.json`.',
        'Regenerate (`node tools/effect-map.mjs`) so this artifact byte-matches `generateMarkdown()`.'
      ],
      mustNot: [
        'Hand-edit this file.',
        'Treat this map as a seventh named drift part. It supports Gates only.',
        'Leave a vitest file unlinked from the registry.'
      ],
      negativeControls: ['missing-file-meta', 'row-for-missing-file', 'registry-unlinked', 'vitest-unlinked'],
      notOwn:
        '**Does not own** the gate contract or product behaviour. **Supports:** Gates. **Not** a seventh named drift part.',
      cannotSee: ['That a test is the right test.', 'Paraphrased product drift.']
    }),
    `Executable tests: ${suite.rows.length} over ${suite.files.length} files.`,
    '',
    '## Per-file declarations',
    '',
    '| file | protects | does not prove | oracle | platform |',
    '|---|---|---|---|---|'
  ]
  for (const file of suite.files) {
    const meta = FILE_META[file]
    if (!meta) {
      lines.push(`| \`${file}\` | MISSING META | | | |`)
      continue
    }
    lines.push(
      `| \`${file}\` | ${meta.protects} | ${meta.doesNotProve} | ${meta.oracle} | ${meta.platform} |`
    )
  }
  lines.push('', '## Per-test rows', '', '| file | test | protects | does not prove |', '|---|---|---|---|')
  for (const row of suite.rows) {
    const protects = row.meta?.protects ?? 'MISSING META'
    const doesNot = row.meta?.doesNotProve ?? ''
    lines.push(`| \`${row.file}\` | ${row.name} | ${protects} | ${doesNot} |`)
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function findProblems(suite = collectSuite(), root = repoRoot) {
  const problems = []
  for (const file of suite.files) {
    if (!FILE_META[file]) {
      problems.push({ code: 'missing-file-meta', file })
    }
  }
  for (const declared of Object.keys(FILE_META)) {
    if (!suite.files.includes(declared)) {
      problems.push({ code: 'row-for-missing-file', file: declared })
    }
  }
  const expected = generateMarkdown(suite)
  let actual = ''
  try {
    actual = readFileSync(path.join(root, 'docs', 'effect-map.md'), 'utf8')
  } catch {
    actual = ''
  }
  if (actual !== expected) {
    problems.push({ code: 'map-stale', file: 'docs/effect-map.md' })
  }

  let registry
  try {
    registry = JSON.parse(readFileSync(path.join(root, 'tests', 'registry.json'), 'utf8'))
  } catch {
    problems.push({ code: 'registry-missing', file: 'tests/registry.json' })
    return problems
  }

  for (const meta of Object.values(FILE_META)) {
    for (const id of meta.registryIds) {
      if (!registry.tests?.[id]) {
        problems.push({ code: 'registry-missing-id', id })
      }
    }
  }
  const linkedIds = new Set(
    Object.values(FILE_META).flatMap((meta) => meta.registryIds)
  )
  for (const id of Object.keys(registry.tests ?? {})) {
    const entry = registry.tests[id]
    if (entry.classification?.execution_mode !== 'automated') continue
    if (NON_VITEST_AUTOMATED.has(id)) continue
    if (!linkedIds.has(id)) {
      problems.push({ code: 'registry-unlinked', id })
    }
  }
  for (const file of suite.files) {
    const ids = FILE_META[file]?.registryIds ?? []
    if (ids.length === 0) {
      problems.push({ code: 'vitest-unlinked', file })
    }
  }
  return problems
}

export function runSelfTest() {
  const failures = []
  const nestedDir = path.join(repoRoot, 'tests', '_nested-control')
  const nestedFile = path.join(nestedDir, 'planted.test.ts')
  mkdirSync(nestedDir, { recursive: true })
  writeFileSync(nestedFile, "it('planted nested', () => {})\n")
  try {
    const found = listTestFiles()
    if (!found.includes('tests/_nested-control/planted.test.ts')) {
      failures.push('nested test discovery silent')
    }
  } finally {
    rmSync(nestedDir, { recursive: true, force: true })
  }
  if (listTestFiles().includes('tests/_nested-control/planted.test.ts')) {
    failures.push('nested plant leaked after cleanup')
  }

  const suite = collectSuite()
  const baseline = findProblems(suite)
  const staleOnly = baseline.filter((p) => p.code === 'map-stale')
  void staleOnly

  const missingMeta = findProblems({
    files: [...suite.files, 'tests/ghost.test.ts'],
    rows: [
      ...suite.rows,
      { file: 'tests/ghost.test.ts', name: 'ghost', meta: undefined }
    ]
  })
  if (!missingMeta.some((p) => p.code === 'missing-file-meta' && p.file === 'tests/ghost.test.ts')) {
    failures.push('missing-file-meta detector silent')
  }

  const extraRow = findProblems({
    files: suite.files.filter((f) => f !== suite.files[0]),
    rows: suite.rows.filter((r) => r.file !== suite.files[0])
  })
  if (!extraRow.some((p) => p.code === 'row-for-missing-file' && p.file === suite.files[0])) {
    failures.push('row-for-missing-file detector silent')
  }

  return failures
}

function main() {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const failures = runSelfTest()
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      process.exitCode = 1
      return
    }
    console.log('effect-map self-test: 3/3 controls')
    return
  }
  const suite = collectSuite()
  if (arg === '--check') {
    const problems = findProblems(suite)
    for (const problem of problems) console.error(JSON.stringify(problem))
    console.log(
      `effect-map: ${suite.rows.length} tests over ${suite.files.length} files, ${problems.length} problems`
    )
    if (problems.length > 0) process.exitCode = 1
    return
  }
  writeFileSync(MAP_PATH, generateMarkdown(suite), 'utf8')
  console.log(`wrote docs/effect-map.md (${suite.rows.length} tests)`)
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
