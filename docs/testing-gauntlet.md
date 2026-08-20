# Testing gauntlet

**This document owns** the gates: what each one proves, what it cannot prove, the exact command, how it fails, and the floor or ceiling it holds.
**It does not own** the behaviour under test, or the rule that floors may never fall (that rule lives in `CLAUDE.md`).

The v0 gate count is 11.

Numbers for floors and ceilings live in `.claude/gate-baseline.json`. This file names the gates; it does not duplicate those numbers.

## Agent contract (Gates part)

| action | command |
|---|---|
| cheap path | `npm run check` (what that script must run is listed below; cadence is owned by `CLAUDE.md`) |
| release path | `npm run gauntlet` |
| lockstep | `node tools/check-lockstep.mjs` and `node tools/check-lockstep.mjs --self-test` |
| floors | `node tools/check-floors.mjs` |
| regenerate maps | `npm run maps` |
| fail | exit 1; JSON problem objects on stderr (floors also print `live=` / `baseline=`) |
| baseline | `.claude/gate-baseline.json` |

MUST:

- Keep exactly six named drift parts. G-lockstep fails if they disagree or a part file is missing.
- Bind Gates to this file **plus** `.claude/gate-baseline.json` (lockstep `part-source-missing` if the baseline is absent).
- Run the command in the gate table. Do not infer a substitute.
- Player-facing growth in the same change: JSON Schema + Ajv, Playwright spec/fixture (teaching, interaction, regression), and all six drift parts.

MUST NOT:

- Collapse the six parts into fewer artifacts.
- Treat effect-map as a seventh named part.
- Hand-edit generated maps (`docs/file-map.md`, `docs/code-map.md`, `docs/feature-map.md`, `docs/tutorial-manifest.md`, `docs/effect-map.md`).
- Delete a test, delete a mutant, or add a skip to make a build pass.
- Raise a `_max` ceiling without the owner. A missing ceiling is a failure.
- Add an ad-hoc parser beside JSON Schema / Ajv for content, config, saves, or UI contracts.
- Add a one-off player-facing script instead of a Playwright spec/fixture.

## Six drift parts (must stay in lockstep)

These are six artifacts, not one. G-lockstep fails if they disagree. Effect-map rows support Gates; they are not a seventh named part.

| id | Part | Source | Generated / extra | Gate |
|---|---|---|---|---|
| DRIFT-OWNERS | Owners | `tools/file-map.mjs` | `docs/file-map.md` | G-map |
| DRIFT-CODE-MAP | Code map | `tools/code-map.mjs` | `docs/code-map.md` | G-lockstep |
| DRIFT-FEATURE-MAP | Feature map | `tools/feature-map.mjs` | `docs/feature-map.md` | G-lockstep |
| DRIFT-TUTORIAL | Tutorial manifest | `tools/tutorial-manifest.mjs` | `docs/tutorial-manifest.md` | G-lockstep |
| DRIFT-BLAST | Blast radius | `tools/blast-radius.mjs` | (lookup, not a markdown map) | G-blast |
| DRIFT-GATES | Gates | `docs/testing-gauntlet.md` | `.claude/gate-baseline.json` | G-floors |

### Blast radius query

```
node tools/blast-radius.mjs --word TOKEN
```

Depends means: tracked files whose relative path or contents include the token as a case-insensitive substring; not an import graph, call graph, or git history.

The lookup never fails a build. `--self-test` does (`node tools/blast-radius.mjs --self-test`).

MUST: run `--word` before editing the named thing. MUST NOT: treat empty hits as "nothing depends" without checking token spelling.

### G-lockstep agreement (enforced, not inferred)

`node tools/check-lockstep.mjs` MUST fail when any of these is true:

- Drift part count is not 6, or a named part source/generated/baseline file is missing (`part-source-missing`, `part-generated-missing`).
- A feature id is missing from `SPEC.md` (`feature-missing-from-spec`).
- A feature `tutorialIds` entry is absent from the tutorial manifest (`feature-tutorial-missing`).
- A feature `schemaIds` entry is absent from the code map (`feature-code-row-missing`).
- A tutorial `featureId` is absent from the feature map (`tutorial-feature-missing`).
- A shipped feature has no tutorial with status `taught` (`shipped-feature-untaught`).
- A shipped feature has empty `schemaIds` (`shipped-feature-without-schema`).
- A feature `e2eSpecs` array is empty (`missing-e2e-spec`) or a listed spec is missing on disk (`e2e-spec-missing-on-disk`).
- A code-map row linked from `schemaIds` lists an `e2eSpecs` path that the feature does not list (`feature-e2e-spec-missing`). Shipped Learn MUST list `e2e/specs/widen-1-get-across.spec.ts` and `e2e/specs/widen-2-lights.spec.ts` because `CODE-WIDEN-SITTING-1` and `CODE-WIDEN-SITTING-2` declare those specs.

