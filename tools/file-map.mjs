#!/usr/bin/env node
/**
 * Ownership table and generated file map.
 *
 * This module owns: which file owns which fact, which tracked paths are
 * declared, HISTORY ceiling, and tombstones.
 * It does not own: product behaviour, gate floors, or live coverage numbers.
 *
 * Honest limits:
 * - A stale paragraph rewritten in fresh words is invisible.
 * - A sentence that correctly denies an owned fact but contains its shape is
 *   refused anyway (cure: describe, do not quote).
 * - A brand-new fact family is unguarded until its row exists here.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(here, '..')
const MAP_PATH = path.join(repoRoot, 'docs', 'file-map.md')

export const HISTORY_FILES_MAX = 0

export const TOMBSTONES = ['docs/STATUS.md', 'docs/session-summary.md']

export const COPY_EXEMPT = new Set([
  'docs/open-faults.md',
  'docs/file-map.md',
  'docs/effect-map.md',
  'docs/code-map.md',
  'docs/feature-map.md',
  'docs/tutorial-manifest.md',
  'tools/file-map.mjs',
  'tools/code-map.mjs',
  'tools/feature-map.mjs',
  'tools/tutorial-manifest.mjs',
  'tools/check-lockstep.mjs'
])

export const FACTS = [
  {
    id: 'FACT-CHECK-CADENCE',
    owner: 'CLAUDE.md',
    why: 'Push versus release cadence must not fork across README and agent docs.',
    control: '`npm run check` is the cheap path before every push.',
    shapes: [
      {
        id: 'SHAPE-CHECK-CADENCE',
        regex: 'npm run check` is the cheap path before every push'
      }
    ]
  },
  {
    id: 'FACT-GATE-COUNT',
    owner: 'docs/testing-gauntlet.md',
    why: 'A second file quoting the gate count will rot the day a gate is added.',
    control: 'The v0 gate count is 11.',
    shapes: [{ id: 'SHAPE-GATE-COUNT', regex: 'The v0 gate count is 11.' }]
  },
  {
    id: 'FACT-NO-NETWORK',
    owner: 'CLAUDE.md',
    why: 'The shipped-app network rule is one sentence; copies will diverge.',
    control: 'The shipped child app makes no network calls in v0.',
    shapes: [
      {
        id: 'SHAPE-NO-NETWORK',
        regex: 'The shipped child app makes no network calls in v0.'
      }
    ]
  }
]

/**
 * Most-specific rows first. Exact `path` beats `glob`.
 * kind: OWNER | SOURCE | TEST | GATE | DOC | GENERATED | DATA | HISTORY
 */
