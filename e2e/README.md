# End-to-end tests

Player-facing Playwright specs. JSON Schema / Ajv stay in `schema/` and `tests/`. These files cover what children and grown-ups can actually do in the browser.

## Add a player-facing feature

Do not add a one-off script. In the same change:

1. Extend or add a page object under `e2e/pages/`.
2. Reuse `e2e/fixtures/player.ts` or extend that fixture.
3. Add or extend a spec under `e2e/specs/` with teaching, interaction, and regression steps.
4. Point the new feature row in `tools/feature-map.mjs` at that spec.
5. Add or extend JSON Schema + Ajv tests for any new content, config, save, or UI contract.

`npm run gauntlet` runs these specs against the production preview when `dist/` exists.
