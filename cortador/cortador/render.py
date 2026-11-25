"""Renderização de um corte via ffmpeg.

Compõe: corte temporal + reframe (9:16/16:9/1:1) + zoom opcional +
overlays (logo, banner) + barra de progresso + legendas (PNG pintadas no Pillow).

Como o build do ffmpeg do usuário pode não ter libass/drawtext, usamos os
filtros universais `overlay` e `drawbox` (sempre presentes) com PNGs prontos.
Se um ffmpeg com libass estiver disponível, você pode optar por queimar .ass
diretamente (ver `burn_ass_if_available`).
"""

from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass, field
from typing import List, Optional, Tuple

from .caption_engine import CaptionEvent
from .probe import MediaInfo, build_reframe_filter, TARGET_SIZES
from .styles import CaptionStyle, get_style
from . import paint


@dataclass
class OverlayImage:
    path: str
    x: str          # expressão ffmpeg (ex: "40", "w-w-40", "(w-overlay_w)/2")
    y: str
    scale: Optional[Tuple[int, int]] = None  # redimensiona antes de sobrepor


@dataclass
class RenderConfig:
    target_format: str = "9:16"
    reframe: str = "blur"          # blur | crop | pad | none
    style: str = "gaming_bold"
    progress_bar: bool = True
    progress_color: str = "0xFF2864@0.95"
    progress_track: str = "0xFFFFFF@0.22"
    zoom: float = 0.0              # 0 = sem zoom; >0 = zoom lento (ex: 0.12)
    logo: Optional[str] = None
    banner: Optional[str] = None
    safe_bottom: int = 170         # respiro para a UI do TikTok/Reels/Shorts
    audio_normalize: bool = True   # normaliza o volume (lives costumam sair baixas)
    audio_target: str = "-14"      # LUFS alvo (padrão de streaming)
    title_intro: bool = True       # mostra o título grande no começo do corte
    crf: int = 20
    preset: str = "veryfast"
    audio_bitrate: str = "192k"
    fps: Optional[int] = None


def _esc_filter_path(p: str) -> str:
    """Escapa um caminho para uso dentro de filter_complex (ffmpeg)."""
    return p.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")


def _has_libass(ffmpeg: str = "ffmpeg") -> bool:
    try:
        out = subprocess.run([ffmpeg, "-hide_banner", "-filters"],
                             capture_output=True, text=True).stdout
        return "subtitles" in out or " ass " in out
    except Exception:
        return False


