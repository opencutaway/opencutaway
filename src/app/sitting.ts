import sitting1Json from '../../content/sittings/widen-1-get-across.json' with { type: 'json' }
import sitting2Json from '../../content/sittings/widen-2-lights.json' with { type: 'json' }

export type HotspotRole = 'through-line' | 'off-need'

export type SittingHotspot = {
  id: string
  role: HotspotRole
  displayName: string
  gloss?: string
  functionSummary?: string
  inTabOrder: boolean
  visual: {
    contrast: 'high' | 'low'
    pattern: 'solid' | 'dashed-quiet'
  }
  layout: {
    xPercent: number
    yPercent: number
    widthPercent: number
    heightPercent: number
  }
}

export type WidenSitting = {
  sittingId: string
  throughLine: string
  overture: string
  prompt: string
  tryAgain: string
  secondMissHint: string
  adultRevealLabel: string
  showAllNamesLabel: string
  backLabel: string
  hotspots: SittingHotspot[]
}

export const WIDEN_SITTING_1 = sitting1Json as WidenSitting
export const WIDEN_SITTING_2 = sitting2Json as WidenSitting

export function throughLineHotspots(
  sitting: WidenSitting = WIDEN_SITTING_1
): SittingHotspot[] {
  return sitting.hotspots.filter((hotspot) => hotspot.role === 'through-line')
}

export function hotspotById(
  id: string,
  sitting: WidenSitting = WIDEN_SITTING_1
): SittingHotspot | undefined {
  return sitting.hotspots.find((hotspot) => hotspot.id === id)
}

/**
 * S9 at the block's minimum rendered width (`.busy-block { min-width }`):
 * every hotspot box must measure at least `minHitPx` on both axes, and no two
 * boxes may intersect, so a later-painted hotspot can never cover another.
 */
export const HOTSPOT_LAYOUT_RULE = {
  minBlockWidthPx: 720,
  minBlockHeightPx: 405,
  minHitPx: 44
} as const

export type HotspotLayoutProblem =
  | { code: 'too-narrow'; id: string; px: number }
  | { code: 'too-short'; id: string; px: number }
  | { code: 'overlap'; id: string; other: string }
  | { code: 'out-of-block'; id: string }

export function findHotspotLayoutProblems(
  hotspots: Pick<SittingHotspot, 'id' | 'layout'>[],
  rule: { minBlockWidthPx: number; minBlockHeightPx: number; minHitPx: number } = HOTSPOT_LAYOUT_RULE
): HotspotLayoutProblem[] {
  const problems: HotspotLayoutProblem[] = []
  const boxes = hotspots.map((hotspot) => {
    const { xPercent, yPercent, widthPercent, heightPercent } = hotspot.layout
    return {
      id: hotspot.id,
      x1: xPercent,
      y1: yPercent,
      x2: xPercent + widthPercent,
      y2: yPercent + heightPercent,
      widthPx: (widthPercent / 100) * rule.minBlockWidthPx,
      heightPx: (heightPercent / 100) * rule.minBlockHeightPx
    }
  })
  for (const box of boxes) {
    if (box.widthPx < rule.minHitPx) {
      problems.push({ code: 'too-narrow', id: box.id, px: Math.round(box.widthPx * 10) / 10 })
    }
    if (box.heightPx < rule.minHitPx) {
      problems.push({ code: 'too-short', id: box.id, px: Math.round(box.heightPx * 10) / 10 })
    }
    if (box.x2 > 100 || box.y2 > 100) {
      problems.push({ code: 'out-of-block', id: box.id })
    }
  }
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i]
      const b = boxes[j]
      const intersects = a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2
      if (intersects) {
        problems.push({ code: 'overlap', id: a.id, other: b.id })
      }
    }
  }
  return problems
}
