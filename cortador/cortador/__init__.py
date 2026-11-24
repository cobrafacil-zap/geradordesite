"""
Cortador de Vídeos com Legenda — pipeline profissional de clipes.

Pega uma live/vídeo longo, detecta os melhores takes, formata em 9:16 ou 16:9,
quebra em cortes de 1–3 minutos e entrega legenda profissional (queimada),
título, hashtags e descrição para cada corte.

Módulos:
    probe        — ffprobe, detecção de orientação, filtros de reframe
    analysis     — análise de áudio (energia/emoção) e seleção de melhores takes
    transcribe   — transcrição com faster-whisper (timestamps por palavra)
    captions     — geração de legendas SRT/ASS + modelos de estilo (modelos de legenda)
    metadata     — geração de título, hashtags e descrição por corte
    render       — corte, reframe e queima de legenda via ffmpeg
    pipeline     — orquestra o fluxo completo
    cli          — interface de linha de comando
"""

__version__ = "1.0.0"
__author__ = "Cobrafacil"

try:  # pipeline é opcional no import (facilita testes de módulos isolados)
    from .pipeline import run_pipeline  # noqa: F401
except Exception:  # pragma: no cover
    run_pipeline = None
