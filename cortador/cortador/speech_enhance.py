"""Speech Enhancer — isola a voz do fundo (jogo/música) com Demucs.

É o "Speech Enhancer" do Wayin.ai: separa a fala do barulho do jogo para que a
transcrição (e portanto título e legenda) saia precisa. Também serve para deixar
o áudio final com a voz mais limpa.

Uso:
    isolate_vocals("entrada.wav", "voz.wav")   # só a voz (para transcrever)
    enhance_for_video("entrada.wav", "out.wav")  # voz realçada + fundo baixo
"""

from __future__ import annotations

import glob
import os

from .ffbin import FFMPEG
import shutil
import subprocess
import sys
import tempfile


def _run_demucs(in_wav: str, out_dir: str, model: str = "htdemucs") -> str:
    """Roda o Demucs em modo two-stems (vocals / no_vocals) e devolve a pasta do track."""
    cmd = [
        sys.executable, "-m", "demucs",
        "--two-stems", "vocals",
        "-n", model,
        "-o", out_dir,
        in_wav,
    ]
    env = os.environ.copy()
    # força CPU (mais estável que GPU em Mac para este caso)
    env.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")
    proc = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if proc.returncode != 0:
        raise RuntimeError(f"Demucs falhou: {proc.stderr[-500:]}")
    # saída: out_dir/<model>/<nome-do-track>/{vocals,no_vocals}.wav
    track_dirs = glob.glob(os.path.join(out_dir, model, "*"))
    if not track_dirs:
        raise RuntimeError("Demucs não gerou saída.")
    return track_dirs[0]


def isolate_vocals(in_wav: str, out_wav: str, model: str = "htdemucs") -> str:
    """Devolve apenas a voz (vocals), já normalizada — ideal para transcrever com precisão."""
    import subprocess as sp
    tmp = tempfile.mkdtemp(prefix="demucs_")
    try:
        track_dir = _run_demucs(in_wav, tmp, model)
        vocals = os.path.join(track_dir, "vocals.wav")
        if not os.path.exists(vocals):
            raise RuntimeError("vocals.wav não encontrado no output do Demucs.")
        # normaliza a voz (Demucs devolve baixa) para o Whisper acertar
        sp.run([FFMPEG, "-y", "-v", "error", "-i", vocals,
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95",
                out_wav], check=True)
        return out_wav
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def enhance_for_video(in_wav: str, out_wav: str, model: str = "htdemucs",
                      bg_level: float = 0.25) -> str:
    """Voz realçada + pouco do fundo (jogo/música) — áudio final mais limpo e audível."""
    import subprocess as sp
    tmp = tempfile.mkdtemp(prefix="demucs_")
    try:
        track_dir = _run_demucs(in_wav, tmp, model)
        vocals = os.path.join(track_dir, "vocals.wav")
        no_vocals = os.path.join(track_dir, "no_vocals.wav")
        if not os.path.exists(vocals):
            raise RuntimeError("vocals.wav não encontrado.")
        if os.path.exists(no_vocals):
            # mistura: voz no talo + fundo bem mais baixo
            cmd = [
                FFMPEG, "-y", "-v", "error",
                "-i", vocals, "-i", no_vocals,
                "-filter_complex",
                f"[0:a]volume=1.0[voz];[1:a]volume={bg_level}[fundo];"
                f"[voz][fundo]amix=inputs=2:duration=first:dropout_transition=0,"
                f"loudnorm=I=-15:TP=-1.5,alimiter=limit=0.95[out]",
                "-map", "[out]", out_wav,
            ]
        else:
            cmd = [FFMPEG, "-y", "-v", "error", "-i", vocals,
                   "-af", "loudnorm=I=-15:TP=-1.5,alimiter=limit=0.95", out_wav]
        sp.run(cmd, check=True)
        return out_wav
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
