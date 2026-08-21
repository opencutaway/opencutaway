import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoJson } from './helpers/repo-files.ts'
import { WIDEN_SITTING_2, throughLineHotspots } from '../src/app/sitting.ts'

const sittingSchema = compileSchema('schema/sitting-widen-2.schema.json')

describe('widen sitting 2 content', () => {
  it('accepts the Lights sitting instance', () => {
    expect(sittingSchema(readRepoJson('content/sittings/widen-2-lights.json'))).toBe(
      true
    )
  })

  it('uses real names for the through-line and keeps crossing objects quiet', () => {
    const names = throughLineHotspots(WIDEN_SITTING_2).map((hotspot) => hotspot.displayName)
    expect(names).toEqual([
      'Utility pole',
      'Overhead conductor',
      'Distribution transformer'
    ])
    expect(WIDEN_SITTING_2.throughLine).toBe('Lights')
    expect(WIDEN_SITTING_2.secondMissHint).toBe('This is the street object for lights.')
    expect(WIDEN_SITTING_2.secondMissHint.includes('Utility pole')).toBe(false)
    expect(WIDEN_SITTING_2.secondMissHint.includes('Overhead conductor')).toBe(false)
    expect(WIDEN_SITTING_2.secondMissHint.includes('Distribution transformer')).toBe(
      false
    )
    // D1: the hint names the need, never an object; the old form said "not the crossing".
    const hint = WIDEN_SITTING_2.secondMissHint.toLowerCase()
    expect(hint.includes('crossing')).toBe(false)
    expect(hint.includes('crosswalk')).toBe(false)
    expect(hint.includes('gates')).toBe(false)
    expect(hint.includes('signal')).toBe(false)
    expect(hint.includes('shop')).toBe(false)
    expect(WIDEN_SITTING_2.hotspots.length).toBe(10)
    for (const hotspot of WIDEN_SITTING_2.hotspots) {
      expect(hint.includes(hotspot.displayName.toLowerCase())).toBe(false)
    }
    const transformer = WIDEN_SITTING_2.hotspots.find(
      (hotspot) => hotspot.id === 'obj-distribution-transformer'
    )
    expect(transformer?.gloss).toBe(
      'distribution transformer; it steps voltage down so nearby buildings can use it'
    )
    const signal = WIDEN_SITTING_2.hotspots.find(
      (hotspot) => hotspot.id === 'obj-traffic-signal'
    )
    expect(signal?.role).toBe('off-need')
    expect(signal?.inTabOrder).toBe(false)
    const shop = WIDEN_SITTING_2.hotspots.find((hotspot) => hotspot.id === 'obj-shop')
    expect(shop?.role).toBe('off-need')
    expect(shop?.inTabOrder).toBe(false)
    for (const hotspot of throughLineHotspots(WIDEN_SITTING_2)) {
      expect(hotspot.inTabOrder).toBe(true)
      expect(hotspot.visual.contrast).toBe('high')
      expect(hotspot.visual.pattern).toBe('solid')
    }
  })

  it('rejects a through-line hotspot that is missing from tab order', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string; inTabOrder: boolean }[]
    }
    const pole = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-utility-pole')
    expect(pole).toBeTruthy()
    pole!.inTabOrder = false
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects an off-need hotspot placed in tab order', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string; inTabOrder: boolean }[]
    }
    const signal = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-traffic-signal')
    expect(signal).toBeTruthy()
    signal!.inTabOrder = true
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects extra properties on the sitting', () => {
    const sitting = {
      ...(readRepoJson('content/sittings/widen-2-lights.json') as object),
      analyticsId: 'nope'
    }
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects a crossing object placed on the Lights through-line', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string; role: string }[]
    }
    const signal = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-traffic-signal')
    expect(signal).toBeTruthy()
    signal!.role = 'through-line'
    expect(sittingSchema(sitting)).toBe(false)
  })

  it('rejects approachLiveGear values other than never (S3)', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      safety: { approachLiveGear: string }
    }
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
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      secondMissHint?: string
    }
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
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      prompt: string
    }
    sitting.prompt = ''
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('minLength/prompt')
  })

  it('rejects an empty hotspot list', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: unknown[]
    }
    sitting.hotspots = []
    expect(sittingSchema(sitting)).toBe(false)
    expect(sittingSchema.errors?.map((error) => error.keyword)).toContain('minItems')
  })

  it('rejects fewer than five hotspots even with the whole through-line present', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string }[]
    }
    sitting.hotspots = sitting.hotspots.slice(0, 4)
    expect(sitting.hotspots.map((hotspot) => hotspot.id)).toEqual([
      'obj-utility-pole',
      'obj-overhead-conductor',
      'obj-distribution-transformer',
      'obj-traffic-signal'
    ])
    expect(sittingSchema(sitting)).toBe(false)
    // The missing shop also trips a contains clause; minItems must still be reported.
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('minItems/hotspots')
  })

  it('rejects a through-line hotspot with an empty gloss', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string; gloss?: string }[]
    }
    const transformer = sitting.hotspots.find(
      (hotspot) => hotspot.id === 'obj-distribution-transformer'
    )
    expect(transformer).toBeTruthy()
    transformer!.gloss = ''
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`)
    ).toContain('minLength/hotspots/2/gloss')
  })

  it('rejects a through-line hotspot with no gloss', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: { id: string; gloss?: string }[]
    }
    const pole = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-utility-pole')
    expect(pole).toBeTruthy()
    delete pole!.gloss
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.missingProperty)}`
      )
    ).toContain('required:gloss')
  })

  it('rejects a hotspot with an extra property', () => {
    const sitting = structuredClone(readRepoJson('content/sittings/widen-2-lights.json')) as {
      hotspots: ({ id: string } & Record<string, unknown>)[]
    }
    const pole = sitting.hotspots.find((hotspot) => hotspot.id === 'obj-utility-pole')
    expect(pole).toBeTruthy()
    pole!.tapCount = 0
    expect(sittingSchema(sitting)).toBe(false)
    expect(
      sittingSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.additionalProperty)}`
      )
    ).toContain('additionalProperties:tapCount')
  })

  it('keeps dam and cute substitute names out of the committed sitting', () => {
    const text = JSON.stringify(WIDEN_SITTING_2).toLowerCase()
    expect(text.includes('dam')).toBe(false)
    expect(text.includes('sparkle')).toBe(false)
    expect(text.includes('zappy')).toBe(false)
  })
})
