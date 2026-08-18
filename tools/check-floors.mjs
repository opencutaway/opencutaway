#!/usr/bin/env node
/**
 * Compare live counts to .claude/gate-baseline.json.
 * Keys without _max are floors. Keys ending _max are ceilings.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { collectSuite } from './effect-map.mjs'
import { GOVERNING_FILES } from './check-governing.mjs'
import { HISTORY_FILES_MAX, historyCount, listTrackedFiles, repoRoot } from './file-map.mjs'
import { listSchemaFiles } from '../scripts/lib/ajv-validate.mjs'
import { FEATURES, shippedFeatures } from './feature-map.mjs'
import { DRIFT_PARTS } from './check-lockstep.mjs'

const BASELINE_PATH = path.join(repoRoot, '.claude', 'gate-baseline.json')

function playwrightSpecCount(root = repoRoot) {
  const dir = path.join(root, 'e2e', 'specs')
  return readdirSync(dir).filter((name) => name.endsWith('.spec.ts')).length
}

export function liveCounts() {
  const suite = collectSuite()
  return {
    vitest_files: suite.files.length,
    vitest_cases: suite.rows.length,
    governing_files: GOVERNING_FILES.length,
    history_files: historyCount(listTrackedFiles()),
    history_files_max: HISTORY_FILES_MAX,
    playwright_specs: playwrightSpecCount(),
    schema_files: listSchemaFiles().length,
    shipped_features: shippedFeatures().length,
    declared_features: FEATURES.length,
    drift_parts: DRIFT_PARTS.length
  }
}

export function compare(baseline, live) {
  const problems = []
  if (!Object.prototype.hasOwnProperty.call(baseline, 'history_files_max')) {
    problems.push({ code: 'missing-ceiling', key: 'history_files_max' })
  }
  for (const [key, floor] of Object.entries(baseline)) {
    if (key.endsWith('_max')) {
      const liveKey = key.slice(0, -4)
      const value = live[liveKey] ?? live[key]
      if (typeof value === 'number' && value > floor) {
        problems.push({ code: 'ceiling-exceeded', key, live: value, max: floor })
      }
      continue
    }
    const value = live[key]
    if (typeof value !== 'number') {
      problems.push({ code: 'missing-live', key })
      continue
    }
    if (value < floor) {
      problems.push({ code: 'floor-dropped', key, live: value, floor })
    }
    if (value > floor) {
      problems.push({ code: 'floor-raise-required', key, live: value, floor })
    }
  }
  return problems
}

function main() {
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
  const live = liveCounts()
  const problems = compare(baseline, live)
  console.log(`floors live=${JSON.stringify(live)} baseline=${JSON.stringify(baseline)}`)
  for (const problem of problems) console.error(JSON.stringify(problem))
  if (problems.length > 0) {
    process.exitCode = 1
  } else {
    console.log('floors: ok')
  }
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
