# Art bible

**This document owns** how Open Cutaway looks and how its visuals are produced: the look, projection and canvas, composition, pixel construction and edge language, colour, value, lighting and process colour coding, materials and weathering, street geometry and traffic-control plausibility, object scale and touch affordance as drawn, cutaway language, animation character and timing, location continuity, the asset pipeline (layers, states, naming, deliverables, production gates), AI-assisted concept rules, originality guardrails, acceptance tests, and the style-drift review.
**It does not own** screen behaviour and interaction states (`SPEC.md`), curriculum order, rungs, or drawn density (`docs/level-spine.md`), the do-not-copy sources (`docs/inspiration.md`), the S- and E-rules (`CLAUDE.md`), or the machine-readable values (`content/art/tokens.json`, which this document explains and the gate checks).

The game is a warm, carefully composed municipal diorama: ordered civic geography, layered isometric depth, and modern retro-pixel colour with rich materials and restrained motion. Its art is original 2D illustration with deliberate pixel construction and a remembered retro-era character. No named commercial work appears in this document or in any prompt, filename, or credit; the intended qualities are defined below as measurable rules.

Units: art is authored in logical art pixels (logical px) on the canvas of §Projection. Touch, type, and interface measurements are CSS pixels (CSS px); in this web client one point of the source specification equals one CSS px.

Screen behaviour, interaction states, labels, audio, and navigation are owned by `SPEC.md` (deepen-rung interaction model). This document keeps what is art: motion character, timing, cutaway language, process colour, and affordance cues.

## Design lock

These decisions hold unless the owner deliberately revises this document.

| Area | Locked decision |
|---|---|
| Display | iPad landscape is primary; phones and desktops are supported. Narrower screens fit the block to width and pan it inside its own frame; the page never scrolls sideways. The grid below is the grid for real art on every supported device. |
| Camera | Fixed authored scenes. No free camera, no rotation, no perspective. Pan on a narrow screen is a viewport fit, not a camera the child steers. |
| Selection | The child taps a principal object or a large invisible hit region. |
| Zoom | A tap moves into a separately authored inspection composition, never a freely controlled close-up. |
| Projection | One consistent 2:1 dimetric isometric angle throughout. |
| Rendering | Original 2D illustration. No real-time 3D, and no 3D render passed through a pixel filter as final art. |
| Art character | Clean modern illustration with deliberate pixel construction and a remembered retro-era character. |
| Palette | Broad modern palette, realistic material colours, temporary instructional highlights. |
| Outlines | Forms separate through value, colour temperature, material, and shadow. No uniform black contour. |
| Object proportions | Technically credible, enlarged only where recognition or touch requires it. |
| Hidden systems | Removable surface layers, cutaways, separated parts, sectional bases, and process animation. No transparent X-ray overlay. |
| World condition | Tidy, functional, lived-in municipality with ordinary weathering and no structural distress. |
| Lighting | One stable daytime condition. No weather or time-of-day variants. |
| Ambient motion | Present but subordinate; hidden processes receive the strongest motion. |
| Production | Precise enough for several artists and AI-assisted concept generation to produce one look. |
| Audience, scope, density | Ages 7–12 (`SPEC.md`). Which objects, in which order, on which rung, and how many jobs are drawn in one view: `docs/level-spine.md`. |

## Five-second test

Within five seconds of seeing a scene a child should be able to tell:

1. what the principal infrastructure object is;
2. where it belongs in the municipality;
3. that it can be tapped;
4. which part is currently important;
5. whether the scene shows ordinary operation or an instructional process.

A scene that fails this test loses secondary detail before it gains labels.

## Three priorities and their weights

The weights are review weights for judging a scene, not mixing ratios for drawing one.

| Priority | Weight | Production meaning | Failure condition |
|---|---|---|---|
| A. Municipal systems legibility | 30% | Ordered geography, instantly readable infrastructure, clear roads and lots, strong silhouettes, visible functional relationships | A reviewer can describe the mood but cannot say what the object does or where material, force, people, vehicles, water, or information moves |
| B. Hand-composed isometric depth | 20% | Foreground, middle-ground, and background staging; elevation changes; deliberate overlap; scenes that read as authored, not tiled | The scene reads as a flat diagram, a repeated tile field, or a random pile of isometric assets |
| C. Modern retro-pixel atmosphere | 50% | Broad colour, expressive materials, selective pixel clustering, local light, subtle wear, restrained environmental animation | The result looks like vector art with a pixel filter, a low-resolution 3D render, noisy nostalgia, or a dark decayed world that competes with the lesson |

### A. Legibility rules

- One permanent isometric orientation for the whole game.
- Roads, curbs, walls, pipes, rails, and structural edges align to the grid unless the real object is curved or irregular.
- The object sits where a child would normally meet it.
- The principal silhouette is recognisable at 256 × 192.
- Each scene has one unmistakable subject; other infrastructure stays present but quiet.
- Functional geometry is preserved: supports support, pipes connect, gates have pivots, signals face traffic, water follows gravity or pressure, load paths end at foundations.
- No decorative element implies a false function.
- Route connections stay visible through spacing, alignment, or process animation, never permanent arrows.
- Municipal conventions repeat consistently: curb height, lane width, railing scale, cabinet proportions, pipe-wall thickness, bolt scale, hazard marking.

### B. Depth rules

- Each scene is composed as a diorama, not an unrestricted tile map.
- Three depth bands (§Composition and visual hierarchy).
- Mild asymmetry and local irregularity are permitted so the town reads as built over time.
- Elevation changes, retaining walls, stairs, bridge decks, channels, embankments, platforms, and roofs make depth legible.
- Foreground objects may cross the scene boundary but never hide a required tap target.
- An identical decorative tile never repeats more than twice in a directly adjacent run without modification.
- Contrast, saturation, texture frequency, and animation all fall with distance.
- The densest detail belongs to the principal object and its immediate sectional base.

