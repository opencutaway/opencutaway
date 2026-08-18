#!/usr/bin/env node
/**
 * Feature map: what children and grown-ups can do.
 * Generated docs/feature-map.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'feature-map.md')

export const FEATURES = [
  {
    id: 'FEAT-TITLE',
    name: 'Title screen',
    status: 'shipped',
    actors: ['child', 'adult'],
    canDo: 'See the game name and that lessons are not in this build. Progress stays on this device.',
    entry: 'src/app/App.tsx',
    e2eSpec: 'e2e/specs/title.spec.ts',
    tutorialIds: ['TUT-TITLE-NAME'],
    schemaIds: ['CODE-TITLE-SCREEN']
  },
  {
    id: 'FEAT-LEARN',
    name: 'Learn',
    status: 'stub',
    actors: ['child', 'adult'],
    canDo: 'Later: object cards and chain-strips (name to function, this path not that one).',
    entry: 'SPEC.md',
    e2eSpec: 'e2e/specs/modes-not-shipped.spec.ts',
    tutorialIds: ['TUT-OBJECT-NAME-FUNCTION', 'TUT-CHAIN-PATH'],
    schemaIds: ['CODE-OBJECT-CARD', 'CODE-SYSTEM-CHAIN']
  },
  {
    id: 'FEAT-CHALLENGE',
    name: 'Challenge',
    status: 'stub',
    actors: ['child', 'adult'],
    canDo: 'Later: recall and path-choice without becoming a scavenger hunt.',
    entry: 'SPEC.md',
    e2eSpec: 'e2e/specs/modes-not-shipped.spec.ts',
    tutorialIds: ['TUT-CHAIN-PATH'],
    schemaIds: ['CODE-SYSTEM-CHAIN']
  },
  {
    id: 'FEAT-LIFE-LIST',
    name: 'Life list',
    status: 'stub',
    actors: ['child', 'adult'],
    canDo: 'Later: optional honor-system IRL finds that must not unlock Learn or Challenge.',
    entry: 'SPEC.md',
    e2eSpec: 'e2e/specs/modes-not-shipped.spec.ts',
    tutorialIds: ['TUT-LIFE-LIST'],
    schemaIds: []
  }
]

export function shippedFeatures(features = FEATURES) {
  return features.filter((feature) => feature.status === 'shipped')
}

export function generateMarkdown(features = FEATURES) {
  const lines = [
    '# Feature map',
    '',
    'GENERATED. Do not hand-edit. Source: `tools/feature-map.mjs`.',
    '',
    '**This generated file lists** what children and grown-ups can do.',
    '**It does not own** how a mechanic is taught (Tutorial manifest) or gate commands (Gates).',
    '',
    '| id | name | status | actors | can do | e2e spec | tutorials |',
    '|---|---|---|---|---|---|---|'
  ]
  for (const feature of features) {
    lines.push(
      `| ${feature.id} | ${feature.name} | ${feature.status} | ${feature.actors.join(', ')} | ${feature.canDo} | \`${feature.e2eSpec}\` | ${feature.tutorialIds.join(', ')} |`
    )
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function findProblems(features = FEATURES, root = repoRoot) {
  const problems = []
  const seen = new Set()
  for (const feature of features) {
    if (seen.has(feature.id)) problems.push({ code: 'duplicate-id', id: feature.id })
    seen.add(feature.id)
    if (!['shipped', 'stub'].includes(feature.status)) {
      problems.push({ code: 'bad-status', id: feature.id })
    }
    if (!feature.actors.includes('child') || !feature.actors.includes('adult')) {
      problems.push({ code: 'missing-coplay-actor', id: feature.id })
    }
    if (!feature.e2eSpec) {
      problems.push({ code: 'missing-e2e-spec', id: feature.id })
    } else if (!existsSync(path.join(root, feature.e2eSpec))) {
      problems.push({ code: 'e2e-spec-missing-on-disk', id: feature.id, file: feature.e2eSpec })
    }
    if (feature.tutorialIds.length === 0) {
      problems.push({ code: 'untutoried-feature', id: feature.id })
    }
  }
  const expected = generateMarkdown(features)
  const actual = existsSync(MAP_PATH) ? readFileSync(MAP_PATH, 'utf8') : ''
  if (actual !== expected) {
    problems.push({ code: 'map-stale', file: 'docs/feature-map.md' })
  }
  return problems
}

export function runSelfTest() {
  const failures = []
  const ghost = findProblems([
    {
      id: 'FEAT-GHOST',
      name: 'Ghost',
      status: 'shipped',
      actors: ['child', 'adult'],
      canDo: 'Nothing',
      entry: 'SPEC.md',
      e2eSpec: 'e2e/specs/does-not-exist.spec.ts',
      tutorialIds: ['TUT-GHOST'],
      schemaIds: []
    }
  ])
  if (!ghost.some((p) => p.code === 'e2e-spec-missing-on-disk')) {
    failures.push('e2e-spec-missing-on-disk detector silent')
  }
  const noTutorial = findProblems([
    {
      id: 'FEAT-UNTUTORED',
      name: 'Untutored',
      status: 'stub',
      actors: ['child', 'adult'],
      canDo: 'Nothing',
      entry: 'SPEC.md',
      e2eSpec: 'e2e/specs/title.spec.ts',
      tutorialIds: [],
      schemaIds: []
    }
  ])
  if (!noTutorial.some((p) => p.code === 'untutoried-feature')) {
    failures.push('untutoried-feature detector silent')
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
    console.log('feature-map self-test: 2/2 controls')
    return
  }
  if (arg === '--check') {
    const problems = findProblems()
    for (const problem of problems) console.error(JSON.stringify(problem))
    console.log(`feature-map: ${FEATURES.length} features, ${problems.length} problems`)
    if (problems.length > 0) process.exitCode = 1
    return
  }
  writeFileSync(MAP_PATH, generateMarkdown(), 'utf8')
  console.log(`wrote docs/feature-map.md (${FEATURES.length} features)`)
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
