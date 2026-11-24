"""Geração de legendas SRT e ASS a partir da transcrição.

- Quebra o texto em blocos de exibição (1–2 linhas, respeitando timing por palavra).
- Destaca palavras-chave em cor (estilo dos exemplos).
- Suporta karaoke palavra-a-palavra (\\k) usando os timestamps de cada palavra.
- Escreve .srt (legenda simples/compatível) e .ass (legenda estilizada queimável).
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Optional, Tuple

from .styles import CaptionStyle, get_style
from .transcribe import Segment, Transcript, Word


# Palavras que costumam ganhar destaque emocional (PT/EN) — usadas somadas
# a heurísticas (caixa-alta, pontuação, tamanho) para escolher o que colorir.
_STOPWORDS = set("""a o as os um uma de do da das dos em no na nos nas por para com sem sob
sobre entre ate apos antes e ou mas que se ja nao sim mais menos muito muita muitos muitas
eu tu ele ela nos vcs eles elas me te se lhe lhes meu minha seu sua isso isto aquilo aquela
esse essa este esta aquele aquela quando onde como porque qual quais quem ser estar ter haver
foi era sao sera serait vai vem vai estou esta estamos temos tenho tinha disse fala falo
the a an of in on at to for with and or but is are was were be been i you he she it we they
this that these those not yes no can will just very really""".split())

_EMOTION_WORDS = set("""nao nenhuma nunca nada ninguem absurdo absurda surreal louco louca
insano insana epico epica incrivel impossivel acredita acreditar olha ve veja corre correu
fugiu fuga assalto assalta policia tiroteio tiro tiroi preso prisao prendeu caiu caiu capotou
explode explodiu grito gritou surpreendeu chocante drama caos riu rindo chorando ganhou perdeu
morreu matou venceu venci missao desafio estrelas record dinheiro milhao milhoes bilhao roubou
pegou conseguiu consegui golpe arma carro carroes corrida helicóptero helicoptero blaze""".split())


@dataclass
class CaptionEvent:
    start: float
    end: float
    text: str                    # texto exibido (já formatado)
    words: List[Word]            # palavras com timing (para karaoke)
    line_breaks: List[int] = None  # índices onde ocorrem quebras de linha


def _format_time_srt(t: float) -> str:
    ms = int(round(max(0.0, t) * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _format_time_ass(t: float) -> str:
    cs = int(round(max(0.0, t) * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h:d}:{m:02d}:{s:02d}.{cs:02d}"


def _clean_word(w: str) -> str:
    return re.sub(r"[^\wÀ-ÿ'’-]", "", w) or w


def _is_highlight(word: str, style: CaptionStyle) -> bool:
    """Decide se uma palavra deve ganhar cor de destaque."""
    raw = word.strip()
    core = _clean_word(raw).lower()
    if not core or len(core) < 3:
        return False
    # exclamação/interrogação adjacente → emoção
    if re.search(r"[!?]", raw):
        return True
    # caixa-alta no original (grito/ênfase)
    letters = [c for c in raw if c.isalpha()]
    if letters and all(c.isupper() for c in letters) and len(letters) >= 3:
        return True
    if core in _EMOTION_WORDS:
        return True
    return False


def _chunk_events(
    transcript: Transcript,
    style: CaptionStyle,
    max_chars: Optional[int] = None,
    max_lines: int = 2,
) -> List[CaptionEvent]:
    """Agrupa palavras em blocos de exibição com timing."""
    max_chars = max_chars or style.max_chars_per_line
    events: List[CaptionEvent] = []

    all_words: List[Word] = []
    for seg in transcript.segments:
        if seg.words:
            all_words.extend(seg.words)
        else:
            # fallback: uma palavra por token sem timing fino
            toks = seg.text.split()
            if not toks:
                continue
            step = (seg.end - seg.start) / len(toks)
            for i, tk in enumerate(toks):
                all_words.append(Word(tk, seg.start + i * step, seg.start + (i + 1) * step))

    if not all_words:
        return events

    cur: List[Word] = []
    cur_len = 0
    lines_in_event = 1

    def flush():
        nonlocal cur, cur_len, lines_in_event
        if not cur:
            return
        text = " ".join(w.text.strip() for w in cur)
        start = cur[0].start
        end = cur[-1].end
        events.append(CaptionEvent(start, end, text, list(cur)))
        cur = []
        cur_len = 0
        lines_in_event = 1

    for w in all_words:
        token = w.text.strip()
        if not token:
            continue
        tlen = len(token)
        # Quebra linha se estourar o limite por linha.
        if cur and cur_len + 1 + tlen > max_chars:
            if lines_in_event >= max_lines:
                flush()
            else:
                # quebra de linha dentro do mesmo evento: marca com \n na montagem
                lines_in_event += 1
                cur_len = tlen
                cur.append(w)
                continue
        if cur:
            cur_len += 1 + tlen
        else:
            cur_len = tlen
        cur.append(w)

    flush()

    # Estende o fim de cada evento até o início do próximo (sem buracos).
    for i in range(len(events) - 1):
        events[i].end = max(events[i].end, events[i + 1].start - 0.01)
    return events


def _build_ass_dialogue(ev: CaptionEvent, style: CaptionStyle) -> str:
    """Monta a linha Dialogue do ASS, com destaque de palavra e/ou karaoke."""
    parts: List[str] = []

    if style.karaoke and ev.words:
        for w in ev.words:
            dur_cs = max(1, int(round((w.end - w.start) * 100)))
            token = w.text.strip()
            if not token:
                continue
            # palavra ativa acende em karaoke_color; as demais ficam em primary.
            parts.append(f"{{\\k{dur_cs}}}{token}")
        text = " ".join(parts)
    else:
        tokens = ev.text.split()
        colored = []
        for tok in tokens:
            if style.highlight_words and _is_highlight(tok, style):
                colored.append(f"{{\\1c{style.highlight_color}}}{tok}{{\\1c{style.primary}}}")
            else:
                colored.append(tok)
        text = " ".join(colored)

    # Quebra de linha automática se passar do limite.
    if style.max_lines == 2 and len(ev.text) > style.max_chars_per_line:
        words = text.split(" ")
        # reconstrói com quebra aproximada no meio
        half = len(ev.text) // 2
        acc = 0
        brk = len(words)
        for i, wd in enumerate(words):
            acc += len(re.sub(r"\\[a-zA-Z0-9\\{}&H-]", "", wd)) + 1
            if acc >= half:
                brk = i + 1
                break
        if 0 < brk < len(words):
            text = " ".join(words[:brk]) + "\\N" + " ".join(words[brk:])

    # Efeito de entrada.
    if style.effect == "fade":
        tag = "{\\fad(90,60)}"
    elif style.effect == "pop":
        tag = "{\\fad(40,40)\\fscx108\\fscy108\\t(0,90,\\fscx100\\fscy100)}"
    else:
        tag = ""

    return f"{tag}{text}"


def build_ass(
    transcript: Transcript,
    style: CaptionStyle,
    play_res: Tuple[int, int] = (1080, 1920),
    offset: float = 0.0,
) -> str:
    events = _chunk_events(transcript, style)
    w, h = play_res

    header = f"""[Script Info]
