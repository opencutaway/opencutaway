# File map

GENERATED. Do not hand-edit. Source: `tools/file-map.mjs`.

| action | command |
|---|---|
| regenerate | `node tools/file-map.mjs` |
| check | `node tools/file-map.mjs --check` |
| self-test | `node tools/file-map.mjs --self-test` |
| gate | G-map |
| fail | exit 1; JSON problem objects on stderr |
| artifact | `docs/file-map.md` |

MUST:
- Declare every tracked path in `FILE_ROWS` (exact `path` or `glob`) in the same change that creates the file.
- Keep a unique `id` on every `FILE_ROWS` row and every `FACTS` row.
- The owner file must contain the fact `control` string exactly.
- Regenerate this artifact (`node tools/file-map.mjs`) so it byte-matches `generateMarkdown()`.
- Leave tombstones absent from disk and from git.

MUST NOT:
- Hand-edit this file.
- Copy a fact `control` string into a non-owner file outside `COPY_EXEMPT`.
- Recreate `docs/STATUS.md` or `docs/session-summary.md`.
- Add HISTORY-kind files above ceiling 0.
- Infer who owns a path; read `rowId` + `kind`.

Negative controls: `control-missing`, `copied-fact`, `undeclared`, `tombstone`, `row-missing-id`

**Does not own** product behaviour, gate floors, or live coverage numbers. **Part:** Owners.

## Cannot see

- A stale paragraph rewritten in fresh words.
- A sentence that denies an owned fact but contains its shape is still refused.
- A new fact family is unguarded until its row exists in `tools/file-map.mjs`.

## Owned facts

| id | owner | control | why | shapes |
|---|---|---|---|---|
| FACT-CHECK-CADENCE | `CLAUDE.md` | `npm run check` is the cheap path before every push. | Push versus release cadence must not fork across README and agent docs. | SHAPE-CHECK-CADENCE |
| FACT-GATE-COUNT | `docs/testing-gauntlet.md` | The v0 gate count is 11. | A second file quoting the gate count will rot the day a gate is added. | SHAPE-GATE-COUNT |
| FACT-NO-NETWORK | `CLAUDE.md` | The shipped child app makes no network calls in v0. | The shipped-app network rule is one sentence; copies will diverge. | SHAPE-NO-NETWORK |

## COPY_EXEMPT (copied control strings allowed only here)

- `docs/code-map.md`
- `docs/effect-map.md`
- `docs/feature-map.md`
- `docs/file-map.md`
- `docs/open-faults.md`
- `docs/tutorial-manifest.md`
- `tools/check-lockstep.mjs`
- `tools/code-map.mjs`
- `tools/feature-map.mjs`
- `tools/file-map.mjs`
- `tools/tutorial-manifest.mjs`

## Tombstones (MUST NOT exist)

- `docs/STATUS.md`
- `docs/session-summary.md`

HISTORY ceiling: 0

## FILE_ROWS (declaration table; edit this in `tools/file-map.mjs`)

