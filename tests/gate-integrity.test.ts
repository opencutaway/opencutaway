import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import {
  findConfigProblems,
  findForcedSuccessInPackageJson,
  findPaperOvers,
  findPopulationProblems,
  listScanTargets,
  scanRepo,
  scanRepoPaperOvers,
  shouldScanRelativePath
} from '../tools/check-gate-integrity.mjs'
import { readRepoText, repoRoot } from './helpers/repo-files.ts'

// Planted faults are assembled from fragments because this file is itself
// inside the scanned population.
const RETRY_KEY = ['re', 'try'].join('')
const RETRIES_KEY = ['re', 'tries'].join('')

describe('gate integrity paper-over scan', () => {
  it('flags planted skip marks', () => {
    const planted = [['it', '.skip'].join(''), "('hidden', () => {})"].join('')
    expect(findPaperOvers(planted).map((hit) => hit.code)).toContain('skip-mark')
  })

  it('flags planted only marks', () => {
    const planted = [['test', '.only'].join(''), "('solo', () => {})"].join('')
    expect(findPaperOvers(planted).map((hit) => hit.code)).toContain('only-mark')
  })

  it('flags planted vacuous expect true', () => {
    const planted = ['expect', '(true)'].join('')
    expect(findPaperOvers(planted).map((hit) => hit.code)).toContain(
      'vacuous-expect'
    )
  })

  it('does not flag toBeTruthy or expect value toBe true', () => {
    const clean =
      "it('keeps a real oracle', () => { expect(value).toBe(true); expect(flag).toBeTruthy() })"
    expect(findPaperOvers(clean)).toEqual([])
  })

  it('flags a package json script that hides failure', () => {
    const hide = ['vitest run || process.exit', '(0)'].join('')
    const hits = findForcedSuccessInPackageJson(
      JSON.stringify({ scripts: { check: hide } })
    )
    expect(hits.map((hit) => hit.code)).toContain('forced-success')
  })

  it('flags a package json script that passes a retry flag', () => {
    const hits = findForcedSuccessInPackageJson(
      JSON.stringify({
        scripts: {
          e2e: ['playwright test --', RETRIES_KEY, '=2'].join(''),
          unit: ['vitest run --', RETRY_KEY, ' 1'].join(''),
          zero: ['playwright test --', RETRIES_KEY, '=0'].join('')
        }
      })
    )
    const flagged = hits
      .filter((hit) => hit.code === 'retry-flag')
      .map((hit) => hit.script)
      .sort()
    expect(flagged).toEqual(['e2e', 'unit'])
  })

  it('flags a Playwright config with forbidOnly missing or false', () => {
    const absent = findConfigProblems(
      'playwright.config.ts',
      `export default { ${RETRIES_KEY}: 0 }`
    )
    const off = findConfigProblems(
      'playwright.config.ts',
      `export default { forbidOnly: false, ${RETRIES_KEY}: 0 }`
    )
    expect(absent.map((hit) => hit.code)).toEqual(['forbid-only-missing'])
    expect(off.map((hit) => hit.code)).toEqual(['forbid-only-missing'])
  })

  it('flags Playwright retries above zero at top level and per project', () => {
    const top = findConfigProblems(
      'playwright.config.ts',
      `export default { forbidOnly: true, ${RETRIES_KEY}: 1 }`
    )
    const project = findConfigProblems(
      'playwright.config.ts',
      `export default { forbidOnly: true, ${RETRIES_KEY}: 0, projects: [{ ${RETRIES_KEY}: 2 }] }`
    )
    expect(top.map((hit) => hit.code)).toEqual([
      'retries-nonzero',
      'retries-nonzero'
    ])
    expect(project.map((hit) => hit.code)).toEqual(['retries-nonzero'])
    expect(project[0]?.detail).toBe(`${RETRIES_KEY}: 2`)
  })

  it('flags vitest retry above zero in vite.config.ts and vitest.config.ts', () => {
    const numeric = findConfigProblems(
      'vite.config.ts',
      `export default { test: { allowOnly: false, ${RETRY_KEY}: 2 } }`
    )
    const objectForm = findConfigProblems(
      'vitest.config.ts',
      `export default { test: { allowOnly: false, ${RETRY_KEY}: { count: 1 } } }`
    )
    const clean = findConfigProblems(
      'vitest.config.ts',
      `export default { test: { allowOnly: false, ${RETRY_KEY}: 0 } }`
    )
    expect(numeric.map((hit) => hit.code)).toEqual(['vitest-retry-nonzero'])
    expect(numeric[0]?.detail).toBe(`${RETRY_KEY}: 2`)
    expect(objectForm.map((hit) => hit.code)).toEqual(['vitest-retry-nonzero'])
    expect(objectForm[0]?.detail).toBe(`${RETRY_KEY}: { count: 1 }`)
    expect(clean).toEqual([])
  })

  it('flags a per-test retry option in a test file', () => {
    const planted = `it('flaky', { ${RETRY_KEY}: 2 }, () => {})`
    const hits = findPaperOvers(planted)
    expect(hits.map((hit) => hit.code)).toEqual(['test-retry-nonzero'])
    expect(hits[0]?.detail).toBe(`${RETRY_KEY}: 2`)
    expect(findPaperOvers(`it('steady', { ${RETRY_KEY}: 0 }, () => {})`)).toEqual(
      []
    )
  })

  it('flags retry keys written in quotes', () => {
    expect(
      findPaperOvers(`it('flaky', { '${RETRY_KEY}': 2 }, () => {})`).map((hit) => hit.code)
    ).toEqual(['test-retry-nonzero'])
    expect(
      findPaperOvers(`test.describe.configure({ "${RETRIES_KEY}": 3 })`).map((hit) => hit.code)
    ).toEqual(['e2e-retries-nonzero'])
    expect(
      findConfigProblems(
        'vite.config.ts',
        `export default { test: { allowOnly: false, "${RETRY_KEY}": 2 } }`
      ).map((problem) => problem.code)
    ).toEqual(['vitest-retry-nonzero'])
    expect(findPaperOvers(`it('steady', { '${RETRY_KEY}': 0 }, () => {})`)).toEqual([])
  })

  it('flags Playwright describe configure retries in an e2e file', () => {
    const planted = `test.describe.configure({ mode: 'serial', ${RETRIES_KEY}: 3 })`
    const hits = findPaperOvers(planted)
    expect(hits.map((hit) => hit.code)).toEqual(['e2e-retries-nonzero'])
    expect(hits[0]?.detail).toBe(`${RETRIES_KEY}: 3`)
    expect(
      findPaperOvers(`test.describe.configure({ ${RETRIES_KEY}: 0 })`)
    ).toEqual([])
  })

  it('scans tests, e2e, scripts, and the three config files only', () => {
    expect(shouldScanRelativePath('package.json')).toBe(true)
    expect(shouldScanRelativePath('vite.config.ts')).toBe(true)
    expect(shouldScanRelativePath('vitest.config.ts')).toBe(true)
    expect(shouldScanRelativePath('playwright.config.ts')).toBe(true)
    expect(shouldScanRelativePath('tests/gate-integrity.test.ts')).toBe(true)
    expect(shouldScanRelativePath('e2e/specs/title.spec.ts')).toBe(true)
    expect(shouldScanRelativePath('e2e/helpers/adult-sitting-controls.ts')).toBe(true)
    expect(shouldScanRelativePath('scripts/write-test-registry.mjs')).toBe(true)
    expect(shouldScanRelativePath('scripts/lib/pii-scan.mjs')).toBe(true)
    expect(shouldScanRelativePath('src/app/App.tsx')).toBe(false)
    expect(shouldScanRelativePath('tools/check-gate-integrity.mjs')).toBe(false)
    expect(shouldScanRelativePath('tests/registry.json')).toBe(false)
    expect(shouldScanRelativePath('docs/testing-gauntlet.md')).toBe(false)
  })

  it('scans the whole population the tree holds', () => {
    const scanned = listScanTargets()
    expect(scanned.length).toBeGreaterThanOrEqual(27)
    expect(scanned).toContain('package.json')
    expect(scanned).toContain('vite.config.ts')
    expect(scanned).toContain('playwright.config.ts')
    expect(scanned).toContain('tests/gate-integrity.test.ts')
    expect(scanned).toContain('tests/helpers/repo-files.ts')
    expect(scanned).toContain('e2e/specs/title.spec.ts')
    expect(scanned).toContain('e2e/helpers/adult-sitting-controls.ts')
    expect(scanned).toContain('e2e/pages/title-screen.ts')
    expect(scanned).toContain('scripts/write-test-registry.mjs')
    expect(scanned).toContain('scripts/lib/pii-scan.mjs')
    expect(scanned).not.toContain('src/app/App.tsx')
    expect(scanned).not.toContain('tests/registry.json')

    // Independent population: git plus a regex written here, not the scanner's filter.
    const independent = execFileSync(
      'git',
      ['ls-files', '-co', '--exclude-standard'],
      { cwd: repoRoot, encoding: 'utf8' }
    )
      .split(/\r?\n/)
      .filter(Boolean)
      .map((rel) => rel.replaceAll('\\', '/'))
      .filter(
        (rel) =>
          /^(?:tests|e2e|scripts)\/.+\.(?:ts|tsx|js|mjs|cjs)$/.test(rel) ||
          /^(?:package\.json|(?:vite|vitest|playwright)\.config\.(?:ts|mts|js|mjs))$/.test(
            rel
          )
      )
      .sort()
    expect(scanned).toEqual(independent)
  })

  it('reports a narrowed filter as a population regression', () => {
    const tracked = ['package.json', 'vite.config.ts', 'playwright.config.ts', 'tests/gate-integrity.test.ts', 'e2e/specs/title.spec.ts', 'scripts/write-test-registry.mjs', 'src/app/App.tsx']
    const full = tracked.filter(shouldScanRelativePath)
    expect(findPopulationProblems(full, tracked)).toEqual([])
    const narrowed = full.filter((rel) => !rel.startsWith('tests/'))
    expect(findPopulationProblems(narrowed, tracked)).toEqual([
      {
        code: 'population-missing',
        file: 'tests/gate-integrity.test.ts',
        detail: 'not scanned'
      },
      {
        code: 'population-missing',
        file: 'tests/gate-integrity.test.ts',
        detail: 'filter dropped it'
      }
    ])
    expect(findPopulationProblems(['src/app/App.tsx', ...full], tracked)).toEqual([
      { code: 'population-extra', file: 'src/app/App.tsx' }
    ])
    expect(
      findPopulationProblems(
        full.filter((rel) => rel !== 'e2e/specs/title.spec.ts'),
        tracked.filter((rel) => rel !== 'e2e/specs/title.spec.ts')
      )
    ).toEqual([
      {
        code: 'population-missing',
        file: 'e2e/specs/title.spec.ts',
        detail: 'not in tree'
      }
    ])
  })

  it('finds no paper-over in tracked tests and scripts', () => {
    const { problems, scanned } = scanRepo()
    expect(problems).toEqual([])
    expect(scanned.length).toBeGreaterThanOrEqual(27)
    expect(scanned).toEqual(listScanTargets())
    expect(scanRepoPaperOvers()).toEqual([])
  })

  it('keeps vitest allowOnly false and Playwright retries at 0', () => {
    const vite = readRepoText('vite.config.ts')
    const playwright = readRepoText('playwright.config.ts')
    expect(vite.includes('allowOnly: false')).toBe(true)
    expect(playwright.includes('forbidOnly: true')).toBe(true)
    expect(playwright.includes('retries: 0')).toBe(true)
    expect(
      findConfigProblems('vite.config.ts', vite).map((hit) => hit.code)
    ).toEqual([])
    expect(
      findConfigProblems('playwright.config.ts', playwright).map(
        (hit) => hit.code
      )
    ).toEqual([])
  })
})
