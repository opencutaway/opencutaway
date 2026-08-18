# Independent review — CTX-BOOTSTRAP-DRIFT

**This record owns** the independent review of the Drift overlay on commit `27dd3d6`.
**It does not own** product behaviour, gate floors, or live counts after later commits.

| Field | Value |
|---|---|
| Revision | CTX-BOOTSTRAP-DRIFT over `27dd3d6` (uncommitted overlay; no overlay commit hash) |
| Base | `27dd3d6` — Scaffold Open Cutaway conventions |
| Reviewer | ROLE-REVIEWER (did not implement) |
| Implementer | ROLE-IMPLEMENTER |
| Date | 2026-08-18 |
| Disposition | Findings corrected; same-reviewer verification of the corrections is recorded below |

## Requirements in scope

Prompt package `open-cutaway-drift-bootstrap`: A1 PII scrub; MIT copyright as Open Cutaway authors; no forbidden client tokens in `src/`; no LLM SDK in the game client; one owner for the v0 gate count; generated file map and effect map; `AGENTS.md` points at `CLAUDE.md` and does not quote E-rule text; README and SPEC describe an infrastructure game; Scarry is tone-only; registry uses `ROLE-*` / `CTX-*`; taxonomy exclusions for this slice.

## Drift check — 2026-08-18 (after corrections, including this record)

| check | result |
|---|---|
| Owners (G-map) | 83 declared, 3 owned facts, 83 tracked, 0 problems · 4/4 controls |
| Map identical to table | yes |
| Blast radius (G-blast) | 3/3 controls |
| Effect map (G-effect) | 22 tests over 8 files, 0 problems · 3/3 controls |
| Governing (G-gov) | 9 files, 0 strays · 3/3 controls |
| PII / ethos | 0 problems · 5/5 PII controls · ethos 0 problems |
| Floors | live vitest_files=8 vitest_cases=22 governing_files=9 history_files=0 history_files_max=0 · matches baseline |
| npm run check | exit 0 |
| npm run gauntlet | exit 0 (check + production build) |

What this check cannot see: a stale paragraph in fresh words; an undeclared fact family; whether a rule is the right rule.

## First-pass findings (ROLE-REVIEWER)

Revision reviewed: CTX-BOOTSTRAP-DRIFT over `27dd3d6`.

1. **[P2] Test the production hit-target rule** — `tests/hit-target.test.ts`. The test checked an unused constant rather than `src/index.css`, so the stylesheet could shrink while the suite stayed green. Affected: `tests/hit-target.test.ts`, `src/app/hit-target.ts`, `src/index.css`.
2. **[P2] Discover nested Vitest files** — `tools/effect-map.mjs`. Discovery read only immediate children of `tests/`, so a nested test file would be omitted from the effect map and floor counts. Affected: `tools/effect-map.mjs`, `tools/check-floors.mjs`, generated `docs/effect-map.md`.

Passed on first pass: PII scrub of tracked files; MIT copyright line; no geolocation / getUserMedia / gtag / Sentry / openai / langgraph in `src/`; no LLM SDK in client dependencies; gate-count shape owned by `docs/testing-gauntlet.md`; maps generated from tools; AGENTS.md does not restate E-rule text; README/SPEC remain infrastructure; Scarry named only as occupational-density tone with a do-not-copy line; registry ownership fields use role IDs.

## Corrections (ROLE-IMPLEMENTER)

1. Hit-target test now asserts literal `min-height: 44px` and `min-width: 44px` in `src/index.css`. The unused constant module was removed. Registry metadata regenerated from `scripts/write-test-registry.mjs`.
2. `listTestFiles` walks `tests/` recursively. Effect-map `--self-test` plants a nested `*.test.ts` and fails if discovery misses it, then deletes the plant.

## Drift check — 2026-08-18 (after six-parts + Playwright/Ajv close-out)

| check | result |
|---|---|
| Owners (G-map) | 101 declared, 3 owned facts, 101 tracked, 0 problems · 4/4 controls |
| Code map | 8 rows, 0 problems · 2/2 controls |
| Feature map | 4 features, 0 problems · 2/2 controls |
| Tutorial manifest | 4 rows, 0 problems · 2/2 controls |
| Lockstep (six parts) | 6 parts, 0 problems · 3/3 controls |
| Map identical to table | yes |
| Blast radius (G-blast) | 3/3 controls |
| Effect map (G-effect) | 26 tests over 9 files, 0 problems · 3/3 controls |
| Schema inventory (G-schema) | 5 schemas, 5 mapped, 0 problems · 2/2 controls |
| Governing (G-gov) | 9 files, 0 strays · 3/3 controls |
| PII / ethos | 0 problems · 5/5 PII controls · ethos 0 problems |
| Floors | live vitest_files=9 vitest_cases=26 governing_files=9 history_files=0 playwright_specs=2 schema_files=5 shipped_features=1 declared_features=4 drift_parts=6 · matches baseline |
| npm run check | exit 0 |
| npm run gauntlet | exit 0 (check + tsc --noEmit + vite build + Playwright 4 passed) |

What this check cannot see: a stale paragraph in fresh words; an undeclared fact family; whether a rule is the *right* rule.

## Same-reviewer verification

**Blocked — not self-approved.** ROLE-IMPLEMENTER cannot verify ROLE-IMPLEMENTER corrections.

- The original ROLE-REVIEWER found two P2s on CTX-BOOTSTRAP-DRIFT over `27dd3d6`. Those corrections remain in the tree (CSS hit-target oracle; recursive test discovery).
- Resume of that reviewer failed: parent worker was stopped (parent-mismatch). A replacement reviewer was started and then interrupted.
- Taxonomy exclusions (`F-exclusion-review`) stay unverified until ROLE-REVIEWER records approval.
- Integration of the overlay remains uncommitted. Owner may accept the unverified findings as a documented exception, or assign a fresh ROLE-REVIEWER.

Disposition: findings corrected in the working tree; independent reverify **not** complete.
