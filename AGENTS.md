# Agent guide — Open Cutaway

**This document owns** how agents work here: read-order, the dependency ask, the shape of a decision page, and collaboration.
**It does not own** the exact text of S-rules or E-rules. Do not paraphrase those rules. Point at `CLAUDE.md`.

You are working in the public game repository for **Open Cutaway**, a forever-freeware infrastructure-literacy game for ages 7–12 with adult co-play. Children are capable of real systems. Do not use baby talk, talking hydrants, or propaganda.

Collaboration records, ownership fields, and review notes MUST use role or context IDs (`ROLE-IMPLEMENTER`, `CTX-BOOTSTRAP`). Never personal names, usernames, or email addresses.

## Read order

1. `CLAUDE.md`
2. `SPEC.md`
3. `docs/settled.md`
4. `docs/open-faults.md`
5. `docs/testing-gauntlet.md`
6. generated `docs/file-map.md`
7. generated `docs/code-map.md`, `docs/feature-map.md`, `docs/tutorial-manifest.md`

Then the file you are about to change. Safety and engineering rules are in `CLAUDE.md` only.

## Six drift parts

Exact files, commands, MUST / MUST NOT, and fail codes live in `docs/testing-gauntlet.md`. Do not collapse the six parts. Older name file-map is Owners. Effect-map supports Gates; it is not a seventh named part. Do not paraphrase S/E rules; open `CLAUDE.md`. Gate integrity (no retry-to-green, no paper-over) is the Agent contract in that gauntlet; when blocked, use the decision page below.

| Part | Edit | Regenerate | Check |
|---|---|---|---|
| Owners | `tools/file-map.mjs` | `node tools/file-map.mjs` | `node tools/file-map.mjs --check` and `--self-test` |
| Code map | `tools/code-map.mjs` | `node tools/code-map.mjs` | `node tools/code-map.mjs --check` and `--self-test` |
| Feature map | `tools/feature-map.mjs` | `node tools/feature-map.mjs` | `node tools/feature-map.mjs --check` and `--self-test` |
| Tutorial manifest | `tools/tutorial-manifest.mjs` | `node tools/tutorial-manifest.mjs` | `node tools/tutorial-manifest.mjs --check` and `--self-test` |
| Blast radius | (lookup only) | none | `node tools/blast-radius.mjs --self-test` |
| Gates | `docs/testing-gauntlet.md` and `.claude/gate-baseline.json` | none | `node tools/check-lockstep.mjs` and `node tools/check-floors.mjs` |

All six at once: `npm run maps` then `node tools/check-lockstep.mjs`. Generated `docs/*.md` maps are outputs; hand edits are erased.

## Player-facing growth

When adding something a child or grown-up can do, in the same change:

- Extend JSON Schema and Ajv tests. Schema is the authority path. No ad-hoc parsers for content, config, saves, or UI contracts.
- Add or extend a Playwright page object, fixture, and spec (teaching, interaction, regression). Do not add a one-off script.
- List every Playwright spec on the feature `e2eSpecs` array. Shipped Learn MUST include `e2e/specs/widen-1-get-across.spec.ts` and `e2e/specs/widen-2-lights.spec.ts`.
- Update all six drift parts so G-lockstep stays green.

The finished-work rule for that slice lives in `CLAUDE.md`.

## Maps and lookups

Owners live in `tools/file-map.mjs`. `docs/file-map.md` is generated. Hand edits of that map are erased. New file: declare it in `FILE_ROWS` in the same commit that creates it.

Before an edit:

```
node tools/blast-radius.mjs --word TOKEN
```

Depends means: tracked files whose relative path or contents include the token as a case-insensitive substring; not an import graph, call graph, or git history. The lookup does not fail a build; its `--self-test` does, and that self-test runs in `npm run check`.

The effect map is generated. Do not write `docs/effect-map.md` by hand. The code map, feature map, and tutorial manifest are also generated. Do not write those markdown files by hand.

## Dependency ask

