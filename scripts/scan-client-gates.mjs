import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scanClientTree } from './lib/scan-client-tree.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcRoot = path.join(repoRoot, 'src')
const findings = await scanClientTree(srcRoot)

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.file}: ${finding.hits.join(', ')}`)
  }
  process.exitCode = 1
}
