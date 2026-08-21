# End-to-end tests

Player-facing Playwright specs. JSON Schema / Ajv stay in `schema/` and `tests/`. These files cover what children and grown-ups can actually do in the browser.

## Add a player-facing feature

Do not add a one-off script. In the same change:

1. Extend or add a page object under `e2e/pages/`.
2. Reuse `e2e/fixtures/player.ts` or extend that fixture.
3. Add or extend a spec under `e2e/specs/` with teaching, interaction, and regression steps.
4. Append every new spec path to that feature's `e2eSpecs` array in `tools/feature-map.mjs`. If the code-map row has `e2eSpecs`, the feature array MUST include those paths or G-lockstep fails (`feature-e2e-spec-missing`). Shipped Learn lists both `e2e/specs/widen-1-get-across.spec.ts` and `e2e/specs/widen-2-lights.spec.ts`.
5. Add or extend JSON Schema + Ajv tests for any new content, config, save, or UI contract.

`npm run gauntlet` runs these specs against the production preview when `dist/` exists.

Playable coverage now includes the title and widen sittings 1–2 (Cross the Street, Lights); shared steps live in `e2e/helpers/` (adult controls; hotspot reachability, keyboard order, and name legibility). Challenge and Life list stay stubbed in `modes-not-shipped.spec.ts`.
