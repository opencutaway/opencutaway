# CLAUDE.md — finished work, safety, engineering

**This document owns** what counts as finished work; safety rules S1–S9; engineering rules E1–E12; and the scan style for chat replies to the owner.
**It does not own** product behaviour (`SPEC.md`); the gate contract (`docs/testing-gauntlet.md`); the look (`docs/art-bible.md`); or agent practice (`AGENTS.md`).

## What counts as finished work

The product is the working game. This slice ships guard rails plus widen sittings 1–2 (Cross the Street, Lights) on the busy block, their kid-facing copy read and passed by the human ROLE-EDITOR (`docs/reviews/CTX-EDITOR-SITTINGS-1-2.md`); later sittings still fill in.
Tests and documents exist to protect the game; they are never the goal by themselves.

Do not create status files, progress logs, or session summaries. Update the single document that already owns the fact. A new governing file needs the same owner-visible approval as a new dependency.

Honesty is absolute: never edit a test so failing behaviour looks like it passes; never present a stub as proof the real feature works; never call work done while any part is unfinished. Paper-over of a red gate (specification gaming, oracle degradation, vacuous gate) is named and banned in `docs/testing-gauntlet.md`.

Nobody — human or agent — may call a change finished, a build ready, or a check all green until the drift-check procedure in `.claude/skills/drift-check/SKILL.md` has run and every coverage number is the whole of its population.

## Chat to the owner

Chat replies are scanned, not read. Use bullets, tables, and short technical lines. This applies to chat only. Commit messages, `docs/`, SPEC, and kid-facing copy keep plain durable prose.

A decision the owner must make goes to them as a clickable page, one question per screen, every option costed, one marked MY PICK, an Other box that outranks the buttons, numbers measured rather than recalled, copy-all at the end.

## Safety (S-rules)

S1. Never demean the child. No baby talk. Use the real name of the object, then a short gloss if a word is new.

S2. Never record an in-real-life "found" except by an honor-system adult/child toggle. No sensors.

S3. Never gamify approaching live tracks, docks, substations, or live gear. Object cards keep `safety.approachLiveGear` as `never`. Teach from drawings and allowed photos.

S4. The shipped child app makes no network calls in v0. No ads, analytics, or monitoring. An owner-approved visible update-check may exist later; it does not exist now.

S5. Adult co-play is the design. Do not ship child-cloud accounts.

S6. No camera. No GPS. No `getUserMedia`. No geolocation APIs, including stubs.

S7. No personal names in the repository. Sample players are `Player A`, `Pat`, and `Jordan`. Device-local profile names stay gitignored.

S8. Teach first. A life list never gates levels.

S9. Child-facing controls stay large enough to use. Minimum hit target: 44 CSS pixels, even before real UI ships.

## Engineering (E-rules)

E1. Do not hand-edit generated files. Regenerate them from their tool.

E2. Every assertion uses a literal expected value. A test never reads the constant it checks.

E3. Every detector has a negative control that fails on the fault it targets.

E4. Never delete a test. Never delete a mutant. Never add a skip to make a build pass.

E5. Floors never go down. Keys ending `_max` are ceilings: never raise them without the owner. A missing ceiling is a failure.

E6. If a gate fails, fix the code. If the gate itself looks wrong, stop and tell the owner.

E7. `npm run check` is the cheap path before every push. A red check blocks a push. Full `npm run gauntlet` is release-time, not for every push.

E8. Testing work does not change game behaviour.

E9. Before starting work, read `docs/settled.md` and `docs/open-faults.md`.

E10. Prefer the standard library and packages already in `package.json`. Ask the owner before adding a dependency.

E11. Before any edit: (1) What am I changing? One sentence. (2) Who owns this fact? See generated `docs/file-map.md`. (3) What depends on it? `node tools/blast-radius.mjs --word …`. (4) What proves it? Name the check before the first edit. Multi-agent plans need the owner's agreement. Reviewers are read-only.

E12. A player-facing feature is unfinished until the same change updates all six drift parts (Owners, Code map, Feature map, Tutorial manifest, Blast radius, Gates), adds or extends JSON Schema plus Ajv tests for every new content/config/save/UI-contract, and adds or extends a Playwright spec with teaching, interaction, and regression steps.