export const FILE_ROWS = [
  { path: 'docs/file-map.md', kind: 'GENERATED', notes: 'Written by this tool' },
  { path: 'docs/effect-map.md', kind: 'GENERATED', notes: 'Written by tools/effect-map.mjs' },
  { path: 'docs/code-map.md', kind: 'GENERATED', notes: 'Written by tools/code-map.mjs' },
  { path: 'docs/feature-map.md', kind: 'GENERATED', notes: 'Written by tools/feature-map.mjs' },
  { path: 'docs/tutorial-manifest.md', kind: 'GENERATED', notes: 'Written by tools/tutorial-manifest.mjs' },
  { path: 'tests/registry.json', kind: 'GENERATED', notes: 'Written by scripts/write-test-registry.mjs' },
  { path: 'CLAUDE.md', kind: 'OWNER', notes: 'Finished work, S-rules, E-rules' },
  { path: 'AGENTS.md', kind: 'OWNER', notes: 'Agent practice' },
  { path: 'SPEC.md', kind: 'OWNER', notes: 'Game behaviour' },
  { path: 'README.md', kind: 'OWNER', notes: 'Front door and pointers' },
  { path: 'CHANGELOG.md', kind: 'DOC', notes: 'Parent-facing history' },
  { path: 'LICENSE', kind: 'DOC', notes: 'MIT' },
  { path: 'package.json', kind: 'SOURCE', notes: 'App and check scripts' },
  { path: 'package-lock.json', kind: 'DATA', notes: 'npm lockfile; PII allowlist' },
  { path: '.gitignore', kind: 'SOURCE', notes: 'Includes local profiles' },
  { path: '.gitattributes', kind: 'SOURCE', notes: 'LF and binaries' },
  { path: 'index.html', kind: 'SOURCE', notes: 'Vite entry' },
  { path: 'tsconfig.json', kind: 'SOURCE', notes: 'TypeScript' },
  { path: 'vite.config.ts', kind: 'SOURCE', notes: 'Vite + vitest' },
  { path: '.claude/gate-baseline.json', kind: 'GATE', notes: 'Floors and ceilings' },
  { path: '.claude/skills/drift-check/SKILL.md', kind: 'OWNER', notes: 'Drift-check procedure' },
  { path: 'docs/testing-gauntlet.md', kind: 'OWNER', notes: 'Gate contract' },
  { path: 'docs/settled.md', kind: 'OWNER', notes: 'Closed questions' },
  { path: 'docs/open-faults.md', kind: 'OWNER', notes: 'Open gaps' },
  { path: 'docs/PRIVACY.md', kind: 'OWNER', notes: 'Commit scrub' },
  { path: 'docs/inspiration.md', kind: 'OWNER', notes: 'Do-not-copy books' },
  { path: 'docs/candidates.md', kind: 'OWNER', notes: 'Unfrozen object notes' },
  { path: 'docs/level-spine.md', kind: 'OWNER', notes: 'Curriculum shape and numbering' },
  { path: 'docs/ATTRIBUTION.md', kind: 'OWNER', notes: 'Per-asset rows' },
  { path: 'docs/reviews/README.md', kind: 'DOC', notes: 'Review record home' },
  { glob: 'docs/reviews/**', kind: 'DOC', notes: 'Independent review records' },
  { glob: '.cursor/rules/**', kind: 'DOC', notes: 'Agent hard-stops' },
  { glob: 'schema/**', kind: 'DATA', notes: 'JSON Schema' },
  { glob: 'content/**', kind: 'DATA', notes: 'Schema examples only' },
  { glob: 'src/**', kind: 'SOURCE', notes: 'Offline Preact shell' },
  { glob: 'tests/**', kind: 'TEST', notes: 'Vitest and registry' },
  { glob: 'e2e/**', kind: 'TEST', notes: 'Playwright player-facing specs' },
  { path: 'playwright.config.ts', kind: 'TEST', notes: 'Playwright runner' },
  { glob: 'scripts/**', kind: 'GATE', notes: 'PII and client scans' },
  { glob: 'tools/**', kind: 'GATE', notes: 'Maps and floors' },
  { glob: 'workflows/**', kind: 'DATA', notes: 'Build-time graphs' },
  { glob: 'assets/**', kind: 'DATA', notes: 'Drawings and photos later' },
  { glob: 'cosmetics/**', kind: 'DATA', notes: 'Unfrozen stub' },
  { glob: 'printables/**', kind: 'DATA', notes: 'Later print sheets' },
  { glob: 'profiles/**', kind: 'DATA', notes: 'Keep file only; JSON gitignored' }
]

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*')
  return new RegExp(`^${escaped}$`)
}

export function normalizeRel(relativePath) {
  return relativePath.replaceAll('\\', '/')
}

export function classifyPath(relativePath) {
  const rel = normalizeRel(relativePath)
  for (const row of FILE_ROWS) {
    if (row.path && row.path === rel) {
      return row
    }
  }
  for (const row of FILE_ROWS) {
    if (row.glob && globToRegExp(row.glob).test(rel)) {
      return row
    }
  }
  return null
}

export function listTrackedFiles(root = repoRoot) {
  const output = execFileSync(
    'git',
    ['ls-files', '-co', '--exclude-standard'],
    { cwd: root, encoding: 'utf8' }
  )
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map(normalizeRel)
    .filter((rel) => !rel.startsWith('node_modules/') && rel !== 'node_modules')
}

export function readText(root, relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8')
}

export function missingOwnerControls(contentsByFile) {
  const problems = []
  for (const fact of FACTS) {
    const text = contentsByFile[fact.owner]
    if (typeof text !== 'string') {
      problems.push({ code: 'owner-missing', fact: fact.id, file: fact.owner })
      continue
    }
    if (!text.includes(fact.control)) {
      problems.push({ code: 'control-missing', fact: fact.id, file: fact.owner })
    }
  }
  return problems
}

export function copiedFacts(contentsByFile) {
  const problems = []
  for (const fact of FACTS) {
    for (const shape of fact.shapes) {
      for (const [file, text] of Object.entries(contentsByFile)) {
        if (file === fact.owner) continue
        if (COPY_EXEMPT.has(file)) continue
        if (typeof text !== 'string') continue
        if (text.includes(shape.regex)) {
          problems.push({
            code: 'copied-fact',
            fact: fact.id,
            shape: shape.id,
            file
          })
        }
      }
    }
  }
  return problems
}

export function undeclaredFiles(tracked) {
  return tracked.filter((rel) => classifyPath(rel) === null)
}

export function resurrectedTombstones(tracked, root = repoRoot) {
  const problems = []
  for (const tomb of TOMBSTONES) {
    const onDisk = existsSync(path.join(root, tomb))
    const trackedHit = tracked.includes(normalizeRel(tomb))
    if (onDisk || trackedHit) {
      problems.push({ code: 'tombstone', file: tomb })
    }
  }
  return problems
}

