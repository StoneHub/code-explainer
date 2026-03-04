---
name: explainer
description: "Use when the user asks to explain, walk through, or understand a feature, module, or code flow in the codebase. Triggers on phrases like 'explain', 'walk me through', 'how does X work', 'what does this code do'."
---

# Code Explainer

## Overview

Interactive code walkthrough skill. Scans the codebase for a feature, builds a segment-by-segment plan, then walks the user through each segment -- highlighting code in VS Code and explaining it at their chosen depth level.

## When to Use

- User asks to "explain" or "walk me through" a feature
- User wants to understand how a module, service, or flow works
- User says "how does X work" about the codebase
- User asks for a code walkthrough or tour

## When NOT to Use

- User wants to fix a bug (use systematic-debugging)
- User wants to change code (use brainstorming/writing-plans)
- User asks a quick factual question ("what port does the backend run on?")

## Checklist

You MUST complete these steps in order:

1. **Assess familiarity** — Read `docs/config.md` for saved preferences. If no config exists, read `docs/step1-assess.md` and ask the user.
2. **Scan the codebase** — Read `docs/step2-scan.md` for sub-agent dispatch instructions.
3. **Build walkthrough plan** — Read `docs/step3-plan.md` for plan format and presentation.
4. **Present plan** — (covered in `docs/step3-plan.md`)
5. **Execute walkthrough** — Read `docs/step5-interactive.md` for interactive mode, or `docs/step5-autoplay.md` for autoplay mode. Both reference `docs/tts.md` for TTS details.
6. **Wrap up** — Summarize key takeaways:
   - **Summary** — 3-5 bullet points of the key takeaways
   - **Architecture note** — how this feature fits into the broader system
   - **Offer next steps** — "Want me to dive deeper into any part, or explain a related feature?"

**First-time setup?** Read `docs/setup.md` for installation instructions.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Explaining too much at once | Stick to segment boundaries, keep explanations concise |
| Not connecting segments | Always include a context line linking to previous segment |
| Forgetting to highlight | ALWAYS run `highlight.sh` before explaining each segment |
| Reading the entire file | Use offset+limit on Read to show only the segment |
| Not waiting for user | Always pause after each segment for questions |
| Segments too large | Overview: max 80 lines. Detailed: max 40 lines. Split if bigger |
| Not speaking before explaining | If TTS is enabled, ALWAYS run speak.sh after writing the explanation |
| Speaking markdown formatting | Strip all backticks, bold markers, line refs from spoken text |
