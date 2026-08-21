# Open Cutaway

**This document owns** the front door: what the game is, how to run it, and where to look next.
**It does not own** counts, gate lists, or restated engineering rules.

[Open Cutaway](https://github.com/opencutaway/opencutaway) is a visual infrastructure-literacy game: street objects, system chains, and the industrial landscape a child may never visit. It is for ages 7–12 with an adult co-player. The shipped app is an offline Preact + Vite client; progress stays on the device. No camera, location, cloud accounts, ads, or analytics. Forever freeware.

Tone and world draw from Macaulay’s *Underground*, Hayes’s *Infrastructure*, and Scarry’s *What Do People Do All Day?* (occupational density only). The busy block is a pixel-constructed isometric illustration defined by the rules in [docs/art-bible.md](docs/art-bible.md), not by named games. Do not copy those books or any game. See [docs/inspiration.md](docs/inspiration.md).

## Status

This slice makes the title plus **widen sittings 1–2 (Get across, Lights)** playable on one busy block; their kid-facing copy is still waiting on the human copy gate. Later sittings, Challenge, and Life list are not playable yet.

| Mode | Status |
| --- | --- |
| Title | Placeholder playable: the name and **Get across** plus **Lights** controls |
| Learn | Sittings 1–2 playable, copy gate open: find the through-line object, read the real name and what it does |
| Challenge | Not playable yet |
| Life list | Not playable yet |

There is no profile picker in this build. Privacy wins: personal information must never enter git. See [docs/PRIVACY.md](docs/PRIVACY.md).

## How to run

Needs Node.js 22+ and npm.

```bash
npm install
npx playwright install chromium
npm run dev
```

`npm run dev` opens the title. Choose **Get across** for sitting 1 or **Lights** for sitting 2.

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
| [docs/level-spine.md](docs/level-spine.md) | How levels are numbered (frozen; sittings 1–2 follow it) |
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
