# Step 2: Scan the Codebase (via sub-agent)

**Dispatch a haiku sub-agent** to scan the codebase. This saves main conversation context for the walkthrough itself.

Use the Agent tool with these parameters:
- `subagent_type`: `Explore`
- `model`: `haiku`
- `description`: `Scan codebase for {feature}`

## Prompt template for the sub-agent

```
Scan this codebase to find all files relevant to "{feature}".

1. Grep for: {feature name}, key class names, key function names
2. Glob for file patterns in relevant directories
3. Read entry points and key files to understand the flow
4. Follow imports to discover related files
5. Look for service classes, controllers, modules, types, and tests

Return a structured result:
- **Entry point**: the file/function where the feature starts
- **Core files**: list of files with brief description of each
- **Call chain**: what calls what (A -> B -> C)
- **Walkthrough plan**: ordered list of segments, each as:
  {file_absolute_path}:{startLine}-{endLine} -- {brief description} [{complexity}]
    Sub-highlights (2-5 per segment, split by logical boundaries):
      - {startLine}-{endLine} -- {brief description of this sub-range}
      - {startLine}-{endLine} -- {brief description of this sub-range}

  Where {complexity} is one of:
  - `[core]` — central logic, the "meat" of the feature. Explain thoroughly.
  - `[wiring]` — boilerplate, config, module setup, DI registration. Breeze through.
  - `[supporting]` — helpers, utilities, types. Explain briefly.

  Sub-highlights should split each segment into focused 5-15 line blocks at logical boundaries
  (imports, function signatures, conditionals, return values, setup vs logic).

Depth level: {overview|detailed|focused}
Segment sizing:
- Overview: 40-80 lines per segment, 4-8 segments total
- Detailed: 15-40 lines per segment, 8-15 segments total
- Focused: 1-3 segments, only what's relevant

Ordering: start with entry point, follow data/call flow, group related logic, end with utilities/types/config.
```

## Tips for the prompt

- Include the feature name and any files the user mentioned or has open
- Specify the depth level chosen in Step 1
- If the user pointed to a specific file, tell the sub-agent to start there

The sub-agent returns the walkthrough plan. You then present it in Step 3/4.
