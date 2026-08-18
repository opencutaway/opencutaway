# Testing gauntlet

**This document owns** the gates: what each one proves, what it cannot prove, and the floor or ceiling it holds.
**It does not own** the behaviour under test, or the rule that floors may never fall (that rule lives in `CLAUDE.md`).

The v0 gate count is 11.

Numbers for floors and ceilings live in `.claude/gate-baseline.json`. This file names the gates; it does not duplicate those numbers.

## Six drift parts (must stay in lockstep)

These are six artifacts, not one. G-lockstep fails if they disagree. Effect-map rows support Gates; they are not a seventh named part.

| Part | Source | Generated | Gate |
|---|---|---|---|
| Owners | `tools/file-map.mjs` | `docs/file-map.md` | G-map |
| Code map | `tools/code-map.mjs` | `docs/code-map.md` | G-lockstep |
| Feature map | `tools/feature-map.mjs` | `docs/feature-map.md` | G-lockstep |
| Tutorial manifest | `tools/tutorial-manifest.mjs` | `docs/tutorial-manifest.md` | G-lockstep |
| Blast radius | `tools/blast-radius.mjs` | (lookup, not a markdown map) | G-blast |
| Gates | this file plus `.claude/gate-baseline.json` | (floors JSON) | G-floors |

## Cadence (pointer)

Which npm script is the everyday path, and which is release-time, is owned by `CLAUDE.md`. This file only lists what those scripts must run.

`npm run check` must run: unit tests, file-map check and self-test, blast-radius self-test, effect-map check and self-test, code-map / feature-map / tutorial-manifest check and self-test, lockstep check and self-test, schema inventory check and self-test, governing-file check and self-test, PII lint and self-test, ethos scan, floor check.

`npm run gauntlet` must run that same set plus the production build and Playwright (G-e2e).

## Gates

| Gate | Command | Proves | Cannot prove |
|---|---|---|---|
| G-map | `node tools/file-map.mjs --check` and `--self-test` | Every tracked file is declared; owned-fact shapes are not copied; tombstones stay gone; the generated map matches the table | A stale paragraph rewritten in fresh words |
| G-blast | `node tools/blast-radius.mjs --self-test` | The E11 lookup still finds planted controls | What a change *means* |
| G-effect | `node tools/effect-map.mjs --check` and `--self-test` | Every vitest test has a row; the committed map matches the tree; registry and map agree on executable tests | That a test is the *right* test |
| G-gov | `node tools/check-governing.mjs` and `--self-test` | Governing files are listed, each has an ownership header, no stray status files | That the headers describe the right ownership |
| G-pii | `node tools/pii-lint.mjs` and `--self-test` | No email-like strings or user-folder prefixes in tracked files except the lockfile allowlist | Encoded or paraphrased personal facts |
| G-ethos | `node tools/pii-lint.mjs --ethos` | `src/` has no geolocation, getUserMedia, gtag, Sentry, openai, or langgraph | A new SDK under a name not on the list |
| G-unit | `vitest run` | Literal-value tests of helpers, schemas, and inventory | That Playwright covered the same paths |
| G-schema | `node tools/check-schemas.mjs` and `--self-test` | Every JSON Schema file is on the code map; Ajv compiles it; every mapped instance validates | That the schema is the *right* shape for a future lesson |
| G-lockstep | `node tools/check-lockstep.mjs` and `--self-test` | The six named drift parts exist and agree (features ↔ tutorials ↔ code rows ↔ SPEC ids ↔ e2e files) | That a stub feature is ready to ship |
| G-e2e | `npm run test:e2e` | Player-facing specs cover teaching, interaction, and regression for shipped and explicitly stubbed modes | Playable Learn/Challenge lessons, which must not exist yet |
| G-floors | `node tools/check-floors.mjs` | Live counts are not below floors; HISTORY and any declared line-length caps have ceilings | That the floors measure the thing you care about |

## Shared oracle rules (held by the suite, named here)

- Assertions use literal expected values.
- Every detector has a negative control that fails on the fault it targets.
- Do not delete a test or a mutant, and do not add a skip to make a build pass.
- If a gate fails, fix the code. If the gate itself looks wrong, stop and tell the owner.
- Do not edit generated files by hand.
- JSON Schema plus Ajv is the authority path for player-facing content, config, saves, and UI contracts. Do not add an ad-hoc parser beside it.
- A new player-facing feature adds or extends a Playwright spec/fixture in the same change. Do not add a one-off script.

## Honest limits

Passing this gauntlet means the named gates were happy. It does not mean the product is finished, the maps can see paraphrased drift, or a rule is the right rule. Run the procedure in `.claude/skills/drift-check/SKILL.md` before calling anything all green.
