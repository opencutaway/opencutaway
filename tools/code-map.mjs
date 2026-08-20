#!/usr/bin/env node
/**
 * Code map: how files produce, consume, validate, and publish facts.
 * Generated docs/code-map.md. Do not hand-edit that file.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { FACTS, renderGeneratedPreamble, repoRoot, tickList } from './file-map.mjs'

const MAP_PATH = path.join(repoRoot, 'docs', 'code-map.md')

export const PLAYER_FACING_KINDS = ['ui-contract', 'content', 'save', 'config']

export const CODE_ROWS = [
  {
    id: 'CODE-FACT-CHECK-CADENCE',
    factId: 'FACT-CHECK-CADENCE',
    kind: 'engineering',
    produces: ['CLAUDE.md'],
    consumes: ['AGENTS.md', 'README.md', 'docs/testing-gauntlet.md'],
    validates: null,
    instances: [],
    e2eSpecs: [],
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
    e2eSpecs: [],
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
    e2eSpecs: [],
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
    e2eSpecs: ['e2e/specs/title.spec.ts'],
    publishes: 'Title-screen copy in the child app'
  },
  {
    id: 'CODE-WIDEN-SITTING-1',
    factId: 'DATA-WIDEN-SITTING-1',
    kind: 'content',
    produces: ['content/sittings/widen-1-get-across.json'],
    consumes: [
      'src/app/sitting.ts',
      'src/app/WidenSitting1.tsx',
      'src/app/renderers/BusyBlock.tsx'
    ],
    validates: 'schema/sitting-widen-1.schema.json',
    instances: ['content/sittings/widen-1-get-across.json'],
    e2eSpecs: ['e2e/specs/widen-1-get-across.spec.ts'],
    publishes: 'Widen sitting 1 (Get across) copy and hotspots'
  },
  {
    id: 'CODE-WIDEN-SITTING-2',
    factId: 'DATA-WIDEN-SITTING-2',
    kind: 'content',
    produces: ['content/sittings/widen-2-lights.json'],
    consumes: [
      'src/app/sitting.ts',
      'src/app/WidenSitting1.tsx',
      'src/app/renderers/BusyBlock.tsx'
    ],
    validates: 'schema/sitting-widen-2.schema.json',
    instances: ['content/sittings/widen-2-lights.json'],
    e2eSpecs: ['e2e/specs/widen-2-lights.spec.ts'],
    publishes: 'Widen sitting 2 (Lights) copy and hotspots'
  },
  {
    id: 'CODE-OBJECT-CARD',
    factId: 'DATA-OBJECT-CARD',
    kind: 'content',
    produces: ['content/examples/object-card.example.json'],
    consumes: ['tests/schema-examples.test.ts'],
    validates: 'schema/infrastructure-object-card.schema.json',
    instances: ['content/examples/object-card.example.json'],
    e2eSpecs: [],
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
    e2eSpecs: [],
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
    e2eSpecs: [],
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
    e2eSpecs: [],
    publishes: 'Build-time content-authoring graph; never imported from src/'
  }
]

export function playerFacingRows() {
  return CODE_ROWS.filter((row) => PLAYER_FACING_KINDS.includes(row.kind))
}

export function generateMarkdown(rows = CODE_ROWS) {
  const lines = [
    ...renderGeneratedPreamble({
      title: 'Code map',
      source: 'tools/code-map.mjs',
      artifact: 'docs/code-map.md',
      gate: 'G-lockstep',
      must: [
        'Keep a unique `id` on every row.',
        'Map every Owners `FACTS[].id` to a `factId`.',
        'Player-facing kinds (`ui-contract`, `content`, `save`, `config`) MUST set `validates` to a JSON Schema path and `instances` to committed fixtures.',
        'Sitting/UI rows that a shipped feature consumes MUST list Playwright paths in `e2eSpecs`.',
        'Regenerate (`node tools/code-map.mjs`) so this artifact byte-matches `generateMarkdown()`.'
      ],
      mustNot: [
        'Hand-edit this file.',
        'Add an ad-hoc parser beside Ajv for content, config, saves, or UI contracts.',
        'Point `validates` or `instances` at paths that do not exist.',
        'Import workflow graphs from `src/`.'
      ],
      negativeControls: [
        'owner-fact-unmapped',
        'player-facing-without-schema',
        'player-facing-without-instance',
        'missing-path',
        'missing-schema'
      ],
      notOwn:
        '**Does not own** who owns a fact (Owners) or what players can do (Feature map). **Part:** Code map.',
      cannotSee: [
        'That a schema is the right shape for a future lesson.',
        'That a stub row is ready to ship.'
      ]
    }),
    '| id | factId | kind | produces | consumes | validates | instances | e2eSpecs | publishes |',
    '|---|---|---|---|---|---|---|---|---|'
  ]
  for (const row of rows) {
    lines.push(
      `| ${row.id} | ${row.factId} | ${row.kind} | ${tickList(row.produces)} | ${tickList(row.consumes)} | ${row.validates ? `\`${row.validates}\`` : '—'} | ${tickList(row.instances)} | ${tickList(row.e2eSpecs)} | ${row.publishes} |`
    )
  }
  lines.push('')
  return `${lines.join('\n')}\n`
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
    const e2eSpecs = row.e2eSpecs ?? []
    for (const rel of [...row.produces, ...row.consumes, ...row.instances, ...e2eSpecs]) {
      if (!existsSync(path.join(root, rel))) {
        problems.push({ code: 'missing-path', id: row.id, file: rel })
      }
    }
    if (row.validates && !existsSync(path.join(root, row.validates))) {
      problems.push({ code: 'missing-schema', id: row.id, file: row.validates })
    }
    const needsSchema = PLAYER_FACING_KINDS.includes(row.kind)
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
      e2eSpecs: [],
      publishes: 'ghost'
    },
    ...CODE_ROWS.filter((row) => row.factId !== 'DATA-TITLE-SCREEN')
  ])
  if (!noSchema.some((p) => p.code === 'player-facing-without-schema')) {
    failures.push('player-facing-without-schema detector silent')
  }
  const md = generateMarkdown()
  if (!md.includes('| instances |')) {
    failures.push('generated code map omitted instances column')
  }
  if (!md.includes('content/ui/title-screen.json')) {
    failures.push('generated code map omitted title instance path')
  }
  if (!md.includes('e2e/specs/widen-2-lights.spec.ts')) {
    failures.push('generated code map omitted sitting 2 e2e spec')
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
    console.log('code-map self-test: 5/5 controls')
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
