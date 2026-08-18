import { describe, expect, it } from 'vitest'
import { findForbiddenDependencies } from '../scripts/lib/forbidden-dependencies.mjs'
import { readRepoJson } from './helpers/repo-files.ts'

describe('client dependency hard-stops', () => {
  it('rejects a sample package list that includes a forbidden SDK', () => {
    const hits = findForbiddenDependencies({
      dependencies: { openai: '1.0.0' }
    })
    expect(hits).toContain('openai')
  })

  it('allows the committed package.json', () => {
    const pkg = readRepoJson('package.json') as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    expect(findForbiddenDependencies(pkg)).toEqual([])
  })
})
