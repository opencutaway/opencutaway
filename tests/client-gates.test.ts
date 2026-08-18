import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { findForbiddenTokens } from '../scripts/lib/client-gates.mjs'
import { scanClientTree } from '../scripts/lib/scan-client-tree.mjs'
import { repoRoot } from './helpers/repo-files.ts'

describe('child-facing client hard-stops', () => {
  it('flags forbidden client tokens in a sample string', () => {
    const sample = ['get', 'User', 'Media'].join('')
    expect(findForbiddenTokens(sample)).toContain('getUserMedia')
  })

  it('finds no forbidden tokens under src/', async () => {
    const findings = await scanClientTree(path.join(repoRoot, 'src'))
    expect(findings).toEqual([])
  })
})
