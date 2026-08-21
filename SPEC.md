# SPEC.md — Open Cutaway behaviour

**This document owns** behaviour of the infrastructure game: what Open Cutaway does, screens, copy the app shows, the runtime freeze (the look itself is owned by `docs/art-bible.md`), the deepen-rung interaction design, and the road ahead. Stubs are OK when a mode is not built yet.
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
| FEAT-TITLE | Title | Placeholder playable | The name **Open Cutaway**, a short blurb, and **Cross the Street** plus **Lights** controls that open widen sittings 1 and 2. Progress stays on this device. |
| FEAT-LEARN | Learn | Sittings 1–2 playable; copy gate open | **Cross the Street** (widen sitting 1): through-line objects (traffic signal, crosswalk, crossing gates) are high contrast, named, and first in tab order. **Lights** (widen sitting 2): through-line objects (utility pole, overhead conductor, distribution transformer) are high contrast, named, and first in tab order. The busy block is at least 720 CSS px wide so every hotspot is a 44 px target that no other hotspot covers; on a narrower screen the block pans sideways inside its own frame and the page does not. Off-need objects stay quiet: lower contrast, dashed pattern, not in tab order. The player finds a through-line object, then reads the real name, a short gloss, and what it does. A wrong tap says try again; a second miss names the rung without giving the answer. After a second miss the adult can reveal the through-line names; show all names can be toggled at any time. Reduce-motion: no pulse. Sittings 3–11, chain-strips, plants, and the dam are not in this build. Carrier-rung and facility-rung lessons (rungs 2 and 3 by default — `docs/level-spine.md`) follow the deepen-rung interaction model below, which is design only. |
| FEAT-CHALLENGE | Challenge | Stub | Later: recall and path-choice without becoming a scavenger hunt. |
| FEAT-LIFE-LIST | Life list | Stub | Later: optional honor-system IRL finds. Must not unlock Learn or Challenge. |

Machine-checkable rows for those ids live in the generated feature map. This file owns the behaviour those rows describe.

Status words. *Playable* means the code, content, JSON Schema, and Playwright proof have landed in lockstep. The generated feature map's `shipped` status is that same lockstep label and nothing more. Kid-facing copy counts as shipped only after the human ROLE-EDITOR gate, tracked as `F-lessons` in `docs/open-faults.md`.

There is no playable hydrant lesson in this slice. There is no node-link graph explorer. There is no dam sitting.

## Shipped look (pointer) and runtime freeze

The look — projection and grid, palette, pixel construction, materials, lighting, cutaway language, process colour coding, animation character and timing, production pipeline, originality guardrails — is owned by `docs/art-bible.md`, with its measured values in `content/art/tokens.json`. This file keeps only the runtime freeze.

**Runtime freeze.** The client stays **2D and light**: no WebGL, no heavy 3D engine, no huge textures. iPad landscape is the primary display; phones and desktops are supported, with the block fitting to width and panning sideways inside its own frame while the page never scrolls sideways. Touch-first; child-facing hit targets follow `CLAUDE.md` S9.

**Placeholder exemption.** The shipped SVG busy block is a placeholder drawn on the legacy grid until it is redrawn on the bible's grid; the exemption is named in `docs/open-faults.md` (`F-art-geometry-migration`), not silent. Until real art lands, sittings use original SVG (or tiny PNG) placeholders. No photoreal photos on the block.

Learn graphics mix original cutaways/cross-sections, object portraits, and chain-strips. Scenes read as a busy town of everyday work (density is owned by `docs/level-spine.md`), never a talking-hydrant cartoon or an abstract systems diagram. The books that inform the world and every do-not-copy line live in `docs/inspiration.md`.

## Object cards and chains

An object card teaches a real street or industrial object. It always carries `safety.approachLiveGear: never`. Drawings and allowed photos teach; the game never sends anyone toward live tracks, docks, substations, or live gear.

A chain is an ordered path (this pipe, not that one). How chains are numbered, which town they sit in, and which verbs appear on which rung live in `docs/level-spine.md`. That file is the freeze; this file still owns what a shipped screen does.

The First Twelve and other lists live in `docs/candidates.md` as unfrozen **nouns**. They are not this schema and not the numbered spine.

## Deepen rungs — interaction model (design; not built)

This section is design only. Nothing in it is built: no deepen rung, no hub, no inspection scene, no narration, no audio asset (`docs/open-faults.md`, `F-deepen-rungs-unbuilt`). Widen sittings 1–2 keep the find-the-object mechanic in the Screens table. Rung order, geography, verbs, and density stay owned by `docs/level-spine.md`; this section owns what a carrier-rung or facility-rung lesson screen does once one is built (rungs 2 and 3 by default; three rungs is the default, not a law — `docs/level-spine.md`). How each state looks — motion character, cutaway language, process colour coding, affordance cues — is owned by `docs/art-bible.md`; the numbers below are the behaviour contract a lesson must meet, written here so the art and the code agree. S3 holds throughout: cutaways teach the object, and no lesson sends anyone toward live tracks, docks, substations, or live gear.

Every number in this section — timings, scale percentages, type sizes, contrast ratios — is owned by `content/art/tokens.json` (explained in `docs/art-bible.md`) and quoted here so the design reads in one place; when the two differ, the tokens win and this text is corrected.

