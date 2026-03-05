---
name: explainer
description: "Use when the user asks to explain, walk through, or understand a feature, module, or code flow in the codebase. Triggers on 'explain', 'walk me through', 'how does X work', 'what does this code do'."
---

# Code Explainer

Interactive code walkthrough. Scans the codebase for a feature, builds a segment plan, then walks through each segment — highlighting code in VS Code and explaining at their chosen depth.

## Checklist

Complete these steps in order:

0. **Parallel init** — Dispatch both in a **single response**:
   - **Sidebar check (Bash):** `PORT=$(cat ~/.claude-explainer-port 2>/dev/null) && TOKEN=$(cat ~/.claude-explainer-token 2>/dev/null) && curl -sf -H "Authorization: Bearer $TOKEN" "http://localhost:$PORT/api/health"` — `{"status":"ok"}` means sidebar is active. When active, **NEVER output walkthrough content as terminal text**; all output goes through sidebar HTTP API only.
   - **Assess familiarity (AskUserQuestion):** Read `docs/assess.md` and ask preferences.

1. **Scout** — Read `docs/scan.md`. Dispatch Haiku sub-agent to discover relevant files and map the call chain. No highlights yet — discovery only.
2. **Plan** — Read `docs/plan.md`. Dispatch Sonnet sub-agent to build narrative plan and transition objects. Immediately send stub `set_plan` to sidebar so the outline is visible. Present plan in chat and wait for user approval.
3. **Generate segments** — Read `docs/segments.md`. Dispatch parallel segment agents (Haiku for Overview, Sonnet for Deep Dive) — one per segment, capped at 5 concurrent. Fire `replace_segment` as each completes. User can start walkthrough before all segments finish.
4. **Execute walkthrough** — Read the doc for chosen mode: `docs/walkthrough.md`, `docs/read.md`, or `docs/podcast.md`. Walkthrough and podcast reference `docs/tts.md`.
5. **Wrap up** — 3-5 key takeaways, how feature fits the broader architecture, offer to dive deeper or explain related features.

**First-time setup?** Read `docs/setup.md`.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Scope too large | Stick to segment boundaries. Overview: max 80 lines, Deep Dive: max 40. Split if bigger |
| Not connecting segments | Include a context line linking to previous segment |
| Forgetting to highlight | Sidebar: automatic. Fallback: write to `~/.claude-highlight.json` |
| Reading entire file | Use offset+limit on Read for just the segment |
| Not waiting for user | Pause after each segment for questions |
| ttsText missing or has markdown | Include plain `ttsText` in every segment — strip backticks, bold, line refs from spoken text |
| Explaining obvious code, missing the "why" | Skip standard patterns (loops, imports, null checks). Always explain intent before mechanism |
| Ignoring complexity tags | `[core]` = thorough, `[wiring]` = breeze through, `[supporting]` = brief |
| Sidebar check not parallelized | Dispatch Bash health check + AskUserQuestion in one response, not sequentially |
| Text output when sidebar active | If health check returned ok, send plan JSON only — no terminal text |
| Sub-highlights too broad | One concept per highlight, 1-8 lines each. Split multi-operation blocks. For constructors with N args, use N highlights. Deep Dive: 6-12 per segment, Overview: 3-6 |
| Wrong field names in sidebar JSON | Use `start`/`end`/`title`/`ttsText`/`highlights` — NOT `startLine`/`endLine`/`label`/`subHighlights`. See `docs/plan.md` for exact schema |
| Skipping `set_plan` before `goto` | Sidebar needs the full plan loaded first. Always send stub `set_plan` via `explainer.sh plan` before any `goto` or `replace_segment` messages |
| Waiting for all segments before showing plan | Send stub `set_plan` immediately after planner. Fire `replace_segment` per agent as they finish. Don't batch |
| Scout generating highlights | Scout only maps files and call chain. Highlights are the segment agents' job |
