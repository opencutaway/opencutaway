# Effect map

GENERATED. Do not hand-edit. Source: `tools/effect-map.mjs`.

| action | command |
|---|---|
| regenerate | `node tools/effect-map.mjs` |
| check | `node tools/effect-map.mjs --check` |
| self-test | `node tools/effect-map.mjs --self-test` |
| gate | G-effect |
| fail | exit 1; JSON problem objects on stderr |
| artifact | `docs/effect-map.md` |

MUST:
- Every `tests/**/*.test.ts` file has a `FILE_META` row.
- Every `FILE_META.registryIds` id exists in `tests/registry.json`.
- Regenerate (`node tools/effect-map.mjs`) so this artifact byte-matches `generateMarkdown()`.

MUST NOT:
- Hand-edit this file.
- Treat this map as a seventh named drift part. It supports Gates only.
- Leave a vitest file unlinked from the registry.

Negative controls: `missing-file-meta`, `row-for-missing-file`, `registry-unlinked`, `vitest-unlinked`

**Does not own** the gate contract or product behaviour. **Supports:** Gates. **Not** a seventh named drift part.

## Cannot see

- That a test is the right test.
- Paraphrased product drift.

Executable tests: 44 over 11 files.

## Per-file declarations

| file | protects | does not prove | oracle | platform |
|---|---|---|---|---|
| `tests/client-gates.test.ts` | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. | Empty findings; constructed getUserMedia is flagged. | Node vitest |
| `tests/forbidden-dependencies.test.ts` | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. | Empty name list for committed package.json. | Node vitest |
| `tests/hit-target.test.ts` | Child-facing hit targets stay at 44 CSS pixels; the busy block is SVG without WebGL. | That 44px is enough for every future control, or that SVG is the only allowed 2D renderer. | Literal min-height and min-width 44px in src/index.css; BusyBlock contains <svg and not webgl. | Node vitest |
| `tests/pii-scan.test.ts` | Tracked files have no email-like or user-folder markers; detector fires on constructed samples. | Paraphrased personal facts. | Empty findings list; constructed samples match kinds. | Node vitest |
| `tests/registry-coverage.test.ts` | Every taxonomy category is named by a test or an exclusion, never both. | That exclusions are the right product call. | Empty missing/extra/dual lists. | Node vitest |
| `tests/schema-examples.test.ts` | Committed examples match schema; unsafe and cloud-sync instances fail. | A filled catalog. | Ajv true/false with literal fixtures. | Node vitest |
| `tests/schema-inventory.test.ts` | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. | Literal schema path list; Ajv true/false on fixtures. | Node vitest |
| `tests/title.test.ts` | The title names Open Cutaway and offers Get across and Lights. | Sittings 3–11 or Challenge. | Literal title string Open Cutaway and control labels Get across and Lights. | Node vitest |
| `tests/widen-sitting-1.test.ts` | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. | Ajv true/false plus literal names Traffic signal, Crosswalk, Crossing gates. | Node vitest |
| `tests/widen-sitting-2.test.ts` | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. | Ajv true/false plus literal names Utility pole, Overhead conductor, Distribution transformer. | Node vitest |
| `tests/workflow-graph.test.ts` | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. | Ajv plus literal locus and gate flags. | Node vitest |

## Per-test rows

| file | test | protects | does not prove |
|---|---|---|---|
| `tests/client-gates.test.ts` | flags forbidden client tokens in a sample string | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | finds no forbidden tokens under src/ | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/forbidden-dependencies.test.ts` | rejects a sample package list that includes a forbidden SDK | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/forbidden-dependencies.test.ts` | allows the committed package.json | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/hit-target.test.ts` | keeps stylesheet controls at 44 CSS pixels | Child-facing hit targets stay at 44 CSS pixels; the busy block is SVG without WebGL. | That 44px is enough for every future control, or that SVG is the only allowed 2D renderer. |
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
| `tests/schema-inventory.test.ts` | lists every committed JSON Schema file | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | accepts the title-screen UI contract | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | rejects a title contract that opens Get across as Lights | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | rejects a title contract that opens Lights as Get across | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | rejects a title contract with an extra property | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | accepts the widen sitting 1 contract | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | accepts the widen sitting 2 contract | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/title.test.ts` | names the game Open Cutaway and offers Get across and Lights | The title names Open Cutaway and offers Get across and Lights. | Sittings 3–11 or Challenge. |
| `tests/widen-sitting-1.test.ts` | accepts the Get across sitting instance | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | uses real names for the through-line and keeps off-need out of tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a through-line hotspot that is missing from tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects an off-need hotspot placed in tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects extra properties on the sitting | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | asks to try again on the first miss and names the rung on the second | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | records a through-line find without a timer or lockout | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | turns off the through-line pulse when reduce-motion is requested | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | accepts the Lights sitting instance | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | uses real names for the through-line and keeps crossing objects quiet | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a through-line hotspot that is missing from tab order | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects an off-need hotspot placed in tab order | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects extra properties on the sitting | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a crossing object placed on the Lights through-line | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | keeps dam and cute substitute names out of the committed sitting | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/workflow-graph.test.ts` | matches the workflow schema and stays build-time | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | requires a human gate before kid-facing copy can be committed | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | uses file-path handoffs between named nodes | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |

