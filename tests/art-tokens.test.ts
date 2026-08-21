import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoJson, readRepoText } from './helpers/repo-files.ts'
import { HOTSPOT_LAYOUT_RULE } from '../src/app/sitting.ts'

type Tokens = {
  schemaVersion: string
  source: { owner: string }
  projection: { groundDiamondPx: { width: number; height: number }; elevationUnitPx: number }
  canvas: { logicalPx: { width: number; height: number } }
  display: { primary: string }
  legacyPlaceholder: {
    file: string
    viewBox: { width: number; height: number }
    tilePx: { width: number; height: number }
    minBlockWidthCssPx: number
    status: string
  }
  zoom: { transitionMs: number[]; liftLogicalPx: number[] }
  saturation: { principalPct: number }
  palette: { anchors: { id: string; name: string; hex: string; role: string }[] }
  processCoding: { process: string; colourFamily: string; anchor: string }[]
  touch: { minHitCssPx: number }
  timing: { separationMs: number[]; completionPause: number[] }
  animation: { ambientBudget: { note: string } }
  ui: {
    stylesheet: string
    pageBackground: string
    ink: string
    focusRing: string
    focusRingWidthCssPx: number
    focusRingNote: string
    throughLineOutline: string
    quietOutline: string
    foundOutline: string
    controlFocusRing: string
    controlFocusRingWidthCssPx: number
    blockBorder: string
    blockBackground: string
    quietNameInk: string
    quietNameBackground: string
    cardBackground: string
  }
  layers: string[]
  objectStates: string[]
  productionGates: string[]
}

const tokensSchema = compileSchema('schema/art-tokens.schema.json')
const TOKENS_PATH = 'content/art/tokens.json'
const BIBLE_PATH = 'docs/art-bible.md'
const STYLESHEET_PATH = 'src/index.css'

/** The 23 palette anchors of the bible figure, in bible order. Upper-case hex. */
const PALETTE = [
  ['deep-structural-shadow', '#252B35'],
  ['cool-shadow', '#354253'],
  ['asphalt', '#4B5963'],
  ['dark-steel', '#56656B'],
  ['galvanized-steel', '#87979A'],
  ['warm-concrete', '#AAA594'],
  ['pale-concrete', '#CAC5B3'],
  ['weathered-wood', '#8B654B'],
  ['rust-accent', '#A65D3D'],
  ['soil', '#7D654E'],
  ['vegetation', '#65875B'],
  ['deep-vegetation', '#405F49'],
  ['water', '#438EA1'],
  ['deep-water', '#315F77'],
  ['safety-yellow', '#E4B94E'],
  ['signal-amber', '#E69A3B'],
  ['signal-red', '#D65352'],
  ['signal-green', '#4BA16B'],
  ['instructional-cyan', '#6CCED0'],
  ['electrical-violet', '#8A7ED6'],
  ['selection-gold', '#F5D26A'],
  ['warm-light', '#F0C685'],
  ['soft-highlight', '#EDE8DA']
]

/** Every hex colour src/index.css uses, lower-case, sorted. Any change here is a stylesheet change. */
const STYLESHEET_HEXES = [
  '#12202a',
  '#1a1424',
  '#1e6e8a',
  '#2e7d4f',
  '#3e6e92',
  '#5e574d',
  '#8f8678',
  '#b8770a',
  '#d9d3c8',
  '#f4f1ea',
  '#fffdf8'
]

function loadTokens(): Tokens {
  return structuredClone(readRepoJson(TOKENS_PATH)) as Tokens
}

