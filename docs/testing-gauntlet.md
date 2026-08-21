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
| gate integrity (G-unit) | `node tools/check-gate-integrity.mjs` and `node tools/check-gate-integrity.mjs --self-test` |
| regenerate maps | `npm run maps` |
| fail | exit 1; JSON problem objects on stderr (floors also print `live=` / `baseline=`) |
| baseline | `.claude/gate-baseline.json` |

### Purpose

A gate is a proxy. The gate measures the software. The gate is not the goal.

Make the software correct. Do not make the gate agree.

### Named failure modes

Use these names in reports.

| name | meaning |
|---|---|
| specification gaming | The agent optimizes the proxy (a green pipeline) and not the target (correct software). |
| oracle degradation | The agent makes the test oracle weaker instead of a repair to the system under test. |
| vacuous gate | The gate cannot fail. It is always true. It gives no information about the software. |

### Preflight

Do these steps before the first edit. Do **not** rediscover CI from scratch.

MUST:

- Read this file. The eleven named gates, commands, and fail codes live here.
- Run `npm run check`. Do not infer a substitute.
- Paste the `G-floors` line that starts `live=` / `baseline=` from that run.
- Record the run id: `git rev-parse HEAD` plus dirty or clean (`git status --porcelain`). Until GitHub Actions exists, that pair is the run id.

MUST NOT:

- Treat missing GitHub Actions as “no gates.” An absent remote control is not permission.
- Skip this gauntlet and grep for a `.github/` workflow that this repository does not ship.

### R1–R8 (mapped to this toolchain)

| id | rule | this repo |
|---|---|---|
| R1 | Gate integrity. Do not change a gate to make the code pass. Change the code to make the gate pass. | `CLAUDE.md` E6. Paper-over scan is G-unit (`tools/check-gate-integrity.mjs`). |
| R2 | Falsifiability. A gate that cannot fail is prohibited. Show a failing case. | `CLAUDE.md` E3. Tool `--self-test` plants. G-unit negative controls. |
| R3 | Fail closed. Error, timeout, skipped test, cancelled job, missing artifact, and a gate that did not run are failures. | Tools `exit 1`. Skip marks fail G-unit. A gate that did not run is R6, not green. |
| R4 | Root cause. Repair the defect. Do not repair the detector. | `CLAUDE.md` E6. |
| R5 | No retry to green. | Playwright `retries: 0` and Vitest `retry` unset (default 0); Vitest 4 does have `test.retry` and per-test `{ retry: n }`, so G-unit scans for both (GIP-C8). MUST NOT re-run the same red tree hoping for green. Re-run after a **code** repair is OK. |
| R6 | Truthful status. Do not report success if a gate failed or did not run. Give the run id. | MUST NOT claim green if G-e2e did not run. `npm run check` is not `npm run gauntlet`. Run id = HEAD + dirty/clean until CI exists. |
| R7 | No new (lower) baseline. | Already `G-floors` and `CLAUDE.md` E5. Live above floor → `floor-raise-required`. |
| R8 | Stop with options. Do not select an option yourself. | When blocked, the `AGENTS.md` decision page. MY PICK is the recommendation. Do not execute until the operator replies. Silence is not approval. |

### Prohibited paper-over (§6 A–G)

MUST NOT do any of the following. Categories bind to the detectors already in this gauntlet. Examples are not complete.

| id | MUST NOT | bound to |
|---|---|---|
| A | Delete a failing test; exclude a test file from the run; move a test to a directory the runner ignores. | `G-floors` (`vitest_files`, `vitest_cases`, `playwright_specs`); `G-lockstep` (`e2e-spec-missing-on-disk`); `CLAUDE.md` E4 |
| B | Add a skip mark, an expected-failure mark, or an ignore mark; remove an assertion; make an assertion weaker; write a test with no assertion; write an assertion that is always true. | G-unit paper-over scan (`skip-mark`, `only-mark`, `vacuous-expect`); Vitest `allowOnly: false`; Playwright `forbidOnly: true`; `CLAUDE.md` E2 and E4. MUST NOT ban `toBeTruthy()`. |
| C | Replace the unit under test with a mock; write the expected value into the code under test; accept a new snapshot without examining the difference. | `CLAUDE.md` E2. This slice has no mocks and no snapshots. |
| D | Disable a rule; add a file to an ignore list to hide a finding; add an inline comment that hides a type error or a forbidden-client token. | `G-ethos`; `G-pii`; `G-map` tombstones |
| E | Lower a floor; delete a measurement; raise a `_max` ceiling without the owner; raise a timeout to hide a slow operation. | `G-floors`; `CLAUDE.md` E5 |
| F | Add a command that always exits with success; set a step to continue after an error; turn a named gate off; skip a hook; force-push over a failed check; narrow the set of files a scan looks at. | G-unit `forced-success` and `retry-flag` on `package.json` scripts; `population-missing` / `population-extra` when the scanned set disagrees with the required literal paths or the independent population filter; `npm run check` is an `&&` chain. No GitHub `continue-on-error` in this repository. |
| G | Catch an exception and give no report; send output to a file nobody reads; report a partial run (`npm run check`) as a complete run (`npm run gauntlet`). | Drift-check report in `.claude/skills/drift-check/SKILL.md`; R6 |