### C. Atmosphere rules

- Work in logical art pixels with a broad modern palette.
- Surfaces are built from intentional clusters, never automatic noise.
- Major materials use four to seven value steps; small secondary materials use two to four.
- Grid-aligned forms keep crisp stepped edges; anti-aliasing is selective and only where a curve materially benefits.
- Machinery and civic objects carry small signs of ordinary use: faded paint, clean grime, minor fastener rust, polished handles, damp curb edges, gathered leaves.
- Local lights and saturated accents stay small; they mark function and focus and never recolour the scene.
- Only elements that communicate operation, occupancy, or environmental cause are animated.
- No historical hardware palette, sprite limit, or screen resolution is imitated exactly.

## Projection, canvas, and safe region

### Projection

| Property | Value |
|---|---|
| Type | 2:1 dimetric isometric |
| Ground diamond | 64 × 32 logical px |
| Horizontal axes | 26.565° above and below horizontal |
| Elevation unit | 16 logical px |
| Half elevation unit | 8 logical px |
| Perspective, rotation, mirrored scenes | None |
| Visible vertical faces | Point toward lower-left and lower-right |
| Key light | Upper-left |
| Height and distance | Higher or more distant parts of the town generally sit toward the top of the frame |

### Canvas and export

| Property | Value |
|---|---|
| Logical canvas | 1024 × 768 logical px |
| Standard export | Scale 2 (2048 × 1536), integer scaling |
| Permitted export | Scale 3 where a device profile requires it |
| Scaling method | Nearest-neighbour for environmental art |
| Interface | Typography, controls, and focus indicators render natively at device resolution, separate from the pixel art |
| After approval | No environmental layer is rescaled by a non-integer amount |

This keeps the art crisp on high-density displays without pretending to be bound by historical hardware.

### Safe region

All required instructional content stays inside x = 112–912 and y = 72–696 logical px. The outer margins are extendable scenery: they may be cropped, expanded, or simplified for a device, and they never carry required controls, labels, component taps, process endpoints, or necessary causal information. On a narrow screen the fit-width pan keeps the safe region reachable; the margins are what a pan reveals or hides.

## Object scale and fixed-scene zoom

### Principal-object scale

| Scale | Principal object or coupled assembly occupies |
|---|---|
| Overview | 28–42% of frame width, or 24–38% of frame area including its immediate base |
| Inspection | 58–72% of usable scene area; never more than 78%, so labels and controls keep room |

A quiet buffer of at least 10% of the object's displayed width surrounds it; 15% when the object has several tappable components.

### Controlled enlargement

Realistic relationships come first; enlargement follows only for touch and comprehension.

| Element | Enlargement over strict environmental scale |
|---|---|
| Principal object | 125–160% |
| Small interactive component | 140–200% |
| Gap between neighbouring tappable parts | +10–30% |
| Pipe or flow path during animation | +15–35% visual width |
| Cutaway wall thickness | Simplified until readable |

Enlargement never changes a function, suggests a false connection, or makes a dangerous condition look normal.

### Fixed-scene zoom

A tap does not move a camera; it changes to a separately authored composition.

| Property | Value |
|---|---|
| Transition | 350–500 ms |
| Object translation | At most 25% of frame width |
| Apparent scale increase | 1.4–2.2× |
| Background value | −8 to −12 points |
| Background saturation | −20 to −35% |
| Depth-of-field blur | Not required |
| Orientation and lighting | Preserved throughout |

## Composition and visual hierarchy

### Three depth bands

| Band | Purpose | Rules |
|---|---|---|
| Foreground frame | Establish depth and location | Curb edges, low foliage, railings, a roof corner, shoreline stones, a platform edge. Low contrast. Withdraws, fades, or slides aside if it overlaps the inspection object. At most 18% of the frame. |
| Instructional middle ground | Hold the principal object and its functional context | Strongest value separation and most precise texture. All required tap targets. Start and result of the local process animation. Carries 60–75% of the scene's high-contrast edges. |
| Background context | Explain where the object belongs | Lower contrast, lower saturation, fewer texture clusters, slower motion. No text the lesson needs. May hold a connected object that briefly wakes during the system-link step. |

### Priority budget

Every element in a scene is classified.

| Priority | Quantity | Treatment |
|---|---|---|
| P1 principal object | 1 | Highest contrast, clearest silhouette, richest controlled detail |
| P2 functional context | 1–3 groups | Medium contrast; enough detail to explain placement and connection |
| P3 environmental life | ranked, not counted — `docs/level-spine.md` | Lower contrast and saturation; sparse animation |
| P4 decorative texture | Variable | Low contrast; removable without harming comprehension |

No P2, P3, or P4 element uses a larger saturated colour patch than the P1 object unless the lesson specifically needs it. Drawn population (how many jobs, vehicles, and shops appear in one view) is the occupational-density rule of `docs/level-spine.md`; this budget ranks what is drawn, it does not count it.

### Occlusion rule

At overview scale, decorative occlusion covers at most 8% of the principal object's silhouette, and never:

- the initial tap region;
- a component named in narration;
- the entry or exit point of a demonstrated flow;
- a safety-critical feature;
- the final result of the animation.

At inspection scale, required components are fully visible or individually brought forward.

### Thumbnail, blur, and grayscale tests

A scene is approved only when:

- at 256 × 192 the principal object remains identifiable;
- after a mild blur equivalent to 4 logical px the main silhouette remains distinct;
- in grayscale the selected object remains separable from its immediate background;
- at least 4 of 5 reviewers name the subject within five seconds without being told.

## Pixel construction and edge language

### Pixel character

