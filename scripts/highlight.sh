#!/bin/bash
# Highlight a range of lines in VS Code via the claude-explainer extension.
# Writes a JSON file that the extension watches and reacts to.
# Usage: highlight.sh <file> <start_line> <end_line>

FILE="$1"
START="$2"
END="$3"

echo "{\"file\":\"$FILE\",\"start\":$START,\"end\":$END}" > ~/.claude-highlight.json
