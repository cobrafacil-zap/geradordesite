"""Análise de áudio para encontrar os 'melhores takes' de uma live longa.

Estratégia rápida e escalável (funciona bem em lives de 2h+):
  1. Extrai o áudio para WAV mono 16kHz (barato).
  2. Calcula energia (RMS) por janela curta.
  3. Pontua cada segundo com um mix de: volume, picos de emoção (grito/risada),
     densidade de fala (voz presente) e variação dinâmica.
  4. Varre janelas deslizantes (60–180s) e escolhe as de maior pontuação,
     sem sobreposição, encaixando os cortes em pausas naturais.
"""

from __future__ import annotations

import subprocess
import tempfile

from .ffbin import FFMPEG
import os
from dataclasses import dataclass
from typing import List, Optional

import numpy as np

try:
    from scipy.io import wavfile as _wavfile
except Exception:  # pragma: no cover
    _wavfile = None


@dataclass
class Window:
    start: float
    end: float
    score: float
    reason: str = ""

    @property
    def duration(self) -> float:
        return self.end - self.start


@dataclass
class AudioStats:
    duration: float
    energy: np.ndarray          # energia por segundo (normalizada 0..1)
    speech_ratio: float         # fração do tempo com voz
    peak_energy: float
    times: np.ndarray           # eixo temporal (s)


def extract_wav(path: str, sr: int = 16000) -> str:
    """Extrai áudio mono PCM para WAV temporário. Retorna o caminho."""
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    cmd = [
        FFMPEG, "-y", "-v", "error", "-i", path,
        "-vn", "-ac", "1", "-ar", str(sr),
        "-f", "wav", tmp.name,
    ]
    subprocess.run(cmd, check=True)
    return tmp.name


def _load_wav(path: str):
    if _wavfile is None:
        raise RuntimeError("scipy não disponível para ler WAV")
    sr, data = _wavfile.read(path)
    if data.dtype != np.float32 and data.dtype != np.float64:
        data = data.astype(np.float32) / np.iinfo(data.dtype).max
    return sr, data.astype(np.float32)


