# Open Cutaway

**This document owns** the front door: what the game is, and pointers to every owner.
**It does not own** counts, gate lists, or restated engineering rules.

A visual, text-rich game that teaches how infrastructure works — street objects, system chains, and the industrial landscape a child may never visit. Designed for ages 7–12 with a parent or other adult as a co-player.

This repository is the **guard rails plus a placeholder shell**. There are no playable Learn/Challenge lessons in this slice.

- Display name: **Open Cutaway**
- Public repo: `opencutaway/opencutaway`
- License: MIT (code). Content added later must stay MIT-clean (original writing, original traced SVG, or US public-domain / CC0 photos with attribution).

## What this is not (yet)

- Not a finished curriculum
- Not a scavenger hunt that gates learning behind outdoor finds
- Not a node-link graph explorer
- Not a cloud app, and not a product that uses a camera or device location
- Not a phonics or reading-aloud game

## Requirements

- Node.js 24 LTS (or another current Node LTS, `>=22`)
- npm 11 or compatible

## Setup

```bash
npm install
npx playwright install chromium
npm run check
npm run build
npm run test:e2e
npm run dev
```

`npm run dev` opens the title-screen stub. This build has nothing to save.

Which commands run on an ordinary push versus a release is owned by `CLAUDE.md`. Do not restate that cadence here.

## Who owns what

| File | Pointer |
| --- | --- |
| `CLAUDE.md` | Finished work, safety, engineering |
| `AGENTS.md` | How agents work here |
| `SPEC.md` | What the game does |
| `docs/testing-gauntlet.md` | Gates |
| `docs/settled.md` | Closed questions |
| `docs/open-faults.md` | Open gaps |
| `docs/PRIVACY.md` | What must never be committed |
| `docs/file-map.md` | Generated owners (source: `tools/file-map.mjs`) |
| `docs/code-map.md` | Generated produce/consume/validate/publish map |
| `docs/feature-map.md` | Generated list of what children and grown-ups can do |
| `docs/tutorial-manifest.md` | Generated list of how each mechanic is taught |
| `docs/effect-map.md` | Generated test map (source: `tools/effect-map.mjs`) |
| `docs/inspiration.md` | Books we learn from and must not copy |
| `docs/candidates.md` | Unfrozen object notes |
| `.claude/skills/drift-check/SKILL.md` | How to claim a green build |

## Repository layout

| Path | Role |
| --- | --- |
| `schema/` | JSON Schema for object cards, chains, local profiles, UI contracts, and build-time workflows |
| `content/examples/` | Valid schema examples only — not a catalog |
| `content/ui/` | Player-facing UI contracts (Ajv) |
| `e2e/` | Playwright specs, fixtures, and page objects |
| `workflows/` | Declarative build-time execution graphs (not shipped in the game client) |
| `src/` | Offline Preact shell |
| `tools/` | File map, blast radius, effect map, and related checks |
| `cosmetics/` | Stub only; reward look is unfrozen |

## Ethos (short)

Forever freeware and open source. Offline-first. Local profiles only. The shipped-client network and telemetry rule lives in `CLAUDE.md`.
