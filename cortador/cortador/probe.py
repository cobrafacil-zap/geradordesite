"""Inspeção de mídia via ffprobe + detecção de orientação + construção de filtros de reframe."""

from __future__ import annotations

import json
import subprocess

from .ffbin import FFPROBE
from dataclasses import dataclass, field
from typing import Optional

# Resoluções padrão de saída por formato.
TARGET_SIZES = {
    "9:16": (1080, 1920),
    "16:9": (1920, 1080),
    "1:1": (1080, 1080),
    "4:5": (1080, 1350),
}


@dataclass
class MediaInfo:
    path: str
    width: int
    height: int
    duration: float
    fps: float
    has_audio: bool
    video_codec: str = ""
    audio_codec: str = ""
    aspect: str = "9:16"  # formato detectado
    raw: dict = field(default_factory=dict)

    @property
    def is_vertical(self) -> bool:
        return self.height >= self.width


def _run_ffprobe(path: str) -> dict:
    cmd = [
        FFPROBE, "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", path,
    ]
    out = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def _parse_fps(raw_fps: str) -> float:
    try:
        if "/" in raw_fps:
            num, den = raw_fps.split("/")
            return float(num) / float(den) if float(den) else 25.0
        return float(raw_fps)
    except Exception:
        return 25.0


def detect_aspect(width: int, height: int) -> str:
    """Classifica a proporção em buckets amigáveis para edição."""
    if width <= 0 or height <= 0:
        return "9:16"
    ratio = width / height
    candidates = {
        "9:16": 9 / 16,
        "16:9": 16 / 9,
        "1:1": 1.0,
        "4:5": 4 / 5,
    }
    best = min(candidates.items(), key=lambda kv: abs(ratio - kv[1]))
    return best[0]


def probe(path: str) -> MediaInfo:
    data = _run_ffprobe(path)
    vstream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
    astream = next((s for s in data.get("streams", []) if s.get("codec_type") == "audio"), None)
    if vstream is None:
        raise ValueError(f"Nenhum fluxo de vídeo encontrado em: {path}")

    width = int(vstream.get("width", 0))
    height = int(vstream.get("height", 0))
    fps = _parse_fps(vstream.get("r_frame_rate", "25/1"))

    duration = 0.0
    if vstream.get("duration"):
        duration = float(vstream["duration"])
    elif data.get("format", {}).get("duration"):
        duration = float(data["format"]["duration"])

    return MediaInfo(
        path=path,
        width=width,
        height=height,
        duration=duration,
        fps=fps,
        has_audio=astream is not None,
        video_codec=vstream.get("codec_name", ""),
        audio_codec=(astream or {}).get("codec_name", ""),
        aspect=detect_aspect(width, height),
        raw=data,
    )


def build_reframe_filter(
    info: MediaInfo,
    target_format: str,
    method: str = "blur",
    target_size: Optional[tuple] = None,
) -> tuple[str, int, int]:
    """
    Constrói o filter_complex de reframe e retorna (filtro, out_w, out_h).

    method:
      - 'blur'  : fundo desfocado preenchendo o quadro + vídeo centralizado (profissional)
      - 'crop'  : recorte central que preenche o quadro
      - 'pad'   : barras sólidas (letterbox/pillarbox) preservando o vídeo inteiro
      - 'none'  : apenas escala para o alvo
    """
    out_w, out_h = target_size or TARGET_SIZES.get(target_format, TARGET_SIZES["9:16"])
    src_ratio = info.width / info.height if info.height else 1.0
    out_ratio = out_w / out_h

    # Mesma proporção → só escala.
    if abs(src_ratio - out_ratio) < 0.02 or method == "none":
        filt = (
            f"[0:v]scale={out_w}:{out_h}:force_original_aspect_ratio=decrease,"
            f"pad={out_w}:{out_h}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v]"
        )
        return filt, out_w, out_h

    if method == "crop":
        filt = (
            f"[0:v]scale={out_w}:{out_h}:force_original_aspect_ratio=increase,"
            f"crop={out_w}:{out_h},setsar=1,format=yuv420p[v]"
        )
        return filt, out_w, out_h

    if method == "pad":
        filt = (
            f"[0:v]scale={out_w}:{out_h}:force_original_aspect_ratio=decrease,"
            f"pad={out_w}:{out_h}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v]"
        )
        return filt, out_w, out_h

    # 'blur' (padrão): fundo borrado + vídeo contido.
    filt = (
        f"[0:v]split=2[bg][fg];"
        f"[bg]scale={out_w}:{out_h}:force_original_aspect_ratio=increase,"
        f"crop={out_w}:{out_h},boxblur=24:6,setsar=1[bgv];"
        f"[fg]scale={out_w}:{out_h}:force_original_aspect_ratio=decrease,setsar=1[fgv];"
        f"[bgv][fgv]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]"
    )
    return filt, out_w, out_h
