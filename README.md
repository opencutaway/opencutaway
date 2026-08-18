# Open Cutaway

A visual, text-rich game that teaches how infrastructure works — street objects, system chains, and the industrial landscape a child may never visit. Designed for ages 7–12 with a parent or other adult as a co-player.

This repository is **conventions only** right now: schemas, folders, agent rules, and a Preact placeholder. There are no playable Learn/Challenge lessons in this slice.

- Display name: **Open Cutaway**
- Public repo: `opencutaway/opencutaway`
- License: MIT (code). Content added later must stay MIT-clean (original writing, original traced SVG, or US public-domain / CC0 photos with attribution).

## What this is not (yet)

- Not a finished curriculum
- Not a scavenger hunt that gates learning behind outdoor finds
- Not a node-link graph explorer
- Not a cloud app, and not a product that uses a camera or device location

## Requirements

- Node.js 24 LTS (or another current Node LTS, `>=22`)
- npm 11 or compatible

## Setup

```bash
npm install
npm test
npm run build
npm run dev
```

`npm run dev` opens the title-screen stub. Progress, if it existed, would stay on the device. This build has nothing to save.

## Repository map

| Path | Role |
| --- | --- |
| `schema/` | JSON Schema for object cards, chains, local profiles, and build-time workflows |
| `content/examples/` | Valid schema examples only — not a catalog |
| `workflows/` | Declarative build-time execution graphs (not shipped in the game client) |
| `src/` | Offline Preact shell |
| `docs/PRIVACY.md` | A1: what must never be committed |
| `docs/candidates.md` | Unfrozen brainstorm notes, including a candidate First Twelve |
| `docs/inspiration.md` | Stance toward two inspiration books; do not copy them |
| `cosmetics/` | Stub only; reward look is unfrozen |

## Ethos (short)

Forever freeware and open source. Offline-first. No ads, analytics, or monitoring. Local profiles only. See `AGENTS.md` for hard-stops that later agents must keep.
