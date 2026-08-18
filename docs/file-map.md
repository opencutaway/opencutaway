# File map

GENERATED. Do not hand-edit. Source: `tools/file-map.mjs`.

**This generated file lists** owners and kinds. **It does not own** the table.

## Honest limits

- A stale paragraph in fresh words is invisible.
- A sentence that denies an owned fact but contains its shape is still refused.
- A new fact family is unguarded until its row exists in the tool.

## Owned facts

| id | owner | why |
|---|---|---|
| FACT-CHECK-CADENCE | `CLAUDE.md` | Push versus release cadence must not fork across README and agent docs. |
| FACT-GATE-COUNT | `docs/testing-gauntlet.md` | A second file quoting the gate count will rot the day a gate is added. |
| FACT-NO-NETWORK | `CLAUDE.md` | The shipped-app network rule is one sentence; copies will diverge. |

## Tombstones (must not exist)

- `docs/STATUS.md`
- `docs/session-summary.md`

HISTORY ceiling: 0

## Tracked files

| path | kind | notes |
|---|---|---|
| `.claude/gate-baseline.json` | GATE | Floors and ceilings |
| `.claude/skills/drift-check/SKILL.md` | OWNER | Drift-check procedure |
| `.cursor/rules/client-hard-stops.mdc` | DOC | Agent hard-stops |
| `.cursor/rules/content-workflows.mdc` | DOC | Agent hard-stops |
| `.cursor/rules/drift-maps.mdc` | DOC | Agent hard-stops |
| `.cursor/rules/privacy-a1.mdc` | DOC | Agent hard-stops |
| `.gitattributes` | SOURCE | LF and binaries |
| `.gitignore` | SOURCE | Includes local profiles |
| `AGENTS.md` | OWNER | Agent practice |
| `CHANGELOG.md` | DOC | Parent-facing history |
| `CLAUDE.md` | OWNER | Finished work, S-rules, E-rules |
| `LICENSE` | DOC | MIT |
| `README.md` | OWNER | Front door and pointers |
| `SPEC.md` | OWNER | Game behaviour |
| `assets/drawings/.gitkeep` | DATA | Drawings and photos later |
| `assets/drawings/README.md` | DATA | Drawings and photos later |
| `assets/photos/.gitkeep` | DATA | Drawings and photos later |
| `assets/photos/README.md` | DATA | Drawings and photos later |
| `content/README.md` | DATA | Schema examples only |
| `content/examples/local-profile.example.json` | DATA | Schema examples only |
| `content/examples/object-card.example.json` | DATA | Schema examples only |
| `content/examples/system-chain.example.json` | DATA | Schema examples only |
| `content/ui/title-screen.json` | DATA | Schema examples only |
| `cosmetics/.gitkeep` | DATA | Unfrozen stub |
| `cosmetics/README.md` | DATA | Unfrozen stub |
| `docs/ATTRIBUTION.md` | OWNER | Per-asset rows |
| `docs/PRIVACY.md` | OWNER | Commit scrub |
| `docs/candidates.md` | OWNER | Unfrozen object notes |
| `docs/code-map.md` | GENERATED | Written by tools/code-map.mjs |
| `docs/effect-map.md` | GENERATED | Written by tools/effect-map.mjs |
| `docs/feature-map.md` | GENERATED | Written by tools/feature-map.mjs |
| `docs/file-map.md` | GENERATED | Written by this tool |
| `docs/inspiration.md` | OWNER | Do-not-copy books |
| `docs/open-faults.md` | OWNER | Open gaps |
| `docs/reviews/CTX-BOOTSTRAP-DRIFT.md` | DOC | Independent review records |
| `docs/reviews/README.md` | DOC | Review record home |
| `docs/settled.md` | OWNER | Closed questions |
| `docs/testing-gauntlet.md` | OWNER | Gate contract |
| `docs/tutorial-manifest.md` | GENERATED | Written by tools/tutorial-manifest.mjs |
| `e2e/README.md` | TEST | Playwright player-facing specs |
| `e2e/fixtures/player.ts` | TEST | Playwright player-facing specs |
| `e2e/pages/title-screen.ts` | TEST | Playwright player-facing specs |
| `e2e/specs/modes-not-shipped.spec.ts` | TEST | Playwright player-facing specs |
| `e2e/specs/title.spec.ts` | TEST | Playwright player-facing specs |
| `index.html` | SOURCE | Vite entry |
| `package-lock.json` | DATA | npm lockfile; PII allowlist |
| `package.json` | SOURCE | App and check scripts |
| `playwright.config.ts` | TEST | Playwright runner |
| `printables/.gitkeep` | DATA | Later print sheets |
| `printables/README.md` | DATA | Later print sheets |
| `profiles/.gitkeep` | DATA | Keep file only; JSON gitignored |
| `schema/infrastructure-object-card.schema.json` | DATA | JSON Schema |
| `schema/local-profile.schema.json` | DATA | JSON Schema |
| `schema/system-chain.schema.json` | DATA | JSON Schema |
| `schema/ui-title-screen.schema.json` | DATA | JSON Schema |
| `schema/workflow-graph.schema.json` | DATA | JSON Schema |
| `scripts/lib/ajv-validate.mjs` | GATE | PII and client scans |
| `scripts/lib/client-gates.mjs` | GATE | PII and client scans |
| `scripts/lib/forbidden-dependencies.mjs` | GATE | PII and client scans |
| `scripts/lib/pii-scan.mjs` | GATE | PII and client scans |
| `scripts/lib/scan-client-tree.mjs` | GATE | PII and client scans |
| `scripts/scan-client-gates.mjs` | GATE | PII and client scans |
| `scripts/scan-pii.mjs` | GATE | PII and client scans |
| `scripts/write-test-registry.mjs` | GATE | PII and client scans |
| `src/app/App.tsx` | SOURCE | Offline Preact shell |
| `src/app/renderers/.gitkeep` | SOURCE | Offline Preact shell |
| `src/app/renderers/README.md` | SOURCE | Offline Preact shell |
| `src/app/title.ts` | SOURCE | Offline Preact shell |
| `src/index.css` | SOURCE | Offline Preact shell |
| `src/main.tsx` | SOURCE | Offline Preact shell |
| `src/vite-env.d.ts` | SOURCE | Offline Preact shell |
| `tests/client-gates.test.ts` | TEST | Vitest and registry |
| `tests/forbidden-dependencies.test.ts` | TEST | Vitest and registry |
| `tests/helpers/repo-files.ts` | TEST | Vitest and registry |
| `tests/helpers/schema.ts` | TEST | Vitest and registry |
| `tests/hit-target.test.ts` | TEST | Vitest and registry |
| `tests/pii-scan.test.ts` | TEST | Vitest and registry |
| `tests/registry-coverage.test.ts` | TEST | Vitest and registry |
| `tests/registry.json` | GENERATED | Written by scripts/write-test-registry.mjs |
| `tests/registry/README.md` | TEST | Vitest and registry |
| `tests/registry/test-taxonomy-ids.json` | TEST | Vitest and registry |
| `tests/schema-examples.test.ts` | TEST | Vitest and registry |
| `tests/schema-inventory.test.ts` | TEST | Vitest and registry |
| `tests/scripts-modules.d.ts` | TEST | Vitest and registry |
| `tests/title.test.ts` | TEST | Vitest and registry |
| `tests/workflow-graph.test.ts` | TEST | Vitest and registry |
| `tools/blast-radius.mjs` | GATE | Maps and floors |
| `tools/check-floors.mjs` | GATE | Maps and floors |
| `tools/check-governing.mjs` | GATE | Maps and floors |
| `tools/check-lockstep.mjs` | GATE | Maps and floors |
| `tools/check-schemas.mjs` | GATE | Maps and floors |
| `tools/code-map.mjs` | GATE | Maps and floors |
| `tools/effect-map.mjs` | GATE | Maps and floors |
| `tools/feature-map.mjs` | GATE | Maps and floors |
| `tools/file-map.mjs` | GATE | Maps and floors |
| `tools/pii-lint.mjs` | GATE | Maps and floors |
| `tools/tutorial-manifest.mjs` | GATE | Maps and floors |
| `tsconfig.json` | SOURCE | TypeScript |
| `vite.config.ts` | SOURCE | Vite + vitest |
| `workflows/README.md` | DATA | Build-time graphs |
| `workflows/content-authoring.example.yaml` | DATA | Build-time graphs |

