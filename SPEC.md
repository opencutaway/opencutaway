# SPEC.md — Open Cutaway behaviour

**This document owns** behaviour of the infrastructure game: what Open Cutaway does, screens, copy the app shows, the shipped look (art and runtime), and the road ahead. Stubs are OK when a mode is not built yet.
**It does not own** how behaviour is proved.

Open Cutaway is a visual, text-rich game about how infrastructure works. Players aged 7–12, with a parent or other adult as co-player, learn street objects (name → function) and system chains (this path, not that one). It is not a phonics, CVC, or reading-aloud game.

## Who it is for

- Children 7–12 who can handle real systems and precise words
- Adults who co-play and also learn
- English v1

## Ethos the app must keep

Forever freeware. Progress stays on the device. Local sibling profiles only. No camera, no device location, no cloud accounts. Teach first; an optional life list later must never gate levels. Life list is not in the current scaffolding pass (`docs/level-spine.md`).

## Screens (v0)

| Feature ID | Screen | Status | What the player sees |
|---|---|---|---|
| FEAT-TITLE | Title | Placeholder playable | The name **Open Cutaway**, a short blurb, and **Get across** plus **Lights** controls that open widen sittings 1 and 2. Progress stays on this device. |
| FEAT-LEARN | Learn | Sittings 1–2 playable; copy gate open | **Get across** (widen sitting 1): through-line objects (traffic signal, crosswalk, crossing gates) are high contrast, named, and first in tab order. **Lights** (widen sitting 2): through-line objects (utility pole, overhead conductor, distribution transformer) are high contrast, named, and first in tab order. The busy block is at least 720 CSS px wide so every hotspot is a 44 px target that no other hotspot covers; on a narrower screen the block pans sideways inside its own frame and the page does not. Off-need objects stay quiet: lower contrast, dashed pattern, not in tab order. The player finds a through-line object, then reads the real name, a short gloss, and what it does. A wrong tap says try again; a second miss names the rung without giving the answer. After a second miss the adult can reveal the through-line names; show all names can be toggled at any time. Reduce-motion: no pulse. Sittings 3–11, chain-strips, plants, and the dam are not in this build. |
| FEAT-CHALLENGE | Challenge | Stub | Later: recall and path-choice without becoming a scavenger hunt. |
| FEAT-LIFE-LIST | Life list | Stub | Later: optional honor-system IRL finds. Must not unlock Learn or Challenge. |

Machine-checkable rows for those ids live in the generated feature map. This file owns the behaviour those rows describe.

Status words. *Playable* means the code, content, JSON Schema, and Playwright proof have landed in lockstep. The generated feature map's `shipped` status is that same lockstep label and nothing more. Kid-facing copy counts as shipped only after the human ROLE-EDITOR gate, tracked as `F-lessons` in `docs/open-faults.md`.

There is no playable hydrant lesson in this slice. There is no node-link graph explorer. There is no dam sitting.

## Shipped look (art and runtime freeze)

**Frozen:** isometric **16-bit SNES JRPG-inspired** placeholders (1990s isometric towns, readable props, limited palette) until a human artist replaces them. The client stays **2D and light** for **modest machines and iPads**: no WebGL, no heavy 3D engine, no huge textures. Touch-first; child-facing controls stay at least 44 CSS pixels (see `CLAUDE.md` S9).

Until commissioned art exists, sittings use **original SVG (or tiny PNG) placeholders** in that style. Placeholders are allowed now; real art later swaps in. No photoreal photos on the block. Do not copy SNES games, Scarry, Macaulay, or any copyrighted tiles or sprites.

Learn graphics also mix original cutaways/cross-sections, object portraits, and chain-strips.

Scenes should read at a glance as a busy town of everyday work: vehicles, shops, civic jobs, and overlapping activity. Warm and specific — this pipe, that worker's job — not an abstract systems diagram and not a talking-hydrant cartoon.

Inspiration for density of people-doing-jobs and for the 16-bit isometric tone is listed in `docs/inspiration.md`. Do not copy those books' or those games' characters, names, towns, tiles, art, or text.

## Object cards and chains

An object card teaches a real street or industrial object. It always carries `safety.approachLiveGear: never`. Drawings and allowed photos teach; the game never sends anyone toward live tracks, docks, substations, or live gear.

A chain is an ordered path (this pipe, not that one). How chains are numbered, which town they sit in, and which verbs appear on which rung live in `docs/level-spine.md`. That file is the freeze; this file still owns what a shipped screen does.

The First Twelve and other lists live in `docs/candidates.md` as unfrozen **nouns**. They are not this schema and not the numbered spine.

## Profiles

Multiple on-device sibling profiles. Never OAuth, email, or sync. Sample names in-repo are `Player A`, `Pat`, and `Jordan`. Real household names stay on the device.

## Cosmetics

Look files in `cosmetics/` are still a stub. The **rules** for hats, badges, and cards are frozen in `docs/level-spine.md`: one album, three shelves (objects, jobs, places); collectibles never open the next rung; no score or timer as the test.

## Road ahead (not this slice)

1. Human-gated object cards and chain-strips **following** `docs/level-spine.md` (do not invent a second curriculum)
2. On-device profile picker writing gitignored saves
3. Optional life list that cannot gate levels (not this pass)
4. An opt-in build-time workflow runner — never inside the child app
