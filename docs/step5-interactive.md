# Step 5: Interactive Walkthrough

**If Autoplay was chosen, use `docs/step5-autoplay.md` instead.**

For Interactive modes, do these steps for EACH segment:

## 5a. Highlight in VS Code

**MANDATORY: Run this BEFORE explaining each segment.** This writes a JSON file that the code-explainer VS Code extension picks up to open the file, highlight the line range, and scroll to it:

```bash
~/.claude/skills/explainer/scripts/highlight.sh {absolute_filepath} {startLine} {endLine}
```

The highlight script writes `{"file":"...","start":N,"end":N}` to `~/.claude-highlight.json`. The VS Code extension watches this file and reacts by:
1. Opening the file in the editor
2. Selecting the specified line range
3. Scrolling to center the selection in the viewport
4. Applying a subtle gold background decoration so the range stands out visually

**Important:** Always use absolute file paths. The VS Code extension must be installed (see `docs/setup.md`). If the extension is not installed, the highlight will have no effect -- the walkthrough still works, just without automatic navigation.

## 5b. Read the Segment

Use the Read tool with offset and limit to read exactly the segment's lines:

```
Read(file_path, offset=startLine, limit=endLine-startLine+1)
```

## 5c. Explain the Segment

**Structure your explanation as:**

1. **Context line** (1 sentence) -- how this connects to the previous segment or the overall flow
2. **What this code does** -- explain the segment's purpose
3. **Key details** (depth-dependent):
   - Overview: skip implementation details, focus on what and why
   - Detailed: explain patterns, design decisions, edge cases, why it's written this way
4. **Connection forward** (1 sentence) -- what comes next and why

**Formatting rules:**
- Reference specific line numbers: "On line 42, the `matchOrders()` call..."
- Use the file_path:line_number pattern for cross-references
- Keep each segment explanation concise -- aim for 3-8 sentences for overview, 8-15 for detailed
- Use code inline references with backticks for variable/function names

## 5c-tts. Speak the Explanation (if TTS enabled)

If TTS is enabled, create a **spoken version** of the explanation and pipe it to the speak script. The spoken version must be simplified for natural listening. See `docs/tts.md` for voice, speed, and formatting rules.

**Conversion rules (written -> spoken):**
- Strip all markdown formatting (backticks, bold, headers)
- Remove line number references ("On line 42," -> "")
- Remove file path references
- Simplify code references ("the `matchOrders()` method" -> "the matchOrders method")
- Keep it to 2-4 sentences max -- shorter than the written explanation
- Make it conversational, as if explaining to a colleague

**Example:**
- Written: "On line 42, the `matchOrders()` method iterates through the `pendingOrders` array, calling `tryFill()` for each order that meets the price threshold."
- Spoken: "The matchOrders method iterates through pending orders, calling tryFill for each order that meets the price threshold."

**Execute via Bash with `run_in_background: true`** so speech does not block Claude:

```bash
~/.claude/skills/explainer/scripts/speak.sh "The matchOrders method iterates through pending orders..."
```

## 5d. Wait for User

After explaining each segment, end with:

```
Segment {current}/{total} -- say "next" to continue, or ask any questions about this part.
```

**Handle user responses:**
- "next" / "continue" / "go" -> proceed to next segment
- A question -> answer it, then ask if ready for next segment
- "skip" -> move to next segment without explaining
- "skip to {N}" -> jump to segment N
- "go deeper" -> re-read the segment with Detailed depth
- "zoom out" -> re-read with Overview depth
- "stop" / "done" -> jump to wrap-up
- "mute" / "silence" -> disable TTS for remaining segments, confirm with "Audio muted."
- "unmute" / "audio on" -> re-enable TTS for remaining segments, confirm with "Audio enabled."
