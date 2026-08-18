import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
)

export function readRepoText(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

export function readRepoJson(relativePath: string): unknown {
  return JSON.parse(readRepoText(relativePath))
}
