import { describe, expect, it } from 'vitest'
import {
  findPiiInText,
  shouldScanRelativePath,
  scanPiiInTree
} from '../scripts/lib/pii-scan.mjs'
import { repoRoot } from './helpers/repo-files.ts'

describe('PII scrub', () => {
  it('detects constructed email and user-folder samples', () => {
    const email = ['pat', 'example.invalid'].join('@')
    const win = ['C:', 'Users', 'Pat'].join('\\') + '\\notes.txt'
    const mac = ['', 'Users', 'Pat', 'notes.txt'].join('/')
    expect(findPiiInText(email)).toContain('email-like')
    expect(findPiiInText(win)).toContain('windows-user-path')
    expect(findPiiInText(mac)).toContain('macos-user-path')
  })

  it('skips lockfiles', () => {
    expect(shouldScanRelativePath('package-lock.json')).toBe(false)
    expect(shouldScanRelativePath('docs/PRIVACY.md')).toBe(true)
    expect(shouldScanRelativePath('node_modules/pkg/index.js')).toBe(false)
  })

  it('finds no PII markers in files git would track', () => {
    expect(scanPiiInTree(repoRoot)).toEqual([])
  })
})