def build_filtergraph(
    info: MediaInfo,
    cfg: RenderConfig,
    events: List[CaptionEvent],
    cap_pngs: List[str],
    duration: float,
    workdir: str,
    title_png: Optional[str] = None,
    title_duration: float = 3.2,
) -> Tuple[str, int, int, List[str], List[str]]:
    """Monta o filter_complex. Retorna (filtro, out_w, out_h, inputs_extra, cmd_prefix_paths)."""
    target_size = TARGET_SIZES.get(cfg.target_format, TARGET_SIZES["9:16"])
    out_w, out_h = target_size

    reframe_f, out_w, out_h = build_reframe_filter(info, cfg.target_format, cfg.reframe, target_size)
    # renomeia a saída do reframe para [vbase]
    reframe_f = reframe_f.replace("[v]", "[vbase]")
    parts = [reframe_f]
    cur = "[vbase]"

    # --- zoom lento opcional (Ken Burns) ---
    if cfg.zoom and cfg.zoom > 0:
        z = cfg.zoom
        parts.append(
            f"{cur}scale=iw*1.15:ih*1.15,"
            f"crop=iw/1.15:ih/1.15:x='(iw-ow)/2':y='(ih-oh)/2',"
            f"zoompan=z='min(1.0+{z}*on/{max(1,int(duration*25))},1.25)'"
            f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={out_w}x{out_h}:fps=25[vz]"
        )
        cur = "[vz]"

    # --- barra de progresso (drawbox animado) ---
    if cfg.progress_bar:
        bar_h = max(10, out_h // 110)
        bar_y = out_h - cfg.safe_bottom - bar_h
        parts.append(f"{cur}drawbox=x=40:y={bar_y}:w=iw-80:h={bar_h}:color={cfg.progress_track}:t=fill[vtrk]")
        parts.append(
            f"[vtrk]drawbox=x=40:y={bar_y}:w='(iw-80)*t/{duration:.3f}':h={bar_h}:"
            f"color={cfg.progress_color}:t=fill[vprog]"
        )
        cur = "[vprog]"

    extra_inputs: List[str] = []   # caminhos de imagens adicionais (-loop 1 -t dur)

    def _add_overlay(img_path: str, x: str, y: str, idx: int) -> None:
        nonlocal cur
        extra_inputs.append(img_path)
        lbl = f"ov{idx}"
        parts.append(f"[{len(extra_inputs)}:v]format=rgba[{lbl}]")
        nxt = f"[v{idx}]"
        parts.append(f"{cur}[{lbl}]overlay=x={x}:y={y}:eof_action=repeat{nxt}")
        cur = nxt

    n = 0
    if cfg.logo:
        _add_overlay(cfg.logo, "40", "40", n); n += 1
    if cfg.banner:
        _add_overlay(cfg.banner, "(w-overlay_w)/2", "30", n); n += 1

    # --- legendas: um overlay por evento, com janela de tempo ---
    for ev, png in zip(events, cap_pngs):
        if not os.path.exists(png):
            continue
        s = max(0.0, ev.start)
        e = max(s + 0.05, ev.end)
        extra_inputs.append(png)
        lbl = f"cap{n}"
        parts.append(f"[{len(extra_inputs)}:v]format=rgba[{lbl}]")
        nxt = f"[v{n}]"
        # posiciona pela base inferior segura (safe_bottom), centralizado
        y = f"{out_h - cfg.safe_bottom}-overlay_h-{get_style(cfg.style).margin_v//4}"
        parts.append(
            f"{cur}[{lbl}]overlay=x=(w-overlay_w)/2:y={y}:"
            f"enable='between(t,{s:.3f},{e:.3f})':eof_action=repeat{nxt}"
        )
        cur = nxt
        n += 1

    # título de abertura (hook) — grande, no início do corte, por cima de tudo
    if title_png:
        extra_inputs.append(title_png)
        lbl = f"ttl{n}"
        parts.append(f"[{len(extra_inputs)}:v]format=rgba[{lbl}]")
        nxt = f"[v{n}]"
        parts.append(
            f"{cur}[{lbl}]overlay=x=(w-overlay_w)/2:y=(h-overlay_h)*0.34:"
            f"enable='between(t,0.15,{title_duration:.2f})':eof_action=repeat{nxt}"
        )
        cur = nxt
        n += 1

    parts.append(f"{cur}format=yuv420p[vout]")
    return ";".join(parts), out_w, out_h, extra_inputs, []


def render_clip(
    src: str,
    info: MediaInfo,
    start: float,
    duration: float,
    events: List[CaptionEvent],
    out_path: str,
    cfg: Optional[RenderConfig] = None,
    workdir: Optional[str] = None,
    ffmpeg: str = "ffmpeg",
    title: Optional[str] = None,
) -> str:
    """Renderiza um corte completo (vídeo + áudio + legendas + overlays)."""
    cfg = cfg or RenderConfig()
    style = get_style(cfg.style)
    out_w, out_h = TARGET_SIZES.get(cfg.target_format, TARGET_SIZES["9:16"])

    workdir = workdir or os.path.dirname(os.path.abspath(out_path))
    os.makedirs(workdir, exist_ok=True)

    # 1) pintar PNGs das legendas (tempos relativos ao início do corte)
    cap_pngs: List[str] = []
    rel_events: List[CaptionEvent] = []
    for i, ev in enumerate(events):
        s = max(0.0, ev.start - start)
        e = max(s + 0.05, ev.end - start)
        if s >= duration:
            continue
        e = min(e, duration)
        png = os.path.join(workdir, f"_cap_{os.path.basename(out_path)}_{i}.png")
        paint.render_caption_png(ev, style, out_w, png)
        cap_pngs.append(png)
        rel_events.append(CaptionEvent(s, e, ev.text, ev.words, ev.highlight_idx, ev.emoji))

    # 1.5) título de abertura (hook) — PNG grande
    title_png = None
    title_dur = 3.2
    if cfg.title_intro and title and title.strip():
        from .styles import CaptionStyle
        from .caption_engine import is_highlight
        tstyle = CaptionStyle(
            key="title", label="título", description="",
            font="Anton-Regular", fontsize=max(96, out_w // 7), outline_w=6.0,
            shadow=4.0, margin_v=0, uppercase=True, highlight_words=True,
            highlight_color="&H0000FFFF", effect="pop",
            max_chars_per_line=15, max_lines=3,
        )
        twords = title.split()
        thl = [i for i, w in enumerate(twords) if is_highlight(w)]
        tev = CaptionEvent(0, title_dur, title, [], thl, None)
        title_png = os.path.join(workdir, f"_titulo_{os.path.basename(out_path)}.png")
        paint.render_caption_png(tev, tstyle, out_w, title_png)

    filt, out_w, out_h, extra_inputs, _ = build_filtergraph(
        info, cfg, rel_events, cap_pngs, duration, workdir,
        title_png=title_png, title_duration=title_dur,
    )

    cmd = [ffmpeg, "-y", "-v", "error", "-ss", f"{start:.3f}", "-t", f"{duration:.3f}", "-i", src]
    for img in extra_inputs:
        cmd += ["-loop", "1", "-t", f"{duration:.3f}", "-i", img]

    cmd += ["-filter_complex", filt, "-map", "[vout]"]
    if info.has_audio:
        cmd += ["-map", "0:a:0"]
    cmd += [
        "-c:v", "libx264", "-preset", cfg.preset, "-crf", str(cfg.crf),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    ]
    if cfg.fps:
        cmd += ["-r", str(cfg.fps)]
    if info.has_audio:
        if cfg.audio_normalize:
            # deixa o volume no padrão de streaming (lives gravam muito baixo)
            cmd += ["-af", f"loudnorm=I={cfg.audio_target}:TP=-1.5:LRA=11,alimiter=limit=0.95"]
        cmd += ["-c:a", "aac", "-b:a", cfg.audio_bitrate]
    cmd += [out_path]

    subprocess.run(cmd, check=True)

    # limpa PNGs temporários
    for png in cap_pngs:
        try:
            os.remove(png)
        except OSError:
            pass
    if title_png and os.path.exists(title_png):
        try:
            os.remove(title_png)
        except OSError:
            pass

    return out_path


def burn_ass_if_available(src, ass_path, out_path, fontsdir, ffmpeg="ffmpeg") -> bool:
    """Se o ffmpeg tiver libass, queima um .ass diretamente (alternativa premium)."""
    if not _has_libass(ffmpeg):
        return False
    cmd = [ffmpeg, "-y", "-v", "error", "-i", src,
           "-vf", f"ass=filename={_esc_filter_path(ass_path)}:fontsdir={_esc_filter_path(fontsdir)}",
           "-c:a", "copy", out_path]
    try:
        subprocess.run(cmd, check=True)
        return True
    except Exception:
        return False
