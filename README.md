# Open Cutaway

**This document owns** the front door: what the game is, how to run it, and where to look next.
**It does not own** counts, gate lists, or restated engineering rules.

[Open Cutaway](https://github.com/opencutaway/opencutaway) is a visual infrastructure-literacy game: street objects, system chains, and the industrial landscape a child may never visit. It is for ages 7–12 with an adult co-player. The shipped app is an offline Preact + Vite client; progress stays on the device. No camera, location, cloud accounts, ads, or analytics. Forever freeware.

Tone and world draw from Macaulay’s *Underground*, Hayes’s *Infrastructure*, and Scarry’s *What Do People Do All Day?* (occupational density only). Do not copy those books. See [docs/inspiration.md](docs/inspiration.md).

## Status

This slice is guard rails plus a placeholder shell.

| Mode | Status |
| --- | --- |
| Title | Shipped stub: the name and a blurb that lessons are not in this build |
| Learn | Not playable yet |
| Challenge | Not playable yet |
| Life list | Not playable yet |

There is nothing to save in this build. Privacy wins: personal information must never enter git. See [docs/PRIVACY.md](docs/PRIVACY.md).

## How to run

Needs Node.js 22+ and npm.

```bash
npm install
npx playwright install chromium
npm run dev
```

`npm run dev` opens the title stub.

```bash
npm run check      # everyday gates (unit tests, maps, schemas, privacy)
npm run gauntlet   # check + production build + Playwright
```

Which of those is for an ordinary push versus a release is owned by [CLAUDE.md](CLAUDE.md). Do not restate that cadence here.

Player-facing JSON is checked with Ajv. Playwright specs grow with each player-facing feature.

## Where to look

| File | What it is |
| --- | --- |
| [SPEC.md](SPEC.md) | What the game does |
| [docs/level-spine.md](docs/level-spine.md) | How levels are numbered (frozen; no lessons built yet) |
| [CLAUDE.md](CLAUDE.md) | Finished work, safety, engineering |
| [AGENTS.md](AGENTS.md) | How agents work here |
| [docs/file-map.md](docs/file-map.md) | Owners (generated) |
| [docs/code-map.md](docs/code-map.md) | Code map (generated) |
| [docs/feature-map.md](docs/feature-map.md) | Feature map (generated) |
| [docs/tutorial-manifest.md](docs/tutorial-manifest.md) | Tutorial manifest (generated) |
| [docs/testing-gauntlet.md](docs/testing-gauntlet.md) | Gates (blast-radius lookup is `tools/blast-radius.mjs`) |
| [docs/PRIVACY.md](docs/PRIVACY.md) | What must never be committed |

Those six named drift parts (Owners, Code map, Feature map, Tutorial manifest, Blast radius, Gates) are process, not the product. They must stay in lockstep.

## License

MIT. Copyright (c) 2026 Open Cutaway authors. See [LICENSE](LICENSE).
