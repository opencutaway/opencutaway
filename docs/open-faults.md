# Open faults

**This document owns** what is known wrong, missing, or undecided right now, with where it lives and what done means.
**It does not own** anything closed.

A fault that lives only in a chat log is a fault this project will lose.

| ID | Where | What's wrong | Done means |
|---|---|---|---|
| F-lessons | `src/`, `content/` | No playable object or chain lesson | First Learn cards exist and pass human copy gate |
| F-profiles | `src/` | On-device sibling profiles are schema-only | A local profile picker writes gitignored saves |
| F-cosmetics | `cosmetics/` | Reward look is unfrozen | Owner picks a look; stub remains until then |
| F-runner | `/workflows` | Declarative graphs only; no executable runner | Opt-in runner later, never inside the child PWA |
| F-prose | all OWNER docs | A stale paragraph in fresh words is invisible to the maps | Human read of governing docs at release |
| F-exclusion-review | `tests/registry.json` | Taxonomy exclusions still wait on ROLE-REVIEWER verification of this slice | Independent review record marks them verified |