| id | match | kind | notes |
|---|---|---|---|
| OWN-GEN-FILE-MAP | `docs/file-map.md` | GENERATED | Written by this tool |
| OWN-GEN-EFFECT-MAP | `docs/effect-map.md` | GENERATED | Written by tools/effect-map.mjs |
| OWN-GEN-CODE-MAP | `docs/code-map.md` | GENERATED | Written by tools/code-map.mjs |
| OWN-GEN-FEATURE-MAP | `docs/feature-map.md` | GENERATED | Written by tools/feature-map.mjs |
| OWN-GEN-TUTORIAL-MANIFEST | `docs/tutorial-manifest.md` | GENERATED | Written by tools/tutorial-manifest.mjs |
| OWN-GEN-TEST-REGISTRY | `tests/registry.json` | GENERATED | Written by scripts/write-test-registry.mjs |
| OWN-CLAUDE | `CLAUDE.md` | OWNER | Finished work, S-rules, E-rules |
| OWN-AGENTS | `AGENTS.md` | OWNER | Agent practice |
| OWN-SPEC | `SPEC.md` | OWNER | Game behaviour and shipped look |
| OWN-README | `README.md` | OWNER | Front door and pointers |
| OWN-CHANGELOG | `CHANGELOG.md` | DOC | Parent-facing history |
| OWN-LICENSE | `LICENSE` | DOC | MIT |
| OWN-PACKAGE-JSON | `package.json` | SOURCE | App and check scripts |
| OWN-PACKAGE-LOCK | `package-lock.json` | DATA | npm lockfile; PII allowlist |
| OWN-GITIGNORE | `.gitignore` | SOURCE | Includes local profiles |
| OWN-GITATTRIBUTES | `.gitattributes` | SOURCE | LF and binaries |
| OWN-INDEX-HTML | `index.html` | SOURCE | Vite entry |
| OWN-TSCONFIG | `tsconfig.json` | SOURCE | TypeScript |
| OWN-VITE-CONFIG | `vite.config.ts` | SOURCE | Vite + vitest; allowOnly false |
| OWN-GATE-BASELINE | `.claude/gate-baseline.json` | GATE | Floors and ceilings |
| OWN-DRIFT-CHECK-SKILL | `.claude/skills/drift-check/SKILL.md` | OWNER | Drift-check procedure |
| OWN-TESTING-GAUNTLET | `docs/testing-gauntlet.md` | OWNER | Gate contract |
| OWN-SETTLED | `docs/settled.md` | OWNER | Closed questions |
| OWN-OPEN-FAULTS | `docs/open-faults.md` | OWNER | Open gaps |
| OWN-PRIVACY | `docs/PRIVACY.md` | OWNER | Commit scrub |
| OWN-INSPIRATION | `docs/inspiration.md` | OWNER | Do-not-copy books and 16-bit isometric tone |
| OWN-CANDIDATES | `docs/candidates.md` | OWNER | Unfrozen object notes |
| OWN-LEVEL-SPINE | `docs/level-spine.md` | OWNER | Curriculum shape and numbering |
| OWN-ATTRIBUTION | `docs/ATTRIBUTION.md` | OWNER | Per-asset rows |
| OWN-REVIEWS-README | `docs/reviews/README.md` | DOC | Review record home |
| OWN-GLOB-REVIEWS | `docs/reviews/**` | DOC | Independent review records |
| OWN-GLOB-CURSOR-RULES | `.cursor/rules/**` | DOC | Agent hard-stops |
| OWN-GLOB-SCHEMA | `schema/**` | DATA | JSON Schema |
| OWN-GLOB-CONTENT | `content/**` | DATA | Schema examples, UI contracts, sitting copy |
| OWN-GLOB-SRC | `src/**` | SOURCE | Offline Preact shell |
| OWN-GLOB-TESTS | `tests/**` | TEST | Vitest and registry |
| OWN-GLOB-E2E | `e2e/**` | TEST | Playwright player-facing specs |
| OWN-PLAYWRIGHT-CONFIG | `playwright.config.ts` | TEST | Playwright runner |
| OWN-GLOB-SCRIPTS | `scripts/**` | GATE | PII and client scans |
| OWN-GATE-INTEGRITY | `tools/check-gate-integrity.mjs` | GATE | G-unit paper-over scan (GIP-C5); not a 12th named gate |
| OWN-GLOB-TOOLS | `tools/**` | GATE | Maps, floors, and other gate tools |
| OWN-GLOB-WORKFLOWS | `workflows/**` | DATA | Build-time graphs |
| OWN-GLOB-ASSETS | `assets/**` | DATA | Drawings and photos later |
| OWN-GLOB-COSMETICS | `cosmetics/**` | DATA | Unfrozen stub |
| OWN-GLOB-PRINTABLES | `printables/**` | DATA | Later print sheets |
| OWN-GLOB-PROFILES | `profiles/**` | DATA | Keep file only; JSON gitignored |

## Tracked files