- One logical px becomes a 2 × 2 block in the standard export.
- Single logical px are reserved for fine wires, indicator highlights, and small animation accents.
- Material texture uses clusters of 2–4 logical px.
- Environmental layers are never positioned at sub-pixel offsets.
- Interface vectors, text, and focus indicators stay out of the pixel art.

### Edge hierarchy

Forms separate using, in this order:

1. value change;
2. colour-temperature change;
3. cast or contact shadow;
4. material texture change;
5. reflected-light band;
6. short dark edge accent.

A dark edge accent is normally 1 logical px thick and covers at most 30% of a major object's perimeter. An object is never surrounded by a uniform black line.

### Cluster rules

- A cluster describes plane, material, wear, or light direction.
- No random single-pixel noise on large surfaces.
- No blanket dithering over a whole object; dithering bridges two values only across a transition zone at most 6 logical px wide.
- Repeated texture stamps vary in rotation, spacing, or local value.
- Hard diagonal grid edges use a stable step pattern; the step rhythm never alternates unpredictably.

### Curve treatment

Curved pipes, wheels, arches, and turbine housings may use selective anti-aliasing: at most 1 logical px beyond the hard silhouette, with the anti-alias colour sampled between object and background values, no global smoothing filter, and a recheck after integer export scaling.

## Colour, value, and lighting

### Palette anchors

The palette is broad and modern, organised into material ramps. The anchors below are the ramp references; the checked values are `palette` in `content/art/tokens.json`.

| Anchor | Hex |
|---|---|
| deep-structural-shadow | `#252B35` |
| cool-shadow | `#354253` |
| asphalt | `#4B5963` |
| dark-steel | `#56656B` |
| galvanized-steel | `#87979A` |
| warm-concrete | `#AAA594` |
| pale-concrete | `#CAC5B3` |
| weathered-wood | `#8B654B` |
| rust-accent | `#A65D3D` |
| soil | `#7D654E` |
| vegetation | `#65875B` |
| deep-vegetation | `#405F49` |
| water | `#438EA1` |
| deep-water | `#315F77` |
| safety-yellow | `#E4B94E` |
| signal-amber | `#E69A3B` |
| signal-red | `#D65352` |
| signal-green | `#4BA16B` |
| instructional-cyan | `#6CCED0` |
| electrical-violet | `#8A7ED6` |
| selection-gold | `#F5D26A` |
| warm-light | `#F0C685` |
| soft-highlight | `#EDE8DA` |

Each major material ramp has one deep shadow, one contact or seam value, one base, one light-plane value, one highlight, and up to two weathering or reflected-light accents: four to seven steps in all.

### Interface palette

The interface is drawn natively, outside the pixel art, with its own small palette. The through-line, quiet, and found treatments below are look; what they mean and when they apply is `SPEC.md` and `docs/level-spine.md`.

| Role | Hex | Note |
|---|---|---|
| Page background | `#f4f1ea` | |
| Ink | `#12202a` | Body text and through-line outline |
| Focus ring | `#b8770a` | 4 CSS px, on hotspots; selection-gold darkened to hold 3:1 against the page background |
| Control focus ring | `#1e6e8a` | 3 CSS px, on buttons and links |
| Quiet outline | `#8f8678` | Dashed, for off-need objects |
| Found outline | `#2e7d4f` | |
| Block border | `#1a1424` | Frame around the busy block |
| Block background | `#3e6e92` | Ground behind the busy block |
| Quiet name ink | `#5e574d` | Text of a shown off-need name |
| Quiet name background | `#d9d3c8` | Plate behind a shown off-need name |
| Card background | `#fffdf8` | Object card |

### Saturation hierarchy

| Element | Saturation (principal = 100) |
|---|---|
| Principal object | 100 |
| Immediate context | 75–90 |
| Background | 55–75 |
| Inspection background | 45–65 |
| Temporary process highlight | Up to 115, confined to the active path or part |

Saturation is never uniform: large concrete and asphalt surfaces stay quieter than painted equipment, water, vegetation, or safety markings.

### Lighting

One stable daytime setup.

| Property | Value |
|---|---|
| Key light | Upper-left, mildly warm |
| Ambient fill | Cool and soft |
| Cast shadows | Clear enough to explain height, never dramatic |
| Variants | None: no sunset, night, fog, rain, or weather |
| Local equipment lights | May glow locally without shifting the scene's overall colour |
| Contact shadow | 1–3 logical px |
| Small object cast shadow | 4–12 logical px |
| Large structure cast shadow | Proportional, never dark enough to hide road markings or components |
| Darkest value | Reserved for deep gaps, enclosed interiors, and critical separation |

### Type and contrast as drawn

Interface type renders natively: captions 19–22 CSS px, labels 17–20 CSS px, button text 18–22 CSS px. Normal text holds at least 4.5:1 contrast; large text and essential graphical boundaries hold at least 3:1. Label space is sized for a 1–4 word title, 1–3 word component labels, and a caption of at most 18 words at roughly 55 characters per line; the word limits themselves, captions for narration, and the rule that audio is never required belong to `SPEC.md`. Temporary colour is always paired with motion, pattern, shape, or narration, and reduced motion is served by fades, staged reveals, and sequential emphasis rather than by dropping the information.

## Process colour coding

Temporary instructional colour is always paired with motion or pattern. It appears only during a demonstration and disappears when the demonstration ends; it is never baked into environmental art and never the only carrier of meaning.

