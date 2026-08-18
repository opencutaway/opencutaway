# SPEC.md — Open Cutaway behaviour

**This document owns** behaviour of the infrastructure game: what Open Cutaway does, screens, copy the app shows, and the road ahead. Stubs are OK when a mode is not built yet.
**It does not own** how behaviour is proved.

Open Cutaway is a visual, text-rich game about how infrastructure works. Players aged 7–12, with a parent or other adult as co-player, learn street objects (name → function) and system chains (this path, not that one). It is not a phonics, CVC, or reading-aloud game.

## Who it is for

- Children 7–12 who can handle real systems and precise words
- Adults who co-play and also learn
- English v1

## Ethos the app must keep

Forever freeware. Progress stays on the device. Local sibling profiles only. No camera, no device location, no cloud accounts. Teach first; an optional life list later must never gate levels.

## Screens (v0)

| Feature ID | Screen | Status | What the player sees |
|---|---|---|---|
| FEAT-TITLE | Title | Placeholder shipped | The name **Open Cutaway** and a short blurb that lessons are not in this build. Progress would stay on this device. |
| FEAT-LEARN | Learn | Stub | Later: object cards and chain-strips. Name the object, say what it does, show how it sits in a path. |
| FEAT-CHALLENGE | Challenge | Stub | Later: recall and path-choice without becoming a scavenger hunt. |
| FEAT-LIFE-LIST | Life list | Stub | Later: optional honor-system IRL finds. Must not unlock Learn or Challenge. |

Machine-checkable rows for those ids live in the generated feature map. This file owns the behaviour those rows describe.

There is no playable hydrant lesson in this slice. There is no node-link graph explorer.

## Visual language

Learn graphics mix original cutaways/cross-sections, object portraits, and chain-strips.

Scenes should read at a glance as a busy cross-section of everyday work: vehicles, shops, civic jobs, and overlapping activity. Warm and specific — this pipe, that worker's job — not an abstract systems diagram and not a talking-hydrant cartoon.

Inspiration for that density of people-doing-jobs is listed in `docs/inspiration.md`. Do not copy those books' characters, names, towns, art, or text.

Child-facing controls must stay large enough to use (see `CLAUDE.md` S9).

## Object cards and chains

An object card teaches a real street or industrial object. It always carries `safety.approachLiveGear: never`. Drawings and allowed photos teach; the game never sends anyone toward live tracks, docks, substations, or live gear.

A chain is an ordered path (this pipe, not that one). Place-reading of a whole block can wait.

The First Twelve and other lists live in `docs/candidates.md` as unfrozen notes. They are not this schema and not this curriculum.

## Profiles

Multiple on-device sibling profiles. Never OAuth, email, or sync. Sample names in-repo are `Player A`, `Pat`, and `Jordan`. Real household names stay on the device.

## Cosmetics

Reward look (banners vs hats, Steam-like IRL rewards) is unfrozen. `cosmetics/` is a stub only.

## Road ahead (not this slice)

1. Human-gated object cards and chain-strips
2. On-device profile picker writing gitignored saves
3. Optional life list that cannot gate levels
4. An opt-in build-time workflow runner — never inside the child app
