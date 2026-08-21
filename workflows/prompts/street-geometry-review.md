# Street-geometry review prompt (reusable)

**This file owns** the reusable prompt for the separate review pass that judges a generated or redrawn street scene for physical plausibility and traffic-control logic only.
**It does not own** the street-geometry rules (`docs/art-bible.md`, section "Street geometry and traffic-control plausibility"), the originality review (a separate pass under the same bible), or the generation prompt (`workflows/prompts/street-scene-generation.md`).

Build-time only. Never imported from `src/`. The reviewer is a different agent or person from the one who produced the scene. The reviewer's output (the table below) goes into the asset's provenance record as the technical-review record (`schema/art-provenance.schema.json`); role IDs only.

## Prompt

```
Act as a municipal street-layout and traffic-control reviewer.

Ignore artistic attractiveness, mood, colour, texture, and originality.
Review only whether the depicted street would appear physically normal
and immediately understandable to an ordinary human observer.

Inspect the image systematically.

1. Trace every road from one image edge to another.
2. Identify the permitted direction of travel in every lane.
3. Confirm that all vehicles occupy valid lanes.
4. Trace every sidewalk continuously around its street corner.
5. Trace every crosswalk from one curb ramp to the directly opposite curb
   ramp.
6. Confirm that no crosswalk bends, branches, merges, overlaps another
   crosswalk, or terminates in the road.
7. Confirm that every stop line is behind and parallel to its crosswalk.
8. Confirm that every signal pole is outside active traffic lanes.
9. Confirm that every signal head faces the approach it controls.
10. Confirm that the visible signal indications are mutually consistent.
11. Confirm that yellow and white road markings have conventional and
    internally consistent meanings.
12. Identify any object that occupies an impossible physical position.

Return a table with:

- Component
- PASS or FAIL
- Exact location of problem
- Why a human observer would find it abnormal
- Smallest correction required

Reject the image if any of the following occur:

- a lane cannot be traced continuously;
- a crosswalk cannot be traced between opposing curb ramps;
- a vehicle overlaps a sidewalk or crosswalk;
- a traffic signal controls an unclear or impossible approach;
- road markings create contradictory traffic directions;
- the intersection topology cannot be explained unambiguously.

Do not approve an error merely because the image is visually attractive.
```

## Acceptance checklist

Every row must be PASS before the scene moves to the originality review. One FAIL fails the scene; repair the faulty region locally and review again.

| # | Check | PASS / FAIL | Location | Smallest correction |
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

## When a new failure appears

If a scene fails for a reason no row or negative constraint names, add the failure to the DO NOT INCLUDE block in `workflows/prompts/street-scene-generation.md` and to the street-geometry section of `docs/art-bible.md` in the same change.
