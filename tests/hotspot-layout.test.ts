import { describe, expect, it } from 'vitest'
import {
  WIDEN_SITTING_1,
  WIDEN_SITTING_2,
  findHotspotLayoutProblems
} from '../src/app/sitting.ts'
import { readRepoText } from './helpers/repo-files.ts'

const RULE_720 = { minBlockWidthPx: 720, minBlockHeightPx: 405, minHitPx: 44 }

function box(id: string, x: number, y: number, w: number, h: number) {
  return { id, layout: { xPercent: x, yPercent: y, widthPercent: w, heightPercent: h } }
}

describe('hotspot layout keeps every target reachable (S9)', () => {
  it('lays out both committed sittings with no intersecting boxes and nothing under 44 px at 720 px', () => {
    expect(findHotspotLayoutProblems(WIDEN_SITTING_1.hotspots, RULE_720)).toEqual([])
    expect(findHotspotLayoutProblems(WIDEN_SITTING_2.hotspots, RULE_720)).toEqual([])
    expect(WIDEN_SITTING_1.hotspots.length).toBe(8)
    expect(WIDEN_SITTING_2.hotspots.length).toBe(10)
  })

  it('gives the same object the same box in both sittings', () => {
    const byId1 = new Map(WIDEN_SITTING_1.hotspots.map((hotspot) => [hotspot.id, hotspot.layout]))
    const shared = WIDEN_SITTING_2.hotspots.filter((hotspot) => byId1.has(hotspot.id))
    expect(shared.map((hotspot) => hotspot.id)).toEqual([
      'obj-utility-pole',
      'obj-traffic-signal',
      'obj-crosswalk',
      'obj-crossing-gates',
      'obj-shop',
      'obj-mailbox',
      'obj-fire-hydrant',
      'obj-railroad-tracks'
    ])
    for (const hotspot of shared) {
      expect(hotspot.layout).toEqual(byId1.get(hotspot.id))
    }
  })

  it('keeps the stylesheet minimum block width equal to the rule the layout was checked against', () => {
    const css = readRepoText('src/index.css')
    expect(css.includes('.busy-block {\n  position: relative;\n  min-width: 720px;')).toBe(true)
    expect(css.includes('.busy-block-scroll {\n  overflow-x: auto;')).toBe(true)
  })

  it('flags the pole-under-transformer overlap that shipped before this rule', () => {
    const problems = findHotspotLayoutProblems(
      [
        box('obj-utility-pole', 41.5, 16.5, 6.8, 26),
        box('obj-distribution-transformer', 44.2, 20.5, 6.2, 13)
      ],
      RULE_720
    )
    expect(problems).toEqual([
      { code: 'overlap', id: 'obj-utility-pole', other: 'obj-distribution-transformer' }
    ])
  })

  it('flags a box that is narrow, short, or off the block', () => {
    expect(findHotspotLayoutProblems([box('obj-a', 10, 10, 5, 10)], RULE_720)).toEqual([
      { code: 'too-narrow', id: 'obj-a', px: 36 },
      { code: 'too-short', id: 'obj-a', px: 40.5 }
    ])
    expect(findHotspotLayoutProblems([box('obj-b', 95, 95, 10, 12)], RULE_720)).toEqual([
      { code: 'out-of-block', id: 'obj-b' }
    ])
  })

  it('keeps drawn objects without a hotspot on the quiet style', () => {
    const busy = readRepoText('src/app/renderers/BusyBlock.tsx')
    expect(busy.includes("<g class={objectShapeClass('obj-far-utility-pole', hotspots)}>")).toBe(true)
    expect(busy.includes("<g class={objectShapeClass('obj-street-truck', hotspots)}>")).toBe(true)
    // Twelve named-object groups carry objectShapeClass; the remaining bare <g> groups are
    // street, ground, jobs, and trees, which are scenery rather than objects a child names.
    expect(busy.split("objectShapeClass('obj-").length - 1).toBe(12)
    expect((busy.match(/^ *<g>$/gm) ?? []).length).toBe(14)
  })

  it('accepts boxes that merely touch', () => {
    expect(
      findHotspotLayoutProblems([box('obj-a', 10, 10, 10, 12), box('obj-b', 20, 10, 10, 12)], RULE_720)
    ).toEqual([])
  })
})