**General clause.** If an action makes a gate agree, and the behaviour of the software did not change, the action is prohibited. This clause has priority over A–G. Do not look for a mechanism that the categories do not name.

### Permitted remediations

MUST:

- Fix the code under test so the existing gate passes.
- Revert the change that caused the failure.
- Stop and give a decision page (`AGENTS.md`: one question per screen, every option costed, one marked MY PICK, an Other box that outranks the buttons, numbers measured rather than recalled, copy-all at the end). Do not execute until the operator replies. Silence is not approval.

A revert removes the cause. A suppression removes the detector. A revert is permitted. A suppression is not.

### E12 carve-out

`CLAUDE.md` E12 requires player-facing work to add schema, Ajv tests, Playwright, and the six drift parts in the same change, and `G-floors` requires raising floors when live is above baseline.

That **adding** is required work. It is not gate weakening.

MUST NOT treat the following as the E12 carve-out; stop and give a decision page instead:

- Weakening oracles
- Deleting tests
- Adding skips
- Lowering floors
- Disabling a named gate

Do not quote E12 text; open `CLAUDE.md`.

### Escalation

When a gate fails: reproduce, diagnose, repair the cause.

Stop and give a decision page when any of these is true:

- Three rejected causes
- The only action left is paper-over (§6 A–G)
- The failure cannot be reproduced

If that stop names a real new fault, add a tracking row in `docs/open-faults.md`. MUST NOT create `STATUS.md`. MUST NOT invent a GitHub-issue process.

### Policy controls (GIP-C1–C9)

Draft-policy control IDs. Never call these E1–E9 (`CLAUDE.md` already owns E1–E12).

| id | control | status in this repo |
|---|---|---|
| GIP-C1 | CODEOWNERS on tests and CI | Not added. No `CODEOWNERS`. |
| GIP-C2 | Branch protection with required checks | Not added. No `.github/` workflows. Look at GitHub settings; do not fake them in markdown. |
| GIP-C3 | Coverage ratchet | Count floors in `G-floors`, not coverage percent. Do not add line-coverage %. |
| GIP-C4 | Mutation-score ratchet | Not added. G-unit “mutants” are planted negative controls (`CLAUDE.md` E3), not Stryker. |
| GIP-C5 | Diff/tree check for §6 mechanisms | The G-unit paper-over scan: `node tools/check-gate-integrity.mjs`. |
| GIP-C6 | Suppression-baseline ratchet | Not added. No linter suppression file to ratchet. |
| GIP-C7 | Scheduled suite (flake hunt) | Not added. No cron. |
| GIP-C8 | Automatic job retry off | True locally and scanned: Playwright `retries: 0` (`retries-nonzero`, top level and per project); Vitest `retry` unset, default 0 (`vitest-retry-nonzero` in `vite.config.*` / `vitest.config.*`, which takes precedence); per-test `{ retry: n }` in scanned test files (`test-retry-nonzero`); `test.describe.configure({ retries: n })` in e2e files (`e2e-retries-nonzero`); `--retry` / `--retries` flags in `package.json` scripts (`retry-flag`). Only the literal `0` passes. |
| GIP-C9 | SaaS log retention | Not added. Do not add Sentry or analytics (`G-ethos`). Paste live drift-check numbers. |

FACT-GATE-COUNT stays eleven named gates. GIP-C5 is a subsection of G-unit. Do not add a 12th named gate.

MUST:

- Keep exactly six named drift parts. G-lockstep fails if they disagree or a part file is missing.
- Bind Gates to this file **plus** `.claude/gate-baseline.json` (lockstep `part-source-missing` if the baseline is absent).
- Run the command in the gate table. Do not infer a substitute.
- Player-facing growth in the same change: JSON Schema + Ajv, Playwright spec/fixture (teaching, interaction, regression), and all six drift parts. See `CLAUDE.md` E12.

MUST NOT:

