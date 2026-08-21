# Human copy gate — CTX-EDITOR-SITTINGS-1-2

**This record owns** the ROLE-EDITOR read-through of every kid-facing string on the title screen and in widen sittings 1–2, the corrections the editor requested, and their verification.
**It does not own** the curriculum (`docs/level-spine.md`), screen behaviour (`SPEC.md`), or the S-rules the strings were read against (`CLAUDE.md`).

| Field | Value |
|---|---|
| Revision reviewed | `277f8d7` (strings as committed there) |
| Corrections applied at | the commit that adds this record |
| Editor | ROLE-EDITOR (the owner; read each line aloud as to a seven-year-old) |
| Implementer | ROLE-IMPLEMENTER (applied the editor's words verbatim; changed nothing else) |
| Date | 2026-08-21 |
| Scope | `content/ui/title-screen.json`, `content/sittings/widen-1-get-across.json`, `content/sittings/widen-2-lights.json` — 43 strings after de-duplication |
| Rules read against | `CLAUDE.md` S1 (real name, short gloss, never demean), S3; `docs/level-spine.md` second-miss rule and industry-name rule |
| Disposition | Passed. Corrections applied verbatim; gates green; the editor confirmed the rendered title screen and sitting 1 heading on 2026-08-21 |

## Verdicts

| Group | Strings | Pass | Fix |
|---|---|---|---|
| Title screen | 4 | 2 | 2 |
| Shared sitting lines | 4 | 4 | 0 |
| Sitting 1 (through-line cards, prompt, hint, reveal) | 13 | 12 | 1 |
| Sitting 2 (through-line cards, prompt, hint, reveal) | 13 | 13 | 0 |
| Off-need object names | 8 | 8 | 0 |
| **Total** | **43** | **40** | **3** |

Every pass line is unchanged on disk. The three fixes, in the editor's words:

| String | Was | Now |
|---|---|---|
| `title.learnControl` | Get across | Cross the Street |
| `title.blurb` | A visual game about how infrastructure works. Start on the block with Get across or Lights. Progress stays on this device. | A visual game about how infrastructure works. Start on the block with "Cross the Street" or "Lights". Progress always stays on this device. |
| `s1.throughLine` (sitting 1 heading) | Get across | Cross the Street |

## What the corrections touched

The three strings are one decision: the need's on-screen name is **Cross the Street**. The implementer applied it to the three kid-facing strings, to the schema pin that holds the heading (`schema/sitting-widen-1.schema.json` `throughLine` const), to every test and Playwright literal that asserts the on-screen name, and to the documents that quote the screen (`SPEC.md`, `README.md`, `CLAUDE.md`, `docs/level-spine.md` need list, `content/README.md`, `docs/art-bible.md` subject table, generator descriptions). Internal identifiers keep the `get-across` slug (`sitting-widen-1-get-across`, file names, hotspot ids); a child never sees them. Lower-case "get across" inside the prompt and the second-miss hint stays: the editor passed both lines. Earlier settled rows keep the wording they were written with; `docs/settled.md` Q-copy-gate-2026-08-21 records the rename.

## Gates after the corrections

| check | result |
|---|---|
| `npm run check` | exit 0 — vitest 15 files / 141 cases; gate-integrity 0 problems; floors ok |
| `npm run gauntlet` | exit 0 — Playwright 16 passed on chromium-desktop and chromium-mobile; the title spec opens sitting 1 by the accessible name "Cross the Street" |

## Verification

The editor's replacements were applied byte-for-byte from the copy-gate block. Same-reviewer verification is the editor's confirmation that the rendered title screen and sitting 1 heading read as intended.

Editor confirmation: recorded 2026-08-21 from the built app's title screen and sitting 1 render. The editor also noted that object relationships on the placeholder block are not yet real-world correct (for example the railroad-tracks hotspot sitting over water); that is an art matter carried by `F-art-geometry-migration`, not a copy matter, and does not reopen this gate.
