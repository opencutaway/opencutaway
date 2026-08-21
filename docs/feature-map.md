# Feature map

GENERATED. Do not hand-edit. Source: `tools/feature-map.mjs`.

| action | command |
|---|---|
| regenerate | `node tools/feature-map.mjs` |
| check | `node tools/feature-map.mjs --check` |
| self-test | `node tools/feature-map.mjs --self-test` |
| gate | G-lockstep |
| fail | exit 1; JSON problem objects on stderr |
| artifact | `docs/feature-map.md` |

MUST:
- Keep a unique `id` on every row (`FEAT-…`).
- Status is `shipped` or `stub` only.
- Actors MUST include `child` and `adult`.
- `e2eSpecs` is a non-empty array of Playwright spec paths; every path MUST exist on disk.
- Shipped Learn sittings MUST list every sitting spec (Cross the Street and Lights).
- Name `entry`, `schemaIds`, and `tutorialIds`; G-lockstep reads those fields.
- Regenerate (`node tools/feature-map.mjs`) so this artifact byte-matches `generateMarkdown()`.

MUST NOT:
- Hand-edit this file.
- Ship a feature with an empty `e2eSpecs` array or a missing spec file.
- Point `e2eSpecs` at a one-off script instead of `e2e/specs/*.spec.ts`.
- Omit sitting 2 (`e2e/specs/widen-2-lights.spec.ts`) from shipped `FEAT-LEARN`.

Negative controls: `e2e-spec-missing-on-disk`, `missing-e2e-spec`, `untutoried-feature`, `missing-coplay-actor`, `bad-status`

**Does not own** how a mechanic is taught (Tutorial manifest) or gate commands (Gates). **Part:** Feature map.

## Cannot see

- That a stub feature is ready to ship.
- That kid-facing copy passed the human gate.

| id | name | status | actors | entry | e2eSpecs | schemaIds | tutorialIds | canDo |
|---|---|---|---|---|---|---|---|---|
| FEAT-TITLE | Title screen | shipped | child, adult | `src/app/App.tsx` | `e2e/specs/title.spec.ts` | `CODE-TITLE-SCREEN` | `TUT-TITLE-NAME` | See the game name and open Cross the Street or Lights (widen sittings 1 and 2). Progress stays on this device. |
| FEAT-LEARN | Learn | shipped | child, adult | `src/app/WidenSitting1.tsx` | `e2e/specs/widen-1-get-across.spec.ts`, `e2e/specs/widen-2-lights.spec.ts` | `CODE-OBJECT-CARD`, `CODE-SYSTEM-CHAIN`, `CODE-WIDEN-SITTING-1`, `CODE-WIDEN-SITTING-2` | `TUT-OBJECT-NAME-FUNCTION`, `TUT-CHAIN-PATH` | Widen sittings 1–2: find Cross the Street objects or Lights objects (pole, overhead conductor, distribution transformer) on the busy block; read the real name, a short gloss, and what it does. Sittings 3–11 are not in this build. |
| FEAT-CHALLENGE | Challenge | stub | child, adult | `SPEC.md` | `e2e/specs/modes-not-shipped.spec.ts` | `CODE-SYSTEM-CHAIN` | `TUT-CHAIN-PATH` | Later: recall and path-choice without becoming a scavenger hunt. |
| FEAT-LIFE-LIST | Life list | stub | child, adult | `SPEC.md` | `e2e/specs/modes-not-shipped.spec.ts` | — | `TUT-LIFE-LIST` | Later: optional honor-system IRL finds that must not unlock Learn or Challenge. |

