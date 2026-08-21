import { describe, expect, it } from 'vitest'
import { readRepoText } from './helpers/repo-files.ts'

describe('child-facing hit target', () => {
  it('keeps stylesheet controls at 44 CSS pixels', () => {
    const css = readRepoText('src/index.css')
    expect(css.includes('min-height: 44px')).toBe(true)
    expect(css.includes('min-width: 44px')).toBe(true)
    // The exact rule, so moving the declarations into a comment or an unused selector fails.
    const exactRule = [
      'button,',
      'a,',
      "[role='button'] {",
      '  min-height: 44px;',
      '  min-width: 44px;',
      '}'
    ].join('\n')
    expect(css.includes(exactRule)).toBe(true)
    const busy = readRepoText('src/app/renderers/BusyBlock.tsx')
    expect(busy.includes('<svg')).toBe(true)
    expect(busy.toLowerCase().includes('webgl')).toBe(false)
  })
})
