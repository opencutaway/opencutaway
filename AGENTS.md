# Agent guide — Open Cutaway

You are working in the public game repository for **Open Cutaway**, a forever-freeware infrastructure-literacy game for ages 7–12 with adult co-play. Children are capable of real systems. Do not use baby talk, talking hydrants, or propaganda.

Collaboration records, ownership fields, and review notes MUST use role or context IDs (`ROLE-IMPLEMENTER`, `CTX-BOOTSTRAP`). Never personal names, usernames, or email addresses.

## Hard-stops

### 1. A1 — personal information never enters the repo

This is the first hard-stop. If it conflicts with any other task, privacy wins.

Before every commit, scrub legal names, emails, phones, home/work/school addresses, GPS, account IDs, identifiable photos, children’s names, real sibling profile names, user-folder paths, hostnames, API keys, `.env` files, and chat exports with personal facts.

- Copyright and README identify **Open Cutaway** / **opencutaway authors** only.
- Sample profiles use clearly fake names (`Player A`, `Pat`, `Jordan`).
- Device saves are gitignored. Never commit a household dump.
- Do not invent a real-looking email for git identity examples. See `docs/PRIVACY.md`.

If you find personal information already staged, remove it, rewrite the file, and do not commit until `npm test` is clean.

### 2. Product ethos

- Forever freeware, MIT for code, MIT-clean content (original writing; original human-traced SVG; US public-domain or CC0 photos with per-asset attribution). No NC licenses. No copying other books’ text, photos, drawings, chapter lists, or taxonomy.
- Offline first. No external ads, analytics, or monitoring.
- Local on-device profiles only. Never cloud, OAuth, email, or sync.
- No camera or geolocation APIs, permissions, or “stubs for later.”
- Do not add Next.js, SSR, Electron, Firebase, Supabase, Auth.js, LangChain, LangGraph, OpenAI SDKs, Sentry, Google Analytics, or Plausible.
- Do not put multi-agent graphs or model calls in `src/`. The shipped game is a normal offline Preact app.
- Teach-first; optional life-list later. Do not build scavenger-gated progression.
- Cosmetics (banners vs hats, Steam-like IRL rewards) are **unfrozen**. Keep the `cosmetics/` stub; do not ship a look.

### 3. Safety (even before lessons exist)

Never gamify approaching tracks, docks, substations, or live gear. Object cards must keep `safety.approachLiveGear` as `never`. Teach from drawings and allowed photos, not by sending children toward live equipment.

### 4. Scope of this slice

This run is conventions only. Do not fill twelve object lessons, freeze a First Twelve in schema, or treat `docs/candidates.md` as product data.

## Graph locus

Explicit multi-agent execution graphs are **build-time developer workflows** under `/workflows` (YAML/JSON). Individual models or tools are nodes; routing and file handoffs are edges. Parallel work, branching, and **capped** cycles are allowed there.

An executable runner (LangGraph or similar) is a later opt-in and must never ship inside the child-facing app.

For content work, follow `workflows/content-authoring.example.yaml` and `.cursor/rules/`. Kid-facing copy and images require a human gate. No unattended loops on child copy.

## Art ingest (later)

- Drawings: AI draft → human traces SVG. Prompt logs stay out of git. Commit SVG plus provenance.
- Photos in v0: US public domain or CC0 only, with a row in `docs/ATTRIBUTION.md`.
- Do not commit closed-model rasters as “original MIT art.”
- Learn-mode visuals (later): original cutaways, object portraits, and chain-strips. Not a node-link explorer. No cute anthropomorphic infrastructure.

## Profiles

Multiple on-device sibling profiles. Never cloud-shared. Life-list finds are honor-system later.

## Agent Collaboration and Review

Default workflow: **Implement → independent review → correct → verify → integrate**.

These user-approved rules are mandatory for every code-related change in this repository.

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
