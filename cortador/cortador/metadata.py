"""Geração de metadata social por corte: título (com hook), hashtags, descrição e CTA.

Focado em PT-BR. Combina:
  - extração de palavras-chave do texto transcrito
  - detecção de categoria/tema (gaming, crime, corrida, etc.)
  - templates de headline testados em clipagem viral (estilo dos exemplos)
  - hashtags misturadas (nicho + trending + amplas)

Se houver OPENAI_API_KEY, você pode trocar por geração via LLM (opcional).
"""

from __future__ import annotations

import os
import re
import unicodedata
from collections import Counter
from typing import Dict, List, Optional

from .caption_engine import _STOPWORDS


def _strip(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def _tokens(text: str) -> List[str]:
    return re.findall(r"[a-z0-9']+", _strip(text).lower())


# palavras de preenchimento que nunca devem virar palavra-chave/título
_FILLER = set("""
aqui ali la agora antes depois ainda tambem entao dai tipo coisa coisas bem bem
muito mais menos cada sobre entre acho quero quer fazer falar falou fala disse diz
jogar joguei jogando jogo epoca tempo dia noite hoje amanha ontem sempre nunca
nada nunca alguem ninguem todo toda todos todas outro outra outros outras
mesmo mesma mesma so ja nao sim talvez porque quando onde como qual quais
esse essa isso isto aquilo aquele aquela este esta seu sua meu minha nosso nossa
vou vai vamos estou esta estamos estao ser estar ter haver foi era ser
the and for you that this with have from they been said was are out all can
""".split())


# ---------------------------------------------------------------------------
# Categorias e hashtags de base
# ---------------------------------------------------------------------------

_CATEGORIES = {
    "gaming_crime": {
        "match": ["assalto", "roubo", "caixa eletronico", "policia", "tiroteio", "fuga", "preso", "prisao", "roubou", "sequestr"],
        "names": ["Assalto", "Fuga", "Confronto", "Caos"],
        "tags": ["#gta", "#gtarp", "#gaming", "#brasil", "#fivem", "#roleplay"],
    },
    "corrida": {
        "match": ["carro", "corrida", "drift", "capot", "acidente", "velocidade", "tuning", "skyline", "motor", "fugiu"],
        "names": ["Corrida", "Fuga de Carro", "Drift", "Capotamento"],
        "tags": ["#carros", "#corrida", "#drift", "#automotivo", "#gta", "#tuning"],
    },
    "gameplay": {
        "match": ["gta", "jogo", "jogando", "gameplay", "live", "stream", "desafio", "estrela", "missao", "npc"],
        "names": ["Gameplay", "Desafio", "Missão", "Aventura"],
        "tags": ["#gta", "#gta6", "#gtarp", "#gaming", "#gameplay", "#brasil"],
    },
    "humor": {
        "match": ["kkk", "haha", "risada", "piada", "engracad", "zoa", "meme", "lol"],
        "names": ["Momento", "Zoeira", "Cena", "Treta"],
        "tags": ["#humor", "#zoeira", "#engracado", "#viral", "#brasil", "#meme"],
    },
    "geral": {
        "match": [],
        "names": ["Momento", "Cena", "História", "Clipe"],
        "tags": ["#viral", "#fyp", "#brasil", "#explore", "#paravoce", "#reels"],
    },
}

_TREND_TAGS = ["#viral", "#fyp", "#foryou", "#explore", "#paravoce", "#trending", "#shorts", "#reels", "#tiktok"]


def detect_category(text: str) -> str:
    t = _strip(text).lower()
    best, best_hits = "geral", 0
    for key, cfg in _CATEGORIES.items():
        hits = sum(1 for w in cfg["match"] if w in t)
        if hits > best_hits:
            best, best_hits = key, hits
    return best


def extract_keywords(text: str, top: int = 8) -> List[str]:
    toks = [t for t in _tokens(text)
            if len(t) > 3 and t not in _STOPWORDS and t not in _FILLER]
    # prefere palavras de conteúdo (mais longas = substantivos/verbos fortes)
    freq = Counter(toks)
    ranked = sorted(freq.items(), key=lambda kv: (-(len(kv[0]) * 0.5 + kv[1]), kv[0]))
    return [w for w, _ in ranked[:top]]


# eventos "de manchete" detectados no texto -> rótulo de título
_EVENT_LEXICON = [
    (["caixa eletronico", "caixa", "eletronico"], "Caixa Eletrônico"),
    (["assalto", "assalta", "roub", "roubo"], "Assalto"),
    (["fuga", "fugiu", "foge", "escapou"], "Fuga"),
    (["tiroteio", "tiro", "troca de tiro", "policia", "policial"], "Tiroteio"),
    (["capotou", "capotamento", "acidente", "bateu"], "Capotamento"),
    (["corrida", "drift", "velocidade", "persegui"], "Corrida"),
    (["preso", "prisao", "prendeu", "cadeia"], "Prisão"),
    (["desafio", "5 estrelas", "estrelas", "missao"], "Desafio 5 Estrelas"),
    (["joias", "joia", "ouro", "diamante"], "Fuga com Joias"),
    (["explosao", "explode", "bomba", "fogo"], "Explosão"),
    (["helicóptero", "helicoptero", "aereo"], "Perseguição Aérea"),
    (["gta", "rp", "gameplay", "jogo"], "Gameplay"),
]


def detect_event(text: str) -> str:
    t = _strip(text).lower()
    for words, label in _EVENT_LEXICON:
        if any(w in t for w in words):
            return label
    return ""


# ---------------------------------------------------------------------------
# Títulos
# ---------------------------------------------------------------------------

def _clean_phrase(text: str, max_words: int = 9) -> str:
    words = [w for w in text.split() if w.lower().strip(".,!?;:") not in _STOPWORDS]
    return " ".join(words[:max_words]).strip(".,!?;:")


_ACTION = set("""fugiu fuga fugir roubou roubo assalto assalta pegou conseguiu ganhou perdeu
morreu matou venceu explodiu capotou bateu correu invadiu prendeu escapou transformou vira virou
aconteceu descobriu encontrou achou abriu fez diz falou gritou caiu subiu desceu prendeu salvou
perseguiu despistou escondeu apareceu surpreendeu deixou virou passou parou começou terminou""".split())

_EMOTION = set("""epico epica insano insana absurdo surreal louco louca incrivel impossivel
chocante surpreendeu caos drama perigo inacreditavel mais-perto pegou-prendeu cinco-estrelas
inacreditavel""".split())


def _best_phrase(text: str) -> str:
    """Escolhe a cláusula do corte que melhor resume o que acontece (frase natural)."""
    parts = re.split(r"[.!?\n…;]+|,\s*", text)
    best, best_sc = None, -1.0
    for p in parts:
        p = re.sub(r"\s+", " ", p).strip()
        toks = _tokens(p)
        n = len(toks)
        if n < 4 or n > 18:
            continue
        sc = 0.0
        sc += sum(2 for t in toks if t in _ACTION)
        sc += sum(2 for t in toks if t in _EMOTION)
        sc += sum(1 for t in toks if t not in _STOPWORDS and t not in _FILLER and len(t) >= 5)
        sc += max(0.0, 3.0 - abs(n - 10) / 3.0)
        if sc > best_sc:
            best_sc, best = sc, p
    return best or re.sub(r"\s+", " ", text).strip()


def _headline(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip(" .,!?;:")
    return (s[0].upper() + s[1:]) if s else s


def make_titles(text: str, category: str = "geral", game: Optional[str] = None) -> List[str]:
    """Títulos gerados a partir do CONTEÚDO real do corte (fazem sentido com a legenda)."""
    phrase = _headline(_best_phrase(text))
    if not phrase:
        phrase = _headline(re.sub(r"\s+", " ", text).strip()[:70])
    ev = detect_event(text)
    g = (game or "").strip()

    excl = "" if phrase.endswith(("!", "?", "…")) else ""
    titles = [
        f"{phrase}{excl}",                              # principal: o que acontece no corte
        f"{phrase} — e o final surpreendeu",
    ]
    if ev and ev.lower() not in phrase.lower():
        titles.append(f"{ev}: {phrase}")
    titles.append(f"Olha o que aconteceu: {phrase}")
    if g:
        titles.append(f"{phrase} ({g})")
    titles.append(f"{phrase} #shorts")
    return titles


def make_description(text: str, category: str, title: str, game: Optional[str] = None) -> str:
    hook = _clean_phrase(text, 12)
    g = (game or "").strip()
    where = f"Trecho da live de {g}." if g else "Trecho da live."
    cta = "Segue pra ver mais cortes assim! 🚀"
    return (
        f"{title}\n\n"
        f"{'🔥 ' if hook else ''}{hook}…\n\n"
        f"{where} Corte gerado automaticamente com legenda profissional.\n\n"
        f"{cta}\n"
    )


def _game_tags(game: str = "", text: str = "") -> List[str]:
    """Hashtags do jogo/nicho (ex.: #gta6 #gtavi #gtarp) a partir do nome do jogo."""
    g = (game or "").lower()
    t = (text or "").lower()
    blob = f"{g} {t}"
    tags: List[str] = []
    if "gta" in blob or "grand theft" in blob:
        if "rp" in g or "roleplay" in g or "fivem" in g:
            tags += ["#gtarp", "#fivem", "#roleplay"]
        # a comunidade GTA VI é o maior público → sempre as duas
        tags += ["#gta6", "#gtavi"]
        tags += ["#gta", "#gaming"]
    elif any(k in blob for k in ("minecraft", "roblox", "valorant", "fortnite", "pubg", "lol", "cs2")):
        tags.append("#gaming")
    return tags


def make_hashtags(text: str, category: str, extra: Optional[List[str]] = None,
                  game: str = "") -> List[str]:
    t = _strip(text).lower()
    tags: List[str] = []

    # hashtags vindas da IA entram primeiro (mais certas para o jogo)
    for x in (extra or []):
        xx = str(x).strip().replace(" ", "")
        if not xx:
            continue
        xx = xx if xx.startswith("#") else "#" + xx
        if xx not in tags:
            tags.append(xx)

    # do jogo/nicho (é o que o público busca: #gta6, #gtavi…)
    for x in _game_tags(game, text):
        if x not in tags:
            tags.append(x)

    # palavras do conteúdo (específicas do corte)
    for kw in extract_keywords(text, 5):
        tag = "#" + re.sub(r"[^a-z0-9]", "", _strip(kw).lower())
        if len(tag) > 3 and tag not in tags:
            tags.append(tag)

    # nicho: tags específicas do conteúdo (o do jogo já entrou em _game_tags)
    if any(w in t for w in ("carro", "corrida", "drift", "motor", "capot")):
        for x in ("#carros", "#corrida", "#automotivo"):
            if x not in tags:
                tags.append(x)
    if any(w in t for w in ("podcast", "entrevista", "conversa")):
        for x in ("#podcast", "#entrevista"):
            if x not in tags:
                tags.append(x)

    # amplas/trending por último
    for x in ("#brasil", "viral") + tuple(_TREND_TAGS):
        x = x if x.startswith("#") else "#" + x
        if x not in tags:
            tags.append(x)

    return tags[:15]


def generate_metadata(
    text: str,
    category: Optional[str] = None,
    game: Optional[str] = None,
    virality_label: str = "",
    virality_total: float = 0.0,
    hashtags: Optional[List[str]] = None,
) -> Dict:
    category = category or detect_category(text)
    titles = make_titles(text, category, game)
    title = titles[0]
    tags = make_hashtags(text, category, extra=hashtags, game=game or "")
    return {
        "title": title,
        "title_options": titles[:6],
        "description": make_description(text, category, title, game),
        "hashtags": tags,
        "hashtags_str": " ".join(tags),
        "keywords": extract_keywords(text),
        "category": category,
        "hook": _clean_phrase(text, 12),
        "virality": {"total": virality_total, "label": virality_label},
    }


# ---------------------------------------------------------------------------
# Opcional: refinamento via LLM (se OPENAI_API_KEY estiver definida)
# ---------------------------------------------------------------------------

def llm_refine(text: str, current: Dict) -> Optional[Dict]:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        import openai  # type: ignore
        client = openai.OpenAI(api_key=api_key)
        prompt = (
            "Você é um editor viral de TikTok/Reels/Shorts em português do Brasil. "
            "Dado o trecho transcrito de um clipe, escreva: title (máx 70 chars, hook forte), "
            "description (2-3 linhas com CTA) e 10 hashtags. Responda em JSON com chaves "
            "title, description, hashtags (array).\n\nTrecho:\n" + text[:1500]
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        import json
        data = json.loads(resp.choices[0].message.content)
        current["title"] = data.get("title", current["title"])
        current["description"] = data.get("description", current["description"])
        if isinstance(data.get("hashtags"), list):
            current["hashtags"] = data["hashtags"]
            current["hashtags_str"] = " ".join(data["hashtags"])
        current["llm"] = True
        return current
    except Exception:
        return None
