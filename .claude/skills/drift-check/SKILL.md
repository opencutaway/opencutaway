---
name: drift-check
description: Run the comprehensive drift check — ownership, maps, lookup, and coverage — before calling any change finished or all green.
---

# Comprehensive drift check

**This document owns** the procedure: which tools, in what order, how to report, and what green does not mean.
**It does not own** live counts. Never freeze worked examples that go stale. Fill every cell from the run in front of you.

## Standing rule

Nobody — human or agent — may call a change finished, a build ready, or a check **all green** until owners, map, and blast-radius coverage are 100% of their populations (undeclared count 0, map identical to table, effect-map rows = executable tests, blast-radius controls all pass, six drift parts in lockstep).

`npm run check` passing is not sufficient on its own: it proves the gates that ran were happy; this procedure proves they still cover everything they claim to.

## Four failures that wear the same clothes

1. **Ownership drift** — a fact is stated in two files
2. **Map drift** — a generated map no longer matches what it maps
3. **Lookup drift** — the E11 lookup itself has broken
4. **Coverage drift** — a rule or gate has lost the thing that proved it while counts still add up

## Run from the repository root, in this order

```bash
node tools/file-map.mjs --check && node tools/file-map.mjs --self-test
node tools/blast-radius.mjs --self-test
node tools/effect-map.mjs --check && node tools/effect-map.mjs --self-test
node tools/code-map.mjs --check && node tools/code-map.mjs --self-test
node tools/feature-map.mjs --check && node tools/feature-map.mjs --self-test
node tools/tutorial-manifest.mjs --check && node tools/tutorial-manifest.mjs --self-test
node tools/check-lockstep.mjs && node tools/check-lockstep.mjs --self-test
node tools/check-schemas.mjs && node tools/check-schemas.mjs --self-test
node tools/check-governing.mjs && node tools/check-governing.mjs --self-test
node tools/check-gate-integrity.mjs && node tools/check-gate-integrity.mjs --self-test
node tools/pii-lint.mjs && node tools/pii-lint.mjs --self-test && node tools/pii-lint.mjs --ethos
node tools/check-floors.mjs
npm run check
```

Keep the numbers each command prints. They are the evidence. Playwright (G-e2e) is part of `npm run gauntlet`, not this cheap list.

## Report shape

Scannable table. Live numbers pasted from the run. Placeholders in this skill file, never "today" counts.

```
Drift check — <date>

| check | result |
|---|---|
| Owners (G-map) | <declared> declared, <facts> owned facts, <tracked> tracked, <n> problems · <n>/<n> controls |
| Code map | <n> rows, <n> problems |
| Feature map | <n> features, <n> problems |
| Tutorial manifest | <n> rows, <n> problems |
| Lockstep (six parts) | <n> parts, <n> problems (e2e specs + gate-baseline) |
| Map identical to table | yes / no |
| Blast radius (G-blast) | <n>/<n> controls |
| Effect map (G-effect) | <n> tests over <n> files, <n> problems |
| Schema inventory (G-schema) | <n> schemas, <n> problems |
| Governing (G-gov) | <n> files, <n> strays |
| Gate integrity (G-unit) | <n> problems over <n> files · <n>/<n> controls |
| PII / ethos | <n> problems |
| Floors | live vs baseline |
| npm run check | exit <n> |
| Playwright (G-e2e, gauntlet) | <n> specs · exit <n> |

Every cell is a placeholder on purpose.
```

Verdict in one line. If red: what drifted, which file owns the fact, and the fix. If green: still name what the check cannot see.

## What this check cannot see

- A stale paragraph in fresh words
- A fact family nobody has declared
- Whether a rule is the *right* rule
