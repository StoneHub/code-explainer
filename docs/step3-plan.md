# Steps 3 & 4: Build Walkthrough Plan + Present Plan

## Step 3: Build Walkthrough Plan

Parse the sub-agent's response into an ordered list of segments. Each segment is:

```
{number}. {file}:{startLine}-{endLine} -- {brief description}
```

**Verify the plan:**
- Segments are ordered by data/call flow (entry point first)
- No segment exceeds the size limit for the chosen depth
- Absolute file paths are used
- Adjust or split segments if needed

## Step 4: Present Plan

Show the plan to the user in a numbered list:

```
I'll walk through {feature} in {N} segments:

1. src/controllers/auth.controller.ts:10-45 -- HTTP endpoint, request validation
2. src/services/auth.service.ts:20-65 -- Core authentication logic
3. src/services/token.service.ts:15-50 -- JWT generation and verification
...

Ready to start? You can reorder, skip, or add segments.
```

Wait for the user to approve, adjust, or say "go".
