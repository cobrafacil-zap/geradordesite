"""Transcrição com faster-whisper, incluindo timestamps por palavra.

Suporta dois motores:
  - 'faster' (padrão): faster-whisper (ctranslate2) — preciso, timestamps por palavra.
  - 'mlx': mlx-whisper (Apple Silicon / Metal) — mais rápido em Mac M1/M2/M3.

O idioma padrão é português ('pt'), com auto-detect opcional.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Word:
    text: str
    start: float
    end: float


@dataclass
class Segment:
    start: float
    end: float
    text: str
    words: List[Word] = field(default_factory=list)


@dataclass
class Transcript:
    language: str
    segments: List[Segment]
    text: str

    @property
    def words(self) -> List[Word]:
        out: List[Word] = []
        for s in self.segments:
            out.extend(s.words)
        return out


def _get_faster_model(model_size: str):
    """Carrega e cacheia o modelo (evita recarregar a cada corte)."""
    from faster_whisper import WhisperModel

    if not hasattr(_get_faster_model, "_cache"):
        _get_faster_model._cache = {}
    if model_size not in _get_faster_model._cache:
        _get_faster_model._cache[model_size] = WhisperModel(
            model_size, device="cpu", compute_type="int8"
        )
    return _get_faster_model._cache[model_size]


def _transcribe_faster(
    audio_path: str,
    model_size: str,
    language: str,
    beam_size: int,
) -> Transcript:
    model = _get_faster_model(model_size)
    segments_iter, info = model.transcribe(
        audio_path,
        language=language or None,
        beam_size=beam_size,
        word_timestamps=True,
        vad_filter=True,
    )

    segs: List[Segment] = []
    texts: List[str] = []
    for seg in segments_iter:
        words = [
            Word(w.word.strip(), float(w.start), float(w.end))
            for w in (seg.words or [])
            if w.word and w.word.strip()
        ]
        segs.append(Segment(float(seg.start), float(seg.end), seg.text.strip(), words))
        texts.append(seg.text.strip())

    return Transcript(
        language=getattr(info, "language", language or "pt"),
        segments=segs,
        text=" ".join(t for t in texts if t),
    )


def _transcribe_mlx(audio_path: str, model_size: str, language: str) -> Transcript:
    import mlx_whisper  # type: ignore

    repo = {
        "tiny": "mlx-community/whisper-tiny",
        "base": "mlx-community/whisper-base",
        "small": "mlx-community/whisper-small",
        "medium": "mlx-community/whisper-medium",
        "large": "mlx-community/whisper-large-v3",
        "large-v3-turbo": "mlx-community/whisper-large-v3-turbo",
    }.get(model_size, "mlx-community/whisper-small")

    result = mlx_whisper.transcribe(
        audio_path,
        path_or_hf_repo=repo,
        language=language or None,
        word_timestamps=True,
    )

    segs: List[Segment] = []
    texts: List[str] = []
    for seg in result.get("segments", []):
        words = [
            Word(w["word"].strip(), float(w["start"]), float(w["end"]))
            for w in (seg.get("words") or [])
            if w.get("word") and w["word"].strip()
        ]
        text = seg.get("text", "").strip()
        segs.append(Segment(float(seg["start"]), float(seg["end"]), text, words))
        texts.append(text)

    return Transcript(
        language=result.get("language", language or "pt"),
        segments=segs,
        text=" ".join(t for t in texts if t),
    )


def transcribe(
    audio_path: str,
    engine: str = "faster",
    model_size: str = "small",
    language: str = "pt",
    beam_size: int = 5,
) -> Transcript:
    """Transcreve um arquivo de áudio/vídeo e devolve segmentos com palavras."""
    if engine == "mlx":
        try:
            return _transcribe_mlx(audio_path, model_size, language)
        except Exception:
            # fallback seguro
            return _transcribe_faster(audio_path, model_size, language, beam_size)
    return _transcribe_faster(audio_path, model_size, language, beam_size)


def transcribe_clip(
    clip_path: str,
    offset: float = 0.0,
    engine: str = "faster",
    model_size: str = "small",
    language: str = "pt",
) -> Transcript:
    """Transcreve um corte e reajusta os timestamps para o tempo absoluto da live."""
    tr = transcribe(clip_path, engine=engine, model_size=model_size, language=language)
    if offset:
        for seg in tr.segments:
            seg.start += offset
            seg.end += offset
            for w in seg.words:
                w.start += offset
                w.end += offset
    return tr
