"""Score de viralidade multi-eixo — engenharia reversa de Opus Clip, Klap e Vizard.

Em vez de um único número mágico, cada corte é pontuado em eixos que as
plataformas líderes usam para prever desempenho:

  hook      — força dos primeiros 3s (gatilho de curiosidade/emoção)
  emotion   — picos de energia/emoção (grito, risada, impacto)
  dynamics  — altos e baixos (ritmo editável, retenção)
  speech    — densidade e ritmo de fala (clareza do conteúdo)
  semantic  — palavras de surpresa/curiosidade/emoção no texto
  trend     — presença de termos em alta no nicho
  loop      — sensação de fechamento / "quero ver de novo"

Saída: score 0–100 + breakdown + razões em linguagem humana.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field
from typing import Dict, List, Optional

import numpy as np

from .analysis import AudioStats
from .transcribe import Transcript


def _strip(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


_HOOK_OPENERS = [
    r"\bnao acredito", r"\bnao vai acreditar", r"\bolha (so )?isso", r"\bve (isso|so)",
    r"\bdescobri", r"\bdescobre", r"\bcomo (eu|a gente)", r"\bpor que", r"\bvoce (sabia|imaginava)",
    r"\bepico", r"\bsurreal", r"\binsano", r"\bimpossivel", r"\bnao (da|dá) pra", r"\bmano", r"\bcara",
    r"\bpresta atencao", r"\bnao perca", r"\bexatamente", r"\bimagine",
]

_EMOTION_TERMS = [
    "nao", "nunca", "nada", "ninguem", "absurdo", "surreal", "louco", "insano", "epico",
    "incrivel", "impossivel", "grito", "susto", "caos", "fuga", "assalto", "policia", "tiro",
    "explode", "morreu", "ganhou", "perdeu", "recorde", "dinheiro", "milhao", "caramba",
    "meu deus", "oloko", "wtf", "kkk", "haha", "piada", "verdade", "chocante", "surpreendeu",
]

_TREND_TERMS = [
    "gta", "gta rp", "gta 6", "gta vi", "rp", "roleplay", "fivem", "stream", "live", "clip",
    "viral", "trend", "desafio", "5 estrelas", "assalto", "fuga", "corrida", "policial",
    "caixa eletronico", "skyline", "brian", "tuning", "drift",
]


@dataclass
class ViralityScore:
    total: float
    axes: Dict[str, float]
    reasons: List[str] = field(default_factory=list)
    label: str = ""

    def to_dict(self):
        return {"total": round(self.total, 1), "axes": {k: round(v, 2) for k, v in self.axes.items()},
                "label": self.label, "reasons": self.reasons}


def _norm_words(text: str) -> List[str]:
    return re.findall(r"[a-z0-9']+", _strip(text).lower())


def _clip_energy(audio: Optional[AudioStats], start: float, end: float) -> np.ndarray:
    if audio is None or len(audio.energy) == 0:
        return np.zeros(1)
    a = max(0, int(start))
    b = max(a + 1, int(end))
    seg = audio.energy[a:b]
    return seg if len(seg) else np.zeros(1)


def score_clip(
    start: float,
    end: float,
    audio: Optional[AudioStats],
    transcript: Optional[Transcript] = None,
) -> ViralityScore:
    duration = max(1.0, end - start)
    seg_e = _clip_energy(audio, start, end)

    # --- eixos baseados em áudio ---
    mean_e = float(seg_e.mean())
    peak_e = float(np.percentile(seg_e, 95)) if len(seg_e) else 0.0
    dyn = float(seg_e.std()) if len(seg_e) else 0.0
    hook_e = float(np.percentile(seg_e[: max(1, min(len(seg_e), 4))], 90)) if len(seg_e) else 0.0

    emotion = float(min(1.0, peak_e * 1.1))
    dynamics = float(min(1.0, dyn * 3.0))
    hook = float(min(1.0, 0.5 * hook_e + 0.5 * (peak_e * 0.8)))

    # --- eixos baseados em texto ---
    speech = 0.4
    semantic = 0.2
    trend = 0.15
    loop = 0.3
    reasons: List[str] = []

    if transcript and transcript.text:
        words = _norm_words(transcript.text)
        nwords = len(words)
        wps = nwords / duration
        # ritmo saudável de fala: ~2–4 palavras/segundo em PT
        if 1.6 <= wps <= 4.5:
            speech = 0.7 + min(0.3, (4.5 - abs(wps - 3.0)) / 10)
        elif wps > 4.5:
            speech = 0.6
        else:
            speech = max(0.25, wps / 4.0)

        joined = " ".join(words)
        emo_hits = sum(1 for t in _EMOTION_TERMS if t in joined)
        semantic = min(1.0, 0.2 + emo_hits * 0.12)
        trend_hits = sum(1 for t in _TREND_TERMS if t in joined)
        trend = min(1.0, 0.15 + trend_hits * 0.18)

        # hook: primeiras palavras casam com gatilhos
        first = " ".join(words[:12])
        hook_txt = 0.0
        for pat in _HOOK_OPENERS:
            if re.search(pat, first):
                hook_txt = 0.9
                break
        if re.search(r"[!?]", first):
            hook_txt = max(hook_txt, 0.7)
        hook = min(1.0, 0.55 * hook + 0.45 * hook_txt + (0.15 if peak_e > 0.7 else 0))

        # loop: termina em clímax (últimos 2s com energia alta) + frase curta/impacto
        tail = seg_e[-max(1, len(seg_e) // 8):] if len(seg_e) else seg_e
        loop = float(min(1.0, 0.4 + (float(tail.mean()) if len(tail) else 0) * 0.8))

        if emo_hits >= 2:
            reasons.append("linguagem de alta emoção")
        if hook_txt >= 0.7:
            reasons.append("abre com um hook forte")
        if trend_hits >= 1:
            reasons.append("tema em alta no nicho")

    if emotion > 0.7:
        reasons.append("picos de energia/emoção")
    if dynamics > 0.5:
        reasons.append("ritmo dinâmico")
    if speech > 0.65:
        reasons.append("fala clara e bem ritmada")
    if loop > 0.6:
        reasons.append("fecha em clímax (bom pra loop)")

    axes = {
        "hook": hook,
        "emotion": emotion,
        "dynamics": dynamics,
        "speech": speech,
        "semantic": semantic,
        "trend": trend,
        "loop": loop,
    }
    weights = {"hook": 1.15, "emotion": 1.1, "dynamics": 0.9, "speech": 0.9,
               "semantic": 1.0, "trend": 0.8, "loop": 0.7}
    total = sum(axes[k] * weights[k] for k in axes) / sum(weights.values())
    total = float(round(min(100.0, max(0.0, total * 100)), 1))

    if total >= 75:
        label = "🔥 Altíssimo potencial viral"
    elif total >= 60:
        label = "🚀 Ótimo corte"
    elif total >= 45:
        label = "👍 Bom corte"
    else:
        label = "🎬 Corte regular"

    return ViralityScore(total=total, axes=axes, reasons=reasons, label=label)
