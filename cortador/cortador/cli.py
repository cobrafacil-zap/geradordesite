"""Linha de comando do Cortador de Vídeos."""

from __future__ import annotations

import argparse
import os
import sys

from .pipeline import PipelineOptions, run_pipeline
from .styles import list_styles


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="cortador",
        description="Corta lives/vídeos longos nos melhores takes, com legenda profissional, "
                    "título e hashtags prontos para TikTok/Reels/Shorts.",
    )
    p.add_argument("input", nargs="?", default=None,
                   help="Arquivo de vídeo (live/cap) de entrada")
    p.add_argument("-o", "--output", default="output", help="Pasta de saída (padrão: output)")
    p.add_argument("-n", "--count", type=int, default=5, help="Quantidade de cortes (padrão: 5)")
    p.add_argument("--min-len", type=float, default=60, help="Duração mínima do corte em s")
    p.add_argument("--max-len", type=float, default=180, help="Duração máxima do corte em s")
    p.add_argument("--target-len", type=float, default=90, help="Duração alvo do corte em s")
    p.add_argument("--format", dest="target_format", default="9:16",
                   choices=["9:16", "16:9", "1:1", "4:5", "auto"],
                   help="Formato de saída (auto detecta pela entrada)")
    p.add_argument("--reframe", default="blur", choices=["blur", "crop", "pad", "none"],
                   help="Como enquadrar quando o formato mudar")
    p.add_argument("--style", default="gaming_bold",
                   choices=[s["key"] for s in list_styles()],
                   help="Modelo de legenda")
    p.add_argument("--game", default="GTA RP", help="Jogo/nicho para os títulos")
    p.add_argument("--language", default="pt", help="Idioma da transcrição")
    p.add_argument("--model", dest="model_size", default="small",
                   choices=["tiny", "base", "small", "medium", "large"],
                   help="Modelo de transcrição")
    p.add_argument("--engine", default="faster", choices=["faster", "mlx"],
                   help="Motor de transcrição")
    p.add_argument("--zoom", type=float, default=0.0, help="Zoom lento (0 = desligado)")
    p.add_argument("--logo", default=None, help="PNG de logo (marca d'água)")
    p.add_argument("--banner", default=None, help="PNG de banner/topo")
    p.add_argument("--no-emoji", action="store_true", help="Desliga emoji nas legendas")
    p.add_argument("--no-progress", action="store_true", help="Desliga a barra de progresso")
    p.add_argument("--no-render", action="store_true",
                   help="Só gera legendas/metadata, não renderiza vídeo")
    p.add_argument("--styles", action="store_true", help="Lista os modelos de legenda e sai")
    return p


def main(argv=None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.styles:
        print("Modelos de legenda disponíveis:\n")
        for s in list_styles():
            print(f"  • {s['key']:12} — {s['label']}: {s['description']}")
        return 0

    if not args.input:
        print("❌ Informe o arquivo de vídeo de entrada (ou use --styles).", file=sys.stderr)
        return 1
    if not os.path.exists(args.input):
        print(f"❌ Arquivo não encontrado: {args.input}", file=sys.stderr)
        return 1

    opts = PipelineOptions(
        output_dir=args.output,
        count=args.count,
        min_len=args.min_len,
        max_len=args.max_len,
        target_len=args.target_len,
        target_format=args.target_format,
        reframe=args.reframe,
        style=args.style,
        emoji=not args.no_emoji,
        progress_bar=not args.no_progress,
        zoom=args.zoom,
        logo=args.logo,
        banner=args.banner,
        game=args.game,
        language=args.language,
        model_size=args.model_size,
        engine=args.engine,
        render_video=not args.no_render,
    )

    run_pipeline(args.input, opts)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
