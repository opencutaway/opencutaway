import { describe, expect, it } from 'vitest'
import { GAME_TITLE, TITLE_BLURB } from '../src/app/title.ts'

describe('title-screen stub', () => {
  it('names the game Open Cutaway without lesson content', () => {
    expect(GAME_TITLE).toBe('Open Cutaway')
    expect(TITLE_BLURB.includes('Lessons are not in this build yet')).toBe(true)
    expect(TITLE_BLURB.toLowerCase().includes('hydrant')).toBe(false)
  })
})
