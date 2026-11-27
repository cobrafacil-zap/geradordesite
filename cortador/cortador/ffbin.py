"""Localiza os binários do ffmpeg/ffprobe.

No macOS o ffmpeg costuma estar em /opt/homebrew/bin (fora do PATH padrão de
alguns terminais/apps); no Docker/Linux está no PATH. Isso evita o erro
"command not found: ffmpeg".
"""
from __future__ import annotations

import os
import shutil

_FALLBACKS = (
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/usr/bin",
    "/opt/local/bin",
)


def _find(name: str) -> str:
    found = shutil.which(name)
    if found:
        return found
    for folder in _FALLBACKS:
        p = os.path.join(folder, name)
        if os.path.isfile(p) and os.access(p, os.X_OK):
            return p
    return name  # deixa o SO resolver (mensagem de erro padrão)


FFMPEG = _find("ffmpeg")
FFPROBE = _find("ffprobe")
