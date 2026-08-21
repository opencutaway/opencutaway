# Code map

GENERATED. Do not hand-edit. Source: `tools/code-map.mjs`.

| action | command |
|---|---|
| regenerate | `node tools/code-map.mjs` |
| check | `node tools/code-map.mjs --check` |
| self-test | `node tools/code-map.mjs --self-test` |
| gate | G-lockstep |
| fail | exit 1; JSON problem objects on stderr |
| artifact | `docs/code-map.md` |

MUST:
- Keep a unique `id` on every row.
- Map every Owners `FACTS[].id` to a `factId`.
- Player-facing kinds (`ui-contract`, `content`, `save`, `config`) MUST set `validates` to a JSON Schema path and `instances` to committed fixtures.
- Sitting/UI rows that a shipped feature consumes MUST list Playwright paths in `e2eSpecs`.
- Regenerate (`node tools/code-map.mjs`) so this artifact byte-matches `generateMarkdown()`.

MUST NOT:
- Hand-edit this file.
- Add an ad-hoc parser beside Ajv for content, config, saves, or UI contracts.
- Point `validates` or `instances` at paths that do not exist.
- Import workflow graphs from `src/`.

Negative controls: `owner-fact-unmapped`, `player-facing-without-schema`, `player-facing-without-instance`, `missing-path`, `missing-schema`

**Does not own** who owns a fact (Owners) or what players can do (Feature map). **Part:** Code map.

## Cannot see

- That a schema is the right shape for a future lesson.
- That a stub row is ready to ship.

| id | factId | kind | produces | consumes | validates | instances | e2eSpecs | publishes |
|---|---|---|---|---|---|---|---|---|
| CODE-FACT-CHECK-CADENCE | FACT-CHECK-CADENCE | engineering | `CLAUDE.md` | `AGENTS.md`, `README.md`, `docs/testing-gauntlet.md` | — | — | — | Push versus release cadence |
| CODE-FACT-GATE-COUNT | FACT-GATE-COUNT | engineering | `docs/testing-gauntlet.md` | `tools/file-map.mjs` | — | — | — | Named gate list for this slice |
| CODE-FACT-NO-NETWORK | FACT-NO-NETWORK | engineering | `CLAUDE.md` | `AGENTS.md`, `README.md`, `.cursor/rules/client-hard-stops.mdc` | — | — | — | Shipped-app network rule |
| CODE-TITLE-SCREEN | DATA-TITLE-SCREEN | ui-contract | `content/ui/title-screen.json` | `src/app/title.ts`, `src/app/App.tsx` | `schema/ui-title-screen.schema.json` | `content/ui/title-screen.json` | `e2e/specs/title.spec.ts` | Title-screen copy in the child app |
| CODE-WIDEN-SITTING-1 | DATA-WIDEN-SITTING-1 | content | `content/sittings/widen-1-get-across.json` | `src/app/sitting.ts`, `src/app/WidenSitting1.tsx`, `src/app/renderers/BusyBlock.tsx` | `schema/sitting-widen-1.schema.json` | `content/sittings/widen-1-get-across.json` | `e2e/specs/widen-1-get-across.spec.ts` | Widen sitting 1 (Cross the Street) copy and hotspots |
| CODE-WIDEN-SITTING-2 | DATA-WIDEN-SITTING-2 | content | `content/sittings/widen-2-lights.json` | `src/app/sitting.ts`, `src/app/WidenSitting1.tsx`, `src/app/renderers/BusyBlock.tsx` | `schema/sitting-widen-2.schema.json` | `content/sittings/widen-2-lights.json` | `e2e/specs/widen-2-lights.spec.ts` | Widen sitting 2 (Lights) copy and hotspots |
| CODE-OBJECT-CARD | DATA-OBJECT-CARD | content | `content/examples/object-card.example.json` | `tests/schema-examples.test.ts` | `schema/infrastructure-object-card.schema.json` | `content/examples/object-card.example.json` | — | Object-card example only; not a catalog |
| CODE-SYSTEM-CHAIN | DATA-SYSTEM-CHAIN | content | `content/examples/system-chain.example.json` | `tests/schema-examples.test.ts` | `schema/system-chain.schema.json` | `content/examples/system-chain.example.json` | — | System-chain example only; not a catalog |
| CODE-LOCAL-PROFILE | DATA-LOCAL-PROFILE | save | `content/examples/local-profile.example.json` | `tests/schema-examples.test.ts` | `schema/local-profile.schema.json` | `content/examples/local-profile.example.json` | — | Sample on-device profile shape; real saves stay gitignored |
| CODE-WORKFLOW-GRAPH | DATA-WORKFLOW-GRAPH | build-time | `workflows/content-authoring.example.yaml` | `tests/workflow-graph.test.ts` | `schema/workflow-graph.schema.json` | `workflows/content-authoring.example.yaml` | — | Build-time content-authoring graph; never imported from src/ |
| CODE-ART-TOKENS | DATA-ART-TOKENS | config | `content/art/tokens.json` | `docs/art-bible.md`, `src/app/renderers/BusyBlock.tsx`, `src/index.css` | `schema/art-tokens.schema.json` | `content/art/tokens.json` | — | Machine-readable art values; the gate checks renderer constants and stylesheet colours against them |
| CODE-ART-PROVENANCE | DATA-ART-PROVENANCE | build-time | `content/art/provenance/busy-block-placeholder.json` | `docs/art-bible.md` | `schema/art-provenance.schema.json` | `content/art/provenance/busy-block-placeholder.json` | — | One provenance record per final visual asset: role IDs, licence, reviews, file hash |