| Process | Colour family | Anchor | Motion or pattern | Typical use |
|---|---|---|---|---|
| Water or liquid | Cyan-blue | instructional-cyan | Continuous band, droplets, or directional ripples | Pipes, drains, channels, turbines |
| Electricity | Violet | electrical-violet | Discrete pulsing dots or segmented glow | Generator, cable, control cabinet |
| Mechanical load or force | Amber-gold | signal-amber | Sequential compression or transfer pulse | Bridge deck, cables, girders, foundations |
| Data or control signal | Pale neutral | soft-highlight | Dashed pulse or brief node-to-node flash | Detector, controller, signal head |
| Vehicle or pedestrian path | Muted warm white | warm-light | Moving footprints, wheel trace, or short path emphasis | Crossings, intermodal transfer |

## Materials and controlled weathering

The municipality is maintained and working. Weathering proves that people use the world; it never implies failure.

| Material | Base | Detail | Wear permitted | Never |
|---|---|---|---|---|
| Asphalt | Cool grey | Sparse aggregate clusters of 2–5 logical px; slightly darker gutter and tyre-polished zones | Restrained patching; lane paint lightly faded but readable | Major potholes or structural cracking |
| Concrete | Warm grey with large quiet planes | Occasional aggregate or formwork suggestion; darker damp contact at soil or water | Tiny edge chips | Deep cracks, exposed reinforcing steel, unsafe spalling |
| Structural steel | Cool value ramp | Narrow directional highlights; seams, plates, bolts, and bearings clearly separated | Rust at fasteners, joints, drainage points, or scratches | Heavy flaking corrosion |
| Galvanized metal | Pale cool grey | Subtle mottled variation; low-saturation highlights; crisp folds and fasteners | Mottling only | Mirror reflection |
| Painted equipment | Clean local colour | Stronger saturation at parts the child must notice | Mild fading on upper planes; polished wear at handles, buttons, access edges | Illegible pseudo-text or invented warning labels |
| Water | Broad readable masses | Sparse bright edge pixels; depth through value and bottom visibility | Direction shown by movement, not dense sparkle | Process animation that decorates without explaining hydraulics |
| Vegetation | Compact clusters, muted greens in the background | Movement concentrated at scene edges | Plants soften infrastructure | Plants that hide infrastructure; an overgrown or abandoned look |

## Street geometry and traffic-control plausibility

These rules bind every scene that contains a street, intersection, sidewalk, crosswalk, traffic signal, pedestrian signal, lane marking, curb ramp, or vehicle. They exist because generated street imagery is often attractive and physically wrong at the same time.

### Core production rule

Transportation markings and controls are semantic infrastructure, not decorative art. Every road edge, lane, sidewalk, curb ramp, crosswalk, stop line, signal head, vehicle path, and pedestrian path belongs to one traceable, internally consistent street topology. When an image is visually appealing but its street geometry is implausible, the geometry governs and the artwork is corrected.

### Priority order inside street scenes

When visual richness conflicts with traffic plausibility in a street scene, this order holds:

1. street topology and physical plausibility;
2. educational clarity;
3. touch readability;
4. object silhouette and composition;
5. process animation;
6. colour and lighting;
7. decorative environmental detail.

Inside a street scene this order governs; outside streets the Final production rule governs. The two orders differ (the street order ranks composition above process animation and adds educational clarity), but both start in the same place because topology is a street's physical function.

### Generation policy

| Rule | Requirement |
|---|---|
| Layout first | For any important street scene, a structural layout is drawn or generated before any art. It defines only road edges, lane arrangement, sidewalks, curb corners, curb ramps, crosswalks, stop lines, signal-pole locations, and vehicle travel paths. The art pass then preserves that geometry exactly while adding materials, lighting, buildings, vegetation, and atmosphere. |
| Deterministic street assets | Road modules, curbs and sidewalks, curb ramps, crosswalks, stop lines, lane markings, signal poles and signal heads, pedestrian signals, catch basins, manholes, and lane-path overlays or masks are controlled, reusable assets wherever possible. Generation may roam more freely over building facades, plantings, pavement texture, subtle weathering, background props, lighting, and nonessential ambient detail. |
| Fix locally, not globally | A compositionally strong scene with a geometry error is repaired by editing or inpainting only the affected region. The whole scene is regenerated only when the topology itself is fundamentally wrong. |

### Hard requirements

These apply to every conventional intersection scene unless a lesson explicitly requires another layout.

**Intersection form**

- Exactly one conventional four-leg intersection unless otherwise specified.
- Two straight roads cross at 90 degrees.
- Road widths stay constant before, through, and after the intersection.
- Each road has one lane in each direction unless otherwise specified.
- Right-hand driving unless a scene explicitly states otherwise.
- No extra branches, slip lanes, medians, diagonal roads, or unusual geometry unless the lesson requires them.

**Road markings**

- Yellow lines separate opposing directions of travel.
- White markings are used for stop lines, crosswalks, and same-direction lane guidance.
- Every signalised vehicle approach has a stop line.
- Each stop line is parallel to its crosswalk.
- Each stop line sits before its crosswalk from the approaching driver's perspective.
- No lane marking bends, terminates randomly, crosses onto a sidewalk, or implies an impossible travel path.

**Sidewalks and curb ramps**

- Four continuous sidewalks define four clear street corners.
- Every corner has a readable curb condition.
- Every crosswalk begins at one curb ramp and ends at the directly opposite curb ramp.
- Curb ramps face the crosswalk they serve.
- No curb ramp points into traffic or toward the middle of the intersection without a crosswalk.

**Crosswalks**

- Crosswalks are straight and rectangular.
- Each crosswalk crosses one road approach only.
- Each crosswalk connects one curb edge to the directly opposite curb edge.
- Crosswalks never bend, branch, merge, overlap, wrap around corners, or form L, T, or zig-zag shapes.
- No crosswalk terminates in the roadway.
- In an establishing image, no vehicle overlaps a crosswalk.

**Traffic signals**