If a task needs a new npm package, a new governing document, or a new gate, stop and ask the owner. Do not add it quietly.

## Decision page

When the owner must choose, one question per screen, every option costed, one marked MY PICK, an Other box that outranks the buttons, numbers measured rather than recalled, copy-all at the end. Do not invent a decision page unless you are blocked. Do not execute a pick until the operator replies; silence is not approval.

## Child app

The shipped game is a normal offline Preact + Vite app. Do not put execution graphs in `src/`. Do not call network models from the child-facing client. Follow `/workflows` for content work. Kid-facing copy and images require a human gate.

## Privacy scrub (A1)

Personal information of the builder and families must never enter git. If privacy conflicts with architecture completeness, privacy wins. The scrub list and git-identity pattern live in `docs/PRIVACY.md`. Sample players are `Player A`, `Pat`, and `Jordan`. Device saves stay gitignored.

If you find personal information already staged, remove it and do not commit until the privacy lint is clean.

## Product reminders (not the rule text)

- Open Cutaway is infrastructure literacy, not a reading or phonics product.
- Cosmetics stay unfrozen; keep the stub folder.
- `docs/candidates.md` is notes, not schema.
- Teach-first; do not design scavenger-gated progression.
- Do not copy inspiration books (see `docs/inspiration.md`).

## Agent Collaboration and Review

These user-approved rules are mandatory for every code-related change in this repository.

Default workflow: **Implement → independent review → correct → verify → integrate**.

### Independent review

- Each candidate integrated revision MUST receive one independent review. This means one reviewer for the complete change set, not one reviewer per agent, file, commit, finding, or correction.
- The reviewer MUST be independent and MUST NOT have implemented the revision being reviewed.
- The reviewer MUST receive the applicable requirements, an exact immutable revision identifier, the changed files or diff, and the relevant test results.
- Review findings MUST identify the specific problem, supporting evidence, affected files, and exact revision reviewed.
- Findings MUST be returned to the implementation agent for correction.
- The same reviewer MUST verify corrections and record the verification result. Corrections within the same review cycle MUST NOT trigger additional independent reviewers.
- Integration MUST remain blocked until findings are corrected and reverified, or the user explicitly accepts the unresolved findings.
- A second specialist reviewer MAY be assigned only when the work is genuinely critical (security, privacy, safety, destructive or data-loss risk, licensing, or release integrity) or the first reviewer records a specific expertise gap. Record the reason.
- More than two independent reviewers MUST NOT be assigned without prior user approval.

Default reviewer count is 1. Maximum without user approval is 2.

This bootstrap is privacy-critical (A1). The assigned independent review MUST include a PII scrub, licensing check, telemetry/forbidden-client grep, and confirmation that no LLM SDK runs in the game client.

### Shared context and workspaces

- Agents MUST be given access to relevant work produced by other agents, including task records, files, diffs, commits, test results, reports, decisions, and unresolved questions.
- Cross-agent workspace access MUST be read-only by default.
- Multiple agents MUST NOT edit the same workspace or overlapping files concurrently.
- Agents that need to experiment independently MUST use separate branches or worktrees.
- Agents SHOULD communicate questions, findings, and requests directly to one another when the execution environment supports it.
- Important communication, decisions, evidence, and unresolved questions MUST be recorded in durable project files or task records, not only in chat history. Use role IDs, never personal names. Review records live under `docs/reviews/`.

### Task takeover

- When one agent takes over another agent's task, the handoff MUST preserve the current revision, completed work, test results, decisions, and unresolved problems.
- The receiving agent MUST review that handoff before continuing.

### Team model

Agents MUST work as a connected team rather than as isolated conversations.

### Conflicts

A genuine instruction conflict exists only when both instructions cannot be obeyed simultaneously; overlap alone is not a conflict. When instructions genuinely conflict, identify the exact conflict and ask the user to adjudicate instead of resolving it unilaterally.

When this file already contains a stricter rule, later Prompt Packages must merge without deleting or weakening that rule.
