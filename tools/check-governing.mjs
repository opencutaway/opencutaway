#!/usr/bin/env node
/**
 * Governing-file registry and ownership-header check.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './file-map.mjs'

export const GOVERNING_FILES = [
  'CLAUDE.md',
  'AGENTS.md',
  'SPEC.md',
  'README.md',
  'docs/testing-gauntlet.md',
  'docs/settled.md',
  'docs/open-faults.md',
  'docs/PRIVACY.md',
  '.claude/skills/drift-check/SKILL.md'
]

const HEADER = 'This document owns'
const STRAY_NAMES = new Set([
  'STATUS.md',
  'status.md',
  'PROGRESS.md',
  'progress.md',
  'SESSION.md',
  'session-summary.md',
  'HANDOFF.md'
])

export function hasOwnershipHeader(text) {
  return text.includes(HEADER)
}

export function findStrayStatusFiles(root = repoRoot) {
  const strays = []
  const roots = [root, path.join(root, 'docs')]
  for (const dir of roots) {
    if (!existsSync(dir)) continue
    for (const name of readdirSync(dir)) {
      if (STRAY_NAMES.has(name)) {
        strays.push(path.posix.join(dir === root ? '' : 'docs', name).replace(/^\//, '') || name)
      }
    }
  }
  return strays.map((p) => p.replaceAll('\\', '/'))
}

export function checkGoverning(root = repoRoot) {
  const problems = []
  for (const rel of GOVERNING_FILES) {
    const full = path.join(root, rel)
    if (!existsSync(full)) {
      problems.push({ code: 'missing', file: rel })
      continue
    }
    const text = readFileSync(full, 'utf8')
    if (!hasOwnershipHeader(text)) {
      problems.push({ code: 'missing-header', file: rel })
    }
  }
  for (const stray of findStrayStatusFiles(root)) {
    problems.push({ code: 'stray-status', file: stray })
  }
  return { files: GOVERNING_FILES.length, problems }
}

export function runSelfTest() {
  const failures = []
  if (hasOwnershipHeader('# Title\n\nNo header here.')) {
    failures.push('header detector false positive')
  }
  if (!hasOwnershipHeader('**This document owns** a thing.')) {
    failures.push('header detector missed bold form')
  }
  const missing = []
  if (!hasOwnershipHeader('plain')) missing.push('x')
  if (missing.length === 0) failures.push('negative control for missing header silent')
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
    console.log('governing self-test: 3/3 controls')
    return
  }
  const result = checkGoverning()
  for (const problem of result.problems) console.error(JSON.stringify(problem))
  console.log(
    `governing: ${result.files} files, ${result.problems.filter((p) => p.code === 'stray-status').length} strays, ${result.problems.length} problems`
  )
  if (result.problems.length > 0) process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}