| path | rowId | kind | notes |
|---|---|---|---|
| `.claude/gate-baseline.json` | OWN-GATE-BASELINE | GATE | Floors and ceilings |
| `.claude/skills/drift-check/SKILL.md` | OWN-DRIFT-CHECK-SKILL | OWNER | Drift-check procedure |
| `.cursor/rules/client-hard-stops.mdc` | OWN-GLOB-CURSOR-RULES | DOC | Agent hard-stops |
| `.cursor/rules/content-workflows.mdc` | OWN-GLOB-CURSOR-RULES | DOC | Agent hard-stops |
| `.cursor/rules/drift-maps.mdc` | OWN-GLOB-CURSOR-RULES | DOC | Agent hard-stops |
| `.cursor/rules/privacy-a1.mdc` | OWN-GLOB-CURSOR-RULES | DOC | Agent hard-stops |
| `.gitattributes` | OWN-GITATTRIBUTES | SOURCE | LF and binaries |
| `.gitignore` | OWN-GITIGNORE | SOURCE | Includes local profiles |
| `AGENTS.md` | OWN-AGENTS | OWNER | Agent practice |
| `CHANGELOG.md` | OWN-CHANGELOG | DOC | Parent-facing history |
| `CLAUDE.md` | OWN-CLAUDE | OWNER | Finished work, S-rules, E-rules |
| `LICENSE` | OWN-LICENSE | DOC | MIT |
| `README.md` | OWN-README | OWNER | Front door and pointers |
| `SPEC.md` | OWN-SPEC | OWNER | Game behaviour and shipped look |
| `assets/drawings/.gitkeep` | OWN-GLOB-ASSETS | DATA | Drawings and photos later |
| `assets/drawings/README.md` | OWN-GLOB-ASSETS | DATA | Drawings and photos later |
| `assets/photos/.gitkeep` | OWN-GLOB-ASSETS | DATA | Drawings and photos later |
| `assets/photos/README.md` | OWN-GLOB-ASSETS | DATA | Drawings and photos later |
| `content/README.md` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/examples/local-profile.example.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/examples/object-card.example.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/examples/system-chain.example.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/sittings/widen-1-get-across.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/sittings/widen-2-lights.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `content/ui/title-screen.json` | OWN-GLOB-CONTENT | DATA | Schema examples, UI contracts, sitting copy |
| `cosmetics/.gitkeep` | OWN-GLOB-COSMETICS | DATA | Unfrozen stub |
| `cosmetics/README.md` | OWN-GLOB-COSMETICS | DATA | Unfrozen stub |
| `docs/ATTRIBUTION.md` | OWN-ATTRIBUTION | OWNER | Per-asset rows |
| `docs/PRIVACY.md` | OWN-PRIVACY | OWNER | Commit scrub |
| `docs/candidates.md` | OWN-CANDIDATES | OWNER | Unfrozen object notes |
| `docs/code-map.md` | OWN-GEN-CODE-MAP | GENERATED | Written by tools/code-map.mjs |
| `docs/effect-map.md` | OWN-GEN-EFFECT-MAP | GENERATED | Written by tools/effect-map.mjs |
| `docs/feature-map.md` | OWN-GEN-FEATURE-MAP | GENERATED | Written by tools/feature-map.mjs |
| `docs/file-map.md` | OWN-GEN-FILE-MAP | GENERATED | Written by this tool |
| `docs/inspiration.md` | OWN-INSPIRATION | OWNER | Do-not-copy books and 16-bit isometric tone |
| `docs/level-spine.md` | OWN-LEVEL-SPINE | OWNER | Curriculum shape and numbering |
| `docs/open-faults.md` | OWN-OPEN-FAULTS | OWNER | Open gaps |
| `docs/reviews/CTX-BOOTSTRAP-DRIFT.md` | OWN-GLOB-REVIEWS | DOC | Independent review records |
| `docs/reviews/CTX-REVIEW-SITTINGS-GIP.md` | OWN-GLOB-REVIEWS | DOC | Independent review records |
| `docs/reviews/README.md` | OWN-REVIEWS-README | DOC | Review record home |
| `docs/settled.md` | OWN-SETTLED | OWNER | Closed questions |
| `docs/testing-gauntlet.md` | OWN-TESTING-GAUNTLET | OWNER | Gate contract |
| `docs/tutorial-manifest.md` | OWN-GEN-TUTORIAL-MANIFEST | GENERATED | Written by tools/tutorial-manifest.mjs |
| `e2e/README.md` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/fixtures/player.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/helpers/adult-sitting-controls.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/helpers/hotspot-reach.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/pages/title-screen.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/pages/widen-sitting-1.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/pages/widen-sitting-2.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/specs/modes-not-shipped.spec.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/specs/title.spec.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/specs/widen-1-get-across.spec.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `e2e/specs/widen-2-lights.spec.ts` | OWN-GLOB-E2E | TEST | Playwright player-facing specs |
| `index.html` | OWN-INDEX-HTML | SOURCE | Vite entry |
| `package-lock.json` | OWN-PACKAGE-LOCK | DATA | npm lockfile; PII allowlist |
| `package.json` | OWN-PACKAGE-JSON | SOURCE | App and check scripts |
| `playwright.config.ts` | OWN-PLAYWRIGHT-CONFIG | TEST | Playwright runner |
| `printables/.gitkeep` | OWN-GLOB-PRINTABLES | DATA | Later print sheets |
| `printables/README.md` | OWN-GLOB-PRINTABLES | DATA | Later print sheets |
| `profiles/.gitkeep` | OWN-GLOB-PROFILES | DATA | Keep file only; JSON gitignored |
| `schema/infrastructure-object-card.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/local-profile.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/sitting-widen-1.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/sitting-widen-2.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/system-chain.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/ui-title-screen.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `schema/workflow-graph.schema.json` | OWN-GLOB-SCHEMA | DATA | JSON Schema |
| `scripts/lib/ajv-validate.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/lib/client-gates.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/lib/forbidden-dependencies.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/lib/pii-scan.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/lib/scan-client-tree.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/scan-client-gates.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/scan-pii.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `scripts/write-test-registry.mjs` | OWN-GLOB-SCRIPTS | GATE | PII and client scans |
| `src/app/App.tsx` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/WidenSitting1.tsx` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/renderers/.gitkeep` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/renderers/BusyBlock.tsx` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/renderers/README.md` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/sitting-session.ts` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/sitting.ts` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/app/title.ts` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/index.css` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/main.tsx` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `src/vite-env.d.ts` | OWN-GLOB-SRC | SOURCE | Offline Preact shell |
| `tests/client-gates.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/forbidden-dependencies.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/gate-integrity.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/helpers/repo-files.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/helpers/schema.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/hit-target.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/hotspot-layout.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/pii-scan.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/registry-coverage.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/registry.json` | OWN-GEN-TEST-REGISTRY | GENERATED | Written by scripts/write-test-registry.mjs |
| `tests/registry/README.md` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/registry/test-taxonomy-ids.json` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/schema-examples.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/schema-inventory.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/scripts-modules.d.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/title.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/widen-sitting-1.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/widen-sitting-2.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tests/workflow-graph.test.ts` | OWN-GLOB-TESTS | TEST | Vitest and registry |
| `tools/blast-radius.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/check-floors.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/check-gate-integrity.mjs` | OWN-GATE-INTEGRITY | GATE | G-unit paper-over scan (GIP-C5); not a 12th named gate |
| `tools/check-governing.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/check-lockstep.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/check-schemas.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/code-map.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/effect-map.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/feature-map.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/file-map.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/pii-lint.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tools/tutorial-manifest.mjs` | OWN-GLOB-TOOLS | GATE | Maps, floors, and other gate tools |
| `tsconfig.json` | OWN-TSCONFIG | SOURCE | TypeScript |
| `vite.config.ts` | OWN-VITE-CONFIG | SOURCE | Vite + vitest; allowOnly false |
| `workflows/README.md` | OWN-GLOB-WORKFLOWS | DATA | Build-time graphs |
| `workflows/content-authoring.example.yaml` | OWN-GLOB-WORKFLOWS | DATA | Build-time graphs |