**Lesson rhythm (seven beats).** Recognize the object in a believable place. Select it with a tap and get immediate acknowledgement. Separate: the object lifts out of the scene as a solid model piece. Inspect one to three meaningful parts. Operate the mechanism or process. Connect: one short upstream or downstream link. Return: the scene reassembles and keeps a small completion mark. A lesson answers, in plain words, what enters the object, what happens inside, what leaves, which part moves, supports, senses, controls, contains, filters, or carries the load, what larger system it belongs to, and what an operator checks — causation before terminology, and never a long paragraph before the child understands one object.

**State model.**

| State | What the player sees |
|---|---|
| Overview idle | The object in its real setting, the highest-priority form on screen. Ambient motion is sparse. No permanent arrows, no floating labels, no text over the object. |
| Tap acknowledgement | Begins within 100 ms of touch: the object's local value rises, a soft contact pulse, a short material-appropriate sound, and unrelated ambient motion quiets. No selection effect lasts past 450 ms unless the transition has begun. |
| Physical separation | 300–450 ms (`timing.separationMs`). Background value and saturation drop, foreground obstructions withdraw, the object rises 6–12 logical px (`zoom.liftLogicalPx`) with its shadow separating beneath it, then moves into the inspection composition. A clean base, cut edge, or attachment points stay visible. |
| Inspection | The object fills 58–72% of the usable area. One to three component targets at a time. The background stays recognisable but subdued. Labels stay outside the functional geometry. Replay of narration and of the process is always available. |
| Process reveal | A solid, physical transformation: a surface layer slides aside, a casing opens, a cover lifts, a ground section withdraws, an assembly separates, an interior mechanism moves into view, the medium travels through aligned geometry. Never a transparent X-ray overlay. Every process has a visible beginning, a directional middle, a clear result, and a 500–900 ms completion pause; moving parts do not all start at once, and the process must read with narration muted. |
| System connection | Only after the local mechanism is understood: one short link — upstream source, downstream destination, controller or power source, supporting structural path, or the collection, treatment, transfer, or disposal step — lasting 2–6 s. A causal hint, not a network diagram. |
| Return | Reassemble in reverse causal order to the exact original pivot and orientation; restore saturation and ambient life; keep a small completion mark or a changed ordinary state; leave no temporary colour coding on the object. |

**Labels.** Overview: no permanent arrows, no floating labels, no text over the object; at most a one-time narrator cue. Inspection: one object title (1–4 words), one explanatory sentence, up to three component labels (1–3 words), thin leader lines that stay outside the object, and replay, process, and return controls. Movement before arrows: an arrow appears only when direction is still ambiguous after the animation, and it disappears when the animation ends.

**Text and contrast.** Captions run to 18 words at most and about 55 characters per line, one causal idea per sentence. Captions 19–22 CSS px, labels 17–20, button text 18–22. Contrast at least 4.5:1 for normal text and 3:1 for large text and essential graphical boundaries. Temporary colour is always paired with motion, pattern, shape, or narration — never colour alone, the same rule the widen sittings already keep. Hit targets follow `CLAUDE.md` S9.

**Narration and captions.** Narration explains causation: "Water passes through the grate, settles in the basin, and leaves through the outlet pipe." Never narration that only names the object or praises its importance. Every line of narration has a caption. Audio is never required to finish a lesson. Reduce-motion is honoured with fades, staged reveals, and sequential emphasis in place of movement.

**Sound layers.** A lesson may carry tap response, material contact, operating sound, process sound, ambient location sound, narration, and a nonverbal completion cue. During narration, ambient sound and non-essential animation drop; sounds that match the process being explained stay. All audio ships as bundled files inside the app and nothing is fetched at run time (`CLAUDE.md` S4). No audio asset exists yet; each one needs a licence row in `docs/ATTRIBUTION.md` before it lands.

**Navigation.** Two levels. A fixed isometric town hub is an orientation screen, not a simulation: it shows the town centre, a residential street, the bridge or river crossing, the railway and intermodal district, the water and wastewater sites, and the roads out toward the hydroelectric facility (the dam, upriver) and the municipal waste facility (the spine's trash campus — transfer station and MRF, never a landfill visit). Far sites sit at the facility rung as `docs/level-spine.md` places them (three rungs is the default, not a law); every hub location is a scene on one of the spine's eleven needs (the bridge and the intermodal district are carrier-rung scenes of Cross the Street and Goods; `docs/settled.md`, Q-art-subjects-2026-08-21). Only available locations get a strong tap affordance. Tapping a location opens a precomposed lesson scene: no free pan, no camera rotation, no town-scale tap targets. After a far trip the player returns to the block, as the spine requires. Nothing on the hub or in a lesson is a quest to visit a real site.

## Profiles

Multiple on-device sibling profiles. Never OAuth, email, or sync. Sample names in-repo are `Player A`, `Pat`, and `Jordan`. Real household names stay on the device.

## Cosmetics

Look files in `cosmetics/` are still a stub. The **rules** for hats, badges, and cards are frozen in `docs/level-spine.md`: one album, three shelves (objects, jobs, places); collectibles never open the next rung; no score or timer as the test.

## Road ahead (not this slice)

1. Human-gated object cards and chain-strips **following** `docs/level-spine.md` (do not invent a second curriculum)
2. On-device profile picker writing gitignored saves
3. Optional life list that cannot gate levels (not this pass)
4. An opt-in build-time workflow runner — never inside the child app
