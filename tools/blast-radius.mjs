#!/usr/bin/env node
/**
 * Blast-radius lookup. Name a thing; list tracked files that mention it.
 * This lookup never fails a build. --self-test does, and belongs in npm run check.
 *
 * Depends means: tracked files whose relative path or contents include the
 * token as a case-insensitive substring; not an import graph, call graph, or
 * git history.
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  classifyPath,
  listTrackedFiles,
  readText,
  repoRoot
} from './file-map.mjs'

export const SELF_TEST_WORD = 'opencutaway-blast-control-token'

export const DEPENDS_MEANS =
  'tracked files whose relative path or contents include the token as a case-insensitive substring; not an import graph, call graph, or git history'

export const USAGE = `Blast radius (named drift part; lookup, no markdown map)
Query: node tools/blast-radius.mjs --word TOKEN
Also:  node tools/blast-radius.mjs --symbol NAME | --count TOKEN | --self-test
Depends means: ${DEPENDS_MEANS}
MUST: run --word TOKEN before editing the named thing.
MUST NOT: treat this as an import/call/git graph; treat empty hits as "nothing depends" without checking token spelling.
build-fail: never (lookup). --self-test fails the build via G-blast.
Gate: G-blast
Negative controls: word lookup missed tools/blast-radius.mjs; symbol lookup missed SELF_TEST_WORD; expected GATE kind`

export function lookupWord(word, root = repoRoot) {
  const needle = word.toLowerCase()
  const hits = []
  for (const rel of listTrackedFiles(root)) {
    const nameHit = rel.toLowerCase().includes(needle)
    let contentHit = false
    try {
      contentHit = readText(root, rel).toLowerCase().includes(needle)
    } catch {
      contentHit = false
    }
    if (!nameHit && !contentHit) continue
    const row = classifyPath(rel)
    hits.push({
      file: rel,
      kind: row?.kind ?? 'UNDECLARED',
      via: [nameHit ? 'name' : null, contentHit ? 'content' : null].filter(Boolean)
    })
  }
  return hits
}

export function lookupSymbol(symbol, root = repoRoot) {
  const hits = []
  const pattern = new RegExp(`\\b${escapeRegExp(symbol)}\\b`)
  for (const rel of listTrackedFiles(root)) {
    let text = ''
    try {
      text = readText(root, rel)
    } catch {
      continue
    }
    if (!pattern.test(text) && !rel.includes(symbol)) continue
    const row = classifyPath(rel)
    hits.push({ file: rel, kind: row?.kind ?? 'UNDECLARED' })
  }
  return hits
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function countByKind(hits) {
  const counts = {}
  for (const hit of hits) {
    counts[hit.kind] = (counts[hit.kind] ?? 0) + 1
  }
  return counts
}

export function runSelfTest() {
  const failures = []
  const wordHits = lookupWord(SELF_TEST_WORD)
  if (!wordHits.some((hit) => hit.file === 'tools/blast-radius.mjs')) {
    failures.push('word lookup missed tools/blast-radius.mjs')
  }
  if (wordHits.length < 1) {
    failures.push('word lookup returned empty (looks like safety)')
  }
  const symbolHits = lookupSymbol('SELF_TEST_WORD')
  if (!symbolHits.some((hit) => hit.file === 'tools/blast-radius.mjs')) {
    failures.push('symbol lookup missed SELF_TEST_WORD')
  }
  const kinds = wordHits.map((hit) => hit.kind)
  if (kinds.includes('UNDECLARED') && wordHits.some((h) => h.file === 'tools/blast-radius.mjs' && h.kind === 'UNDECLARED')) {
    failures.push('classification failed for blast-radius tool')
  }
  const classified = wordHits.find((hit) => hit.file === 'tools/blast-radius.mjs')
  if (classified && classified.kind !== 'GATE') {
    failures.push(`expected GATE kind, got ${classified.kind}`)
  }
  const src = readText(repoRoot, 'tools/blast-radius.mjs')
  if (!src.includes('not an import graph, call graph, or git history')) {
    failures.push('depends-means contract missing')
  }
  return failures
}

function printHits(label, hits) {
  console.log(`depends-means: ${DEPENDS_MEANS}`)
  console.log('build-fail: never (lookup). --self-test fails the build via G-blast.')
  console.log(`${label}: ${hits.length} files`)
  const counts = countByKind(hits)
  console.log(`kinds: ${JSON.stringify(counts)}`)
  for (const hit of hits) {
    console.log(`- ${hit.file} [${hit.kind}] ${hit.via ? hit.via.join('+') : ''}`)
  }
}

function main() {
  const args = process.argv.slice(2)
  if (args[0] === '--self-test') {
    const failures = runSelfTest()
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      process.exitCode = 1
      return
    }
    console.log('blast-radius self-test: 4/4 controls')
    return
  }
  if (args[0] === '--word' && args[1]) {
    printHits(`word ${args[1]}`, lookupWord(args[1]))
    return
  }
  if (args[0] === '--symbol' && args[1]) {
    printHits(`symbol ${args[1]}`, lookupSymbol(args[1]))
    return
  }
  if (args[0] === '--count' && args[1]) {
    const hits = lookupWord(args[1])
    console.log(String(hits.length))
    return
  }
  console.error(USAGE)
  process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
