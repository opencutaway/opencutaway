import { GAME_TITLE, LEARN_CONTROL_LABEL, LIGHTS_CONTROL_LABEL, TITLE_BLURB } from '../src/app/title.ts'
import { describe, expect, it } from 'vitest'

describe('title screen', () => {
  it('names the game Open Cutaway and offers Get across and Lights', () => {
    expect(GAME_TITLE).toBe('Open Cutaway')
    expect(LEARN_CONTROL_LABEL).toBe('Get across')
    expect(LIGHTS_CONTROL_LABEL).toBe('Lights')
    expect(TITLE_BLURB.includes('Get across')).toBe(true)
    expect(TITLE_BLURB.includes('Lights')).toBe(true)
    expect(TITLE_BLURB.includes('Progress stays on this device')).toBe(true)
    expect(TITLE_BLURB.toLowerCase().includes('hydrant')).toBe(false)
  })
})
