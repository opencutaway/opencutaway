# Code map

GENERATED. Do not hand-edit. Source: `tools/code-map.mjs`.

**This generated file lists** how files produce, consume, validate, and publish facts.
**It does not own** who owns a fact (Owners) or what players can do (Feature map).

| id | fact | kind | produces | consumes | validates (Ajv) | publishes |
|---|---|---|---|---|---|---|
| CODE-FACT-CHECK-CADENCE | FACT-CHECK-CADENCE | engineering | `CLAUDE.md` | `AGENTS.md`, `README.md`, `docs/testing-gauntlet.md` | — | Push versus release cadence |
| CODE-FACT-GATE-COUNT | FACT-GATE-COUNT | engineering | `docs/testing-gauntlet.md` | `tools/file-map.mjs` | — | Named gate list for this slice |
| CODE-FACT-NO-NETWORK | FACT-NO-NETWORK | engineering | `CLAUDE.md` | `AGENTS.md`, `README.md`, `.cursor/rules/client-hard-stops.mdc` | — | Shipped-app network rule |
| CODE-TITLE-SCREEN | DATA-TITLE-SCREEN | ui-contract | `content/ui/title-screen.json` | `src/app/title.ts`, `src/app/App.tsx` | `schema/ui-title-screen.schema.json` | Title-screen copy in the child app |
| CODE-OBJECT-CARD | DATA-OBJECT-CARD | content | `content/examples/object-card.example.json` | `tests/schema-examples.test.ts` | `schema/infrastructure-object-card.schema.json` | Object-card example only; not a catalog |
| CODE-SYSTEM-CHAIN | DATA-SYSTEM-CHAIN | content | `content/examples/system-chain.example.json` | `tests/schema-examples.test.ts` | `schema/system-chain.schema.json` | System-chain example only; not a catalog |
| CODE-LOCAL-PROFILE | DATA-LOCAL-PROFILE | save | `content/examples/local-profile.example.json` | `tests/schema-examples.test.ts` | `schema/local-profile.schema.json` | Sample on-device profile shape; real saves stay gitignored |
| CODE-WORKFLOW-GRAPH | DATA-WORKFLOW-GRAPH | build-time | `workflows/content-authoring.example.yaml` | `tests/workflow-graph.test.ts` | `schema/workflow-graph.schema.json` | Build-time content-authoring graph; never imported from src/ |

