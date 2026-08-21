# Changelog

**This document owns** parent-facing history of repository slices.
**It does not own** product behaviour or gate contracts.

Keep personal names out of this file.

## 0.0.0 — guard rails and placeholder shell

- Public Open Cutaway scaffold: schemas, offline Preact title stub, privacy and client hard-stops.
- Drift-prevention backbone borrowed as process only: owners, generated maps, blast-radius lookup, gate floors.
- Six named drift parts stay in lockstep: Owners, Code map, Feature map, Tutorial manifest, Blast radius, Gates.
- Player-facing JSON uses Ajv; Playwright covers the title stub.
- Visual tone notes now include everyday occupational density (see `docs/inspiration.md`).
- No playable Learn/Challenge lessons yet.
- Curriculum shape frozen in `docs/level-spine.md` (busy block, rungs default to three, hydro + combined sewer). Civil-expert interview 2026-08-19 updated industry names, campus types, and Challenge mix rules. Widen sittings 1–2 (Get across, Lights) are the first playable sittings from that freeze.

## 0.0.0+sitting-1 — Get across on the busy block

- Title offers **Get across**. The busy block is fully drawn; crossing objects are loud, off-need objects are quiet.
- Find a traffic signal, crosswalk, or crossing gates; read the real name, a short gloss, and what it does.
- Wrong tap: try again, then a rung hint that names getting across without naming shop or which object to tap. No timer. Kid-facing copy still waits on the human gate in `/workflows`.
- Sittings 2–11, Challenge, Life list, profiles picker, plants, and the dam are not in this build.

## 0.0.0+sitting-2 — Lights on the busy block

- Title offers **Get across** and **Lights**. Sitting 2 does not wait for sitting 1 to finish.
- Find a utility pole, overhead conductor, or distribution transformer (gloss leads with that name, then voltage-down). Get across objects stay quiet. Jobs stay visible and are not the test. No dam sitting.
- Busy-block placeholders redrawn as denser original 16-bit isometric town sprites (SVG, no WebGL). Lights and Get across still share the same block; only the through-line is loud. Kid-facing copy still waits on the human gate in `/workflows`. Sittings 3–11, Challenge, Life list, profiles picker, plants, and the dam are not in this build.

## Review corrections — reachable targets and honest gates (lands with sittings 1–2)

- Every hotspot on the busy block is a 44 CSS px target that no other hotspot covers: boxes re-laid in both sittings, the transformer drawn out along its bracket, the block held at 720 px wide and panned inside its own frame on narrower screens. Playwright measures this on desktop and Pixel 5; a unit test rejects any intersecting or undersized box.
- Keyboard focus on a hotspot shows an amber ring; Tab reaches the through-line objects in order and never an off-need object; every shown name fits its box.
- Sitting 2's second-miss hint names the need only: "This is the street object for lights."
- Gates strengthened with negative controls: paper-over scanner (14 controls, population checked), schema inventory (7 controls), sitting schemas (16 Ajv negatives), client hard-stops (28 forbidden tokens covering network, media, cloud, model SDKs, durable storage).
- Documents say *playable, copy gate open* for sittings 1–2; SPEC defines the feature map's `shipped` label. Independent review record: `docs/reviews/CTX-REVIEW-SITTINGS-GIP.md`; remaining P3 findings are rows in `docs/open-faults.md`.
