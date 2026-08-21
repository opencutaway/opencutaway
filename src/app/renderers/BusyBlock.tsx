import type { SittingHotspot } from '../sitting'

type BusyBlockProps = {
  hotspots: SittingHotspot[]
  foundId: string | null
  revealed: boolean
  showAllNames: boolean
  onThroughLine: (id: string) => void
  onOffNeed: () => void
}

const TILE_W = 72
const TILE_H = 36
const ORIGIN_X = 468
const ORIGIN_Y = 126
const INK = 2

const C = {
  ink: '#1a1424',
  sky0: '#3e6e92',
  sky1: '#5a8aab',
  sky2: '#7eabc2',
  sky3: '#b7d3de',
  cloud: '#e8f2f4',
  cloudDk: '#c5d7de',
  hillLt: '#4e8a58',
  hillMd: '#3a6e46',
  hillDk: '#2c5636',
  grassA: '#3b8a45',
  grassB: '#2f7038',
  grassTuft: '#246030',
  walkA: '#d4c29a',
  walkB: '#b9a57c',
  curb: '#9a8864',
  roadA: '#585a68',
  roadB: '#474858',
  line: '#dccb7a',
  brickLt: '#c45a4a',
  brickMd: '#9a4036',
  brickDk: '#6e2c28',
  trim: '#efe4c8',
  roofLt: '#3d6d7a',
  roofMd: '#2c5560',
  roofDk: '#1e3e48',
  houseLt: '#d2b07a',
  houseMd: '#b08c58',
  houseDk: '#8a6a40',
  houseRoofLt: '#7a4450',
  houseRoofDk: '#5a303c',
  woodLt: '#8d5a32',
  wood: '#5e3a20',
  woodDk: '#3e2416',
  metalLt: '#8d8fa0',
  metal: '#5c5e6c',
  metalDk: '#3a3c48',
  cream: '#efe6d0',
  window: '#6eb8c8',
  windowDk: '#2f4e62',
  red: '#cc3c3c',
  amber: '#e0a83a',
  green: '#3c9c52',
  skin: '#e0b088',
  hair: '#2e221c',
  shirtShop: '#8a4a38',
  shirtMail: '#3a5c8c',
  shirtWalk: '#4a6e58',
  shirtGuard: '#d8d2c4',
  truckCab: '#5a6e82',
  truckBox: '#7a8490',
  awningA: '#e0cc58',
  awningB: '#c44c3c',
  leafLt: '#4ea24a',
  leafDk: '#2e7038',
  rail: '#6a7180'
}

type Pt = { x: number; y: number }

function isoPt(ix: number, iy: number, iz = 0): Pt {
  return {
    x: (ix - iy) * (TILE_W / 2) + ORIGIN_X,
    y: (ix + iy) * (TILE_H / 2) + ORIGIN_Y - iz
  }
}

function r(n: number): number {
  return Math.round(n)
}

function poly(points: Pt[]): string {
  return points.map((pt) => `${r(pt.x)},${r(pt.y)}`).join(' ')
}

function IsoQuad({
  ix,
  iy,
  tw,
  td,
  fill,
  stroke,
  strokeWidth = 0
}: {
  ix: number
  iy: number
  tw: number
  td: number
  fill: string
  stroke?: string
  strokeWidth?: number
}) {
  return (
    <polygon
      points={poly([
        isoPt(ix, iy),
        isoPt(ix + tw, iy),
        isoPt(ix + tw, iy + td),
        isoPt(ix, iy + td)
      ])}
      fill={fill}
      stroke={stroke ?? 'none'}
      strokeWidth={strokeWidth}
    />
  )
}

function IsoBox({
  ix,
  iy,
  tw,
  td,
  h,
  top,
  left,
  right,
  strokeWidth = INK
}: {
  ix: number
  iy: number
  tw: number
  td: number
  h: number
  top: string
  left: string
  right: string
  strokeWidth?: number
}) {
  const nw = isoPt(ix, iy, h)
  const ne = isoPt(ix + tw, iy, h)
  const se = isoPt(ix + tw, iy + td, h)
  const sw = isoPt(ix, iy + td, h)
  const neG = isoPt(ix + tw, iy)
  const seG = isoPt(ix + tw, iy + td)
  const swG = isoPt(ix, iy + td)
  return (
    <g>
      <polygon points={poly([sw, se, seG, swG])} fill={left} stroke={C.ink} strokeWidth={strokeWidth} />
      <polygon points={poly([ne, se, seG, neG])} fill={right} stroke={C.ink} strokeWidth={strokeWidth} />
      <polygon points={poly([nw, ne, se, sw])} fill={top} stroke={C.ink} strokeWidth={strokeWidth} />
    </g>
  )
}