export function historyCount(tracked) {
  return tracked.filter((rel) => classifyPath(rel)?.kind === 'HISTORY').length
}

export function generateMarkdown(tracked = listTrackedFiles()) {
  const lines = [
    '# File map',
    '',
    'GENERATED. Do not hand-edit. Source: `tools/file-map.mjs`.',
    '',
    '**This generated file lists** owners and kinds. **It does not own** the table.',
    '',
    '## Honest limits',
    '',
    '- A stale paragraph in fresh words is invisible.',
    '- A sentence that denies an owned fact but contains its shape is still refused.',
    '- A new fact family is unguarded until its row exists in the tool.',
    '',
    '## Owned facts',
    '',
    '| id | owner | why |',
    '|---|---|---|',
    ...FACTS.map((fact) => `| ${fact.id} | \`${fact.owner}\` | ${fact.why} |`),
    '',
    '## Tombstones (must not exist)',
    '',
    ...TOMBSTONES.map((t) => `- \`${t}\``),
    '',
    `HISTORY ceiling: ${HISTORY_FILES_MAX}`,
    '',
    '## Tracked files',
    '',
    '| path | kind | notes |',
    '|---|---|---|'
  ]

  const sorted = [...tracked].sort()
  for (const rel of sorted) {
    const row = classifyPath(rel)
    const kind = row?.kind ?? 'UNDECLARED'
    const notes = row?.notes ?? ''
    lines.push(`| \`${rel}\` | ${kind} | ${notes} |`)
  }
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function checkRepo(root = repoRoot) {
  const tracked = listTrackedFiles(root)
  const contents = {}
  for (const rel of tracked) {
    const full = path.join(root, rel)
    if (!existsSync(full)) continue
    try {
      contents[rel] = readFileSync(full, 'utf8')
    } catch {
      contents[rel] = ''
    }
  }

  const problems = [
    ...missingOwnerControls(contents),
    ...copiedFacts(contents),
    ...undeclaredFiles(tracked).map((file) => ({ code: 'undeclared', file })),
    ...resurrectedTombstones(tracked, root)
  ]

  const history = historyCount(tracked)
  if (history > HISTORY_FILES_MAX) {
    problems.push({
      code: 'history-ceiling',
      live: history,
      max: HISTORY_FILES_MAX
    })
  }

  const expected = generateMarkdown(tracked)
  const actual = existsSync(MAP_PATH) ? readFileSync(MAP_PATH, 'utf8') : ''
  const mapIdentical = actual === expected
  if (!mapIdentical) {
    problems.push({ code: 'map-stale', file: 'docs/file-map.md' })
  }

  return {
    problems,
    tracked: tracked.length,
    facts: FACTS.length,
    declared: tracked.length - undeclaredFiles(tracked).length,
    mapIdentical,
    history
  }
}

export function runSelfTest() {
  const failures = []

  const ownerOk = missingOwnerControls({
    'CLAUDE.md': 'nope',
    'docs/testing-gauntlet.md': FACTS[1].control
  })
  if (!ownerOk.some((p) => p.code === 'control-missing' && p.fact === 'FACT-CHECK-CADENCE')) {
    failures.push('control-missing detector silent')
  }

  const copied = copiedFacts({
    'CLAUDE.md': FACTS[2].control,
    'README.md': FACTS[2].control
  })
  if (!copied.some((p) => p.file === 'README.md' && p.fact === 'FACT-NO-NETWORK')) {
    failures.push('copied-fact detector silent')
  }

  const undeclared = undeclaredFiles(['mystery.dat', 'CLAUDE.md'])
  if (!undeclared.includes('mystery.dat') || undeclared.includes('CLAUDE.md')) {
    failures.push('undeclared detector wrong')
  }

  const tombs = resurrectedTombstones([TOMBSTONES[0]], repoRoot)
  if (!tombs.some((p) => p.file === TOMBSTONES[0])) {
    failures.push('tombstone detector silent for tracked path')
  }

  return failures
}

function printCheck(result) {
  for (const problem of result.problems) {
    console.error(JSON.stringify(problem))
  }
  console.log(
    `file-map: ${result.declared} declared, ${result.facts} facts, ${result.tracked} tracked, ${result.problems.length} problems, mapIdentical=${result.mapIdentical ? 'yes' : 'no'}`
  )
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
    console.log(`file-map self-test: 4/4 controls`)
    return
  }
  if (arg === '--check') {
    const result = checkRepo()
    printCheck(result)
    if (result.problems.length > 0) process.exitCode = 1
    return
  }
  const tracked = listTrackedFiles()
  writeFileSync(MAP_PATH, generateMarkdown(tracked), 'utf8')
  console.log(`wrote docs/file-map.md (${tracked.length} paths)`)
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
