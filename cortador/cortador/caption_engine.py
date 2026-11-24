"""Motor de legendas: quebra o texto em blocos de exibição, escolhe palavras de
destaque e injeta emoji.

Saída: lista de CaptionEvent (início, fim, texto, palavras com timing, palavras
destacadas, emoji) — pronta para ser pintada em PNG (paint.py) ou exportada
para SRT/ASS (captions.py).
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field
from typing import List, Optional, Tuple

from .transcribe import Segment, Transcript, Word


# ---------------------------------------------------------------------------
# Léxicos (PT/EN) — emoção e palavras que merecem destaque.
# ---------------------------------------------------------------------------

_STOPWORDS = set("""a o as os um uma de do da das dos em no na nos nas por para com sem sob
sobre entre ate apos antes e ou mas que se ja nao sim mais menos muito muita muitos muitas
eu tu ele ela nos vcs eles elas me te se lhe lhes meu minha seu sua isso isto aquilo aquela
esse essa este esta aquele aquela quando onde como porque qual quais quem ser estar ter haver
foi era sao sera vai vem estou esta estamos temos tenho tinha disse fala falo entao dai tipo
the a an of in on at to for with and or but is are was were be been i you he she it we they
this that these those not yes no can will just very really like got get going gonna um""".split())

_HIGHLIGHT_WORDS = set("""nao nenhuma nunca nada ninguem absurdo absurda surreal louco louca
insano insana epico epica incrivel impossivel acredita acreditar olha ve veja corre correu
fugiu fuga assalto assalta policia tiroteio tiro tiroi preso prisao prendeu caiu capotou
explode explodiu grito gritou surpreendeu chocante drama caos riu rindo chorando ganhou perdeu
morreu matou venceu venci missao desafio estrelas record dinheiro milhao milhoes bilhao roubou
pegou conseguiu conseguiu golpe arma carro corrida helicóptero helicoptero blaze perigo cuidado
caramba meu deus mds kkkkk hahaha wtf oloko mana pqp eita jura serio verdade brincadeira
muito melhor pior maior menor primeiro ultimo nunca sempre aqui agora hoje amanha""".split())

# palavras/gatilhos -> emoji (um por evento, evitando poluição visual)
_EMOJI_MAP = [
    (r"rir|risada|risos|kkk|haha|engraçad|zoa|zoeira", "😂"),
    (r"pol[íi]cia|policial|tiro|tiroteio|prend|preso|cadeia|rev[óo]lv", "🚨"),
    (r"assalto|assalta|roub|roubo|caixa eletr[ôo]nico|dinheiro|milh[ãa]o|grana", "💰"),
    (r"carro|carrao|corrida|fug|drift|motor|velocidade|capot", "🏎️"),
    (r"fogo|explode|explos|bomba|queim", "🔥"),
    (r"estrela|desafio|record|venceu|ganhei|campe[ãa]o|top", "⭐"),
    (r"gta|jogo|jogando|gameplay|game|gamer|live|stream", "🎮"),
    (r"grito|grit|susto|surr|n[ãa]o acredito|caramba|meu deus|mds|oloko|wtf", "😱"),
    (r"amor|beij|casal|namoro|fofo", "❤️"),
    (r"chave|chaves|joia|joias|ouro|presente", "🔑"),
    (r"h[ée]lic[óo]ptero|helicoptero|a[ée]reo|avi[ãa]o", "🚁"),
    (r"[áa]gua|chuva|praia|mar|nata", "🌊"),
    (r"comida|lanche|pizza|burger|fome", "🍔"),
    (r"dinheiro|pagar|conta|pre[çc]o|barato|caro", "💸"),
]

_EMOTION_HINTS = ["!", "?", "kkk", "haha", "mds", "oloko", "wtf", "caramba"]


def _strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def _norm(word: str) -> str:
    return _strip_accents(_clean_word(word)).lower()


def _clean_word(w: str) -> str:
    return re.sub(r"[^\wÀ-ÿ'’-]", "", w) or w


def is_highlight(word: str) -> bool:
    raw = word.strip()
    core = _norm(raw)
    if not core or len(core) < 3:
        return False
    if re.search(r"[!?]", raw):
        return True
    letters = [c for c in raw if c.isalpha()]
    if letters and len(letters) >= 3 and all(c.isupper() for c in letters):
        return True
    if core in _HIGHLIGHT_WORDS:
        return True
    return False


def pick_emoji(text: str) -> Optional[str]:
    t = _strip_accents(text).lower()
    for pattern, emo in _EMOJI_MAP:
        if re.search(pattern, t):
            return emo
    return None


@dataclass
class CaptionEvent:
    start: float
    end: float
    text: str                       # texto exibido (sem emoji)
    words: List[Word] = field(default_factory=list)
    highlight_idx: List[int] = field(default_factory=list)  # índices de palavras destacadas
    emoji: Optional[str] = None

    @property
    def highlight_words(self) -> List[str]:
        return [w for i, w in enumerate(self.text.split()) if i in self.highlight_idx]


def _words_from_transcript(transcript: Transcript) -> List[Word]:
    out: List[Word] = []
    for seg in transcript.segments:
        if seg.words:
            out.extend(seg.words)
        else:
            toks = seg.text.split()
            if not toks:
                continue
            step = (seg.end - seg.start) / len(toks)
            for i, tk in enumerate(toks):
                out.append(Word(tk, seg.start + i * step, seg.start + (i + 1) * step))
    return out


def build_events(
    transcript: Transcript,
    max_chars_per_line: int = 18,
    max_lines: int = 2,
    emoji: bool = True,
    min_dur: float = 0.6,
    max_dur: float = 4.5,
    gap_break: float = 1.2,
) -> List[CaptionEvent]:
    """Agrupa palavras em blocos de exibição com timing e destaque."""
    words = _words_from_transcript(transcript)
    if not words:
        return []

    max_chars = max_chars_per_line * max_lines
    events: List[CaptionEvent] = []

    cur: List[Word] = []
    cur_len = 0

    def flush():
        nonlocal cur, cur_len
        if not cur:
            return
        text = " ".join(_clean_word(w.text) for w in cur if _clean_word(w.text))
        toks = text.split()
        hl = [i for i, tok in enumerate(toks) if is_highlight(tok)]
        start = cur[0].start
        end = cur[-1].end
        if end - start < min_dur:
            end = start + min_dur
        events.append(CaptionEvent(start, end, text, list(cur), hl))
        cur = []
        cur_len = 0

    for i, w in enumerate(words):
        tok = _clean_word(w.text)
        if not tok:
            continue
        tlen = len(tok)
        # Quebra se estourar o tamanho total, ou por pausa longa entre palavras.
        pause = (w.start - cur[-1].end) if cur else 0.0
        if cur and (cur_len + 1 + tlen > max_chars or pause > gap_break):
            flush()
        cur_len = (cur_len + 1 + tlen) if cur else tlen
        cur.append(w)
        # fecha automaticamente se o bloco já está longo o suficiente e vem pausa
        if cur and (words[i].end - cur[0].start) > max_dur:
            flush()
    flush()

    # Ajusta limites: estende fim até o próximo início, corta durações longas.
    for i, ev in enumerate(events):
        if i + 1 < len(events):
            ev.end = max(ev.end, events[i + 1].start - 0.02)
        ev.end = min(ev.end, ev.start + max_dur)
        if ev.end <= ev.start:
            ev.end = ev.start + min_dur

    if emoji:
        for ev in events:
            ev.emoji = pick_emoji(ev.text)

    return events
