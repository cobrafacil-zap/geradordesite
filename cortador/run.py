#!/usr/bin/env python3
"""Ponto de entrada do Cortador de Vídeos.

Uso rápido:
    pip install -r requirements-cli.txt
    python3 run.py "minha_live.mp4" -n 5 --style gaming_bold --format 9:16
    python3 run.py "minha_live.mp4" --styles      # lista os modelos de legenda
"""
from cortador.cli import main

if __name__ == "__main__":
    raise SystemExit(main())
