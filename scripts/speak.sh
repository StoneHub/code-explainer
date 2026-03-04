#!/bin/bash
# ~/.claude/skills/explainer/speak.sh
# Text-to-speech using Kokoro (mlx-audio) with fallback to macOS `say`.
# Usage: speak.sh "text to speak"
# Or:    echo "text" | speak.sh
#
# Kills any previous speech before starting new speech.
# Runs in background so it does not block the caller.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VENV_PYTHON="$ROOT_DIR/.venv/bin/python3"
KOKORO_SCRIPT="$SCRIPT_DIR/kokoro_speak.py"

# Kill any previous speech (both Kokoro/afplay and macOS say)
killall afplay say 2>/dev/null

# Get text from argument or stdin
TEXT="${1:-$(cat)}"

# Exit if no text
if [ -z "$TEXT" ]; then
    exit 0
fi

# Try Kokoro (mlx-audio) first, fall back to macOS say
if [ -x "$VENV_PYTHON" ] && [ -f "$KOKORO_SCRIPT" ]; then
    "$VENV_PYTHON" "$KOKORO_SCRIPT" "$TEXT" &
else
    say -v Samantha -r 190 "$TEXT" &
fi
