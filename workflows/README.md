# Build-time workflows

Declarative execution graphs for Cursor and other developers. They are **not** part of the shipped game runtime. Do not import these files from `src/`. Do not add an agent runner, LangGraph, or model SDK to the Preact client.

Kid-facing copy and images require a human gate. Cycles are capped. Child copy must not loop unattended.

Widen sittings 1–2 (`content/sittings/widen-1-get-across.json`, `content/sittings/widen-2-lights.json`) use original short copy and an original SVG. They have **not** passed `kid-facing-copy-gate`. Do not treat those sittings as copy-complete until ROLE-EDITOR records a pass. Do not auto-approve the gate.

See `content-authoring.example.yaml` and `schema/workflow-graph.schema.json`.

Reusable prompt templates for visual production live in `prompts/`: `street-scene-generation.md` (geometry before style) and `street-geometry-review.md` (the separate plausibility review). They are templates, not logs; per-generation prompt text stays out of git under the `.gitignore` rules for `prompt-logs/`, `art-prompts/`, and `ai-drafts/`. The rules they apply are owned by `docs/art-bible.md`.
