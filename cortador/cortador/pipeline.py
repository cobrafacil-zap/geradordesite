"""Pipeline completo: da live crua aos cortes prontos com legenda, título e hashtags."""

from __future__ import annotations

import json
import os
import re
import subprocess
from dataclasses import dataclass, field, asdict
from typing import List, Optional

from . import analysis, caption_engine, glossary, metadata, paint, virality
from .captions import write_subtitles
from .probe import probe, MediaInfo, TARGET_SIZES
from .render import RenderConfig, render_clip
from .styles import get_style
from .transcribe import transcribe


@dataclass
class PipelineOptions:
    output_dir: str = "output"
    count: int = 5
    min_len: float = 60.0
    max_len: float = 180.0
    target_len: float = 90.0
    target_format: str = "9:16"       # 9:16 | 16:9 | 1:1 | 4:5 | auto
    reframe: str = "blur"             # blur | crop | pad | none
    style: str = "gaming_bold"        # ver styles.STYLES
    emoji: bool = True
    progress_bar: bool = True
    zoom: float = 0.0
    logo: Optional[str] = None
    banner: Optional[str] = None
    game: str = "GTA RP"
    language: str = "pt"
    model_size: str = "small"
    engine: str = "faster"            # faster | mlx
    render_video: bool = True
    ffmpeg: str = "ffmpeg"


def _slugify(text: str, max_len: int = 40) -> str:
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:max_len].strip("-") or "corte"


def _extract_audio_range(src: str, start: float, end: float, out_wav: str, sr: int = 16000):
    cmd = ["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-i", src,
           "-t", f"{max(0.5, end - start):.3f}", "-vn", "-ac", "1", "-ar", str(sr), out_wav]
    subprocess.run(cmd, check=True)
    return out_wav


