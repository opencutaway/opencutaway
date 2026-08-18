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
    name: 'Owners',
    source: 'tools/file-map.mjs',
    generated: 'docs/file-map.md',
    gate: 'G-map'
  },
  {
    name: 'Code map',
    source: 'tools/code-map.mjs',
    generated: 'docs/code-map.md',
    gate: 'G-lockstep'
  },
  {
    name: 'Feature map',
    source: 'tools/feature-map.mjs',
    generated: 'docs/feature-map.md',
    gate: 'G-lockstep'
  },
  {
    name: 'Tutorial manifest',
    source: 'tools/tutorial-manifest.mjs',
    generated: 'docs/tutorial-manifest.md',
    gate: 'G-lockstep'
  },
  {
    name: 'Blast radius',
    source: 'tools/blast-radius.mjs',
    generated: null,
    gate: 'G-blast'
  },
  {
    name: 'Gates',
    source: 'docs/testing-gauntlet.md',
    generated: null,
    gate: 'G-floors'
  }
]

export function findProblems(root = repoRoot) {
  const problems = []
  if (DRIFT_PARTS.length !== 6) {
    problems.push({ code: 'drift-parts-count', live: DRIFT_PARTS.length })
  }
  for (const part of DRIFT_PARTS) {
    if (!existsSync(path.join(root, part.source))) {
      problems.push({ code: 'part-source-missing', name: part.name, file: part.source })
    }
    if (part.generated && !existsSync(path.join(root, part.generated))) {
      problems.push({ code: 'part-generated-missing', name: part.name, file: part.generated })
    }
  }

  const featureIds = new Set(FEATURES.map((feature) => feature.id))
  const tutorialIds = new Set(TUTORIALS.map((row) => row.id))
  const codeIds = new Set(CODE_ROWS.map((row) => row.id))
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
      if (!codeIds.has(schemaId)) {
        problems.push({
          code: 'feature-code-row-missing',
          feature: feature.id,
          code: schemaId
        })
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
  const ghostFeature = FEATURES[0]
  const original = ghostFeature.tutorialIds
  ghostFeature.tutorialIds = ['TUT-DOES-NOT-EXIST']
  try {
    const problems = findProblems()
    if (!problems.some((p) => p.code === 'feature-tutorial-missing')) {
      failures.push('feature-tutorial-missing detector silent')
    }
  } finally {
    ghostFeature.tutorialIds = original
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
    console.log('lockstep self-test: 3/3 controls')
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
