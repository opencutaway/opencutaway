#!/usr/bin/env node
/**
 * Blast-radius lookup. Name a thing; list tracked files that mention it.
 * This lookup never fails a build. --self-test does, and belongs in npm run check.
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
  return failures
}

function printHits(label, hits) {
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
    console.log('blast-radius self-test: 3/3 controls')
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
  console.error('Usage: node tools/blast-radius.mjs --word TOKEN | --symbol NAME | --count TOKEN | --self-test')
  process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
