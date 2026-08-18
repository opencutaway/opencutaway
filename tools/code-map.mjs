#!/usr/bin/env node
/**
 * Code map: how files produce, consume, validate, and publish facts.
 * Generated docs/code-map.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { FACTS, repoRoot } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'code-map.md')

export const CODE_ROWS = [
  {
    id: 'CODE-FACT-CHECK-CADENCE',
    factId: 'FACT-CHECK-CADENCE',
    kind: 'engineering',
    produces: ['CLAUDE.md'],
    consumes: ['AGENTS.md', 'README.md', 'docs/testing-gauntlet.md'],
    validates: null,
    instances: [],
    publishes: 'Push versus release cadence'
  },
  {
    id: 'CODE-FACT-GATE-COUNT',
    factId: 'FACT-GATE-COUNT',
    kind: 'engineering',
    produces: ['docs/testing-gauntlet.md'],
    consumes: ['tools/file-map.mjs'],
    validates: null,
    instances: [],
    publishes: 'Named gate list for this slice'
  },
  {
    id: 'CODE-FACT-NO-NETWORK',
    factId: 'FACT-NO-NETWORK',
    kind: 'engineering',
    produces: ['CLAUDE.md'],
    consumes: ['AGENTS.md', 'README.md', '.cursor/rules/client-hard-stops.mdc'],
    validates: null,
    instances: [],
    publishes: 'Shipped-app network rule'
  },
  {
    id: 'CODE-TITLE-SCREEN',
    factId: 'DATA-TITLE-SCREEN',
    kind: 'ui-contract',
    produces: ['content/ui/title-screen.json'],
    consumes: ['src/app/title.ts', 'src/app/App.tsx'],
    validates: 'schema/ui-title-screen.schema.json',
    instances: ['content/ui/title-screen.json'],
    publishes: 'Title-screen copy in the child app'
  },
  {
    id: 'CODE-OBJECT-CARD',
    factId: 'DATA-OBJECT-CARD',
    kind: 'content',
    produces: ['content/examples/object-card.example.json'],
    consumes: ['tests/schema-examples.test.ts'],
    validates: 'schema/infrastructure-object-card.schema.json',
    instances: ['content/examples/object-card.example.json'],
    publishes: 'Object-card example only; not a catalog'
  },
  {
    id: 'CODE-SYSTEM-CHAIN',
    factId: 'DATA-SYSTEM-CHAIN',
    kind: 'content',
    produces: ['content/examples/system-chain.example.json'],
    consumes: ['tests/schema-examples.test.ts'],
    validates: 'schema/system-chain.schema.json',
    instances: ['content/examples/system-chain.example.json'],
    publishes: 'System-chain example only; not a catalog'
  },
  {
    id: 'CODE-LOCAL-PROFILE',
    factId: 'DATA-LOCAL-PROFILE',
    kind: 'save',
    produces: ['content/examples/local-profile.example.json'],
    consumes: ['tests/schema-examples.test.ts'],
    validates: 'schema/local-profile.schema.json',
    instances: ['content/examples/local-profile.example.json'],
    publishes: 'Sample on-device profile shape; real saves stay gitignored'
  },
  {
    id: 'CODE-WORKFLOW-GRAPH',
    factId: 'DATA-WORKFLOW-GRAPH',
    kind: 'build-time',
    produces: ['workflows/content-authoring.example.yaml'],
    consumes: ['tests/workflow-graph.test.ts'],
    validates: 'schema/workflow-graph.schema.json',
    instances: ['workflows/content-authoring.example.yaml'],
    publishes: 'Build-time content-authoring graph; never imported from src/'
  }
]

export function playerFacingRows() {
  return CODE_ROWS.filter((row) =>
    ['ui-contract', 'content', 'save', 'config'].includes(row.kind)
  )
}

export function generateMarkdown(rows = CODE_ROWS) {
  const lines = [
    '# Code map',
    '',
    'GENERATED. Do not hand-edit. Source: `tools/code-map.mjs`.',
    '',
    '**This generated file lists** how files produce, consume, validate, and publish facts.',
    '**It does not own** who owns a fact (Owners) or what players can do (Feature map).',
    '',
    '| id | fact | kind | produces | consumes | validates (Ajv) | publishes |',
    '|---|---|---|---|---|---|---|'
  ]
  for (const row of rows) {
    lines.push(
      `| ${row.id} | ${row.factId} | ${row.kind} | ${tickList(row.produces)} | ${tickList(row.consumes)} | ${row.validates ? `\`${row.validates}\`` : '—'} | ${row.publishes} |`
    )
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

function tickList(items) {
  return items.map((item) => `\`${item}\``).join(', ')
}

export function findProblems(rows = CODE_ROWS, root = repoRoot) {
  const problems = []
  const factIds = new Set(rows.map((row) => row.factId))
  for (const fact of FACTS) {
    if (!factIds.has(fact.id)) {
      problems.push({ code: 'owner-fact-unmapped', fact: fact.id })
    }
  }
  const seen = new Set()
  for (const row of rows) {
    if (seen.has(row.id)) problems.push({ code: 'duplicate-id', id: row.id })
    seen.add(row.id)
    for (const rel of [...row.produces, ...row.consumes, ...row.instances]) {
      if (!existsSync(path.join(root, rel))) {
        problems.push({ code: 'missing-path', id: row.id, file: rel })
      }
    }
    if (row.validates && !existsSync(path.join(root, row.validates))) {
      problems.push({ code: 'missing-schema', id: row.id, file: row.validates })
    }
    const needsSchema = ['ui-contract', 'content', 'save', 'config'].includes(row.kind)
    if (needsSchema && !row.validates) {
      problems.push({ code: 'player-facing-without-schema', id: row.id })
    }
    if (needsSchema && row.instances.length === 0) {
      problems.push({ code: 'player-facing-without-instance', id: row.id })
    }
  }
  const expected = generateMarkdown(rows)
  const actual = existsSync(MAP_PATH) ? readFileSync(MAP_PATH, 'utf8') : ''
  if (actual !== expected) {
    problems.push({ code: 'map-stale', file: 'docs/code-map.md' })
  }
  return problems
}

export function runSelfTest() {
  const failures = []
  const missingFact = findProblems(
    CODE_ROWS.filter((row) => row.factId !== 'FACT-CHECK-CADENCE')
  )
  if (!missingFact.some((p) => p.code === 'owner-fact-unmapped')) {
    failures.push('owner-fact-unmapped detector silent')
  }
  const noSchema = findProblems([
    {
      id: 'CODE-GHOST',
      factId: 'DATA-GHOST',
      kind: 'ui-contract',
      produces: ['content/ui/title-screen.json'],
      consumes: ['src/app/title.ts'],
      validates: null,
      instances: ['content/ui/title-screen.json'],
      publishes: 'ghost'
    },
    ...CODE_ROWS.filter((row) => row.factId !== 'DATA-TITLE-SCREEN')
  ])
  if (!noSchema.some((p) => p.code === 'player-facing-without-schema')) {
    failures.push('player-facing-without-schema detector silent')
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
    console.log('code-map self-test: 2/2 controls')
    return
  }
  if (arg === '--check') {
    const problems = findProblems()
    for (const problem of problems) console.error(JSON.stringify(problem))
    console.log(`code-map: ${CODE_ROWS.length} rows, ${problems.length} problems`)
    if (problems.length > 0) process.exitCode = 1
    return
  }
  writeFileSync(MAP_PATH, generateMarkdown(), 'utf8')
  console.log(`wrote docs/code-map.md (${CODE_ROWS.length} rows)`)
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
