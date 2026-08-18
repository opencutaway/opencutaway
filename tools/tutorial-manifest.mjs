#!/usr/bin/env node
/**
 * Tutorial manifest: how each mechanic is taught.
 * Generated docs/tutorial-manifest.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'tutorial-manifest.md')

export const TUTORIALS = [
  {
    id: 'TUT-TITLE-NAME',
    mechanic: 'The game names itself',
    taughtBy: 'Title heading and blurb on the title screen',
    featureId: 'FEAT-TITLE',
    status: 'taught',
    actors: ['child', 'adult']
  },
  {
    id: 'TUT-OBJECT-NAME-FUNCTION',
    mechanic: 'Street object name to function',
    taughtBy: 'Learn object cards (not shipped)',
    featureId: 'FEAT-LEARN',
    status: 'deferred',
    actors: ['child', 'adult']
  },
  {
    id: 'TUT-CHAIN-PATH',
    mechanic: 'This path, not that one',
    taughtBy: 'Learn chain-strips and later Challenge (not shipped)',
    featureId: 'FEAT-LEARN',
    status: 'deferred',
    actors: ['child', 'adult']
  },
  {
    id: 'TUT-LIFE-LIST',
    mechanic: 'Optional honor-system IRL finds that never gate levels',
    taughtBy: 'Life list (not shipped)',
    featureId: 'FEAT-LIFE-LIST',
    status: 'deferred',
    actors: ['child', 'adult']
  }
]

export function generateMarkdown(tutorials = TUTORIALS) {
  const lines = [
    '# Tutorial manifest',
    '',
    'GENERATED. Do not hand-edit. Source: `tools/tutorial-manifest.mjs`.',
    '',
    '**This generated file lists** how each mechanic is taught.',
    '**It does not own** what players can do (Feature map) or lesson copy (`SPEC.md`).',
    '',
    '| id | mechanic | taught by | feature | status | actors |',
    '|---|---|---|---|---|---|'
  ]
  for (const row of tutorials) {
    lines.push(
      `| ${row.id} | ${row.mechanic} | ${row.taughtBy} | ${row.featureId} | ${row.status} | ${row.actors.join(', ')} |`
    )
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function findProblems(tutorials = TUTORIALS) {
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
      actors: ['child', 'adult']
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
      actors: ['child', 'adult']
    }
  ])
  if (!status.some((p) => p.code === 'bad-status')) {
    failures.push('bad-status detector silent')
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
    console.log('tutorial-manifest self-test: 2/2 controls')
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