function errorPaths() {
  return tokensSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`) ?? []
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort()
}

/** Upper-case #RRGGBB tokens in a text. A digit-only hex (for example #354253) counts as upper-case. */
function upperHexes(text: string): string[] {
  return sortedUnique(text.match(/#[0-9A-F]{6}\b/g) ?? [])
}

/** Lower-case #rrggbb tokens in a text that carry at least one letter, so a digit-only palette hex is not counted twice. */
function lowerHexes(text: string): string[] {
  return sortedUnique((text.match(/#[0-9a-f]{6}\b/g) ?? []).filter((hex) => /[a-f]/.test(hex)))
}

function uiHexes(tokens: Tokens): string[] {
  return sortedUnique(
    Object.values(tokens.ui).filter(
      (value): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/.test(value)
    )
  )
}

describe('art tokens content', () => {
  it('accepts the committed tokens instance', () => {
    expect(tokensSchema(readRepoJson(TOKENS_PATH))).toBe(true)
  })

  it('names the bible as the owner of the rules', () => {
    expect(loadTokens().source.owner).toBe('docs/art-bible.md')
  })

  it('carries the 23 palette anchors with the exact hex values of the bible figure', () => {
    const tokens = loadTokens()
    expect(tokens.palette.anchors.map((anchor) => [anchor.id, anchor.hex])).toEqual(PALETTE)
    expect(PALETTE.length).toBe(23)
    expect(new Set(tokens.palette.anchors.map((anchor) => anchor.hex)).size).toBe(23)
  })

  it('lists the bible layers, states, gates, and process colours in full', () => {
    const tokens = loadTokens()
    expect(tokens.layers).toEqual([
      'BG_FAR',
      'BG_MID',
      'BG_NEAR',
      'GROUND_BASE',
      'GROUND_DETAIL',
      'GROUND_REMOVABLE',
      'OBJECT_BASE',
      'OBJECT_PART_[NAME]',
      'OBJECT_INTERIOR',
      'OBJECT_CUTAWAY',
      'SHADOW_STATIC',
      'SHADOW_DYNAMIC',
      'FX_SELECTION',
      'FX_FLOW',
      'FX_PROCESS',
      'FX_AMBIENT',
      'CHARACTERS',
      'FOREGROUND_OCCLUSION',
      'HITMASK_[NAME]',
      'LABEL_ANCHOR_[NAME]',
      'AUDIO_ANCHOR_[NAME]'
    ])
    expect(tokens.objectStates).toEqual([
      'OVERVIEW_IDLE',
      'OVERVIEW_SELECTED',
      'INSPECTION_CLOSED',
      'INSPECTION_OPEN',
      'PROCESS_STAGE_01',
      'PROCESS_STAGE_02',
      'PROCESS_STAGE_03',
      'PROCESS_COMPLETE',
      'RETURN'
    ])
    expect(tokens.productionGates).toEqual([
      'function',
      'silhouette',
      'composition',
      'interaction',
      'cutaway',
      'animation',
      'originality',
      'export'
    ])
    expect(
      tokens.processCoding.map((code) => `${code.process}:${code.colourFamily}:${code.anchor}`)
    ).toEqual([
      'water:cyan-blue:instructional-cyan',
      'electricity:violet:electrical-violet',
      'mechanical-load:amber-gold:signal-amber',
      'data-control:pale-neutral:soft-highlight',
      'vehicle-pedestrian-path:muted-warm-white:warm-light'
    ])
    expect(tokens.touch.minHitCssPx).toBe(44)
    // Q3: the ambient budget governs motion only; drawn density stays settled.
    expect(tokens.animation.ambientBudget.note.startsWith('Q3: ')).toBe(true)
    expect(tokens.animation.ambientBudget.note.includes('motion only')).toBe(true)
  })

  it('gives the SPEC separation numbers a token home', () => {
    const tokens = loadTokens()
    // SPEC.md lesson-beat table: physical separation 300–450 ms, object rises 6–12 logical px.
    expect(tokens.timing.separationMs).toEqual([300, 450])
    expect(tokens.zoom.liftLogicalPx).toEqual([6, 12])
    expect(tokens.timing.completionPause).toEqual([500, 900])
  })

  it('rejects a palette anchor with a malformed hex', () => {
    const tokens = loadTokens()
    tokens.palette.anchors[0].hex = '#GGGGGG'
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toContain('pattern/palette/anchors/0/hex')
  })

  it('rejects a lower-case palette hex', () => {
    const tokens = loadTokens()
    tokens.palette.anchors[2].hex = '#4b5963'
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/palette/anchors/2/hex'])
  })

  it('rejects a 22-anchor palette', () => {
    const tokens = loadTokens()
    tokens.palette.anchors = tokens.palette.anchors.slice(0, 22)
    expect(tokens.palette.anchors.length).toBe(22)
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['minItems/palette/anchors'])
  })

  it('rejects a 24-anchor palette', () => {
    const tokens = loadTokens()
    tokens.palette.anchors.push({
      id: 'extra-anchor',
      name: 'Extra anchor',
      hex: '#123456',
      role: 'material'
    })
    expect(tokens.palette.anchors.length).toBe(24)
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['maxItems/palette/anchors'])
  })

  it('rejects a duplicated palette anchor', () => {
    const tokens = loadTokens()
    tokens.palette.anchors[1] = structuredClone(tokens.palette.anchors[0])
    expect(tokens.palette.anchors.length).toBe(23)
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['uniqueItems/palette/anchors'])
  })

  it('rejects a process colour family outside the bible vocabulary', () => {
    const tokens = loadTokens()
    tokens.processCoding[0].colourFamily = 'teal'
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['enum/processCoding/0/colourFamily'])
  })

  it('rejects principal saturation other than 100', () => {
    const tokens = loadTokens()
    tokens.saturation.principalPct = 101
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['const/saturation/principalPct'])
  })

  it('rejects an extra top-level property', () => {
    const tokens = { ...loadTokens(), analyticsId: 'nope' }
    expect(tokensSchema(tokens)).toBe(false)
    expect(
      tokensSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.additionalProperty)}`
      )
    ).toEqual(['additionalProperties:analyticsId'])
  })

  it('rejects a missing required top-level property', () => {
    const tokens = loadTokens() as Partial<Tokens>
    delete tokens.timing
    expect(tokensSchema(tokens)).toBe(false)
    expect(
      tokensSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.missingProperty)}`
      )
    ).toEqual(['required:timing'])
  })

  it('rejects tokens that drop the separation timing', () => {
    const tokens = loadTokens()
    delete (tokens.timing as Partial<Tokens['timing']>).separationMs
    expect(tokensSchema(tokens)).toBe(false)
    expect(
      tokensSchema.errors?.map(
        (error) => `${error.keyword}${error.instancePath}:${String(error.params.missingProperty)}`
      )
    ).toEqual(['required/timing:separationMs'])
  })

  it('rejects tokens that drop the separation lift', () => {
    const tokens = loadTokens()
    delete (tokens.zoom as Partial<Tokens['zoom']>).liftLogicalPx
    expect(tokensSchema(tokens)).toBe(false)
    expect(
      tokensSchema.errors?.map(
        (error) => `${error.keyword}${error.instancePath}:${String(error.params.missingProperty)}`
      )
    ).toEqual(['required/zoom:liftLogicalPx'])
  })

  it('rejects an extra property nested inside touch', () => {
    const tokens = loadTokens()
    ;(tokens.touch as Record<string, unknown>).hapticBuzz = true
    expect(tokensSchema(tokens)).toBe(false)
    expect(
      tokensSchema.errors?.map(
        (error) =>
          `${error.keyword}${error.instancePath}:${String(error.params.additionalProperty)}`
      )
    ).toEqual(['additionalProperties/touch:hapticBuzz'])
  })

  it('rejects a primary display other than iPad landscape', () => {
    const tokens = loadTokens()
    tokens.display.primary = 'phone'
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['enum/display/primary'])
  })

  it('rejects a minimum hit target below the S9 number', () => {
    const tokens = loadTokens()
    tokens.touch.minHitCssPx = 40
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['const/touch/minHitCssPx'])
  })

  it('rejects a ground diamond that is not 64 by 32', () => {
    const tokens = loadTokens()
    tokens.projection.groundDiamondPx.width = 72
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['const/projection/groundDiamondPx/width'])
  })

  it('rejects an upper-case ui hex', () => {
    const tokens = loadTokens()
    tokens.ui.cardBackground = '#FFFDF8'
    expect(tokensSchema(tokens)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/ui/cardBackground'])
  })
})

describe('art tokens gate: renderer and stylesheet agree with the tokens', () => {
  it('pins the legacy placeholder constants that BusyBlock.tsx still draws with', () => {
    const tokens = loadTokens()
    const renderer = readRepoText('src/app/renderers/BusyBlock.tsx')
    expect(tokens.legacyPlaceholder.file).toBe('src/app/renderers/BusyBlock.tsx')
    expect(tokens.legacyPlaceholder.status).toBe('exempt-until-redrawn')
    expect(renderer.includes('const TILE_W = 72')).toBe(true)
    expect(renderer.includes('const TILE_H = 36')).toBe(true)
    expect(renderer.includes('viewBox="0 0 960 540"')).toBe(true)
    expect(tokens.legacyPlaceholder.tilePx.width).toBe(72)
    expect(tokens.legacyPlaceholder.tilePx.height).toBe(36)
    expect(tokens.legacyPlaceholder.viewBox.width).toBe(960)
    expect(tokens.legacyPlaceholder.viewBox.height).toBe(540)
  })

  it('keeps the hotspot layout floor equal to the placeholder minimum block width', () => {
    const tokens = loadTokens()
    expect(HOTSPOT_LAYOUT_RULE.minBlockWidthPx).toBe(720)
    expect(tokens.legacyPlaceholder.minBlockWidthCssPx).toBe(720)
    expect(HOTSPOT_LAYOUT_RULE.minBlockWidthPx).toBe(tokens.legacyPlaceholder.minBlockWidthCssPx)
    expect(HOTSPOT_LAYOUT_RULE.minHitPx).toBe(44)
    expect(tokens.touch.minHitCssPx).toBe(44)
  })

  it('names the exemption: the real-art grid is not the placeholder grid', () => {
    const tokens = loadTokens()
    expect(tokens.projection.groundDiamondPx.width).toBe(64)
    expect(tokens.projection.groundDiamondPx.height).toBe(32)
    expect(tokens.legacyPlaceholder.tilePx.width).toBe(72)
    expect(tokens.legacyPlaceholder.tilePx.height).toBe(36)
    expect(tokens.projection.groundDiamondPx.width).not.toBe(tokens.legacyPlaceholder.tilePx.width)
    expect(tokens.canvas.logicalPx.width).toBe(1024)
    expect(tokens.canvas.logicalPx.height).toBe(768)
    expect(tokens.canvas.logicalPx.width).not.toBe(tokens.legacyPlaceholder.viewBox.width)
  })

  it('pins every ui colour token to its literal value', () => {
    const tokens = loadTokens()
    expect(tokens.ui.stylesheet).toBe('src/index.css')
    expect(tokens.ui.pageBackground).toBe('#f4f1ea')
    expect(tokens.ui.ink).toBe('#12202a')
    expect(tokens.ui.focusRing).toBe('#b8770a')
    expect(tokens.ui.focusRingWidthCssPx).toBe(4)
    expect(tokens.ui.throughLineOutline).toBe('#12202a')
    expect(tokens.ui.quietOutline).toBe('#8f8678')
    expect(tokens.ui.foundOutline).toBe('#2e7d4f')
    expect(tokens.ui.controlFocusRing).toBe('#1e6e8a')
    expect(tokens.ui.controlFocusRingWidthCssPx).toBe(3)
    expect(tokens.ui.blockBorder).toBe('#1a1424')
    expect(tokens.ui.blockBackground).toBe('#3e6e92')
    expect(tokens.ui.quietNameInk).toBe('#5e574d')
    expect(tokens.ui.quietNameBackground).toBe('#d9d3c8')
    expect(tokens.ui.cardBackground).toBe('#fffdf8')
  })

  it('uses exactly the stylesheet hex set in ui: no token without a rule, no rule without a token', () => {
    const tokens = loadTokens()
    const css = readRepoText(STYLESHEET_PATH)
    const cssHexes = sortedUnique((css.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((hex) => hex.toLowerCase()))
    expect(STYLESHEET_HEXES.length).toBe(11)
    expect(cssHexes).toEqual(STYLESHEET_HEXES)
    expect(uiHexes(tokens)).toEqual(STYLESHEET_HEXES)
  })

  it('finds each ui colour in the rule the token names', () => {
    const css = readRepoText(STYLESHEET_PATH)
    expect(css.includes('outline: 4px solid #b8770a')).toBe(true)
    expect(css.includes('outline: 3px solid #1e6e8a')).toBe(true)
    expect(css.includes('outline: 3px solid #12202a')).toBe(true)
    expect(css.includes('outline: 2px dashed #8f8678')).toBe(true)
    expect(css.includes('outline-color: #2e7d4f')).toBe(true)
    expect(css.includes('border: 2px solid #1a1424')).toBe(true)
    expect(css.includes('background: #3e6e92')).toBe(true)
    expect(css.includes('color: #5e574d')).toBe(true)
    expect(css.includes('background: #d9d3c8')).toBe(true)
    expect(css.includes('background: #fffdf8')).toBe(true)
    expect(css.includes('background: #f4f1ea')).toBe(true)
    expect(css.includes('color: #12202a')).toBe(true)
  })
})

describe('art tokens gate: the bible and the tokens quote the same colours', () => {
  it('quotes every palette anchor hex in upper case, and no other upper-case hex', () => {
    const bible = readRepoText(BIBLE_PATH)
    const expected = sortedUnique(PALETTE.map(([, hex]) => hex))
    expect(expected.length).toBe(23)
    expect(upperHexes(bible)).toEqual(expected)
    expect(sortedUnique(loadTokens().palette.anchors.map((anchor) => anchor.hex))).toEqual(expected)
  })

  it('quotes every ui hex in lower case, and no other lower-case hex', () => {
    const bible = readRepoText(BIBLE_PATH)
    expect(lowerHexes(bible)).toEqual(STYLESHEET_HEXES)
    expect(uiHexes(loadTokens())).toEqual(STYLESHEET_HEXES)
  })

  it('never quotes a mixed-case hex', () => {
    const bible = readRepoText(BIBLE_PATH)
    const every = sortedUnique(bible.match(/#[0-9a-fA-F]{6}\b/g) ?? [])
    const classified = new Set([...upperHexes(bible), ...lowerHexes(bible)])
    expect(every.filter((hex) => !classified.has(hex))).toEqual([])
  })
})
