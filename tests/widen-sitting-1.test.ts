import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoJson, readRepoText } from './helpers/repo-files.ts'
import {
  createSittingSession,
  onAdultReveal,
  onOffNeedTap,
  onThroughLineTap,
  shouldShowAdultReveal,
  shouldShowHint,
  shouldShowTryAgain,
  toggleShowAllNames
} from '../src/app/sitting-session.ts'
import { WIDEN_SITTING_1, throughLineHotspots } from '../src/app/sitting.ts'

const sittingSchema = compileSchema('schema/sitting-widen-1.schema.json')

describe('widen sitting 1 content', () => {
  it('accepts the Get across sitting instance', () => {
    expect(sittingSchema(readRepoJson('content/sittings/widen-1-get-across.json'))).toBe(
      true
    )
  })

  it('uses real names for the through-line and keeps off-need out of tab order', () => {
    const names = throughLineHotspots().map((hotspot) => hotspot.displayName)
    expect(names).toEqual(['Traffic signal', 'Crosswalk', 'Crossing gates'])
    expect(WIDEN_SITTING_1.throughLine).toBe('Get across')
    expect(WIDEN_SITTING_1.secondMissHint).toBe(
      'This is the street object for getting across.'
    )
    expect(WIDEN_SITTING_1.secondMissHint.includes('shop')).toBe(false)
    expect(WIDEN_SITTING_1.secondMissHint.includes('Traffic signal')).toBe(false)
    expect(WIDEN_SITTING_1.secondMissHint.includes('Crosswalk')).toBe(false)
    expect(WIDEN_SITTING_1.secondMissHint.includes('Crossing gates')).toBe(false)
    // D1: the hint names the need, never an object.
    const hint = WIDEN_SITTING_1.secondMissHint.toLowerCase()
    expect(WIDEN_SITTING_1.hotspots.length).toBe(8)
    for (const hotspot of WIDEN_SITTING_1.hotspots) {
      expect(hint.includes(hotspot.displayName.toLowerCase())).toBe(false)
    }
    const shop = WIDEN_SITTING_1.hotspots.find((hotspot) => hotspot.id === 'obj-shop')
    expect(shop?.role).toBe('off-need')
    expect(shop?.inTabOrder).toBe(false)
    for (const hotspot of throughLineHotspots()) {
      expect(hotspot.inTabOrder).toBe(true)
      expect(hotspot.visual.contrast).toBe('high')
      expect(hotspot.visual.pattern).toBe('solid')
    }
  })

  it('rejects a through-line hotspot that is missing from tab order', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: { id: string; inTabOrder: boolean }[] }
    const signal = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-traffic-signal')
    expect(signal).toBeTruthy()
    signal!.inTabOrder = false
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects an off-need hotspot placed in tab order', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: { id: string; inTabOrder: boolean }[] }
    const shop = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-shop')
    expect(shop).toBeTruthy()
    shop!.inTabOrder = true
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects extra properties on the sitting', () => {
    const sitting = {
      ...(readRepoJson('content/sittings/widen-1-get-across.json') as object),
      analyticsId: 'nope'
    }
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects approachLiveGear values other than never (S3)', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { safety: { approachLiveGear: string } }
    expect(sitting.safety.approachLiveGear).toBe('never')
    sitting.safety.approachLiveGear = 'sometimes'
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('const/safety/approachLiveGear')
    sitting.safety.approachLiveGear = 'ask-an-adult'
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects a sitting with no second-miss hint', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { secondMissHint?: string }
    expect(typeof sitting.secondMissHint).toBe('string')
    delete sitting.secondMissHint
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.missingProperty)}`
      )
    ).toContain('required:secondMissHint')
  })

  it('rejects an empty prompt', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { prompt: string }
    sitting.prompt = ''
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('minLength/prompt')
  })

  it('rejects an empty hotspot list', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: unknown[] }
    sitting.hotspots = []
    expect(sittingSchema(sitting)).toBe(false)
    expect(sittingSchema.errors?.map((error) => error.keyword)).toContain('minItems')
  })

  it('rejects fewer than five hotspots even when every named object is present', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: { id: string }[] }
    sitting.hotspots = sitting.hotspots.slice(0, 4)
    expect(sitting.hotspots.map((hotspot) => hotspot.id)).toEqual([
      'obj-traffic-signal',
      'obj-crosswalk',
      'obj-crossing-gates',
      'obj-shop'
    ])
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toEqual(['minItems/hotspots'])
  })

  it('rejects a through-line hotspot with an empty gloss', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: { id: string; gloss?: string }[] }
    const crosswalk = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-crosswalk')
    expect(crosswalk).toBeTruthy()
    crosswalk!.gloss = ''
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('minLength/hotspots/1/gloss')
  })

  it('rejects a through-line hotspot with no gloss', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: { id: string; gloss?: string }[] }
    const signal = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-traffic-signal')
    expect(signal).toBeTruthy()
    delete signal!.gloss
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.missingProperty)}`
      )
    ).toContain('required:gloss')
  })

  it('rejects a hotspot with an extra property', () => {
    const sitting = structuredClone(
      readRepoJson('content/sittings/widen-1-get-across.json')
    ) as { hotspots: ({ id: string } & Record<string, unknown>)[] }
    const signal = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-traffic-signal')
    expect(signal).toBeTruthy()
    signal!.tapCount = 0
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.additionalProperty)}`
      )
    ).toContain('additionalProperties:tapCount')
  })
})

describe('widen sitting 1 session', () => {
  it('asks to try again on the first miss and names the rung on the second', () => {
    let session = createSittingSession()
    session = onOffNeedTap(session)
    expect(shouldShowTryAgain(session)).toBe(true)
    expect(shouldShowHint(session)).toBe(false)
    session = onOffNeedTap(session)
    expect(shouldShowTryAgain(session)).toBe(false)
    expect(shouldShowHint(session)).toBe(true)
    expect(shouldShowAdultReveal(session)).toBe(true)
    session = onAdultReveal(session)
    expect(session.revealed).toBe(true)
    expect(shouldShowAdultReveal(session)).toBe(false)
    session = toggleShowAllNames(session)
    expect(session.showAllNames).toBe(true)
    session = toggleShowAllNames(session)
    expect(session.showAllNames).toBe(false)
  })

  it('records a through-line find without a timer or lockout', () => {
    let session = createSittingSession()
    session = onOffNeedTap(session)
    session = onThroughLineTap(session, 'obj-traffic-signal')
    expect(session.foundId).toBe('obj-traffic-signal')
    expect(shouldShowHint(session)).toBe(false)
    expect(shouldShowTryAgain(session)).toBe(false)
  })
})

describe('reduce-motion pulse rule', () => {
  it('turns off the through-line pulse when reduce-motion is requested', () => {
    const css = readRepoText('src/index.css')
    expect(css.includes('@media (prefers-reduced-motion: reduce)')).toBe(true)
    expect(css.includes('animation: none')).toBe(true)
  })
})
