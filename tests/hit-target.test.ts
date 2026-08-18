import { describe, expect, it } from 'vitest'
import { readRepoText } from './helpers/repo-files.ts'

describe('child-facing hit target', () => {
  it('keeps stylesheet controls at 44 CSS pixels', () => {
    const css = readRepoText('src/index.css')
    expect(css.includes('min-height: 44px')).toBe(true)
    expect(css.includes('min-width: 44px')).toBe(true)
  })
})
