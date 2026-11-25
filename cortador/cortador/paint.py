"""Pintura em Pillow: legendas estilizadas, logo, banner/contador e cartão de CTA.

Tudo vira PNG (RGBA) para ser sobreposto no ffmpeg via filtro `overlay`.
É aqui que está o "visual foda": contorno grosso, sombra, palavras-chave
coloridas, emoji colorido, caixas arredondadas e tipografia pesada.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont, ImageFilter

from .caption_engine import CaptionEvent
from .styles import CaptionStyle

_FONT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "fonts")
_EMOJI_CANDIDATES = [
    "/System/Library/Fonts/Apple Color Emoji.ttc",
    "/System/Library/Fonts/Supplemental/Apple Color Emoji.ttc",
    "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",
]

# fallbacks: (nome pedido, arquivo existente)
_FONT_FALLBACK = {
    "Montserrat-Black": ["Montserrat-Black.ttf", "ArchivoBlack-Regular.ttf", "Anton-Regular.ttf"],
    "Montserrat-Bold": ["Montserrat-Bold.ttf", "Montserrat-Black.ttf", "Anton-Regular.ttf"],
    "Anton-Regular": ["Anton-Regular.ttf", "ArchivoBlack-Regular.ttf", "Montserrat-Black.ttf"],
    "BebasNeue-Regular": ["BebasNeue-Regular.ttf", "Anton-Regular.ttf", "Montserrat-Black.ttf"],
    "ArchivoBlack-Regular": ["ArchivoBlack-Regular.ttf", "Anton-Regular.ttf", "Montserrat-Black.ttf"],
}


def ass_to_rgba(color: str) -> Tuple[int, int, int, int]:
    """Converte cor ASS &HAABBGGRR (alpha invertido) para RGBA do Pillow."""
    c = color.upper().replace("&H", "").replace("&", "")
    if len(c) == 6:
        c = "00" + c
    aa, bb, gg, rr = c[0:2], c[2:4], c[4:6], c[6:8]
    r, g, b = int(rr, 16), int(gg, 16), int(bb, 16)
    alpha = 255 - int(aa, 16)
    return (r, g, b, alpha)


@lru_cache(maxsize=32)
def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    files = _FONT_FALLBACK.get(name, [name])
    for fname in files:
        path = os.path.join(_FONT_DIR, fname)
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    # último recurso: fonte default escalada
    return ImageFont.load_default(size=size)


# Apple Color Emoji é fonte bitmap: só aceita tamanhos de strike fixos.
_EMOJI_STRIKES = [96, 64, 128, 48, 32, 16, 160, 192, 224]


@lru_cache(maxsize=1)
def _emoji_base_font():
    for path in _EMOJI_CANDIDATES:
        if not os.path.exists(path):
            continue
        for sz in _EMOJI_STRIKES:
            try:
                return ImageFont.truetype(path, sz), sz
            except Exception:
                continue
    return None


def _has_emoji_glyph(ch: str) -> bool:
    base = _emoji_base_font()
    if base is None:
        return False
    f, _ = base
    try:
        return f.getmask(_clean_emoji(ch)).getbbox() is not None
    except Exception:
        return False


def _clean_emoji(s: str) -> str:
    # remove variation selectors (U+FE0F/U+FE0E) que quebram o glifo em alguns fonts
    return (s or "").replace("\uFE0F", "").replace("\uFE0E", "")


def _render_emoji_tile(emoji: str, size: int) -> Optional[Image.Image]:
    """Renderiza um emoji colorido num tile RGBA (num strike válido) e escala p/ size."""
    if not emoji:
        return None
    base = _emoji_base_font()
    if base is None:
        return None
    ef, bsz = base
    clean = _clean_emoji(emoji)
    if not clean:
        return None
    try:
        pad = max(2, int(bsz * 0.15))
        canvas = Image.new("RGBA", (bsz + pad * 2, bsz + pad * 2), (0, 0, 0, 0))
        ImageDraw.Draw(canvas).text((pad, pad), clean, font=ef, embedded_color=True)
        bb = canvas.getbbox()
        if not bb:
            return None
        tile = canvas.crop(bb)
        if tile.width < 4 or tile.height < 4:
            return None
        # escala para a largura desejada preservando proporção
        target_w = max(10, int(size))
        scale = target_w / tile.width
        target_h = max(10, int(tile.height * scale))
        return tile.resize((target_w, target_h), Image.LANCZOS)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Texto com contorno + sombra
# ---------------------------------------------------------------------------

def _draw_token(draw: ImageDraw.ImageDraw, xy, text, font, fill, stroke_fill, stroke_w, shadow):
    x, y = xy
    if shadow:
        sx, sy, scolor = shadow
        draw.text((x + sx, y + sy), text, font=font, fill=scolor,
                  stroke_width=stroke_w, stroke_fill=scolor)
    draw.text((x, y), text, font=font, fill=fill,
              stroke_width=stroke_w, stroke_fill=stroke_fill)


def _token_widths(tokens, font, draw) -> List[int]:
    return [int(draw.textlength(t, font=font)) for t in tokens]


def render_caption_png(
    event: CaptionEvent,
    style: CaptionStyle,
    canvas_w: int,
    out_path: str,
    max_lines: Optional[int] = None,
) -> str:
    """Renderiza um CaptionEvent como PNG (transparente) e salva em out_path."""
    max_lines = max_lines or style.max_lines
    base_size = style.fontsize
    font = load_font(style.font, base_size)

    text = event.text.upper() if style.uppercase else event.text
    tokens = text.split()
    if not tokens:
        tokens = [""]

    primary = ass_to_rgba(style.primary)
    hl_color = ass_to_rgba(style.highlight_color)
    outline = ass_to_rgba(style.outline)
    shadow_col = (0, 0, 0, 160)

    pad = int(base_size * 0.35)

    draw_tmp = ImageDraw.Draw(Image.new("RGBA", (8, 8)))

    def _measure(size: int) -> int:
        return int(draw_tmp.textlength(" ", font=load_font(style.font, size)))

    # tile de emoji (elemento separado, fora do wrap)
    emoji_tile = _render_emoji_tile(event.emoji, int(base_size * 0.95)) if event.emoji else None
    emoji_adv = (emoji_tile.width + int(base_size * 0.28)) if emoji_tile is not None else 0

    avail_w = canvas_w - 2 * pad - emoji_adv

    def _tok_w(tok: str) -> int:
        return int(draw_tmp.textlength(tok, font=font))

    def wrap():
        lines: List[List[str]] = [[]]
        cur_w = 0
        sp = _measure(base_size)
        for tok in tokens:
            tw = _tok_w(tok)
            add = tw + (sp if lines[-1] else 0)
            if cur_w + add > avail_w and lines[-1]:
                lines.append([tok])
                cur_w = tw
            else:
                lines[-1].append(tok)
                cur_w += add
        return lines

    lines = wrap()
    while len(lines) > max_lines and base_size > 26:
        base_size = int(base_size * 0.9)
        font = load_font(style.font, base_size)
        pad = int(base_size * 0.35)
        emoji_tile = _render_emoji_tile(event.emoji, int(base_size * 0.95)) if event.emoji else None
        emoji_adv = (emoji_tile.width + int(base_size * 0.28)) if emoji_tile is not None else 0
        avail_w = canvas_w - 2 * pad - emoji_adv
        lines = wrap()

    ascent, descent = font.getmetrics()
    line_h = int((ascent + descent) * 1.02)

    n_lines = len(lines)
    block_h = n_lines * line_h
    canvas_h = block_h + 2 * pad

    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if style.border_style == 3:
        back = ass_to_rgba(style.back)
        margin = int(base_size * 0.3)
        draw.rounded_rectangle(
            [margin // 2, margin // 2, canvas_w - margin // 2, canvas_h - margin // 2],
            radius=int(base_size * 0.35), fill=back,
        )

    stroke_w = max(1, int(style.outline_w))
    shadow = (int(style.shadow) or 0, int(style.shadow) or 0, shadow_col) if style.shadow else None
    space_w = int(draw.textlength(" ", font=font))

    global_tok_idx = 0
    y = pad
    for li, line in enumerate(lines):
        line_w = sum(_tok_w(t) for t in line) + space_w * (len(line) - 1)
        # primeira linha reserva espaço do emoji à esquerda
        lead = emoji_adv if (li == 0 and emoji_tile is not None) else 0
        x = (canvas_w - line_w - lead) // 2
        if lead and emoji_tile is not None:
            img.alpha_composite(emoji_tile, (x, y + (line_h - emoji_tile.height) // 2))
            x += lead
        for tok in line:
            is_hl = (global_tok_idx in event.highlight_idx) and style.highlight_words
            fill = hl_color if is_hl else primary
            _draw_token(draw, (x, y), tok, font, fill, outline, stroke_w, shadow)
            x += _tok_w(tok) + space_w
            global_tok_idx += 1
        y += line_h

    img.save(out_path)
    return out_path


# ---------------------------------------------------------------------------
# Cartões genéricos (logo, banner/contador, CTA)
# ---------------------------------------------------------------------------

# paletas do título (fundo, texto) — caixa com contraste, variando por corte (inclui verde)
_TITLE_PALETTES = [
    ((24, 24, 27, 242), (255, 255, 255, 255)),   # caixa preta / texto branco
    ((255, 255, 255, 244), (17, 17, 20, 255)),   # caixa branca / texto preto
    ((34, 197, 94, 240), (255, 255, 255, 255)),  # caixa verde / texto branco
    ((20, 83, 45, 244), (187, 247, 208, 255)),   # caixa verde escuro / texto verde claro
    ((250, 204, 21, 244), (20, 20, 20, 255)),    # caixa amarela / texto preto
    ((24, 24, 27, 242), (134, 239, 172, 255)),   # caixa preta / texto verde claro
]


def render_title(title: str, out_path: str, canvas_w: int = 1080,
                 font_name: str = "Montserrat-Black", variant: int = 0) -> Optional[str]:
    """Título (hook) em caixa/badge: fundo escuro/claro/verde + texto na cor inversa.

    'variant' faz o estilo variar entre os cortes (preto, branco, verde…).
    Aparece só no início do corte (como no modelo de referência).
    """
    title = (title or "").strip()
    if not title:
        return None
    bg, fg = _TITLE_PALETTES[variant % len(_TITLE_PALETTES)]

    size = max(56, canvas_w // 13)
    font = load_font(font_name, size)
    pad = int(size * 0.6)
    max_w = canvas_w - 2 * pad
    draw_tmp = ImageDraw.Draw(Image.new("RGBA", (8, 8)))

    def wrap(fnt, mw):
        lines, cur, cur_w = [], [], 0
        sp = int(draw_tmp.textlength(" ", font=fnt))
        for w in title.split():
            ww = int(draw_tmp.textlength(w, font=fnt))
            add = ww + (sp if cur else 0)
            if cur_w + add > mw and cur:
                lines.append(cur); cur, cur_w = [], 0
            cur.append(w); cur_w += add
        if cur:
            lines.append(cur)
        return lines

    lines = wrap(font, max_w)
    while len(lines) > 3 and size > 32:
        size = int(size * 0.9)
        font = load_font(font_name, size)
        pad = int(size * 0.6)
        max_w = canvas_w - 2 * pad
        lines = wrap(font, max_w)

    ascent, descent = font.getmetrics()
    line_h = int((ascent + descent) * 1.05)
    text_w = max(int(draw_tmp.textlength(" ".join(l), font=font)) for l in lines)
    box_w = min(text_w + 2 * pad, canvas_w)
    box_h = len(lines) * line_h + int(pad * 1.2)

    img = Image.new("RGBA", (canvas_w, box_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    x0 = (canvas_w - box_w) // 2
    draw.rounded_rectangle([x0, 0, x0 + box_w, box_h], radius=int(size * 0.34), fill=bg)

    y = int(pad * 0.6)
    for l in lines:
        lw = int(draw_tmp.textlength(" ".join(l), font=font))
        x = (canvas_w - lw) // 2
        draw.text((x, y), " ".join(l), font=font, fill=fg)
        y += line_h

    img.save(out_path)
    return out_path


def render_text_card(
    out_path: str,
    size: Tuple[int, int],
    lines: List[Tuple[str, int, Tuple[int, int, int, int]]],  # (texto, tamanho, cor RGBA)
    font_name: str = "Montserrat-Black",
    bg: Optional[Tuple[int, int, int, int]] = None,
    radius: int = 0,
    align: str = "center",
) -> str:
    W, H = size
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0) if bg is None else bg)
    draw = ImageDraw.Draw(img)
    if bg is not None and radius > 0:
        draw.rounded_rectangle([0, 0, W, H], radius=radius, fill=bg)

    # mede altura total
    fonts = [(txt, load_font(font_name, sz), col) for txt, sz, col in lines]
    total_h = 0
    metrics = []
    for txt, fnt, col in fonts:
        a, d = fnt.getmetrics()
        lh = a + d
        metrics.append((txt, fnt, col, lh))
        total_h += lh
    y = (H - total_h) // 2
    for txt, fnt, col, lh in metrics:
        w = int(draw.textlength(txt, font=fnt))
        x = (W - w) // 2 if align == "center" else 10
        _draw_token(draw, (x, y), txt, fnt, col, (0, 0, 0, 220), 2, (3, 3, (0, 0, 0, 120)))
        y += lh
    img.save(out_path)
    return out_path


def render_progress_strip(
    out_path: str,
    size: Tuple[int, int],
    frac: float,
    fill_color=(255, 40, 90, 255),
    track_color=(255, 255, 255, 70),
    radius: Optional[int] = None,
) -> str:
    """Barra de progresso estática (0..frac). Para animação, use drawbox no ffmpeg."""
    W, H = size
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    r = radius if radius is not None else H // 2
    draw.rounded_rectangle([0, 0, W, H], radius=r, fill=track_color)
    fw = max(H, int(W * max(0.0, min(1.0, frac))))
    draw.rounded_rectangle([0, 0, fw, H], radius=r, fill=fill_color)
    img.save(out_path)
    return out_path