Negative controls (`node tools/check-lockstep.mjs --self-test`): `feature-tutorial-missing`, `part-source-missing` for `.claude/gate-baseline.json`, `feature-e2e-spec-missing` for `e2e/specs/widen-2-lights.spec.ts`, `e2e-spec-missing-on-disk`.

## Cadence (pointer)

Which npm script is the everyday path, and which is release-time, is owned by `CLAUDE.md`. This file only lists what those scripts must run.

`npm run check` must run: unit tests, file-map check and self-test, blast-radius self-test, effect-map check and self-test, code-map / feature-map / tutorial-manifest check and self-test, lockstep check and self-test, schema inventory check and self-test, governing-file check and self-test, PII lint and self-test, ethos scan, floor check.

`npm run gauntlet` must run that same set plus the production build and Playwright (G-e2e).

## Gates

| Gate | Command | Proves | Cannot prove | Fail | Negative control |
|---|---|---|---|---|---|
| G-map | `node tools/file-map.mjs --check` and `--self-test` | Every tracked file is declared; owned-fact shapes are not copied; tombstones stay gone; the generated map matches the table | A stale paragraph rewritten in fresh words | exit 1; codes `undeclared`, `copied-fact`, `tombstone`, `control-missing`, `map-stale`, `row-missing-id` | `control-missing`, `copied-fact`, `undeclared`, `tombstone`, `row-missing-id` |
| G-blast | `node tools/blast-radius.mjs --self-test` | The lookup still finds planted controls | What a change *means*; import/call/git graphs | exit 1 | word miss on `tools/blast-radius.mjs`; symbol miss on `SELF_TEST_WORD`; kind not `GATE` |
| G-effect | `node tools/effect-map.mjs --check` and `--self-test` | Every vitest test has a row; the committed map matches the tree; registry and map agree on executable tests | That a test is the *right* test | exit 1; codes `missing-file-meta`, `map-stale`, `registry-unlinked` | `missing-file-meta`, `row-for-missing-file` |
| G-gov | `node tools/check-governing.mjs` and `--self-test` | Governing files are listed, each has an ownership header, no stray status files | That the headers describe the right ownership | exit 1; codes `missing`, `missing-header`, `stray-status` | missing-header detector |
| G-pii | `node tools/pii-lint.mjs` and `--self-test` | No email-like strings or user-folder prefixes in tracked files except the lockfile allowlist | Encoded or paraphrased personal facts | exit 1 | constructed email/user-folder samples |
| G-ethos | `node tools/pii-lint.mjs --ethos` | `src/` has no geolocation, getUserMedia, gtag, Sentry, openai, or langgraph | A new SDK under a name not on the list | exit 1 | constructed `getUserMedia` token |
| G-unit | `vitest run` | Literal-value tests of helpers, schemas, and inventory | That Playwright covered the same paths | non-zero vitest exit | per-file mutants in `tests/` |
| G-schema | `node tools/check-schemas.mjs` and `--self-test` | Every JSON Schema file is on the code map; Ajv compiles it; every mapped instance validates | That the schema is the *right* shape for a future lesson | exit 1; codes `schema-not-in-code-map`, `schema-missing`, `instance-invalid` | `schema-missing`; wrong title `sittingId` rejected |
| G-lockstep | `node tools/check-lockstep.mjs` and `--self-test` | The six named drift parts exist and agree (features ↔ tutorials ↔ code rows ↔ SPEC ids ↔ e2e files ↔ gate-baseline) | That a stub feature is ready to ship | exit 1; codes in the G-lockstep agreement list above | sitting-2 spec omitted from `FEAT-LEARN`; missing `.claude/gate-baseline.json` |
| G-e2e | `npm run test:e2e` | Player-facing specs cover teaching, interaction, and regression for shipped and explicitly stubbed modes | Sittings 3–11, Challenge, and Life list, which remain unbuilt | non-zero Playwright exit | stub-mode specs in `e2e/specs/modes-not-shipped.spec.ts` |
| G-floors | `node tools/check-floors.mjs` | Live counts are not below floors; HISTORY and any declared line-length caps have ceilings | That the floors measure the thing you care about | exit 1; codes `floor-dropped`, `floor-raise-required`, `ceiling-exceeded`, `missing-ceiling` | missing `history_files_max` |

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