def run_pipeline(input_path: str, options: Optional[PipelineOptions] = None, log=print) -> dict:
    opts = options or PipelineOptions()
    out_dir = os.path.abspath(opts.output_dir)
    clips_dir = os.path.join(out_dir, "cortes")
    work_dir = os.path.join(out_dir, "_work")
    os.makedirs(clips_dir, exist_ok=True)
    os.makedirs(work_dir, exist_ok=True)

    log(f"🔎 Analisando mídia: {input_path}")
    info: MediaInfo = probe(input_path)
    src_fmt = info.aspect
    target_fmt = opts.target_format
    if target_fmt == "auto":
        target_fmt = "9:16" if info.is_vertical else "16:9"
    log(f"   • Formato de entrada: {src_fmt} ({info.width}x{info.height}) · duração {info.duration:.0f}s")
    log(f"   • Formato de saída:  {target_fmt}")

    log("🎧 Analisando áudio para achar os melhores takes…")
    wins, stats = analysis.analyze_and_select(
        input_path, count=opts.count, min_len=opts.min_len,
        max_len=opts.max_len, target_len=opts.target_len,
    )
    log(f"   • {len(wins)} janelas candidatas selecionadas")

    style = get_style(opts.style)
    out_w, out_h = TARGET_SIZES.get(target_fmt, TARGET_SIZES["9:16"])

    results = []
    for i, w in enumerate(wins, 1):
        log(f"\n🎬 Corte {i}/{len(wins)}  [{w.start:.0f}s → {w.end:.0f}s]  ({w.duration:.0f}s)")

        # 1) transcreve o trecho
        wav = os.path.join(work_dir, f"win_{i}.wav")
        _extract_audio_range(input_path, w.start, w.end, wav)
        tr = transcribe(wav, engine=opts.engine, model_size=opts.model_size, language=opts.language)
        # reajusta timestamps para o tempo absoluto da live
        for seg in tr.segments:
            seg.start += w.start
            seg.end += w.start
            for wd in seg.words:
                wd.start += w.start
                wd.end += w.start
        try:
            os.remove(wav)
        except OSError:
            pass

        # context grounding: corrige nomes/térmicos do nicho (ex.: "GTA RP", "Skyline")
        for seg in tr.segments:
            seg.text = glossary.ground_text(seg.text)
            for wd in seg.words:
                wd.text = glossary.ground_text(wd.text)
        tr.text = glossary.ground_text(tr.text)

        log(f"   • transcrição: {len(tr.segments)} segmentos · idioma {tr.language}")

        # 2) viralidade
        vs = virality.score_clip(w.start, w.end, stats, tr)
        log(f"   • viralidade: {vs.total:.0f}/100 {vs.label}")

        # 3) metadata
        meta = metadata.generate_metadata(
            tr.text, category=metadata.detect_category(tr.text),
            game=opts.game, virality_label=vs.label, virality_total=vs.total,
        )
        meta = metadata.llm_refine(tr.text, meta) or meta

        # 4) eventos de legenda
        events = caption_engine.build_events(
            tr, max_chars_per_line=style.max_chars_per_line,
            max_lines=style.max_lines, emoji=opts.emoji,
        )

        # 5) nomes de arquivo
        base = f"corte_{i:02d}_{_slugify(meta['title'])}"
        mp4 = os.path.join(clips_dir, base + ".mp4")
        srt = os.path.join(clips_dir, base + ".srt")
        ass = os.path.join(clips_dir, base + ".ass")
        js = os.path.join(clips_dir, base + ".json")

        # 6) legendas (arquivos entregáveis)
        write_subtitles(tr, os.path.join(clips_dir, base),
                        style_key=opts.style, play_res=(out_w, out_h), offset=w.start)

        # 7) renderiza o vídeo
        render_status = "pulado"
        if opts.render_video:
            rcfg = RenderConfig(
                target_format=target_fmt, reframe=opts.reframe, style=opts.style,
                progress_bar=opts.progress_bar, zoom=opts.zoom,
                logo=opts.logo, banner=opts.banner,
            )
            render_clip(input_path, info, w.start, w.duration, events, mp4,
                        cfg=rcfg, workdir=work_dir, ffmpeg=opts.ffmpeg)
            render_status = "ok"

        # 8) JSON do corte
        clip_data = {
            "index": i,
            "file": os.path.basename(mp4) if opts.render_video else None,
            "start": round(w.start, 2),
            "end": round(w.end, 2),
            "duration": round(w.duration, 2),
            "audio_reason": w.reason,
            "virality": vs.to_dict(),
            "metadata": meta,
            "transcript": tr.text,
            "captions": [
                {"start": round(e.start, 2), "end": round(e.end, 2), "text": e.text,
                 "highlight": e.highlight_words, "emoji": e.emoji}
                for e in events
            ],
            "subtitles": {"srt": os.path.basename(srt), "ass": os.path.basename(ass)},
            "render": render_status,
        }
        with open(js, "w", encoding="utf-8") as f:
            json.dump(clip_data, f, ensure_ascii=False, indent=2)

        results.append(clip_data)
        log(f"   • título: {meta['title']}")
        log(f"   • hashtags: {meta['hashtags_str']}")
        log(f"   • render: {render_status}")

    # 9) relatórios
    report = {
        "source": input_path,
        "source_format": src_fmt,
        "target_format": target_fmt,
        "style": opts.style,
        "clips": results,
    }
    with open(os.path.join(out_dir, "report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    _write_markdown(report, os.path.join(out_dir, "report.md"))

    log(f"\n✅ Pronto! {len(results)} cortes em: {clips_dir}")
    log(f"📄 Relatórios: report.json · report.md")
    return report


def _write_markdown(report: dict, path: str):
    lines = [
        "# 🎬 Cortes gerados",
        "",
        f"**Fonte:** `{report['source']}`  ",
        f"**Formato:** {report['source_format']} → {report['target_format']}  ",
        f"**Modelo de legenda:** {report['style']}",
        "",
        "---",
        "",
    ]
    for c in report["clips"]:
        m = c["metadata"]
        v = c["virality"]
        lines += [
            f"## {c['index']}. {m['title']}",
            "",
            f"- ⏱️ **Corte:** `{c['start']:.0f}s → {c['end']:.0f}s` ({c['duration']:.0f}s)",
            f"- 📈 **Viralidade:** **{v['total']}/100** {v['label']}",
            f"- 🎯 **Por quê:** {', '.join(v['reasons']) or '—'}",
            f"- 🏷️ **Categoria:** {m['category']}",
            f"- 🎬 **Arquivo:** `{c.get('file') or '—'}`",
            "",
            "**Título:** " + m["title"],
            "",
            "**Outros títulos:**",
            "",
        ]
        for t in m.get("title_options", [])[1:5]:
            lines.append(f"- {t}")
        lines += [
            "",
            "**Hashtags:**",
            "",
            "```\n" + m["hashtags_str"] + "\n```",
            "",
            "**Descrição:**",
            "",
            "```",
            m["description"],
            "```",
            "",
            f"**Transcrição:** {c['transcript'][:300]}{'…' if len(c['transcript'])>300 else ''}",
            "",
            "---",
            "",
        ]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
