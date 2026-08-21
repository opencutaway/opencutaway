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

## Art bible adopted — look, tokens, and the deepen-rung design

- `docs/art-bible.md` is governing document #10 and owns the look: 2:1 dimetric projection on a 1024×768 logical canvas, 64×32 ground diamond, 16 px elevation, palette ramps, pixel construction, materials, lighting, cutaway language, process colour coding, animation timing, production pipeline, and originality guardrails. iPad landscape is primary; phones and desktops pan the block inside its frame.
- Look values live in `content/art/tokens.json` under `schema/art-tokens.schema.json` with Ajv tests; every final asset gets a provenance record under `schema/art-provenance.schema.json`; a gate holds renderer constants and stylesheet colours to the tokens.
- Look language is IP-neutral: `SPEC.md`, `docs/inspiration.md`, `docs/level-spine.md`, and `docs/settled.md` now describe deliberate pixel construction with a remembered retro-era character by rules, not by any named game, console, or title. Do-not-copy rules stay in `docs/inspiration.md`.
- The bible's interaction model — seven-beat lesson rhythm, state model, process reveal, system connection, return, labels, text limits, sound layers, town hub — is folded into `SPEC.md` as the design of rung 2 (carrier) and rung 3 (facility) lessons. Design only; nothing is built; sittings 1–2 keep the find-the-object mechanic; S3 and S4 hold.
- The shipped SVG busy block is a named placeholder exemption on the legacy grid (`F-art-geometry-migration`); `F-deepen-rungs-unbuilt` and `F-art-subjects` record what is unbuilt and undecided.
- The busy block's assistive description now names every hotspot object by its card name, with no development jargon; a unit test pins it (closes the former `F-svg-description`).
- Street-geometry addendum: a hard constraint layer for every scene with a street, signal, crosswalk, or vehicle (layout before art, deterministic street assets, a separate plausibility review, a fifteen-row acceptance checklist); the reusable generation prompt and review templates are versioned under `workflows/prompts/`.
