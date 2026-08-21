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

Executable tests: 92 over 13 files.

## Per-file declarations

| file | protects | does not prove | oracle | platform |
|---|---|---|---|---|
| `tests/client-gates.test.ts` | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. | Empty findings; constructed getUserMedia is flagged. | Node vitest |
| `tests/forbidden-dependencies.test.ts` | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. | Empty name list for committed package.json. | Node vitest |
| `tests/gate-integrity.test.ts` | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. | Planted skip/.only/expect(true)/forced-success fire; live scan is empty; vite.config.ts contains allowOnly: false. | Node vitest |
| `tests/hit-target.test.ts` | Child-facing hit targets stay at 44 CSS pixels; the busy block is SVG without WebGL. | That 44px is enough for every future control, or that SVG is the only allowed 2D renderer. | Literal min-height and min-width 44px in src/index.css; BusyBlock contains <svg and not webgl. | Node vitest |
| `tests/hotspot-layout.test.ts` | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. | findHotspotLayoutProblems returns [] for the committed sittings and literal problem codes for planted overlapping, narrow, short, and off-block boxes. | Node vitest |
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
| `tests/client-gates.test.ts` | keeps the full forbidden token list | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | flags every forbidden token in a realistic client line | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | matches tokens case-insensitively | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | does not trip fetch( on prefetch or refetch names | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | does not trip segment.io on drawing words | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | reports nothing for clean client text | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/client-gates.test.ts` | finds no forbidden tokens under src/ | src/ has none of the banned client tokens; detector fires on a constructed token. | A newly named SDK. |
| `tests/forbidden-dependencies.test.ts` | rejects a sample package list that includes a forbidden SDK | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/forbidden-dependencies.test.ts` | allows the committed package.json | package.json does not declare banned SDKs; detector fires on a sample openai entry. | Transitive CVE scanning. |
| `tests/gate-integrity.test.ts` | flags planted skip marks | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags planted only marks | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags planted vacuous expect true | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | does not flag toBeTruthy or expect value toBe true | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags a package json script that hides failure | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags a package json script that passes a retry flag | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags a Playwright config with forbidOnly missing or false | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags Playwright retries above zero at top level and per project | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags vitest retry above zero in vite.config.ts and vitest.config.ts | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags a per-test retry option in a test file | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags retry keys written in quotes | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | flags Playwright describe configure retries in an e2e file | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | scans tests, e2e, scripts, and the three config files only | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | scans the whole population the tree holds | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | reports a narrowed filter as a population regression | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | finds no paper-over in tracked tests and scripts | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/gate-integrity.test.ts` | keeps vitest allowOnly false and Playwright retries at 0 | Tests and scripts have no skip/.only/vacuous expect(true); package.json scripts do not hide failure; Vitest allowOnly stays false. | That G-e2e ran, or that a paraphrase of a skip exists in docs. |
| `tests/hit-target.test.ts` | keeps stylesheet controls at 44 CSS pixels | Child-facing hit targets stay at 44 CSS pixels; the busy block is SVG without WebGL. | That 44px is enough for every future control, or that SVG is the only allowed 2D renderer. |
| `tests/hotspot-layout.test.ts` | lays out both committed sittings with no intersecting boxes and nothing under 44 px at 720 px | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | gives the same object the same box in both sittings | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | keeps the stylesheet minimum block width equal to the rule the layout was checked against | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | flags the pole-under-transformer overlap that shipped before this rule | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | flags a box that is narrow, short, or off the block | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | keeps drawn objects without a hotspot on the quiet style | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
| `tests/hotspot-layout.test.ts` | accepts boxes that merely touch | Every hotspot box in both sittings is at least 44 CSS px at the 720 px minimum block width and no two boxes intersect (S9). | Rendered sizes in a browser; the Playwright reachability step proves those. |
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
| `tests/schema-inventory.test.ts` | maps every schema file to a code row and finds no problems | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/schema-inventory.test.ts` | runs a negative control for every detector code through findProblems | Every committed JSON Schema compiles in Ajv; the title UI contract and sitting 1–2 contracts are accepted and invalid variants fail. | Sittings 3–11 or a filled object catalog. |
| `tests/title.test.ts` | names the game Open Cutaway and offers Get across and Lights | The title names Open Cutaway and offers Get across and Lights. | Sittings 3–11 or Challenge. |
| `tests/widen-sitting-1.test.ts` | accepts the Get across sitting instance | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | uses real names for the through-line and keeps off-need out of tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a through-line hotspot that is missing from tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects an off-need hotspot placed in tab order | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects extra properties on the sitting | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects approachLiveGear values other than never (S3) | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a sitting with no second-miss hint | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects an empty prompt | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects an empty hotspot list | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects fewer than five hotspots even when every named object is present | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a through-line hotspot with an empty gloss | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a through-line hotspot with no gloss | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | rejects a hotspot with an extra property | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | asks to try again on the first miss and names the rung on the second | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | records a through-line find without a timer or lockout | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-1.test.ts` | turns off the through-line pulse when reduce-motion is requested | Widen sitting 1 validates, uses real names, and teaches miss/hint/find without a timer. | Sittings 3–11, Challenge, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | accepts the Lights sitting instance | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | uses real names for the through-line and keeps crossing objects quiet | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a through-line hotspot that is missing from tab order | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects an off-need hotspot placed in tab order | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects extra properties on the sitting | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a crossing object placed on the Lights through-line | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects approachLiveGear values other than never (S3) | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a sitting with no second-miss hint | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects an empty prompt | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects an empty hotspot list | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects fewer than five hotspots even with the whole through-line present | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a through-line hotspot with an empty gloss | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a through-line hotspot with no gloss | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | rejects a hotspot with an extra property | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/widen-sitting-2.test.ts` | keeps dam and cute substitute names out of the committed sitting | Widen sitting 2 validates, uses real names, and keeps crossing objects quiet. | Sittings 3–11, Challenge, the dam sitting, or the human copy gate. |
| `tests/workflow-graph.test.ts` | matches the workflow schema and stays build-time | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | requires a human gate before kid-facing copy can be committed | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |
| `tests/workflow-graph.test.ts` | uses file-path handoffs between named nodes | Example workflow is build-time, capped, and has a kid-facing human gate. | An executable runner. |