- Collapse the six parts into fewer artifacts.
- Treat effect-map as a seventh named part.
- Hand-edit generated maps (`docs/file-map.md`, `docs/code-map.md`, `docs/feature-map.md`, `docs/tutorial-manifest.md`, `docs/effect-map.md`).
- Delete a test, delete a mutant, or add a skip to make a build pass.
- Raise a `_max` ceiling without the owner. A missing ceiling is a failure.
- Add an ad-hoc parser beside JSON Schema / Ajv for content, config, saves, or UI contracts.
- Add a one-off player-facing script instead of a Playwright spec/fixture.
- Re-run the same red tree hoping for green (R5).
- Claim green when a named gate did not run, especially G-e2e versus `npm run check` (R6).

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

`npm run check` must run: unit tests, G-unit paper-over scan (`node tools/check-gate-integrity.mjs` and `--self-test`; still G-unit, not a 12th named gate), file-map check and self-test, blast-radius self-test, effect-map check and self-test, code-map / feature-map / tutorial-manifest check and self-test, lockstep check and self-test, schema inventory check and self-test, governing-file check and self-test, PII lint and self-test, ethos scan, floor check.

`npm run gauntlet` must run that same set plus the production build and Playwright (G-e2e).

## Gates

| Gate | Command | Proves | Cannot prove | Fail | Negative control |
|---|---|---|---|---|---|
| G-map | `node tools/file-map.mjs --check` and `--self-test` | Every tracked file is declared; owned-fact shapes are not copied; tombstones stay gone; the generated map matches the table | A stale paragraph rewritten in fresh words | exit 1; codes `undeclared`, `copied-fact`, `tombstone`, `control-missing`, `map-stale`, `row-missing-id` | `control-missing`, `copied-fact`, `undeclared`, `tombstone`, `row-missing-id` |
| G-blast | `node tools/blast-radius.mjs --self-test` | The lookup still finds planted controls | What a change *means*; import/call/git graphs | exit 1 | word miss on `tools/blast-radius.mjs`; symbol miss on `SELF_TEST_WORD`; kind not `GATE` |
| G-effect | `node tools/effect-map.mjs --check` and `--self-test` | Every vitest test has a row; the committed map matches the tree; registry and map agree on executable tests | That a test is the *right* test | exit 1; codes `missing-file-meta`, `map-stale`, `registry-unlinked` | `missing-file-meta`, `row-for-missing-file` |
| G-gov | `node tools/check-governing.mjs` and `--self-test` | Governing files are listed, each has an ownership header, no stray status files | That the headers describe the right ownership | exit 1; codes `missing`, `missing-header`, `stray-status` | missing-header detector |
| G-pii | `node tools/pii-lint.mjs` and `--self-test` | No email-like strings or user-folder prefixes in tracked files except the lockfile allowlist | Encoded or paraphrased personal facts | exit 1 | constructed email/user-folder samples |
| G-ethos | `node tools/pii-lint.mjs --ethos` | `src/` has none of the forbidden client tokens in `scripts/lib/client-gates.mjs`: network (`fetch(`, XMLHttpRequest, WebSocket, EventSource, sendBeacon, `importScripts(`), camera and location (geolocation, getUserMedia, mediaDevices, ImageCapture), analytics and cloud (gtag, Sentry, analytics, amplitude, mixpanel, segment.io, firebase, supabase), model SDKs (openai, anthropic, @ai-sdk, langchain, langgraph), durable storage (indexedDB, localStorage, sessionStorage, serviceWorker, caches.open); the scan prints the token count so a shrinking list is visible | A new SDK or primitive under a name not on the list; an aliased call such as `const f = fetch` | exit 1 | constructed `getUserMedia`, `fetch(`, and `localStorage` tokens flagged; `prefetchData(url)` stays clean |
| G-unit | `vitest run` and `node tools/check-gate-integrity.mjs` and `--self-test` | Literal-value tests of helpers, schemas, and inventory; paper-over marks in tests and scripts fail (`skip-mark`, `only-mark`, `vacuous-expect`, `forced-success`, `retry-flag`, `test-retry-nonzero`, `e2e-retries-nonzero`, keys bare or quoted); the scanned population is checked against the tree (`population-missing`, `population-extra`) and printed; Vitest `allowOnly: false` and `retry` unset (`allow-only-missing`, `vitest-retry-nonzero`); Playwright `forbidOnly: true` and `retries: 0` at top level and per project (`forbid-only-missing`, `retries-nonzero`) | That Playwright covered the same paths; that G-e2e ran | non-zero vitest or integrity exit | planted skip / `.only` / `expect(true)` / forced-success; per-file mutants in `tests/` |
| G-schema | `node tools/check-schemas.mjs` and `--self-test` | Every JSON Schema file is on the code map; Ajv compiles it; every mapped instance validates; sitting schemas reject a loosened `approachLiveGear`, a missing second-miss hint, an empty prompt or gloss, an empty hotspot list, and extra properties (Ajv tests in `tests/widen-sitting-*.test.ts`) | That the schema is the *right* shape for a future lesson | exit 1; codes `schema-not-in-code-map`, `schema-missing`, `schema-unreadable`, `schema-without-instance`, `instance-missing`, `instance-invalid` | one planted fixture per code through the real detection path, plus a clean-fixture positive control; wrong title `sittingId` rejected |
| G-lockstep | `node tools/check-lockstep.mjs` and `--self-test` | The six named drift parts exist and agree (features ↔ tutorials ↔ code rows ↔ SPEC ids ↔ e2e files ↔ gate-baseline) | That a stub feature is ready to ship | exit 1; codes in the G-lockstep agreement list above | sitting-2 spec omitted from `FEAT-LEARN`; missing `.claude/gate-baseline.json` |
| G-e2e | `npm run test:e2e` | Player-facing specs cover teaching, interaction, and regression for shipped and explicitly stubbed modes | Sittings 3–11, Challenge, and Life list, which remain unbuilt | non-zero Playwright exit | stub-mode specs in `e2e/specs/modes-not-shipped.spec.ts` |
| G-floors | `node tools/check-floors.mjs` | Live counts are not below floors; HISTORY and any declared line-length caps have ceilings | That the floors measure the thing you care about | exit 1; codes `floor-dropped`, `floor-raise-required`, `ceiling-exceeded`, `missing-ceiling` | missing `history_files_max` |

## Shared oracle rules (held by the suite, named here)

Paper-over, retry-to-green, and truthful status live in the Agent contract above. Named modes: specification gaming, oracle degradation, vacuous gate.

- Assertions use literal expected values. See `CLAUDE.md` E2.
- Every detector has a negative control that fails on the fault it targets. See `CLAUDE.md` E3.
- Do not delete a test or a mutant, and do not add a skip to make a build pass. See `CLAUDE.md` E4.
- If a gate fails, fix the code. If the gate itself looks wrong, stop and tell the owner. See `CLAUDE.md` E6.
- Do not edit generated files by hand. See `CLAUDE.md` E1.
- JSON Schema plus Ajv is the authority path for player-facing content, config, saves, and UI contracts. Do not add an ad-hoc parser beside it.
- A new player-facing feature adds or extends a Playwright spec/fixture in the same change. Do not add a one-off script. See `CLAUDE.md` E12.

## Honest limits

Passing this gauntlet means the named gates were happy. It does not mean the product is finished, the maps can see paraphrased drift, or a rule is the right rule. Run the procedure in `.claude/skills/drift-check/SKILL.md` before calling anything all green.

The G-unit paper-over scan (`tools/check-gate-integrity.mjs`) is text matching over whole files. What it cannot see:

- Retry set anywhere other than a `retry:` / `retries:` key or a `--retry` / `--retries` flag in the scanned files: a config passed with `--config` under another name, a `vitest.workspace` or `projects` file, an `.npmrc` or environment variable, a shell or CI wrapper outside `package.json`, or an options object spread in from an import (`...opts`).
- The scan does not evaluate values. A `retry:` or `retries:` key with any value other than the literal `0` is reported, including `retry: { count: 0 }`, a ternary, a variable, and text inside a comment; `vi.setConfig({ retry: n })` is caught the same way. Write the literal `0` or remove the key. Keys written in quotes (`'retry': 2`, `"retries": 3`) are seen the same as bare keys. A value hidden behind a name the key does not touch is not seen.
- Other expected-failure and conditional marks: `it.fails`, `test.fail`, `test.fixme`, `it.todo`, `skipIf`, `runIf` are not scanned. Only `.skip`, `.only`, `xit`, `xdescribe` are.
- Forced success other than `|| true`, `|| exit 0`, `|| process.exit(0)`, or a script that is only one of those: `|| echo ok`, `|| :`, `; exit 0`, and vitest `--passWithNoTests` pass.
- Files outside `tests/`, `e2e/`, `scripts/`, `package.json`, and the `vite` / `vitest` / `playwright` config names. `tools/` and `src/` are not scanned; the runners' own `include` and `testDir` globs are guarded by `G-floors` counts, not by this scan.
- The population check (`population-missing`, `population-extra`) compares the scanner's filter against six literal paths and a second regex in the same file. Narrowing both in one edit passes the self-test; the unit test's independent `git ls-files` comparison and its literal minimum of 27 targets are the remaining guards.
- The scanner reads comments as code. A commented `// retries: 2` is a finding. That is fail-closed on purpose.
