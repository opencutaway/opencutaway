# Effect map

GENERATED. Do not hand-edit. Source: `tools/effect-map.mjs`.

**This generated file lists** what each executable test protects.
**It does not own** the gate contract or product behaviour.

Executable tests: 26 over 9 files.

## Per-file declarations

| file | protects | does not prove | oracle | platform |
|---|---|---|---|---|
| `tests/client-gates.test.ts` | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. | Empty findings; constructed getUserMedia is flagged. | Node vitest |
| `tests/forbidden-dependencies.test.ts` | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. | Empty name list for committed package.json. | Node vitest |
| `tests/hit-target.test.ts` | Child-facing hit targets in the shipped stylesheet stay at 44 CSS pixels. | Real controls exist yet. | Literal min-height and min-width 44px in src/index.css. | Node vitest |
| `tests/pii-scan.test.ts` | Tracked files have no email-like or user-folder markers; detector fires on constructed samples. | Paraphrased personal facts. | Empty findings list; constructed samples match kinds. | Node vitest |
| `tests/registry-coverage.test.ts` | Every taxonomy category is named by a test or an exclusion, never both. | That exclusions are the right product call. | Empty missing/extra/dual lists. | Node vitest |
| `tests/schema-examples.test.ts` | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. | Ajv true/false with literal fixtures. | Node vitest |
| `tests/schema-inventory.test.ts` | Every committed JSON Schema compiles in Ajv; the title UI contract is accepted and invalid variants fail. | Playable lesson JSON, which must not exist yet. | Literal schema path list; Ajv true/false on fixtures. | Node vitest |
| `tests/title.test.ts` | Placeholder shell names the infrastructure game and does not ship a lesson. | Playable Learn/Challenge content. | Literal title string Open Cutaway. | Node vitest |
| `tests/workflow-graph.test.ts` | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. | Ajv plus literal locus and gate flags. | Node vitest |

## Per-test rows

| file | test | protects | does not prove |
|---|---|---|---|
| `tests/client-gates.test.ts` | flags forbidden client tokens in a sample string | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | finds no forbidden tokens under src/ | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/forbidden-dependencies.test.ts` | rejects a sample package list that includes a forbidden SDK | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/forbidden-dependencies.test.ts` | allows the committed package.json | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/hit-target.test.ts` | keeps stylesheet controls at 44 CSS pixels | Child-facing hit targets in the shipped stylesheet stay at 44 CSS pixels. | Real controls exist yet. |
| `tests/pii-scan.test.ts` | detects constructed email and user-folder samples | Tracked files have no email-like or user-folder markers; detector fires on constructed samples. | Paraphrased personal facts. |
| `tests/pii-scan.test.ts` | skips lockfiles | Tracked files have no email-like or user-folder markers; detector fires on constructed samples. | Paraphrased personal facts. |
| `tests/pii-scan.test.ts` | finds no PII markers in files git would track | Tracked files have no email-like or user-folder markers; detector fires on constructed samples. | Paraphrased personal facts. |
| `tests/registry-coverage.test.ts` | assesses every taxonomy category as applicable or excluded, never both | Every taxonomy category is named by a test or an exclusion, never both. | That exclusions are the right product call. |
| `tests/schema-examples.test.ts` | accepts the placeholder object card | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | accepts the placeholder system chain | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | accepts the fake local profile | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects an object card that omits safety | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects live-gear approach values other than never | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects cloudSync true on a local profile | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects a chain with fewer than two steps | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects empty display names at the lower bound | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-examples.test.ts` | rejects extra properties on an object card | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. |
| `tests/schema-inventory.test.ts` | lists every committed JSON Schema file | Every committed JSON Schema compiles in Ajv; the title UI contract is accepted and invalid variants fail. | Playable lesson JSON, which must not exist yet. |
| `tests/schema-inventory.test.ts` | accepts the title-screen UI contract | Every committed JSON Schema compiles in Ajv; the title UI contract is accepted and invalid variants fail. | Playable lesson JSON, which must not exist yet. |
| `tests/schema-inventory.test.ts` | rejects a title contract that claims lessons already shipped | Every committed JSON Schema compiles in Ajv; the title UI contract is accepted and invalid variants fail. | Playable lesson JSON, which must not exist yet. |
| `tests/schema-inventory.test.ts` | rejects a title contract with an extra property | Every committed JSON Schema compiles in Ajv; the title UI contract is accepted and invalid variants fail. | Playable lesson JSON, which must not exist yet. |
| `tests/title.test.ts` | names the game Open Cutaway without lesson content | Placeholder shell names the infrastructure game and does not ship a lesson. | Playable Learn/Challenge content. |
| `tests/workflow-graph.test.ts` | matches the workflow schema and stays build-time | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | requires a human gate before kid-facing copy can be committed | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | uses file-path handoffs between named nodes | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |

