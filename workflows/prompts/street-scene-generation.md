# Street-scene generation prompt (reusable)

**This file owns** the reusable prompt blocks for generating or redrawing any scene that contains streets, intersections, sidewalks, crosswalks, traffic or pedestrian signals, lane markings, curb ramps, or vehicles.
**It does not own** the street-geometry rules themselves (`docs/art-bible.md`, section "Street geometry and traffic-control plausibility"), the look (`docs/art-bible.md`), or the review pass (`workflows/prompts/street-geometry-review.md`).

Build-time only. Never imported from `src/`. Prompt text for individual generations (logs, variants, seeds) stays out of git — `.gitignore` excludes `prompt-logs/`, `art-prompts/`, and `ai-drafts/`. This template is the one copy that is versioned.

## Order of use

1. Draw or generate the **structural layout first**: road edges, lane arrangement, sidewalks, curb corners, curb ramps, crosswalks, stop lines, signal-pole locations, vehicle travel paths. Nothing else.
2. Prompt the art generator with, in this order: **HARD STREET-GEOMETRY REQUIREMENTS**, then **VISUAL TREATMENT**, then **DO NOT INCLUDE**. Geometry before style, always.
3. Send the result through `workflows/prompts/street-geometry-review.md`. A scene that fails any checklist row is repaired locally (edit or inpaint the faulty region); regenerate the whole scene only when the topology itself is wrong.
4. Record provenance per `schema/art-provenance.schema.json` (role IDs only; `promptRecord: "outside-repository"`).

Replace `[PRINCIPAL OBJECT]` and `[SCENE NOTES]` before use. Do not add named games, studios, artists, or titles anywhere in a prompt (`docs/art-bible.md`, AI-assisted concept workflow).

## Block 1 — HARD STREET-GEOMETRY REQUIREMENTS

```
HARD STREET-GEOMETRY REQUIREMENTS

Geometry and traffic-system plausibility take priority over decorative
detail. Do not reinterpret these requirements.

INTERSECTION FORM

- Show exactly one conventional four-leg intersection.
- Exactly two straight roads cross each other at 90 degrees.
- Both roads maintain a constant width before, through, and after the
  intersection.
- Each road has one lane in each direction.
- Traffic follows right-hand driving conventions.
- Vehicles remain centred within their correct lanes.
- Do not add turning lanes, slip lanes, medians, bicycle lanes, driveways,
  diagonal roads, or additional road branches.

ROAD MARKINGS

- A yellow centre line separates opposing directions of travel.
- White markings are used only for stop lines, crosswalks, and lanes
  travelling in the same direction.
- Every vehicle approach has one solid white stop line.
- Each stop line is parallel to its associated crosswalk.
- Each stop line is located immediately before the crosswalk from the
  approaching driver's perspective.
- No road marking bends, merges unexpectedly, terminates randomly, or
  continues across a sidewalk.

SIDEWALKS AND CURB RAMPS

- Four continuous sidewalks form four distinct street corners.
- Each corner has a clearly identifiable curb.
- Every crosswalk begins at one curb ramp and ends at the directly
  opposite curb ramp.
- Curb ramps face the crosswalk they serve.
- No curb ramp points toward the centre of the intersection or into an
  active vehicle lane without a crosswalk.

CROSSWALKS

- Show four separate straight crosswalks, one across each vehicle
  approach.
- Each crosswalk is a single rectangular band perpendicular to the road
  it crosses.
- Each crosswalk extends only from one curb edge to the directly opposite
  curb edge.
- Crosswalks must not bend, curve, branch, overlap, merge, touch one
  another, form an L shape, form a T shape, or continue around a corner.
- No crosswalk may terminate within the roadway.
- No vehicle may overlap or occupy a crosswalk in the establishing image.

TRAFFIC SIGNALS

- Traffic-signal poles stand behind the curb or on an appropriate
  roadside mounting location, never in a vehicle lane or in the centre
  of the intersection.
- Every signal head faces the approaching traffic lane it controls.
- Provide a logically placed signal indication for each visible vehicle
  approach.
- Signal heads controlling different approaches must face different
  directions.
- Only one circular indication is illuminated in each signal head.
- For this scene, show the principal approach as green; its red and amber
  lenses remain dark.
- Perpendicular vehicle traffic is stopped.
- Pedestrian indications must not contradict the vehicle phase.

VEHICLES

- Include no more than two vehicles.
- Each vehicle follows a continuous, physically possible lane path.
- Vehicle bodies remain completely inside the carriageway.
- No vehicle overlaps a sidewalk, curb, signal pole, crosswalk, stop
  line, or another vehicle.
- Avoid showing a vehicle midway through a turn.
- A stopped vehicle must remain behind its stop line.
- A moving vehicle must have an unobstructed lane ahead.

FINAL TOPOLOGY TEST

A human observer must be able to trace every lane continuously through
the intersection, trace every sidewalk around its corner, and trace every
crosswalk directly from one curb ramp to its opposite curb ramp without
encountering an unexplained break, bend, merger, or obstruction.
```

For a signal lesson, prefer the reduced composition from the art bible: one foreground corner, one principal signal pole, one crosswalk, one curb-ramp pair, one stop line, one subordinate vehicle, one pedestrian waiting zone, and only enough of the opposite side to explain the system. When you use it, replace "exactly one conventional four-leg intersection" with the reduced composition and keep every other rule.

## Block 2 — VISUAL TREATMENT

```
VISUAL TREATMENT

Create a landscape 2D isometric illustration for an educational
infrastructure game for children aged 7–12.

Use a fixed 2:1 dimetric viewpoint (64 x 32 ground diamond, 16 px
elevation unit, 1024 x 768 logical canvas, key light from upper left)
with no camera rotation, perspective convergence, or 3D-rendered
appearance.

[PRINCIPAL OBJECT] is the clear principal subject. Place it near a
foreground corner, behind the curb and outside the pedestrian path. Make
it large and readable through composition rather than placing it
unnaturally within the road.

Use deliberate modern pixel construction, a broad controlled colour
palette built from the material anchors, stepped isometric edges,
selective edge smoothing, changes in colour and value instead of uniform
black outlines, and restrained material texture.

The municipality is tidy, functional, maintained, and gently lived in.
Allow subtle faded paint, ordinary pavement wear, minor grime near the
curb, small leaf accumulations, and restrained rust around fasteners.
Do not show structural damage or neglect.

Keep buildings, vehicles, vegetation, and street furniture visually
subordinate to [PRINCIPAL OBJECT]. Many people doing ordinary jobs may be
drawn; few may move. Avoid excessive props, dense traffic, crowds,
generated storefront text, or decorative markings unrelated to the
traffic system.

[SCENE NOTES]
```

## Block 3 — DO NOT INCLUDE

```
DO NOT INCLUDE

- L-shaped, T-shaped, curved, merged, or intersecting crosswalks
- crosswalks that do not meet curb ramps
- crosswalks terminating in traffic lanes
- vehicles occupying crosswalks
- traffic-signal poles in the carriageway
- one signal head controlling several directions
- signal heads facing away from their traffic
- red, amber, and green illuminated simultaneously
- conflicting pedestrian and vehicle indications
- missing or misplaced stop lines
- yellow lane lines separating traffic travelling in the same direction
- white centre lines separating opposing traffic
- warped road widths
- roads that change direction inside the intersection
- impossible turns or ambiguous vehicle paths
- disconnected sidewalks
- curb ramps facing the wrong direction
- decorative road stripes with no traffic meaning
- fictional traffic symbols
- generated business names or unreadable signage
- any named game, studio, artist, or title as a style reference
```

## Recurring failure modes

When a generated street scene fails review for a reason not already listed in Block 3, add the failure to Block 3 here and to the "Street geometry" section of `docs/art-bible.md` in the same change, so the constraint outlives the scene that taught it.