- Signal poles stand behind the curb or in a valid roadside mounting position.
- Signal poles never stand in an active traffic lane or in the middle of the carriageway.
- Each signal head faces the traffic approach it controls.
- Distinct approaches have logically placed signal indications.
- A standard signal head never displays red, amber, and green at once.
- Vehicle and pedestrian indications never contradict one another.

**Vehicles**

- Vehicles stay fully inside valid travel lanes.
- Vehicles never overlap crosswalks, sidewalks, curbs, poles, or other vehicles.
- A stopped vehicle stays behind the stop line.
- A moving vehicle has a readable, unobstructed lane path.
- No ambiguous turning position unless the turn itself is the subject of the scene.

The cap of at most two vehicles applies to generated establishing images of street and signal lessons, where few vehicles keep the topology legible. Everywhere else, drawn population follows the occupational-density rule of `docs/level-spine.md`, and the ambient animation budget (§Animation character and timing) counts motion only, not how many vehicles are drawn.

### Human-normality rule

Every street scene looks immediately normal to an ordinary observer. Without confusion, a viewer can:

1. trace every lane continuously through the scene;
2. identify where each vehicle would go;
3. trace every sidewalk continuously around each corner;
4. trace every crosswalk from one curb ramp to its opposite curb ramp;
5. understand which signal controls which traffic movement;
6. understand where a pedestrian would wait and where they would cross.

If a typical person would pause and think that this is not how a normal street works, the asset fails.

### Reduced composition for signal lessons

A lesson about a traffic signal or pedestrian signal prefers a reduced composition over a full busy intersection: one foreground corner; one principal signal pole; one clearly visible crosswalk; one readable curb-ramp pair; one stop line; one subordinate vehicle; one subordinate pedestrian waiting zone; and only as much of the opposite side as explains the system. Fewer elements mean fewer ways to be wrong while the object stays recognisable.

### Prompting rule: geometry before style

In any prompt to an image generator, the street-geometry constraints come before the style instructions. The model is told first what the street physically is, how it functions, where traffic and pedestrian controls stand, and what must not be violated; only then does the prompt specify isometric style, colour, texture, lighting, environmental richness, and atmospheric detail. The reusable geometry, visual-treatment, and negative-constraint blocks live in `workflows/prompts/street-scene-generation.md`; they are not reproduced here, and prompt text as used on a real asset never enters git (§Provenance record).

### Plausibility review

Every generated street image passes a separate review pass, by a different agent or reviewer than the one that produced it, that judges only physical plausibility and traffic-control logic. The reviewer ignores attractiveness, atmosphere, colour quality, mood, and artistic originality, and inspects twelve items:

1. road continuity;
2. lane continuity;
3. vehicle placement;
4. sidewalk continuity;
5. curb-ramp placement;
6. crosswalk geometry;
7. stop-line placement;
8. signal-pole placement;
9. signal-head orientation;
10. consistency of signal indications;
11. consistency of lane-marking semantics;
12. any impossible or abnormal object placement.

Any failure fails the scene. The reviewer prompt and its return format live in `workflows/prompts/street-geometry-review.md`.

### Street acceptance checklist

The reviewer fills every row; one FAIL rejects the scene.

| # | Check | PASS / FAIL | Location of problem | Smallest correction |
|---|---|---|---|---|
| 1 | Road edges are continuous and plausible | | | |
| 2 | Lane directions are internally consistent | | | |
| 3 | Vehicles are fully within valid lanes | | | |
| 4 | Sidewalks are continuous around all corners | | | |
| 5 | Every curb ramp faces the crosswalk it serves | | | |
| 6 | Every crosswalk is straight, rectangular, and curb-to-curb | | | |
| 7 | No crosswalk bends, branches, merges, or terminates in the road | | | |
| 8 | Stop lines are present and correctly placed | | | |
| 9 | Signal poles stand outside active traffic lanes | | | |
| 10 | Signal heads face the traffic they control | | | |
| 11 | Visible signal indications are logically consistent | | | |
| 12 | No vehicle occupies a crosswalk in the establishing image | | | |
| 13 | A human observer would regard the scene as a normal street | | | |
| 14 | The principal instructional object remains visually dominant | | | |
| 15 | Decorative detail does not obscure transportation function | | | |

### Failure modes

A new failure mode seen in review is added, in the same change, to the negative-constraint list in `workflows/prompts/street-scene-generation.md` and to the hard requirements of this section. A failure that lives only in a review record will recur.

A street scene succeeds only when it is first legible as a real, coherent, ordinary street, and only then as beautiful artwork.

## Touch affordance as drawn

### Touch regions

The minimum hit target for any child-facing control is the number in `CLAUDE.md` S9. On top of that floor:

| Property | Value |
|---|---|
| Preferred primary target | 56 × 56 CSS px or larger |
| Child-facing controls | Normally 48–64 CSS px high |
| Adjacent interactive regions | At least 8 CSS px apart where practical |
| Invisible padding | May extend beyond the visible sprite |
| Parts too small to hit | Tap the parent object first; larger component targets appear in inspection |

### Tap affordance

An object shows it can be tapped with one or two restrained cues:

- a single gentle light pass after scene entry;
- a small physical movement;
- a brief narrator cue;
- a subtle value lift after a pause;
- an ordinary operating light or moving part.

Constant bouncing, flashing, floating icons over every object, and permanent outlines are not affordance cues in this art. The pulse and outlines on the shipped placeholder are placeholder interface, not this rule (§Shipped placeholder).

## Cutaway language

### Preferred methods

In priority order:

1. removable ground or wall layer;
2. sectional base with a clean cut face;
3. removable cover or casing;
4. separated aligned components;
5. exploded assembly with visible attachment logic;
6. dedicated underground or interior scene.

A transparent X-ray overlay is never the principal explanation.

### Cut-face language

