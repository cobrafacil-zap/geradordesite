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
from .ffbin import FFMPEG, FFPROBE
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
    outro: bool = True             # cartão de final (com transição) ao fim do corte
    outro_img: Optional[str] = None  # imagem do final (senão gera um cartão automático)
    outro_dur: float = 3.0         # duração do fechamento (imagem final)
    crf: int = 17                  # qualidade alta (menor = melhor; 17 ≈ quase sem perda)
    preset: str = "medium"         # codificação mais eficiente (melhor qualidade)
    audio_bitrate: str = "256k"    # áudio com mais fidelidade
    fps: Optional[int] = None


def _esc_filter_path(p: str) -> str:
    """Escapa um caminho para uso dentro de filter_complex (ffmpeg)."""
    return p.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")


def _has_libass(ffmpeg: str = FFMPEG) -> bool:
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
            f"{cur}[{lbl}]overlay=x=(w-overlay_w)/2:y=(h-overlay_h)*0.52:"
            f"enable='between(t,0.15,{title_duration:.2f})':eof_action=repeat{nxt}"
        )
        cur = nxt
        n += 1

    parts.append(f"{cur}format=yuv420p[vout]")
    return ";".join(parts), out_w, out_h, extra_inputs, []


def _probe_video(path: str) -> tuple:
    """(largura, altura, fps, duração) de um vídeo, via ffprobe."""
    out = subprocess.run(
        [FFPROBE, "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,r_frame_rate:format=duration",
         "-of", "default=noprint_wrappers=1", path],
        capture_output=True, text=True, check=True).stdout
    vals = {}
    for line in out.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            vals[k.strip()] = v.strip()
    w = int(vals.get("width") or 1080)
    h = int(vals.get("height") or 1920)
    fps = 30.0
    r = vals.get("r_frame_rate") or "30/1"
    try:
        num, den = r.split("/")
        fps = float(num) / float(den or 1)
    except Exception:
        pass
    dur = float(vals.get("duration") or 0.0)
    return w, h, fps, dur


def _append_outro(main_mp4: str, outro_img: str, out_w: int, out_h: int,
                  duration: float = 3.0, workdir: str = ".", ffmpeg: str = FFMPEG,
                  crf: int = 14, preset: str = "slow", xfade: float = 0.6):
    """Anexa a imagem de fechamento ao fim do vídeo com TRANSIÇÃO (crossfade)."""
    _, _, fps, main_dur = _probe_video(main_mp4)
    if main_dur <= 0:
        return
    xf = min(xfade, max(0.2, main_dur / 4), max(0.2, duration / 2))
    total = main_dur + duration - xf
    outro_seg = os.path.join(workdir, "_outro_seg.mp4")
    # imagem -> segmento de vídeo (sem áudio; o áudio vem do principal + silêncio)
    subprocess.run([
        ffmpeg, "-y", "-v", "error",
        "-loop", "1", "-t", f"{duration:.2f}", "-i", outro_img,
        "-vf", (f"scale={out_w}:{out_h}:force_original_aspect_ratio=increase,"
                f"crop={out_w}:{out_h},setsar=1,format=yuv420p"),
        "-r", f"{fps:.3f}",
        "-c:v", "libx264", "-preset", "medium", "-crf", str(max(0, crf - 2)),
        "-pix_fmt", "yuv420p", outro_seg,
    ], check=True)

    tmp_final = main_mp4 + ".cat.mp4"
    # preset mais leve no passo de concatenação (economiza tempo sem perder qualidade visível)
    fast_preset = "medium" if preset in ("slow", "slower", "veryslow") else preset
    subprocess.run([
        ffmpeg, "-y", "-v", "error", "-i", main_mp4, "-i", outro_seg,
        "-filter_complex",
        (f"[0:v]setsar=1,fps={fps:.3f}[v0];"
         f"[1:v]setsar=1,fps={fps:.3f}[v1];"
         f"[v0][v1]xfade=transition=fade:duration={xf:.2f}:offset={max(0.0, main_dur - xf):.2f}[v];"
         f"[0:a]apad=whole_dur={total:.2f},atrim=0:{total:.2f},afade=t=out:st={max(0.0, total - 0.8):.2f}:d=0.8[a]"),
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", fast_preset, "-crf", str(crf),
        "-c:a", "aac", "-b:a", "192k", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", tmp_final,
    ], check=True)
    os.replace(tmp_final, main_mp4)
    try:
        os.remove(outro_seg)
    except OSError:
        pass


def render_clip(
    src: str,
    info: MediaInfo,
    start: float,
    duration: float,
    events: List[CaptionEvent],
    out_path: str,
    cfg: Optional[RenderConfig] = None,
    workdir: Optional[str] = None,
    ffmpeg: str = FFMPEG,
    title: Optional[str] = None,
    title_variant: int = 0,
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

    # 1.5) título de abertura (hook) — badge/caixa com contraste, estilo variado
    title_png = None
    title_dur = 3.2
    if cfg.title_intro and title and title.strip():
        title_png = os.path.join(workdir, f"_titulo_{os.path.basename(out_path)}.png")
        paint.render_title(title, title_png, canvas_w=out_w, variant=title_variant)

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

    # cartão de final (outro) com transição
    if cfg.outro:
        outro_png = cfg.outro_img
        gen = False
        if not outro_png or not os.path.exists(outro_png):
            outro_png = os.path.join(workdir, f"_outro_card_{os.path.basename(out_path)}.jpg")
            paint.render_outro_card(outro_png, out_w, out_h)
            gen = True
        try:
            _append_outro(out_path, outro_png, out_w, out_h,
                          duration=cfg.outro_dur, workdir=workdir, ffmpeg=ffmpeg,
                          crf=cfg.crf, preset=cfg.preset)
        except Exception:
            pass
        if gen and os.path.exists(outro_png):
            try:
                os.remove(outro_png)
            except OSError:
                pass

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


def burn_ass_if_available(src, ass_path, out_path, fontsdir, ffmpeg=FFMPEG) -> bool:
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
