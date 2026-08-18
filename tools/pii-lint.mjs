#!/usr/bin/env node
/**
 * PII and ethos gates. Negative controls live in --self-test.
 */
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { findPiiInText, shouldScanRelativePath } from '../scripts/lib/pii-scan.mjs'
import { findForbiddenTokens } from '../scripts/lib/client-gates.mjs'
import { scanClientTree } from '../scripts/lib/scan-client-tree.mjs'
import { repoRoot } from './file-map.mjs'

function listCandidateFiles(root = repoRoot) {
  const output = execFileSync(
    'git',
    ['ls-files', '-co', '--exclude-standard'],
    { cwd: root, encoding: 'utf8' }
  )
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(shouldScanRelativePath)
}

export async function scanPii(root = repoRoot) {
  const findings = []
  for (const relativePath of listCandidateFiles(root)) {
    const text = await readFile(path.join(root, relativePath), 'utf8')
    const hits = findPiiInText(text)
    if (hits.length > 0) {
      findings.push({ file: relativePath, hits })
    }
  }
  return findings
}

export async function scanEthos(root = repoRoot) {
  return scanClientTree(path.join(root, 'src'))
}

export function runSelfTest() {
  const failures = []
  const email = ['pat', 'example.invalid'].join('@')
  const win = ['C:', 'Users', 'Pat'].join('\\') + '\\notes.txt'
  const mac = ['', 'Users', 'Pat', 'notes.txt'].join('/')
  const piiHits = findPiiInText(`${email}\n${win}\n${mac}`)
  if (!piiHits.includes('email-like')) failures.push('email control silent')
  if (!piiHits.includes('windows-user-path')) failures.push('windows-path control silent')
  if (!piiHits.includes('macos-user-path')) failures.push('macos-path control silent')
  const token = ['get', 'User', 'Media'].join('')
  if (!findForbiddenTokens(token).includes('getUserMedia')) {
    failures.push('ethos token control silent')
  }
  if (findPiiInText('no markers here').length !== 0) {
    failures.push('pii false positive on clean text')
  }
  return failures
}

async function main() {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const failures = runSelfTest()
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      process.exitCode = 1
      return
    }
    console.log('pii-lint self-test: 5/5 controls')
    return
  }
  if (arg === '--ethos') {
    const findings = await scanEthos()
    for (const finding of findings) {
      console.error(`${finding.file}: ${finding.hits.join(', ')}`)
    }
    console.log(`ethos: ${findings.length} problems`)
    if (findings.length > 0) process.exitCode = 1
    return
  }
  const findings = await scanPii()
  for (const finding of findings) {
    console.error(`${finding.file}: ${finding.hits.join(', ')}`)
  }
  console.log(`pii: ${findings.length} problems`)
  if (findings.length > 0) process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  await main()
}