- Cut faces use a quiet warm neutral distinct from any real material surface.
- Cut edges are 1–2 logical px darker than the cut face.
- Cavities stay dark enough to read as depth but never opaque.
- Pipes, conduits, and reinforcing elements align exactly across separated layers.
- No jagged fictional fracture edge unless the real object is irregular.

### Process reveal as motion

The transformations that open an object are solid and physically understandable: a surface layer slides aside, a casing opens, a cover lifts, a ground section withdraws, an assembly separates into an exploded view, an interior mechanism moves into view, the process medium travels through the aligned geometry. When an object separates it behaves like a removable model component: the background quiets, foreground obstructions withdraw, the object rises 6–12 logical px with its shadow separating beneath it, and a clean base, cut edge, or attachment points remain visible where it stood. On return it reassembles in reverse causal order to its exact original pivot and orientation, and no temporary colour coding stays on it. The order of states around these motions is `SPEC.md`.

## Animation character and timing

### Causal animation rule

Every process animation has a visible beginning, a directional middle, a clear result, and a completion pause of 500–900 ms. Moving parts do not all start at once. The process stays understandable with narration muted.

### Animation layers

1. interface and transition motion;
2. principal mechanical process;
3. instructional flow or load path;
4. ambient environmental motion;
5. worker, pedestrian, or vehicle motion.

### Frame character

The engine may render at full device refresh, but distinctive art changes keep a crafted sprite character.

| Motion | Character |
|---|---|
| Decorative character motion | 8–12 distinct frames per second |
| Water and process flow | 12–18 distinct frames per second |
| Smooth mechanical rotation, scene transitions | May interpolate |
| Indicators | Discrete timed states |

### Timing

| Action | Duration (ms) |
|---|---|
| Tap acknowledgement | 80–140, beginning within 100 of touch |
| Selection effect | At most 450 unless the transition has begun |
| Overview to inspection | 350–500 |
| Inspection settle | 150–250 |
| Cover or component opening | 300–700 |
| Local process demonstration | 1500–4000 |
| Broader system connection | 2000–6000 |
| Return transition | 300–500 |
| Ambient loop | 2000–8000 |
| Completion pause | 500–900 |

On tap the local value rises slightly and a soft contact pulse appears while unrelated ambient motion quiets. During a complex process animation, background movement pauses or quiets.

### Ambient animation budget

This budget counts motion only. Drawn population follows the occupational-density rule in `docs/level-spine.md`: many jobs, vehicles, and shops are drawn in one view, and few of them move at any moment.

| Moving element | Per scene |
|---|---|
| Pedestrians or workers | 0–3 |
| Vehicles | 0–2 |
| Small animal or bird groups | 0–1 |
| Subtle environmental loops | 2–4 |
| Secondary action related to the setting | 1 |

Not every available object is animated.

## Location continuity

Every location reuses one controlled set of municipal conventions so that all of them read as parts of a single town: road surface and curb language; signs and safety markings; vegetation families; utility cabinet proportions; worker clothing and equipment; material ramps; sky and daylight; and scale references such as doors, vehicles, and railings.

A location may have its own material emphasis (a riverside site leans on water and concrete, a rail district on steel and ballast) without breaking the shared conventions. Which locations exist, and how the child moves between the block and a remote site, is `SPEC.md` and `docs/level-spine.md`.

## Asset pipeline

### Scene architecture

There is no single enormous scrolling tile map. Production uses a fixed illustrated busy block, a town hub (`SPEC.md` navigation), individually composed lesson scenes, shared projection and scale rules, reusable modules where repetition is not obvious, and layered assets for separation, cutaways, animation, and occlusion.

### Required layers (21)

| Layer | Holds |
|---|---|
| `BG_FAR` | Distant context |
| `BG_MID` | Middle background |
| `BG_NEAR` | Near background |
| `GROUND_BASE` | Ground plane |
| `GROUND_DETAIL` | Ground texture and markings |
| `GROUND_REMOVABLE` | Ground section that withdraws for a cutaway |
| `OBJECT_BASE` | Principal object body |
| `OBJECT_PART_[NAME]` | One named tappable or moving part |
| `OBJECT_INTERIOR` | Interior mechanism |
| `OBJECT_CUTAWAY` | Cut faces and cavity |
| `SHADOW_STATIC` | Shadows that never move |
| `SHADOW_DYNAMIC` | Shadows that separate or travel |
| `FX_SELECTION` | Selection light pass and contact pulse |
| `FX_FLOW` | Instructional flow or load path |
| `FX_PROCESS` | Process stages |
| `FX_AMBIENT` | Environmental loops |
| `CHARACTERS` | Workers, pedestrians, vehicles |
| `FOREGROUND_OCCLUSION` | Foreground frame that can withdraw |
| `HITMASK_[NAME]` | Invisible hit region for one target |
| `LABEL_ANCHOR_[NAME]` | Where a label's leader line may attach |
| `AUDIO_ANCHOR_[NAME]` | Where a material or process sound originates |

### Required object states (9)

`OVERVIEW_IDLE`, `OVERVIEW_SELECTED`, `INSPECTION_CLOSED`, `INSPECTION_OPEN`, `PROCESS_STAGE_01`, `PROCESS_STAGE_02`, `PROCESS_STAGE_03`, `PROCESS_COMPLETE`, `RETURN`.

Not every state needs a full-frame image; the object is divided into reusable, aligned layers wherever practical. What each state does is `SPEC.md`; how it looks is this document.

### Naming convention

`[LOCATION]_[OBJECT]_[VIEW]_[STATE]_[VERSION]`

