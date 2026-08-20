#!/usr/bin/env node
/**
 * Feature map: what children and grown-ups can do.
 * Generated docs/feature-map.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderGeneratedPreamble, repoRoot, tickList } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'feature-map.md')

export const FEATURES = [
  {
    id: 'FEAT-TITLE',
    name: 'Title screen',
    status: 'shipped',
    actors: ['child', 'adult'],
    canDo: 'See the game name and open Get across or Lights (widen sittings 1 and 2). Progress stays on this device.',
    entry: 'src/app/App.tsx',
    e2eSpecs: ['e2e/specs/title.spec.ts'],
    tutorialIds: ['TUT-TITLE-NAME'],
    schemaIds: ['CODE-TITLE-SCREEN']
  },
  {
    id: 'FEAT-LEARN',
    name: 'Learn',
    status: 'shipped',
    actors: ['child', 'adult'],
    canDo:
      'Widen sittings 1–2: find Get across objects or Lights objects (pole, overhead conductor, distribution transformer) on the busy block; read the real name, a short gloss, and what it does. Sittings 3–11 are not in this build.',
    entry: 'src/app/WidenSitting1.tsx',
    e2eSpecs: [
      'e2e/specs/widen-1-get-across.spec.ts',
      'e2e/specs/widen-2-lights.spec.ts'
    ],
    tutorialIds: ['TUT-OBJECT-NAME-FUNCTION', 'TUT-CHAIN-PATH'],
    schemaIds: [
      'CODE-OBJECT-CARD',
      'CODE-SYSTEM-CHAIN',
      'CODE-WIDEN-SITTING-1',
      'CODE-WIDEN-SITTING-2'
    ]
  },
  {
    id: 'FEAT-CHALLENGE',
    name: 'Challenge',
    status: 'stub',
    actors: ['child', 'adult'],
    canDo: 'Later: recall and path-choice without becoming a scavenger hunt.',
    entry: 'SPEC.md',
    e2eSpecs: ['e2e/specs/modes-not-shipped.spec.ts'],
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
    e2eSpecs: ['e2e/specs/modes-not-shipped.spec.ts'],
    tutorialIds: ['TUT-LIFE-LIST'],
    schemaIds: []
  }
]

export function shippedFeatures(features = FEATURES) {
  return features.filter((feature) => feature.status === 'shipped')
}

export function generateMarkdown(features = FEATURES) {
  const lines = [
    ...renderGeneratedPreamble({
      title: 'Feature map',
      source: 'tools/feature-map.mjs',
      artifact: 'docs/feature-map.md',
      gate: 'G-lockstep',
      must: [
        'Keep a unique `id` on every row (`FEAT-…`).',
        'Status is `shipped` or `stub` only.',
        'Actors MUST include `child` and `adult`.',
        '`e2eSpecs` is a non-empty array of Playwright spec paths; every path MUST exist on disk.',
        'Shipped Learn sittings MUST list every sitting spec (Get across and Lights).',
        'Name `entry`, `schemaIds`, and `tutorialIds`; G-lockstep reads those fields.',
        'Regenerate (`node tools/feature-map.mjs`) so this artifact byte-matches `generateMarkdown()`.'
      ],
      mustNot: [
        'Hand-edit this file.',
        'Ship a feature with an empty `e2eSpecs` array or a missing spec file.',
        'Point `e2eSpecs` at a one-off script instead of `e2e/specs/*.spec.ts`.',
        'Omit sitting 2 (`e2e/specs/widen-2-lights.spec.ts`) from shipped `FEAT-LEARN`.'
      ],
      negativeControls: [
        'e2e-spec-missing-on-disk',
        'missing-e2e-spec',
        'untutoried-feature',
        'missing-coplay-actor',
        'bad-status'
      ],
      notOwn:
        '**Does not own** how a mechanic is taught (Tutorial manifest) or gate commands (Gates). **Part:** Feature map.',
      cannotSee: [
        'That a stub feature is ready to ship.',
        'That kid-facing copy passed the human gate.'
      ]
    }),
    '| id | name | status | actors | entry | e2eSpecs | schemaIds | tutorialIds | canDo |',
    '|---|---|---|---|---|---|---|---|---|'
  ]
  for (const feature of features) {
    lines.push(
      `| ${feature.id} | ${feature.name} | ${feature.status} | ${feature.actors.join(', ')} | \`${feature.entry}\` | ${tickList(feature.e2eSpecs)} | ${tickList(feature.schemaIds)} | ${tickList(feature.tutorialIds)} | ${feature.canDo} |`
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
    if (feature.entry && !existsSync(path.join(root, feature.entry))) {
      problems.push({ code: 'entry-missing-on-disk', id: feature.id, file: feature.entry })
    }
    if (!Array.isArray(feature.e2eSpecs) || feature.e2eSpecs.length === 0) {
      problems.push({ code: 'missing-e2e-spec', id: feature.id })
    } else {
      for (const spec of feature.e2eSpecs) {
        if (!existsSync(path.join(root, spec))) {
          problems.push({ code: 'e2e-spec-missing-on-disk', id: feature.id, file: spec })
        }
      }
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
      e2eSpecs: ['e2e/specs/does-not-exist.spec.ts'],
      tutorialIds: ['TUT-GHOST'],
      schemaIds: []
    }
  ])
  if (!ghost.some((p) => p.code === 'e2e-spec-missing-on-disk' && p.file === 'e2e/specs/does-not-exist.spec.ts')) {
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
      e2eSpecs: ['e2e/specs/title.spec.ts'],
      tutorialIds: [],
      schemaIds: []
    }
  ])
  if (!noTutorial.some((p) => p.code === 'untutoried-feature')) {
    failures.push('untutoried-feature detector silent')
  }
  const md = generateMarkdown()
  if (!md.includes('| entry |')) {
    failures.push('generated feature map omitted entry column')
  }
  if (!md.includes('| schemaIds |')) {
    failures.push('generated feature map omitted schemaIds column')
  }
  if (!md.includes('src/app/App.tsx')) {
    failures.push('generated feature map omitted FEAT-TITLE entry')
  }
  if (!md.includes('e2e/specs/widen-2-lights.spec.ts')) {
    failures.push('generated feature map omitted sitting 2 spec')
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
    console.log('feature-map self-test: 6/6 controls')
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
