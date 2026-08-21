import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scanPiiInTree } from './lib/pii-scan.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const findings = scanPiiInTree(repoRoot)

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.file}: ${finding.hits.join(', ')}`)
  }
  process.exitCode = 1
}