| Example | Reads as |
|---|---|
| `TOWN_STORM_INLET_OVERVIEW_IDLE_v001.png` | Block, storm inlet, overview, idle, first version |
| `TOWN_STORM_INLET_INSPECTION_OPEN_v003.png` | Same object, inspection open, third version |
| `DAM_TURBINE_FX_FLOW_STAGE02_v002.png` | Dam, turbine, flow effect, stage two |
| `BRIDGE_BEARING_HITMASK_MAIN_v001.png` | Bridge, bearing, main hit mask |

Names carry no commercial style reference.

### Deliverables per principal object

Lossless layered master; flattened overview reference; separated object and component layers; removable ground or casing layers; hit masks; occlusion masks; label and audio anchors; animation frames or rig specification; palette notes; engineering-function description; approved dimensions and pivot points; provenance record (§Originality guardrails); originality review record.

Labels, arrows, captions, and instructional colour are never baked into permanent environmental art.

### Production gates (8)

| # | Gate | Passes when |
|---|---|---|
| 1 | Function | An engineering or operations reviewer confirms the mechanism |
| 2 | Silhouette | A child-facing reviewer identifies the object at thumbnail scale |
| 3 | Composition | The P1/P2/P3 hierarchy holds |
| 4 | Interaction | Every target meets the size and spacing rules |
| 5 | Cutaway | Interior and exterior geometry align |
| 6 | Animation | Beginning, direction, and result are clear without sound |
| 7 | Originality | No copied asset, scene composition, decorative motif, or branded element |
| 8 | Export | Integer scaling, pivots, naming, and layer integrity pass |

These are human review gates on art. The repository's automated gates are `docs/testing-gauntlet.md`.

## AI-assisted concept workflow

AI output is concept material until it has been redrawn or corrected, technically verified, divided into production layers, and reviewed for originality.

### Prompt construction

A prompt describes observable design properties, never creators, studios, brands, or commercial titles. Every prompt specifies the subject and its function; the exact projection; the logical canvas and object scale; camera orientation; lighting direction; principal material ramps; scene hierarchy; the amount and type of weathering; required functional components; required negative constraints; separation and cutaway needs; and interaction-space requirements.

Reusable templates are versioned under `workflows/prompts/` (`street-scene-generation.md`, `street-geometry-review.md`). Only per-generation prompt text — logs, variants, seeds — stays out of git, and prompt text never enters a provenance record (§Provenance record).

### Prohibited prompt practices

- "in the style of" followed by a living artist, studio, publisher, or commercial title;
- copyrighted screenshots as image-to-image inputs;
- character, location, object, faction, or brand names from commercial works;
- requests to reproduce a distinctive interface, map, scene, palette, sprite, or building;
- vague period instructions that name a decade and a genre instead of measurable properties.

### Required human correction

Every generated concept is reviewed and corrected for projection drift; invented pipes, fasteners, supports, labels, and controls; impossible access points; false flow direction; inconsistent lighting; repeated texture artefacts; fused or missing components; overly small tap targets; and scene similarity to a known commercial work.

## Originality guardrails

These rules are a production discipline, not a guarantee of legal clearance. The sources this project draws tone from, and the do-not-copy line for each, are `docs/inspiration.md`.

### No source-asset reuse

Nothing is imported, traced, painted over, cropped, recoloured, or transformed from an outside work: sprites, screenshots, maps, textures, interface elements, icons, fonts without an approved licence, sound effects, music, dialogue, distinctive decorative motifs, or promotional artwork.

### Independent-specification rule

A production artist can create any asset from this document, real-world technical references, and project sketches without seeing a commercial game screenshot. When a reference image is needed for an infrastructure object, several real-world sources showing different examples and angles are used; no single entertainment work determines the final silhouette, colour blocking, scene layout, or ornament.

### Distinctive-combination test

An asset is revised when several distinctive choices align with a single outside work: a nearly identical silhouette, matching proportions, matching palette arrangement, matching decorative marks, matching camera crop, matching foreground/background placement, matching lighting pattern, matching animation timing, or matching interface framing. Generic features may be unavoidable; their final combination must be independently authored.

### Public-facing language

Store listings, websites, screenshots, press material, and in-game credits describe the art by its generic properties. They never imply endorsement, affiliation, compatibility, or succession, never use another work's title or logo as a comparison, and use an independently cleared project name, logo, and icon.

### Provenance record

Every final asset has one record at `content/art/provenance/<asset>.json`, validated by `schema/art-provenance.schema.json`. People appear as role IDs only (`CLAUDE.md` S7).

| Field | Holds |
|---|---|
| `assetId` | Asset identifier in the naming convention |
| `file` | Repository path of the asset |
| `kind` | What the asset is: `svg-placeholder`, `scene`, `layer`, `mask`, `frames`, `audio`, or `font` |
| `createdOn` | Creation date |
| `creator` | `ROLE-*` |
| `reviewer` | `ROLE-*` |
| `tools` | Tools used |
| `promptRecord` | `none` or `outside-repository`; prompt text never enters git |
| `references` | Real-world or technical references, each with kind, note, and licence |
| `licence` | Licence of the asset itself |
| `humanChanges` | Changes made by hand after generation |
| `technicalReview` | `result` and where the `record` lives |
| `originalityReview` | `result` and where the `record` lives |
| `fileHash` | `algorithm` (sha256) and `hex` of the final file |

## Acceptance tests

An asset or scene is accepted only when every line below holds.

