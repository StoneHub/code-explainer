#!/usr/bin/env python3
"""Kokoro TTS via mlx-audio — generates speech and plays it.

Usage:
    kokoro_speak.py "Text to speak"
    echo "Text to speak" | kokoro_speak.py

Environment variables:
    KOKORO_VOICE   - Voice preset (default: af_heart)
    KOKORO_SPEED   - Speech speed multiplier (default: 1.0)
"""

import sys
import os
import subprocess
import tempfile
import glob

def speak(text: str) -> None:
    if not text.strip():
        return

    voice = os.environ.get("KOKORO_VOICE", "af_heart")
    speed = float(os.environ.get("KOKORO_SPEED", "1.0"))

    from mlx_audio.tts.generate import generate_audio

    with tempfile.TemporaryDirectory() as tmpdir:
        output_prefix = os.path.join(tmpdir, "speech")
        # lang_code is first char of voice name: a=American, b=British, etc.
        lang = voice[0] if voice else "a"
        generate_audio(
            text=text,
            model="prince-canuma/Kokoro-82M",
            voice=voice,
            speed=speed,
            lang_code=lang,
            file_prefix=output_prefix,
            audio_format="wav",
            verbose=False,
        )
        # Find and play the generated wav file(s)
        wav_files = sorted(glob.glob(os.path.join(tmpdir, "speech_*.wav")))
        for wav in wav_files:
            subprocess.run(["afplay", wav], check=True)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        text = sys.stdin.read()
    speak(text)
