#!/usr/bin/env node
/**
 * Tutorial manifest: how each mechanic is taught.
 * Generated docs/tutorial-manifest.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderGeneratedPreamble, repoRoot, tickList } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'tutorial-manifest.md')

export const TUTORIALS = [
  {
    id: 'TUT-TITLE-NAME',
    mechanic: 'The game names itself',
    taughtBy: 'Title heading and blurb on the title screen',
    featureId: 'FEAT-TITLE',
    status: 'taught',
    actors: ['child', 'adult'],
    produces: ['content/ui/title-screen.json', 'src/app/App.tsx'],
    consumes: ['e2e/specs/title.spec.ts']
  },
  {
    id: 'TUT-OBJECT-NAME-FUNCTION',
    mechanic: 'Street object name to function',
    taughtBy: 'Widen sittings 1–2 (Get across, Lights) on the busy block',
    featureId: 'FEAT-LEARN',
    status: 'taught',
    actors: ['child', 'adult'],
    produces: [
      'content/sittings/widen-1-get-across.json',
      'content/sittings/widen-2-lights.json',
      'src/app/WidenSitting1.tsx'
    ],
    consumes: [
      'e2e/specs/widen-1-get-across.spec.ts',
      'e2e/specs/widen-2-lights.spec.ts'
    ]
  },
  {
    id: 'TUT-CHAIN-PATH',
    mechanic: 'This path, not that one',
    taughtBy: 'Learn chain-strips and later Challenge (not shipped)',
    featureId: 'FEAT-LEARN',
    status: 'deferred',
    actors: ['child', 'adult'],
    produces: ['SPEC.md'],
    consumes: ['e2e/specs/modes-not-shipped.spec.ts']
  },
  {
    id: 'TUT-LIFE-LIST',
    mechanic: 'Optional honor-system IRL finds that never gate levels',
    taughtBy: 'Life list (not shipped)',
    featureId: 'FEAT-LIFE-LIST',
    status: 'deferred',
    actors: ['child', 'adult'],
    produces: ['SPEC.md'],
    consumes: ['e2e/specs/modes-not-shipped.spec.ts']
  }
]

export function generateMarkdown(tutorials = TUTORIALS) {
  const lines = [
    ...renderGeneratedPreamble({
      title: 'Tutorial manifest',
      source: 'tools/tutorial-manifest.mjs',
      artifact: 'docs/tutorial-manifest.md',
      gate: 'G-lockstep',
      must: [
        'Keep a unique `id` on every row (`TUT-…`).',
        '`featureId` MUST be a `FEAT-…` id that exists on the Feature map.',
        'Status is `taught` or `deferred` only.',
        '`produces` and `consumes` are exact paths that exist on disk.',
        'Shipped features MUST have at least one tutorial with status `taught` (enforced by G-lockstep).',
        'Regenerate (`node tools/tutorial-manifest.mjs`) so this artifact byte-matches `generateMarkdown()`.'
      ],
      mustNot: [
        'Hand-edit this file.',
        'Point `featureId` at a string that does not start with `FEAT-`.',
        'Mark a mechanic `taught` when the teaching files are missing.',
        'Treat a deferred tutorial as proof the feature shipped.'
      ],
      negativeControls: ['missing-feature', 'bad-status', 'missing-path'],
      notOwn:
        '**Does not own** what players can do (Feature map) or lesson copy (`SPEC.md`). **Part:** Tutorial manifest.',
      cannotSee: [
        'That kid-facing copy passed the human gate.',
        'That a deferred mechanic is ready to teach.'
      ]
    }),
    '| id | mechanic | taughtBy | featureId | status | actors | produces | consumes |',
    '|---|---|---|---|---|---|---|---|'
  ]
  for (const row of tutorials) {
    lines.push(
      `| ${row.id} | ${row.mechanic} | ${row.taughtBy} | ${row.featureId} | ${row.status} | ${row.actors.join(', ')} | ${tickList(row.produces)} | ${tickList(row.consumes)} |`
    )
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function findProblems(tutorials = TUTORIALS, root = repoRoot) {
  const problems = []
  const seen = new Set()
  for (const row of tutorials) {
    if (seen.has(row.id)) problems.push({ code: 'duplicate-id', id: row.id })
    seen.add(row.id)
    if (!['taught', 'deferred'].includes(row.status)) {
      problems.push({ code: 'bad-status', id: row.id })
    }
    if (!row.featureId.startsWith('FEAT-')) {
      problems.push({ code: 'missing-feature', id: row.id })
    }
    for (const rel of [...(row.produces ?? []), ...(row.consumes ?? [])]) {
      if (!existsSync(path.join(root, rel))) {
        problems.push({ code: 'missing-path', id: row.id, file: rel })
      }
    }
  }
  const expected = generateMarkdown(tutorials)
  const actual = existsSync(MAP_PATH) ? readFileSync(MAP_PATH, 'utf8') : ''
  if (actual !== expected) {
    problems.push({ code: 'map-stale', file: 'docs/tutorial-manifest.md' })
  }
  return problems
}

export function runSelfTest() {
  const failures = []
  const bad = findProblems([
    {
      id: 'TUT-GHOST',
      mechanic: 'Ghost',
      taughtBy: 'Nowhere',
      featureId: 'NOPE',
      status: 'taught',
      actors: ['child', 'adult'],
      produces: ['SPEC.md'],
      consumes: ['e2e/specs/title.spec.ts']
    }
  ])
  if (!bad.some((p) => p.code === 'missing-feature')) {
    failures.push('missing-feature detector silent')
  }
  const status = findProblems([
    {
      id: 'TUT-BAD',
      mechanic: 'Bad',
      taughtBy: 'Nowhere',
      featureId: 'FEAT-TITLE',
      status: 'maybe',
      actors: ['child', 'adult'],
      produces: ['SPEC.md'],
      consumes: ['e2e/specs/title.spec.ts']
    }
  ])
  if (!status.some((p) => p.code === 'bad-status')) {
    failures.push('bad-status detector silent')
  }
  const missingPath = findProblems([
    {
      id: 'TUT-PATH',
      mechanic: 'Path',
      taughtBy: 'Nowhere',
      featureId: 'FEAT-TITLE',
      status: 'taught',
      actors: ['child', 'adult'],
      produces: ['does-not-exist.json'],
      consumes: ['e2e/specs/title.spec.ts']
    }
  ])
  if (!missingPath.some((p) => p.code === 'missing-path' && p.file === 'does-not-exist.json')) {
    failures.push('missing-path detector silent')
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
    console.log('tutorial-manifest self-test: 3/3 controls')
    return
  }
  if (arg === '--check') {
    const problems = findProblems()
    for (const problem of problems) console.error(JSON.stringify(problem))
    console.log(`tutorial-manifest: ${TUTORIALS.length} rows, ${problems.length} problems`)
    if (problems.length > 0) process.exitCode = 1
    return
  }
  writeFileSync(MAP_PATH, generateMarkdown(), 'utf8')
  console.log(`wrote docs/tutorial-manifest.md (${TUTORIALS.length} rows)`)
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