| Area | Checks |
|---|---|
| Projection and composition | Single approved angle; parallel municipal edges stay parallel; principal object unobstructed; required content inside the safe region; recognisable at 256 × 192; one unmistakable P1 subject; foreground occlusion under the limit |
| Educational clarity | Mechanism physically credible; enlarged parts improve touch without changing function; process has beginning, direction, and result; system connection appears only after local understanding; essential meaning does not depend on colour or sound alone; labels can be placed without covering functional parts |
| Style | Reads as original 2D illustration, not filtered 3D; pixel clusters deliberate; no uniform black outline; palette broad but controlled; P1 has more contrast and texture precision than context; weathering suggests use, not failure; no decorative detail implies a false function |
| Interaction | Every target has an adequate hit region; adjacent targets do not conflict; overview, selected, inspection, and process states differ clearly; object separates cleanly into its layers; foreground occlusion can withdraw; lesson understandable with narration muted |
| Animation | Ambient motion sparse; instructional movement sequential; background motion does not compete with narration; flow direction unmistakable; animation pauses at the result; a reduced-motion alternative is possible |
| Originality | No third-party pixels, audio, fonts, textures, or interface elements; prompt and filename carry no commercial style reference; composition is not a one-to-one recreation of an existing scene; asset is explainable entirely through this document and real-world references; an independent reviewer does not immediately attribute it to one commercial work; provenance record complete |
| Street scenes | Every row of the street acceptance checklist (§Street geometry and traffic-control plausibility) passes in a separate plausibility review; one FAIL rejects the scene |

## Style-drift review

After every three completed principal objects:

1. place their overview images on one contact sheet;
2. reduce each to 256 × 192;
3. convert a duplicate sheet to grayscale;
4. compare projection, light, palette, texture density, scale, and weathering;
5. identify the strongest outlier;
6. revise the outlier before adding more assets.

## Subjects on the spine

The curriculum is the eleven needs and their rungs in `docs/level-spine.md` (three rungs is the default, not a law). The ten subjects the source specification sketched are not a second curriculum: each is a named object or scene on one of those needs, at the rung the spine gives it. Scene blueprints are commissioned per need and rung, and the mechanism and system-connection columns below are the art brief for each. Needs with no subject here (Lights at the nearest rung, Heat/cool, Mail, Goods at the nearest rung, Comms) get their blueprints from the spine directly.

| Subject | Need | Rung | Local mechanism | Brief system connection |
|---|---|---|---|---|
| Traffic signal and pedestrian crossing | Get across | nearest (built) | Lenses, push button, controller sequence | Detection and coordinated right-of-way |
| Railway crossing | Get across | nearest (built) | Detection, lights, bell, gate sequence | Train movement and road safety |
| Bridge | Get across | carrier | Deck, girder or cable, bearing, pier or abutment | Load path to foundations and ground |
| Storm sewer inlet | Rain | nearest | Grate, catch basin, sump, outlet pipe | Street runoff to the combined trunk |
| Stormwater outfall | Rain | carrier to facility | Pipe, headwall, energy dissipation | The combined trunk's end, back to streets and drains |
| Fire hydrant and water main | Drink | nearest to carrier | Main, branch, valve, hydrant barrel (potable only) | Reservoir, treatment, pressure system |
| Sanitary sewer and manhole | Flush | nearest to carrier | Gravity channel, pipe junction, access | House lateral to the combined trunk, then treatment |
| Intermodal transfer | Goods | carrier (port and rail) | Lifting and moving one container | Ship, storage, rail, and truck chain |
| Hydroelectric facility | Lights | facility | Intake, penstock, turbine, generator | Water path and electrical delivery; the dam sits upriver |
| Municipal waste facility | Trash | facility | Weighing, transfer, sorting, placement | Collection to the transfer station and MRF campus |

Mapping closed by the owner (`docs/settled.md`, Q-art-subjects-2026-08-21).

## Shipped placeholder

The busy block that ships today (`src/app/renderers/BusyBlock.tsx`) is an SVG on the legacy geometry: a 960 × 540 viewBox, a 72 × 36 tile, and a 720 CSS px minimum block width. It is exempt from the projection, canvas, palette, and pixel rules of this document until it is redrawn on the real-art grid; the exemption is `F-art-geometry-migration` in `docs/open-faults.md` and is named, not silent. Its hotspot outlines and pulse are placeholder interface for the through-line and quiet treatments of `docs/level-spine.md`, not the tap-affordance rule of this document. The redraw on the real-art grid must also pass the street acceptance checklist (§Street geometry and traffic-control plausibility), since the block contains a signalised crossing. The placeholder's provenance record is `content/art/provenance/busy-block-placeholder.json`.

## Machine-readable values

Every number in this document that a gate can check lives in `content/art/tokens.json`, validated by `schema/art-tokens.schema.json`. When this prose and the tokens file disagree, the tokens file is the authority and this prose is the fault. `npm run check` fails when the renderer or the stylesheet departs from the tokens.

| Section of this document | Token group |
|---|---|
| Projection | `projection` |
| Canvas, export, safe region | `canvas` |
| Design lock: display | `display` |
| Shipped placeholder | `legacyPlaceholder` |
| Principal-object scale, controlled enlargement | `objectScale` |
| Fixed-scene zoom | `zoom` |
| Three depth bands | `depthBands` |
| Occlusion rule | `occlusion` |
| Pixel construction and edge language | `pixel` |
| Saturation hierarchy | `saturation` |
| Lighting | `lighting` |
| Palette anchors | `palette` |
| Process colour coding | `processCoding` |
| Touch regions | `touch` |
| Timing | `timing` |
| Frame character, ambient animation budget | `animation` |
| Type and contrast as drawn | `text` |
| Interface palette | `ui` |
| Required layers | `layers` |
| Required object states | `objectStates` |
| Naming convention | `naming` |
| Production gates | `productionGates` |

## Final production rule

When artistic richness and instructional clarity conflict, this order holds:

1. physical function;
2. touch readability;
3. object silhouette;
4. causal process animation;
5. scene composition;
6. colour and lighting;
7. environmental storytelling;
8. decorative texture.

The governing aesthetic is an original, living municipal model built from expressive 2D pixel-constructed illustration, in which every beautiful detail serves physical understanding.