Title: Legendas geradas pelo Cortador
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: {w}
PlayResY: {h}
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
{style.ass_style_line('Default')}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [header]
    for ev in events:
        start = ev.start - offset
        end = ev.end - offset
        if end <= 0:
            continue
        start = max(0.0, start)
        dialogue = _build_ass_dialogue(ev, style)
        lines.append(
            f"Dialogue: 0,{_format_time_ass(start)},{_format_time_ass(end)},Default,,0,0,0,,{dialogue}"
        )
    return "\n".join(lines) + "\n"


def build_srt(transcript: Transcript, offset: float = 0.0, max_chars: int = 42) -> str:
    # Usa um estilo neutro apenas para chunking do SRT.
    neutral = get_style("minimal")
    neutral = CaptionStyle(**{**neutral.__dict__, "max_chars_per_line": max_chars, "max_lines": 2})
    events = _chunk_events(transcript, neutral, max_chars=max_chars)
    out = []
    for i, ev in enumerate(events, 1):
        start = max(0.0, ev.start - offset)
        end = max(start + 0.2, ev.end - offset)
        # quebra em 2 linhas se longo
        txt = ev.text
        if len(txt) > max_chars:
            half = len(txt) // 2
            sp = txt.rfind(" ", 0, half + 5)
            if sp > 0:
                txt = txt[:sp] + "\n" + txt[sp + 1:]
        out.append(f"{i}\n{_format_time_srt(start)} --> {_format_time_srt(end)}\n{txt}\n")
    return "\n".join(out)


def write_subtitles(
    transcript: Transcript,
    out_base: str,
    style_key: str = "gaming_bold",
    play_res: Tuple[int, int] = (1080, 1920),
    offset: float = 0.0,
) -> dict:
    """Escreve .ass e .srt e retorna os caminhos."""
    style = get_style(style_key)
    ass_path = out_base + ".ass"
    srt_path = out_base + ".srt"
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(build_ass(transcript, style, play_res=play_res, offset=offset))
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write(build_srt(transcript, offset=offset))
    return {"ass": ass_path, "srt": srt_path, "style": style.key}
