# Explanation Improvements Design

## Problem

Current explanation segments follow a mechanical structure (context line, what it does, key details, connection forward) that doesn't match how senior engineers actually comprehend code. Research on program comprehension identifies key gaps:

1. **Missing intent** — Explanations lead with "what" instead of "why"
2. **No skip guidance** — Obvious boilerplate gets same treatment as dense logic
3. **Weak narrative thread** — Single "connection forward" sentence doesn't build a mental model across segments
4. **No concreteness** — Abstract descriptions without grounding in real scenarios
5. **No pacing variation** — Every segment treated identically regardless of complexity

## Research Basis

- Letovsky's three-layer mental model: specification (why), implementation (how), annotation (mapping between them)
- Expert programmers use opportunistic strategies — scanning for beacons, chunking by concept, forming hypotheses
- Experts avoid comprehending more than necessary — they build just enough mental model for the task
- Concrete scenarios reduce cognitive load more than abstract descriptions

## Approach

Surgical updates to 4 existing files + 1 minor addition. No new files, no structural changes to the walkthrough flow.

## Changes

### 1. `step5-interactive.md` — New explanation structure (section 5c)

Replace the 4-part explanation template with a 5-part intent-first structure:

1. **Intent** — What problem does this solve? Why does it exist?
2. **Mechanism** — Walk through code grouped by concept, not line order
3. **Concrete scenario** — One sentence grounding it in a real user action
4. **Non-obvious decisions** — Only when genuine surprises/trade-offs exist
5. **Thread forward** — Mental model to carry into next segment, not just "next we look at X"

Add a "What NOT to explain" section: skip imports, standard loops, null checks, boilerplate unless they reveal something interesting.

### 2. `step5-autoplay.md` — Improved narration style

Update narration guidance to lead with WHY, use concrete scenarios, breeze through boilerplate, and vary pacing based on density.

### 3. `step2-scan.md` — Complexity hints from sub-agent

Sub-agent tags each segment with `[core]`, `[wiring]`, or `[supporting]` so the explanation step knows where to spend time vs. breeze through.

### 4. `step3-plan.md` — Show complexity hints in plan presentation

Display complexity tags in the user-facing plan so they can see which segments are core vs. boilerplate.

### 5. `SKILL.md` — Updated common mistakes table

Add two new mistake rows: "Explaining obvious code" and "Missing the why".