function GableRoof({
  ix,
  iy,
  tw,
  td,
  wallH,
  peak,
  left,
  right
}: {
  ix: number
  iy: number
  tw: number
  td: number
  wallH: number
  peak: number
  left: string
  right: string
}) {
  const nw = isoPt(ix, iy, wallH)
  const ne = isoPt(ix + tw, iy, wallH)
  const se = isoPt(ix + tw, iy + td, wallH)
  const sw = isoPt(ix, iy + td, wallH)
  const ridgeN = isoPt(ix + tw / 2, iy, wallH + peak)
  const ridgeS = isoPt(ix + tw / 2, iy + td, wallH + peak)
  return (
    <g>
      <polygon points={poly([nw, ridgeN, ridgeS, sw])} fill={left} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([ne, ridgeN, ridgeS, se])} fill={right} stroke={C.ink} strokeWidth={INK} />
    </g>
  )
}

function HipRoof({
  ix,
  iy,
  tw,
  td,
  wallH,
  peak,
  a,
  b,
  c,
  d
}: {
  ix: number
  iy: number
  tw: number
  td: number
  wallH: number
  peak: number
  a: string
  b: string
  c: string
  d: string
}) {
  const nw = isoPt(ix, iy, wallH)
  const ne = isoPt(ix + tw, iy, wallH)
  const se = isoPt(ix + tw, iy + td, wallH)
  const sw = isoPt(ix, iy + td, wallH)
  const cap = isoPt(ix + tw / 2, iy + td / 2, wallH + peak)
  return (
    <g>
      <polygon points={poly([nw, ne, cap])} fill={a} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([ne, se, cap])} fill={b} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([se, sw, cap])} fill={c} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([sw, nw, cap])} fill={d} stroke={C.ink} strokeWidth={INK} />
    </g>
  )
}

function WallWindow({
  ix,
  iy,
  tw,
  td,
  z0,
  z1,
  face
}: {
  ix: number
  iy: number
  tw: number
  td: number
  z0: number
  z1: number
  face: 'right' | 'left'
}) {
  const inset = 0.28
  const pts =
    face === 'right'
      ? [
          isoPt(ix + tw, iy + inset, z1),
          isoPt(ix + tw, iy + td - inset, z1),
          isoPt(ix + tw, iy + td - inset, z0),
          isoPt(ix + tw, iy + inset, z0)
        ]
      : [
          isoPt(ix + inset, iy + td, z1),
          isoPt(ix + tw - inset, iy + td, z1),
          isoPt(ix + tw - inset, iy + td, z0),
          isoPt(ix + inset, iy + td, z0)
        ]
  const midTop = {
    x: (pts[0].x + pts[1].x) / 2,
    y: (pts[0].y + pts[1].y) / 2
  }
  const midBot = {
    x: (pts[3].x + pts[2].x) / 2,
    y: (pts[3].y + pts[2].y) / 2
  }
  const midL = {
    x: (pts[0].x + pts[3].x) / 2,
    y: (pts[0].y + pts[3].y) / 2
  }
  const midR = {
    x: (pts[1].x + pts[2].x) / 2,
    y: (pts[1].y + pts[2].y) / 2
  }
  return (
    <g>
      <polygon points={poly(pts)} fill={C.window} stroke={C.ink} strokeWidth={INK} />
      <line
        x1={r(midTop.x)}
        y1={r(midTop.y)}
        x2={r(midBot.x)}
        y2={r(midBot.y)}
        stroke={C.windowDk}
        strokeWidth="2"
      />
      <line
        x1={r(midL.x)}
        y1={r(midL.y)}
        x2={r(midR.x)}
        y2={r(midR.y)}
        stroke={C.windowDk}
        strokeWidth="2"
      />
    </g>
  )
}

function Drum({
  cx,
  cy,
  rx,
  ry,
  h,
  top,
  side
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  h: number
  top: string
  side: string
}) {
  const topCy = cy - h
  return (
    <g>
      <path
        d={`M${r(cx - rx)} ${r(cy)} L${r(cx - rx)} ${r(topCy)} A${r(rx)} ${r(ry)} 0 0 1 ${r(cx + rx)} ${r(topCy)} L${r(cx + rx)} ${r(cy)} A${r(rx)} ${r(ry)} 0 0 1 ${r(cx - rx)} ${r(cy)} Z`}
        fill={side}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <ellipse
        cx={r(cx)}
        cy={r(topCy)}
        rx={r(rx)}
        ry={r(ry)}
        fill={top}
        stroke={C.ink}
        strokeWidth={INK}
      />
    </g>
  )
}

