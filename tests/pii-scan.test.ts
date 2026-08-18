import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  findPiiInText,
  shouldScanRelativePath
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
  })

  it('finds no PII markers in files git would track', () => {
    const output = execFileSync(
      'git',
      ['ls-files', '-co', '--exclude-standard'],
      { cwd: repoRoot, encoding: 'utf8' }
    )
    const findings: { file: string; hits: string[] }[] = []
    for (const relativePath of output.split(/\r?\n/).filter(Boolean)) {
      if (!shouldScanRelativePath(relativePath)) {
        continue
      }
      const text = readFileSync(path.join(repoRoot, relativePath), 'utf8')
      const hits = findPiiInText(text)
      if (hits.length > 0) {
        findings.push({ file: relativePath, hits })
      }
    }
    expect(findings).toEqual([])
  })
})
