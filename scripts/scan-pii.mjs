import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findPiiInText, shouldScanRelativePath } from './lib/pii-scan.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function listCandidateFiles() {
  const output = execFileSync(
    'git',
    ['ls-files', '-co', '--exclude-standard'],
    { cwd: repoRoot, encoding: 'utf8' }
  )
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(shouldScanRelativePath)
}

const findings = []
for (const relativePath of listCandidateFiles()) {
  const fullPath = path.join(repoRoot, relativePath)
  const text = await readFile(fullPath, 'utf8')
  const hits = findPiiInText(text)
  if (hits.length > 0) {
    findings.push({ file: relativePath, hits })
  }
}

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.file}: ${finding.hits.join(', ')}`)
  }
  process.exitCode = 1
}
