import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { findForbiddenTokens } from './client-gates.mjs'

const SCAN_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.html'
])

export async function scanClientTree(rootDir) {
  const findings = []

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }
      if (!SCAN_EXTENSIONS.has(path.extname(entry.name))) {
        continue
      }
      const text = await readFile(fullPath, 'utf8')
      const hits = findForbiddenTokens(text)
      if (hits.length > 0) {
        findings.push({ file: fullPath, hits })
      }
    }
  }

  await walk(rootDir)
  return findings
}