function JobSprite({
  ix,
  iy,
  shirt,
  hat,
  bag
}: {
  ix: number
  iy: number
  shirt: string
  hat?: string
  bag?: boolean
}) {
  const feet = isoPt(ix, iy)
  const x = r(feet.x)
  const y = r(feet.y)
  return (
    <g>
      <rect x={x - 4} y={y - 6} width="4" height="7" fill={C.ink} />
      <rect x={x + 1} y={y - 6} width="4" height="7" fill={C.ink} />
      <rect
        x={x - 6}
        y={y - 20}
        width="12"
        height="15"
        fill={shirt}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <rect
        x={x - 6}
        y={y - 30}
        width="12"
        height="11"
        fill={C.skin}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <rect x={x - 5} y={y - 29} width="10" height="4" fill={C.hair} />
      {hat ? (
        <rect x={x - 8} y={y - 34} width="16" height="5" fill={hat} stroke={C.ink} strokeWidth={INK} />
      ) : null}
      {bag ? (
        <rect
          x={x + 6}
          y={y - 18}
          width="8"
          height="10"
          fill={C.wood}
          stroke={C.ink}
          strokeWidth={INK}
        />
      ) : null}
    </g>
  )
}

function Tree({ ix, iy }: { ix: number; iy: number }) {
  const base = isoPt(ix, iy)
  const x = r(base.x)
  const y = r(base.y)
  return (
    <g>
      <rect
        x={x - 4}
        y={y - 18}
        width="8"
        height="18"
        fill={C.wood}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <polygon
        points={`${x},${y - 28} ${x + 22},${y - 16} ${x},${y - 4} ${x - 22},${y - 16}`}
        fill={C.leafDk}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <polygon
        points={`${x},${y - 44} ${x + 18},${y - 32} ${x},${y - 20} ${x - 18},${y - 32}`}
        fill={C.leafLt}
        stroke={C.ink}
        strokeWidth={INK}
      />
      <polygon
        points={`${x},${y - 58} ${x + 12},${y - 48} ${x},${y - 38} ${x - 12},${y - 48}`}
        fill={C.grassA}
        stroke={C.ink}
        strokeWidth={INK}
      />
    </g>
  )
}

function ScreenCube({
  cx,
  cy,
  hw,
  hd,
  h,
  top,
  left,
  right
}: {
  cx: number
  cy: number
  hw: number
  hd: number
  h: number
  top: string
  left: string
  right: string
}) {
  const topY = cy - h
  const nw = { x: cx, y: topY - hd }
  const ne = { x: cx + hw, y: topY }
  const se = { x: cx, y: topY + hd }
  const sw = { x: cx - hw, y: topY }
  const seG = { x: cx, y: cy + hd }
  const swG = { x: cx - hw, y: cy }
  const neG = { x: cx + hw, y: cy }
  return (
    <g>
      <polygon points={poly([sw, se, seG, swG])} fill={left} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([ne, se, seG, neG])} fill={right} stroke={C.ink} strokeWidth={INK} />
      <polygon points={poly([nw, ne, se, sw])} fill={top} stroke={C.ink} strokeWidth={INK} />
    </g>
  )
}

function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y + 8} width="44" height="12" fill={C.cloudDk} stroke={C.ink} strokeWidth={INK} />
      <rect x={x + 10} y={y} width="28" height="14" fill={C.cloud} stroke={C.ink} strokeWidth={INK} />
      <rect x={x + 22} y={y + 4} width="18" height="12" fill={C.cloud} stroke={C.ink} strokeWidth={INK} />
    </g>
  )
}

function hotspotStyle(hotspot: SittingHotspot) {
  return {
    left: `${hotspot.layout.xPercent}%`,
    top: `${hotspot.layout.yPercent}%`,
    width: `${hotspot.layout.widthPercent}%`,
    height: `${hotspot.layout.heightPercent}%`
  }
}

function named(hotspot: SittingHotspot, showAllNames: boolean) {
  if (hotspot.role === 'through-line') return true
  return showAllNames
}

function objectShapeClass(objectId: string, hotspots: SittingHotspot[]) {
  const hotspot = hotspots.find((item) => item.id === objectId)
  return hotspot?.role === 'through-line' ? 'through-shape' : 'quiet-shape'
}

function paintedHotspots(hotspots: SittingHotspot[]) {
  return [
    ...hotspots.filter((hotspot) => hotspot.role !== 'through-line'),
    ...hotspots.filter((hotspot) => hotspot.role === 'through-line')
  ]
}

