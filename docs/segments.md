# Step 3: Parallel Segment Agents (Deep Dive only)

> **Overview mode** skips this step — the planner agent already sent `set_plan` with complete highlights.

Dispatch **one sub-agent per segment** in parallel. Each agent reads its file deeply and generates dense, granular highlights. As each finishes, fire a `replace_segment` to populate the sidebar live.

## Per-segment sub-agent

Agent tool parameters:
- `model`: `MEDIUM` ← replace with model from SKILL.md
- `description`: `Generate highlights for {segment.title}`

### Prompt template

```
You are generating walkthrough highlights for one segment of a code explanation.

Feature: "{feature}"
File: {file}
Lines: {start}–{end}
Complexity: {complexity}
Depth: {overview|deep-dive}

Narrative context:
- Previous segment established: {previousContext}
- Your role in the story: {role}
- You hand off to next segment: {nextContext}
- Suggested opening angle: {narrativeHook}

Read the code:
{file_content}   ← use offset={start} limit={end-start+1}

Generate a JSON segment object:

{
  "id": {id},
  "file": "{file}",
  "start": {start},
  "end": {end},
  "title": "{title}",
  "explanation": "<markdown explanation of the full segment>",
  "highlights": [
    {
      "start": <line>,
      "end": <line>,
      "ttsText": "<1-2 sentence plain-text narration for this highlight>",
      "explanation": "<optional markdown label shown in sidebar>"
    }
  ]
}

Highlight rules:
- **1 line per highlight** — the default. Only group into 2-3 lines when lines are truly inseparable (e.g., a multi-line string literal or chained call that can't be split).
- Aim for **15-30 highlights per segment** in Deep Dive. More is better.
- Every meaningful line gets its own highlight: each constructor arg, each assignment, each condition branch, each return value.
- `ttsText`: **one short sentence**, plain text only. Label what the line does, not how. "This sets the retry limit to three attempts." not a paragraph.
- `explanation`: 2-5 word label shown in sidebar. "Retry limit", "Auth token", "Error fallback". Think tooltip, not prose.
- First highlight: open with a one-liner referencing previousContext. ("Picking up from the controller, here's where credentials are actually checked.")
- `[wiring]` segments: still granular, but ttsText can be even shorter. "Registers the auth module." and move on.
- `[core]` segments: hit every line. Don't skip anything that isn't pure boilerplate (imports, closing braces).

Return only the JSON object, no prose.
```

### Example — constructor with 4 args

```json
"highlights": [
  { "start": 12, "end": 12, "ttsText": "The constructor opens here.", "explanation": "Constructor" },
  { "start": 13, "end": 13, "ttsText": "Injects the user repository for database access.", "explanation": "UserRepository" },
  { "start": 14, "end": 14, "ttsText": "Injects the JWT service for token signing.", "explanation": "JwtService" },
  { "start": 15, "end": 15, "ttsText": "Injects the mailer for sending verification emails.", "explanation": "MailerService" },
  { "start": 16, "end": 16, "ttsText": "And the config service to pull environment values at runtime.", "explanation": "ConfigService" },
  { "start": 18, "end": 18, "ttsText": "Immediately sets the token expiry from config — no magic number buried in the method.", "explanation": "Token expiry" }
]
```

Not this:
```json
"highlights": [
  { "start": 12, "end": 18, "ttsText": "The constructor injects dependencies and sets up config values.", "explanation": "Constructor" }
]
```

## Fire replace_segment as each agent completes

Do not wait for all agents. As soon as one returns its JSON, send it:

```bash
~/.claude/skills/explainer/scripts/explainer.sh send '{
  "type": "replace_segment",
  "id": {id},
  "segment": { ...segment JSON... }
}'
```

The sidebar updates live as segments populate. The user can start the walkthrough as soon as the first few segments are ready — they don't need to wait for all of them.

## Concurrency ceiling

Cap at **5 parallel agents** to avoid rate limits. If there are more segments, queue the remainder and dispatch as slots free up. The progressive `replace_segment` streaming makes queuing invisible to the user.

## After all segments are populated

Proceed to the walkthrough execution doc for the chosen delivery mode:
- **Walkthrough mode** → `docs/walkthrough.md` (sidebar handles playback)
- **Read mode** → `docs/read.md` (step through segments in terminal)
- **Podcast mode** → `docs/podcast.md` (render single audio file)
