#!/usr/bin/env node
/**
 * Lockstep check for the six drift-prevention parts.
 * They must all exist and agree. Do not collapse them into fewer artifacts.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { CODE_ROWS } from './code-map.mjs'
import { FEATURES } from './feature-map.mjs'
import { TUTORIALS } from './tutorial-manifest.mjs'
import { repoRoot } from './file-map.mjs'

export const DRIFT_PARTS = [
  {
    id: 'DRIFT-OWNERS',
    name: 'Owners',
    source: 'tools/file-map.mjs',
    generated: 'docs/file-map.md',
    baseline: null,
    gate: 'G-map'
  },
  {
    id: 'DRIFT-CODE-MAP',
    name: 'Code map',
    source: 'tools/code-map.mjs',
    generated: 'docs/code-map.md',
    baseline: null,
    gate: 'G-lockstep'
  },
  {
    id: 'DRIFT-FEATURE-MAP',
    name: 'Feature map',
    source: 'tools/feature-map.mjs',
    generated: 'docs/feature-map.md',
    baseline: null,
    gate: 'G-lockstep'
  },
  {
    id: 'DRIFT-TUTORIAL',
    name: 'Tutorial manifest',
    source: 'tools/tutorial-manifest.mjs',
    generated: 'docs/tutorial-manifest.md',
    baseline: null,
    gate: 'G-lockstep'
  },
  {
    id: 'DRIFT-BLAST',
    name: 'Blast radius',
    source: 'tools/blast-radius.mjs',
    generated: null,
    baseline: null,
    gate: 'G-blast'
  },
  {
    id: 'DRIFT-GATES',
    name: 'Gates',
    source: 'docs/testing-gauntlet.md',
    generated: null,
    baseline: '.claude/gate-baseline.json',
    gate: 'G-floors'
  }
]

export function requiredPartFiles(part) {
  const files = [{ file: part.source, code: 'part-source-missing' }]
  if (part.generated) files.push({ file: part.generated, code: 'part-generated-missing' })
  if (part.baseline) files.push({ file: part.baseline, code: 'part-source-missing' })
  return files
}

export function missingPartFiles(
  parts = DRIFT_PARTS,
  exists = (rel) => existsSync(path.join(repoRoot, rel))
) {
  const problems = []
  for (const part of parts) {
    for (const item of requiredPartFiles(part)) {
      if (!exists(item.file)) {
        problems.push({ code: item.code, name: part.name, file: item.file })
      }
    }
  }
  return problems
}

export function findProblems(root = repoRoot) {
  const problems = []
  if (DRIFT_PARTS.length !== 6) {
    problems.push({ code: 'drift-parts-count', live: DRIFT_PARTS.length })
  }
  problems.push(...missingPartFiles(DRIFT_PARTS, (rel) => existsSync(path.join(root, rel))))

  const featureIds = new Set(FEATURES.map((feature) => feature.id))
  const tutorialIds = new Set(TUTORIALS.map((row) => row.id))
  const codeById = new Map(CODE_ROWS.map((row) => [row.id, row]))
  const specText = readFileSync(path.join(root, 'SPEC.md'), 'utf8')

  for (const feature of FEATURES) {
    if (!specText.includes(feature.id)) {
      problems.push({ code: 'feature-missing-from-spec', id: feature.id })
    }
    for (const tutorialId of feature.tutorialIds) {
      if (!tutorialIds.has(tutorialId)) {
        problems.push({
          code: 'feature-tutorial-missing',
          feature: feature.id,
          tutorial: tutorialId
        })
      }
    }
    for (const schemaId of feature.schemaIds) {
      const code = codeById.get(schemaId)
      if (!code) {
        problems.push({
          code: 'feature-code-row-missing',
          feature: feature.id,
          schemaId
        })
        continue
      }
      for (const spec of code.e2eSpecs ?? []) {
        if (!(feature.e2eSpecs ?? []).includes(spec)) {
          problems.push({
            code: 'feature-e2e-spec-missing',
            feature: feature.id,
            schemaId,
            file: spec
          })
        }
      }
    }
    if (!Array.isArray(feature.e2eSpecs) || feature.e2eSpecs.length === 0) {
      problems.push({ code: 'missing-e2e-spec', id: feature.id })
    } else {
      for (const spec of feature.e2eSpecs) {
        if (!existsSync(path.join(root, spec))) {
          problems.push({
            code: 'e2e-spec-missing-on-disk',
            id: feature.id,
            file: spec
          })
        }
      }
    }
  }

  for (const tutorial of TUTORIALS) {
    if (!featureIds.has(tutorial.featureId)) {
      problems.push({
        code: 'tutorial-feature-missing',
        tutorial: tutorial.id,
        feature: tutorial.featureId
      })
    }
  }

  for (const feature of FEATURES.filter((row) => row.status === 'shipped')) {
    const taught = feature.tutorialIds.filter((id) => {
      const row = TUTORIALS.find((tutorial) => tutorial.id === id)
      return row?.status === 'taught'
    })
    if (taught.length === 0) {
      problems.push({ code: 'shipped-feature-untaught', id: feature.id })
    }
    if ((feature.schemaIds ?? []).length === 0) {
      problems.push({ code: 'shipped-feature-without-schema', id: feature.id })
    }
  }

  return problems
}

export function runSelfTest() {
  const failures = []
  if (DRIFT_PARTS.length !== 6) {
    failures.push('drift parts must stay at six')
  }
  const names = DRIFT_PARTS.map((part) => part.name)
  for (const required of [
    'Owners',
    'Code map',
    'Feature map',
    'Tutorial manifest',
    'Blast radius',
    'Gates'
  ]) {
    if (!names.includes(required)) {
      failures.push(`missing named part ${required}`)
    }
  }

  const gates = DRIFT_PARTS.find((part) => part.name === 'Gates')
  if (
    !gates ||
    gates.source !== 'docs/testing-gauntlet.md' ||
    gates.baseline !== '.claude/gate-baseline.json'
  ) {
    failures.push('Gates files are not docs/testing-gauntlet.md plus .claude/gate-baseline.json')
  }

  const missingBaseline = missingPartFiles(
    [
      {
        id: 'DRIFT-GATES',
        name: 'Gates',
        source: 'docs/testing-gauntlet.md',
        generated: null,
        baseline: '.claude/gate-baseline.json',
        gate: 'G-floors'
      }
    ],
    (rel) => rel !== '.claude/gate-baseline.json'
  )
  if (
    !missingBaseline.some(
      (p) => p.code === 'part-source-missing' && p.file === '.claude/gate-baseline.json'
    )
  ) {
    failures.push('part-source-missing detector silent for gate-baseline.json')
  }

  const ghostFeature = FEATURES[0]
  const originalTutorials = ghostFeature.tutorialIds
  ghostFeature.tutorialIds = ['TUT-DOES-NOT-EXIST']
  try {
    const problems = findProblems()
    if (!problems.some((p) => p.code === 'feature-tutorial-missing')) {
      failures.push('feature-tutorial-missing detector silent')
    }
  } finally {
    ghostFeature.tutorialIds = originalTutorials
  }

  const learn = FEATURES.find((feature) => feature.id === 'FEAT-LEARN')
  const originalLearnSpecs = learn.e2eSpecs
  learn.e2eSpecs = ['e2e/specs/widen-1-get-across.spec.ts']
  try {
    const problems = findProblems()
    if (
      !problems.some(
        (p) =>
          p.code === 'feature-e2e-spec-missing' &&
          p.file === 'e2e/specs/widen-2-lights.spec.ts'
      )
    ) {
      failures.push('feature-e2e-spec-missing detector silent for sitting 2')
    }
  } finally {
    learn.e2eSpecs = originalLearnSpecs
  }

  const originalTitleSpecs = ghostFeature.e2eSpecs
  ghostFeature.e2eSpecs = ['e2e/specs/does-not-exist.spec.ts']
  try {
    const problems = findProblems()
    if (
      !problems.some(
        (p) =>
          p.code === 'e2e-spec-missing-on-disk' &&
          p.file === 'e2e/specs/does-not-exist.spec.ts'
      )
    ) {
      failures.push('e2e-spec-missing-on-disk detector silent')
    }
  } finally {
    ghostFeature.e2eSpecs = originalTitleSpecs
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
    console.log('lockstep self-test: 7/7 controls')
    return
  }
  const problems = findProblems()
  for (const problem of problems) console.error(JSON.stringify(problem))
  console.log(`lockstep: ${DRIFT_PARTS.length} parts, ${problems.length} problems`)
  if (problems.length > 0) process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