const SHOP = { ix: -3.15, iy: 0.85, tw: 3.45, td: 2.35, h: 62, peak: 24 }
const HOUSE = { ix: 7.15, iy: 0.7, tw: 2.55, td: 2.15, h: 50, peak: 22 }
const MAILBOX = { ix: 0.12, iy: 4.02, tw: 0.58, td: 0.48, h: 18 }
const HYDRANT = { ix: 1.18, iy: 4.12 }
const POLE = { ix: 2.08, iy: 3.12 }
const FAR_POLE = { ix: 9.05, iy: 2.15 }
const SIGNAL = { ix: 5.08, iy: 3.92 }
const GATES = { ix: 7.55, iy: 7.02 }
const TRUCK = { ix: 7.15, iy: 5.22, tw: 1.7, td: 0.85, h: 20 }

export function BusyBlock({
  hotspots,
  foundId,
  revealed,
  showAllNames,
  onThroughLine,
  onOffNeed
}: BusyBlockProps) {
  const pole = isoPt(POLE.ix, POLE.iy)
  const farPole = isoPt(FAR_POLE.ix, FAR_POLE.iy)
  const hydrant = isoPt(HYDRANT.ix, HYDRANT.iy)
  const signal = isoPt(SIGNAL.ix, SIGNAL.iy)
  const gate = isoPt(GATES.ix, GATES.iy)
  const sag = isoPt(5.6, 2.7, 78)
  const sagB = isoPt(5.7, 2.8, 70)
  const wireA = `M ${r(pole.x)} ${r(pole.y - 108)} Q ${r(sag.x)} ${r(sag.y)} ${r(farPole.x)} ${r(farPole.y - 100)}`
  const wireB = `M ${r(pole.x)} ${r(pole.y - 100)} Q ${r(sagB.x)} ${r(sagB.y)} ${r(farPole.x)} ${r(farPole.y - 92)}`
  const wireC = `M ${r(pole.x)} ${r(pole.y - 92)} Q ${r(isoPt(5.8, 2.9, 64).x)} ${r(isoPt(5.8, 2.9, 64).y)} ${r(farPole.x)} ${r(farPole.y - 84)}`

  return (
    <div class="busy-block-scroll">
    <figure class="busy-block">
      <svg
        class="busy-block-art"
        viewBox="0 0 960 540"
        role="img"
        aria-label="An isometric 16-bit town block with a shop, a house, jobs, a street, a utility pole, a transformer, overhead wires, a crosswalk, a traffic signal, and railroad tracks."
      >
        <defs>
          <pattern id="dither-grass" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={C.grassA} />
            <rect width="2" height="2" fill={C.grassB} />
            <rect x="2" y="2" width="2" height="2" fill={C.grassB} />
          </pattern>
          <pattern id="dither-walk" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={C.walkA} />
            <rect width="2" height="2" fill={C.walkB} />
            <rect x="2" y="2" width="2" height="2" fill={C.walkB} />
          </pattern>
          <pattern id="dither-road" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={C.roadA} />
            <rect width="2" height="2" fill={C.roadB} />
            <rect x="2" y="2" width="2" height="2" fill={C.roadB} />
          </pattern>
          <pattern id="brick-face" width="8" height="6" patternUnits="userSpaceOnUse">
            <rect width="8" height="6" fill={C.brickMd} />
            <rect width="8" height="1" fill={C.brickDk} />
            <rect x="4" width="1" height="6" fill={C.brickDk} />
          </pattern>
          <pattern id="roof-tile" width="8" height="4" patternUnits="userSpaceOnUse">
            <rect width="8" height="4" fill={C.roofMd} />
            <rect y="3" width="8" height="1" fill={C.roofDk} />
            <rect x="3" width="1" height="4" fill={C.roofLt} />
          </pattern>
        </defs>

        <rect width="960" height="96" fill={C.sky0} />
        <rect y="96" width="960" height="8" fill={C.sky1} />
        <rect y="104" width="960" height="72" fill={C.sky1} />
        <rect y="176" width="960" height="8" fill={C.sky2} />
        <rect y="184" width="960" height="64" fill={C.sky2} />
        <rect y="248" width="960" height="8" fill={C.sky3} />
        <rect y="256" width="960" height="284" fill={C.sky3} />
        <Cloud x={70} y={28} />
        <Cloud x={390} y={18} />
        <Cloud x={720} y={36} />

        <g>
          <polygon
            points={poly([
              isoPt(-5.6, -0.4, 8),
              isoPt(-4.2, -0.6, 36),
              isoPt(-2.6, -0.2, 14),
              isoPt(-4.2, 1.1)
            ])}
            fill={C.hillMd}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <polygon
            points={poly([isoPt(-4.2, -0.6, 36), isoPt(-3.4, -0.7, 52), isoPt(-2.6, -0.2, 14)])}
            fill={C.hillLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <polygon
            points={poly([isoPt(-1.4, -0.5, 6), isoPt(-0.2, -0.8, 28), isoPt(1.2, -0.3, 8), isoPt(-0.2, 0.9)])}
            fill={C.hillDk}
            stroke={C.ink}
            strokeWidth={INK}
          />
        </g>

        <g>
          <IsoQuad ix={-5} iy={0} tw={15.2} td={11} fill="url(#dither-grass)" />
          <IsoQuad ix={-5} iy={4} tw={15.2} td={1} fill="url(#dither-walk)" />
          <IsoQuad ix={-5} iy={7} tw={15.2} td={1} fill="url(#dither-walk)" />
          <IsoQuad ix={-5} iy={5} tw={15.2} td={2} fill="url(#dither-road)" />
          <IsoQuad ix={-5} iy={4.92} tw={15.2} td={0.16} fill={C.curb} />
          <IsoQuad ix={-5} iy={6.92} tw={15.2} td={0.16} fill={C.curb} />
          {[-4, -2.6, -1.2, 0.2, 1.6, 3, 4.4, 5.8, 7.2, 8.6].map((ix) => (
            <IsoQuad key={`dash-${ix}`} ix={ix} iy={5.92} tw={0.7} td={0.16} fill={C.line} />
          ))}
          <polygon
            points={`${r(isoPt(-4.2, 2.4).x)},${r(isoPt(-4.2, 2.4).y)} ${r(isoPt(-3.9, 2.4).x)},${r(isoPt(-3.9, 2.4).y)} ${r(isoPt(-4.05, 2.55).x)},${r(isoPt(-4.05, 2.55).y)}`}
            fill={C.grassTuft}
          />
          <polygon
            points={`${r(isoPt(0.8, 8.6).x)},${r(isoPt(0.8, 8.6).y)} ${r(isoPt(1.1, 8.6).x)},${r(isoPt(1.1, 8.6).y)} ${r(isoPt(0.95, 8.75).x)},${r(isoPt(0.95, 8.75).y)}`}
            fill={C.grassTuft}
          />
        </g>

        <g class={objectShapeClass('obj-crosswalk', hotspots)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <IsoQuad
              key={`xw-${i}`}
              ix={4.85}
              iy={5.08 + i * 0.36}
              tw={2.35}
              td={0.22}
              fill={C.cream}
              stroke={C.ink}
              strokeWidth={1}
            />
          ))}
        </g>

        <g>
          <Tree ix={-4.35} iy={2.55} />
        </g>

        <g>
          <IsoBox
            ix={HOUSE.ix}
            iy={HOUSE.iy}
            tw={HOUSE.tw}
            td={HOUSE.td}
            h={HOUSE.h}
            top={C.houseLt}
            left={C.houseMd}
            right={C.houseDk}
          />
          <HipRoof
            ix={HOUSE.ix}
            iy={HOUSE.iy}
            tw={HOUSE.tw}
            td={HOUSE.td}
            wallH={HOUSE.h}
            peak={HOUSE.peak}
            a={C.houseRoofLt}
            b={C.houseRoofDk}
            c={C.houseRoofDk}
            d={C.houseRoofLt}
          />
          <WallWindow
            ix={HOUSE.ix}
            iy={HOUSE.iy}
            tw={HOUSE.tw}
            td={HOUSE.td}
            z0={18}
            z1={38}
            face="left"
          />
          <IsoBox
            ix={HOUSE.ix + 0.85}
            iy={HOUSE.iy + HOUSE.td - 0.08}
            tw={0.7}
            td={0.12}
            h={22}
            top={C.woodLt}
            left={C.wood}
            right={C.woodDk}
          />
        </g>

        <g class={objectShapeClass('obj-shop', hotspots)}>
          <IsoBox
            ix={SHOP.ix}
            iy={SHOP.iy}
            tw={SHOP.tw}
            td={SHOP.td}
            h={SHOP.h}
            top={C.brickLt}
            left="url(#brick-face)"
            right={C.brickDk}
          />
          <polygon
            points={poly([
              isoPt(SHOP.ix + SHOP.tw, SHOP.iy + 0.35, 44),
              isoPt(SHOP.ix + SHOP.tw, SHOP.iy + SHOP.td - 0.35, 44),
              isoPt(SHOP.ix + SHOP.tw, SHOP.iy + SHOP.td - 0.35, 40),
              isoPt(SHOP.ix + SHOP.tw, SHOP.iy + 0.35, 40)
            ])}
            fill={C.brickDk}
          />
          <GableRoof
            ix={SHOP.ix}
            iy={SHOP.iy}
            tw={SHOP.tw}
            td={SHOP.td}
            wallH={SHOP.h}
            peak={SHOP.peak}
            left="url(#roof-tile)"
            right={C.roofDk}
          />
          <IsoBox
            ix={SHOP.ix + 2.35}
            iy={SHOP.iy + 0.35}
            tw={0.45}
            td={0.45}
            h={SHOP.h + 18}
            top={C.brickLt}
            left={C.brickMd}
            right={C.brickDk}
          />
          <WallWindow
            ix={SHOP.ix}
            iy={SHOP.iy}
            tw={SHOP.tw}
            td={SHOP.td}
            z0={28}
            z1={50}
            face="right"
          />
          <IsoBox
            ix={SHOP.ix + 0.7}
            iy={SHOP.iy + SHOP.td - 0.06}
            tw={0.85}
            td={0.14}
            h={28}
            top={C.woodLt}
            left={C.wood}
            right={C.woodDk}
          />
          <IsoBox
            ix={SHOP.ix + 0.15}
            iy={SHOP.iy + SHOP.td + 0.05}
            tw={3.15}
            td={0.55}
            h={30}
            top={C.awningA}
            left={C.awningB}
            right={C.brickDk}
          />
          <IsoQuad
            ix={SHOP.ix + 0.35}
            iy={SHOP.iy + SHOP.td + 0.12}
            tw={0.7}
            td={0.28}
            fill={C.awningB}
          />
          <IsoQuad
            ix={SHOP.ix + 1.75}
            iy={SHOP.iy + SHOP.td + 0.12}
            tw={0.7}
            td={0.28}
            fill={C.awningB}
          />
          <IsoBox
            ix={SHOP.ix + 2.55}
            iy={SHOP.iy + SHOP.td + 0.35}
            tw={0.7}
            td={0.55}
            h={12}
            top={C.woodLt}
            left={C.wood}
            right={C.woodDk}
          />
        </g>

        <g class={objectShapeClass('obj-railroad-tracks', hotspots)}>
          {[-3.4, -2.6, -1.8, -1, -0.2, 0.6, 1.4, 2.2, 3, 3.8, 4.6, 5.4, 6.2, 7, 7.8, 8.6, 9.4].map(
            (ix) => (
              <IsoBox
                key={`tie-${ix}`}
                ix={ix}
                iy={8.05}
                tw={0.28}
                td={1.15}
                h={4}
                top={C.woodLt}
                left={C.wood}
                right={C.woodDk}
              />
            )
          )}
          <polyline
            fill="none"
            stroke={C.ink}
            strokeWidth="6"
            points={`${r(isoPt(-3.6, 8.22, 6).x)},${r(isoPt(-3.6, 8.22, 6).y)} ${r(isoPt(10.4, 8.22, 6).x)},${r(isoPt(10.4, 8.22, 6).y)}`}
          />
          <polyline
            fill="none"
            stroke={C.rail}
            strokeWidth="3"
            points={`${r(isoPt(-3.6, 8.22, 6).x)},${r(isoPt(-3.6, 8.22, 6).y)} ${r(isoPt(10.4, 8.22, 6).x)},${r(isoPt(10.4, 8.22, 6).y)}`}
          />
          <polyline
            fill="none"
            stroke={C.ink}
            strokeWidth="6"
            points={`${r(isoPt(-3.6, 8.95, 6).x)},${r(isoPt(-3.6, 8.95, 6).y)} ${r(isoPt(10.4, 8.95, 6).x)},${r(isoPt(10.4, 8.95, 6).y)}`}
          />
          <polyline
            fill="none"
            stroke={C.cream}
            strokeWidth="3"
            points={`${r(isoPt(-3.6, 8.95, 6).x)},${r(isoPt(-3.6, 8.95, 6).y)} ${r(isoPt(10.4, 8.95, 6).x)},${r(isoPt(10.4, 8.95, 6).y)}`}
          />
        </g>

        <g class={objectShapeClass('obj-utility-pole', hotspots)}>
          <rect
            x={r(pole.x) - 6}
            y={r(pole.y) - 118}
            width="12"
            height="118"
            fill={C.wood}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <rect x={r(pole.x) - 4} y={r(pole.y) - 90} width="8" height="6" fill={C.woodLt} />
          <rect x={r(pole.x) - 4} y={r(pole.y) - 52} width="8" height="6" fill={C.woodLt} />
          <rect
            x={r(pole.x) - 22}
            y={r(pole.y) - 112}
            width="44"
            height="8"
            fill={C.woodLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
          {[-16, 0, 16].map((dx) => (
            <ellipse
              key={`ins-${dx}`}
              cx={r(pole.x) + dx}
              cy={r(pole.y) - 116}
              rx="4"
              ry="5"
              fill={C.cream}
              stroke={C.ink}
              strokeWidth={INK}
            />
          ))}
        </g>

        <g class={objectShapeClass('obj-far-utility-pole', hotspots)}>
          <rect
            x={r(farPole.x) - 5}
            y={r(farPole.y) - 108}
            width="10"
            height="108"
            fill={C.wood}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <rect
            x={r(farPole.x) - 16}
            y={r(farPole.y) - 102}
            width="32"
            height="7"
            fill={C.woodLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
        </g>

        <g class={objectShapeClass('obj-overhead-conductor', hotspots)}>
          <path d={wireA} fill="none" stroke={C.ink} strokeWidth="5" />
          <path d={wireB} fill="none" stroke={C.ink} strokeWidth="5" />
          <path d={wireC} fill="none" stroke={C.ink} strokeWidth="4" />
          <path d={wireA} fill="none" stroke={C.metalLt} strokeWidth="2" />
          <path d={wireB} fill="none" stroke={C.metal} strokeWidth="2" />
          <path d={wireC} fill="none" stroke={C.metalDk} strokeWidth="2" />
        </g>

        <g class={objectShapeClass('obj-distribution-transformer', hotspots)}>
          <Drum
            cx={pole.x + 76}
            cy={pole.y - 48}
            rx={18}
            ry={10}
            h={38}
            top={C.metalLt}
            side={C.metal}
          />
          <line
            x1={r(pole.x) + 12}
            y1={r(pole.y) - 70}
            x2={r(pole.x) + 90}
            y2={r(pole.y) - 70}
            stroke={C.metalDk}
            strokeWidth="2"
          />
          <line
            x1={r(pole.x) + 12}
            y1={r(pole.y) - 62}
            x2={r(pole.x) + 90}
            y2={r(pole.y) - 62}
            stroke={C.metalDk}
            strokeWidth="2"
          />
          <line
            x1={r(pole.x) + 12}
            y1={r(pole.y) - 54}
            x2={r(pole.x) + 90}
            y2={r(pole.y) - 54}
            stroke={C.metalDk}
            strokeWidth="2"
          />
          <rect
            x={r(pole.x) + 6}
            y={r(pole.y) - 78}
            width="12"
            height="8"
            fill={C.metalDk}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <line
            x1={r(pole.x) + 76}
            y1={r(pole.y) - 86}
            x2={r(pole.x) + 8}
            y2={r(pole.y) - 108}
            stroke={C.ink}
            strokeWidth="2"
          />
        </g>

        <g class={objectShapeClass('obj-mailbox', hotspots)}>
          <rect
            x={r(isoPt(MAILBOX.ix + 0.28, MAILBOX.iy + 0.24).x) - 3}
            y={r(isoPt(MAILBOX.ix + 0.28, MAILBOX.iy + 0.24).y) - 16}
            width="6"
            height="16"
            fill={C.metalDk}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <IsoBox
            ix={MAILBOX.ix}
            iy={MAILBOX.iy}
            tw={MAILBOX.tw}
            td={MAILBOX.td}
            h={MAILBOX.h}
            top={C.metalLt}
            left={C.metal}
            right={C.metalDk}
          />
          <rect
            x={r(isoPt(MAILBOX.ix + MAILBOX.tw, MAILBOX.iy + 0.12, 12).x)}
            y={r(isoPt(MAILBOX.ix + MAILBOX.tw, MAILBOX.iy + 0.12, 12).y) - 10}
            width="4"
            height="12"
            fill={C.red}
            stroke={C.ink}
            strokeWidth={INK}
          />
        </g>

        <g class={objectShapeClass('obj-fire-hydrant', hotspots)}>
          <Drum cx={hydrant.x} cy={hydrant.y} rx={10} ry={6} h={8} top={C.red} side={C.brickDk} />
          <Drum cx={hydrant.x} cy={hydrant.y - 8} rx={8} ry={5} h={16} top={C.red} side={C.brickMd} />
          <rect
            x={r(hydrant.x) - 14}
            y={r(hydrant.y) - 20}
            width="8"
            height="7"
            fill={C.brickLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <rect
            x={r(hydrant.x) + 6}
            y={r(hydrant.y) - 20}
            width="8"
            height="7"
            fill={C.brickLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <rect
            x={r(hydrant.x) - 5}
            y={r(hydrant.y) - 30}
            width="10"
            height="6"
            fill={C.metalLt}
            stroke={C.ink}
            strokeWidth={INK}
          />
        </g>

        <g class={objectShapeClass('obj-traffic-signal', hotspots)}>
          <rect
            x={r(signal.x) - 5}
            y={r(signal.y) - 92}
            width="10"
            height="92"
            fill={C.metalDk}
            stroke={C.ink}
            strokeWidth={INK}
          />
          <ScreenCube
            cx={signal.x}
            cy={signal.y - 40}
            hw={16}
            hd={8}
            h={46}
            top={C.metal}
            left={C.metalDk}
            right={C.ink}
          />
          <ellipse cx={r(signal.x)} cy={r(signal.y) - 74} rx="7" ry="6" fill={C.red} stroke={C.ink} strokeWidth={INK} />
          <ellipse cx={r(signal.x)} cy={r(signal.y) - 60} rx="7" ry="6" fill={C.amber} stroke={C.ink} strokeWidth={INK} />
          <ellipse cx={r(signal.x)} cy={r(signal.y) - 46} rx="7" ry="6" fill={C.green} stroke={C.ink} strokeWidth={INK} />
          <rect x={r(signal.x) - 10} y={r(signal.y) - 82} width="20" height="4" fill={C.ink} />
        </g>

        <g class={objectShapeClass('obj-street-truck', hotspots)}>
          <IsoBox
            ix={TRUCK.ix + 0.95}
            iy={TRUCK.iy}
            tw={0.85}
            td={TRUCK.td}
            h={TRUCK.h + 8}
            top={C.truckCab}
            left={C.metal}
            right={C.metalDk}
          />
          <IsoBox
            ix={TRUCK.ix}
            iy={TRUCK.iy}
            tw={1.05}
            td={TRUCK.td}
            h={TRUCK.h}
            top={C.truckBox}
            left={C.metal}
            right={C.metalDk}
          />
          <WallWindow
            ix={TRUCK.ix + 0.95}
            iy={TRUCK.iy}
            tw={0.85}
            td={TRUCK.td}
            z0={14}
            z1={24}
            face="right"
          />
          <ellipse
            cx={r(isoPt(TRUCK.ix + 0.2, TRUCK.iy + TRUCK.td).x)}
            cy={r(isoPt(TRUCK.ix + 0.2, TRUCK.iy + TRUCK.td).y)}
            rx="7"
            ry="5"
            fill={C.ink}
          />
          <ellipse
            cx={r(isoPt(TRUCK.ix + 1.45, TRUCK.iy + TRUCK.td).x)}
            cy={r(isoPt(TRUCK.ix + 1.45, TRUCK.iy + TRUCK.td).y)}
            rx="7"
            ry="5"
            fill={C.ink}
          />
        </g>

        <g class={objectShapeClass('obj-crossing-gates', hotspots)}>
          <IsoBox
            ix={GATES.ix}
            iy={GATES.iy}
            tw={0.42}
            td={0.4}
            h={34}
            top={C.metalLt}
            left={C.metal}
            right={C.metalDk}
          />
          <IsoBox
            ix={GATES.ix + 0.32}
            iy={GATES.iy - 0.15}
            tw={0.28}
            td={2.35}
            h={10}
            top={C.red}
            left={C.brickMd}
            right={C.brickDk}
          />
          <IsoQuad ix={GATES.ix + 0.36} iy={GATES.iy + 0.25} tw={0.2} td={0.35} fill={C.cream} />
          <IsoQuad ix={GATES.ix + 0.36} iy={GATES.iy + 0.95} tw={0.2} td={0.35} fill={C.cream} />
          <IsoQuad ix={GATES.ix + 0.36} iy={GATES.iy + 1.65} tw={0.2} td={0.35} fill={C.cream} />
          <ellipse
            cx={r(gate.x)}
            cy={r(gate.y) - 40}
            rx="5"
            ry="5"
            fill={C.red}
            stroke={C.ink}
            strokeWidth={INK}
          />
        </g>

        <g>
          <JobSprite ix={-1.15} iy={3.25} shirt={C.shirtShop} hat={C.awningA} />
          <JobSprite ix={0.55} iy={4.72} shirt={C.shirtMail} bag />
          <JobSprite ix={5.45} iy={5.55} shirt={C.shirtWalk} />
          <JobSprite ix={8.15} iy={7.55} shirt={C.shirtGuard} hat={C.red} />
          <Tree ix={9.4} iy={3.55} />
          <Tree ix={-0.35} iy={9.35} />
        </g>
      </svg>

      <div class="busy-block-hotspots">
        {paintedHotspots(hotspots).map((hotspot) => {
          const isThrough = hotspot.role === 'through-line'
          const showName = named(hotspot, showAllNames)
          const className = [
            'hotspot',
            isThrough ? 'hotspot-through' : 'hotspot-quiet',
            foundId === hotspot.id ? 'hotspot-found' : '',
            revealed && isThrough ? 'hotspot-revealed' : ''
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={hotspot.id}
              type="button"
              class={className}
              style={hotspotStyle(hotspot)}
              tabIndex={hotspot.inTabOrder ? 0 : -1}
              data-hotspot={hotspot.id}
              onClick={() => {
                if (isThrough) onThroughLine(hotspot.id)
                else onOffNeed()
              }}
            >
              <span class={showName ? 'hotspot-name' : 'visually-hidden'}>
                {hotspot.displayName}
              </span>
            </button>
          )
        })}
      </div>
    </figure>
    </div>
  )
}