def compute_stats(audio_path: str, sr: int = 16000, hop_sec: float = 1.0) -> AudioStats:
    """Calcula a curva de energia por segundo e métricas globais."""
    sample_rate, data = _load_wav(audio_path)
    if data.ndim > 1:
        data = data.mean(axis=1)

    hop = int(sample_rate * hop_sec)
    n_hops = max(1, len(data) // hop)
    energy = np.zeros(n_hops, dtype=np.float32)

    # RMS por janela + detecção simples de "voz ativa" via energia acima do piso.
    for i in range(n_hops):
        seg = data[i * hop:(i + 1) * hop]
        if len(seg) == 0:
            continue
        energy[i] = float(np.sqrt(np.mean(seg ** 2)))

    # Normaliza por percentil alto (robusto a outliers de grito).
    ref = np.percentile(energy, 95) or 1.0
    energy_norm = np.clip(energy / (ref + 1e-9), 0, 1.5)

    # "Voz presente": energia acima de 12% do piso de referência.
    speech_mask = energy > (ref * 0.12)
    speech_ratio = float(speech_mask.mean()) if len(speech_mask) else 0.0

    times = np.arange(n_hops) * hop_sec
    return AudioStats(
        duration=float(len(data) / sample_rate),
        energy=energy_norm.astype(np.float32),
        speech_ratio=speech_ratio,
        peak_energy=float(energy_norm.max()) if len(energy_norm) else 0.0,
        times=times,
    )


def _moving_average(x: np.ndarray, k: int) -> np.ndarray:
    if k <= 1 or len(x) == 0:
        return x
    kernel = np.ones(k, dtype=np.float32) / k
    return np.convolve(x, kernel, mode="same")


def score_windows(
    stats: AudioStats,
    min_len: float = 60.0,
    max_len: float = 180.0,
    target_len: float = 90.0,
    step_sec: float = 5.0,
) -> List[Window]:
    """Varre janelas deslizantes e devolve candidatas pontuadas (descrescente)."""
    energy = stats.energy
    if len(energy) == 0:
        return []

    dur = stats.duration
    # Suaviza para achar "trechos bons" sustentados, mantém picos para emoção.
    smooth = _moving_average(energy, 8)
    peak = _moving_average(np.maximum(energy - smooth, 0), 3)  # picos acima da média

    candidates: List[Window] = []
    t = 0.0
    while t + min_len <= dur:
        length = min(target_len, dur - t)
        a = int(t)
        b = int(min(t + length, dur))
        if b - a < min_len and t + min_len <= dur:
            b = int(t + min_len)
        seg_e = smooth[a:b]
        seg_p = peak[a:b]
        if len(seg_e) == 0:
            t += step_sec
            continue

        mean_e = float(seg_e.mean())
        peak_bonus = float(seg_p.mean())
        # Variação dinâmica: momentos com altos e baixos são mais "editáveis".
        dyn = float(seg_e.std())
        score = mean_e * 1.0 + peak_bonus * 1.6 + dyn * 0.8

        reason = []
        if peak_bonus > 0.12:
            reason.append("pico de emoção")
        if mean_e > 0.55:
            reason.append("alta energia")
        if dyn > 0.18:
            reason.append("dinâmico")
        candidates.append(Window(t, t + length, score, ", ".join(reason)))
        t += step_sec

    candidates.sort(key=lambda w: w.score, reverse=True)
    return candidates


def _snap_to_silence(stats: AudioStats, t: float, search: float = 3.0) -> float:
    """Aproxima um instante de um vale local de energia (corte mais limpo)."""
    energy = stats.energy
    if len(energy) == 0:
        return t
    a = max(0, int(t - search))
    b = min(len(energy), int(t + search))
    if b <= a:
        return t
    local = energy[a:b]
    idx = int(np.argmin(local))
    return float(a + idx)


def select_best(
    stats: AudioStats,
    count: int = 5,
    min_len: float = 60.0,
    max_len: float = 180.0,
    target_len: float = 90.0,
    min_gap: float = 10.0,
    snap: bool = True,
) -> List[Window]:
    """Escolhe os melhores cortes não sobrepostos, encaixados em pausas."""
    cands = score_windows(stats, min_len, max_len, target_len)
    chosen: List[Window] = []

    for cand in cands:
        if len(chosen) >= count:
            break
        # Evita sobreposição com os já escolhidos.
        conflict = False
        for c in chosen:
            if not (cand.end + min_gap <= c.start or cand.start >= c.end + min_gap):
                conflict = True
                break
        if conflict:
            continue

        start, end = cand.start, cand.end
        if snap:
            start = _snap_to_silence(stats, start)
            end = _snap_to_silence(stats, end)
            if end - start < min_len * 0.6:
                end = start + min_len
        # Limita em [min_len, max_len] respeitando a duração total.
        end = min(end, stats.duration)
        if end - start > max_len:
            end = start + max_len
        if end - start < min_len:
            continue

        chosen.append(Window(start, end, cand.score, cand.reason))

    chosen.sort(key=lambda w: w.start)
    return chosen


def analyze_and_select(
    video_path: str,
    count: int = 5,
    min_len: float = 60.0,
    max_len: float = 180.0,
    target_len: float = 90.0,
    keep_wav: Optional[str] = None,
) -> tuple[List[Window], AudioStats]:
    """Pipeline completo: extrai áudio, analisa e seleciona os melhores cortes."""
    wav = extract_wav(video_path)
    try:
        stats = compute_stats(wav)
        # vídeo curto (menor que o tamanho mínimo de corte): usa o vídeo inteiro,
        # dividido em partes iguais se pedirem mais de um corte
        if stats.duration <= min_len:
            n = max(1, int(count))
            part = stats.duration / n
            wins = [
                Window(start=round(i * part, 2),
                       end=round(stats.duration if i == n - 1 else (i + 1) * part, 2),
                       score=1.0, reason="vídeo curto: corte único")
                for i in range(n)
            ]
            if keep_wav:
                os.replace(wav, keep_wav)
            return wins, stats
        wins = select_best(stats, count=count, min_len=min_len, max_len=max_len, target_len=target_len)
        if keep_wav:
            os.replace(wav, keep_wav)
        return wins, stats
    finally:
        if os.path.exists(wav) and not keep_wav:
            os.remove(wav)
