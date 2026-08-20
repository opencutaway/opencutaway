# Tutorial manifest

GENERATED. Do not hand-edit. Source: `tools/tutorial-manifest.mjs`.

| action | command |
|---|---|
| regenerate | `node tools/tutorial-manifest.mjs` |
| check | `node tools/tutorial-manifest.mjs --check` |
| self-test | `node tools/tutorial-manifest.mjs --self-test` |
| gate | G-lockstep |
| fail | exit 1; JSON problem objects on stderr |
| artifact | `docs/tutorial-manifest.md` |

MUST:
- Keep a unique `id` on every row (`TUT-…`).
- `featureId` MUST be a `FEAT-…` id that exists on the Feature map.
- Status is `taught` or `deferred` only.
- `produces` and `consumes` are exact paths that exist on disk.
- Shipped features MUST have at least one tutorial with status `taught` (enforced by G-lockstep).
- Regenerate (`node tools/tutorial-manifest.mjs`) so this artifact byte-matches `generateMarkdown()`.

MUST NOT:
- Hand-edit this file.
- Point `featureId` at a string that does not start with `FEAT-`.
- Mark a mechanic `taught` when the teaching files are missing.
- Treat a deferred tutorial as proof the feature shipped.

Negative controls: `missing-feature`, `bad-status`, `missing-path`

**Does not own** what players can do (Feature map) or lesson copy (`SPEC.md`). **Part:** Tutorial manifest.

## Cannot see

- That kid-facing copy passed the human gate.
- That a deferred mechanic is ready to teach.

| id | mechanic | taughtBy | featureId | status | actors | produces | consumes |
|---|---|---|---|---|---|---|---|
| TUT-TITLE-NAME | The game names itself | Title heading and blurb on the title screen | FEAT-TITLE | taught | child, adult | `content/ui/title-screen.json`, `src/app/App.tsx` | `e2e/specs/title.spec.ts` |
| TUT-OBJECT-NAME-FUNCTION | Street object name to function | Widen sittings 1–2 (Get across, Lights) on the busy block | FEAT-LEARN | taught | child, adult | `content/sittings/widen-1-get-across.json`, `content/sittings/widen-2-lights.json`, `src/app/WidenSitting1.tsx` | `e2e/specs/widen-1-get-across.spec.ts`, `e2e/specs/widen-2-lights.spec.ts` |
| TUT-CHAIN-PATH | This path, not that one | Learn chain-strips and later Challenge (not shipped) | FEAT-LEARN | deferred | child, adult | `SPEC.md` | `e2e/specs/modes-not-shipped.spec.ts` |
| TUT-LIFE-LIST | Optional honor-system IRL finds that never gate levels | Life list (not shipped) | FEAT-LIFE-LIST | deferred | child, adult | `SPEC.md` | `e2e/specs/modes-not-shipped.spec.ts` |

