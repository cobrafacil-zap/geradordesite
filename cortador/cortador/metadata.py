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


def make_titles(text: str, category: str = "geral", game: str = "GTA RP") -> List[str]:
    cfg = _CATEGORIES.get(category, _CATEGORIES["geral"])
    event = detect_event(text) or cfg["names"][0]
    kws = extract_keywords(text, 6)
    kw = kws[0].capitalize() if kws else ""
    subject = _clean_phrase(text, 6).rstrip(".")
    ev = event.lower()

    titles = [
        f"Ninguém esperava esse {ev} em {game} 😱",
        f"O {ev} que quase deu tudo errado…",
        f"{event} Épico em {game} — o final vai te chocar",
        f"Não acreditei no que aconteceu nesse {ev}",
        f"E se o {ev} desse errado? Olha o resultado",
        f"A fuga mais insana de {game} termina em {ev}",
        f"Todo mundo achava impossível… até esse {ev}",
        f"{event} em {game} do jeito que você nunca viu 🔥",
        f"Como sobrevivemos a esse {ev} (5 estrelas!)",
        f"{event}: a cena mais louca da live",
    ]
    if kw and kw.lower() not in event.lower():
        titles.insert(1, f"{kw}: o momento mais insano de {game}")
    if subject:
        titles.append(f"{subject[:40]} — clipe épico de {game}")
    return titles


def make_description(text: str, category: str, title: str, game: str = "GTA RP") -> str:
    hook = _clean_phrase(text, 12)
    cta = "Segue pra ver mais cortes assim! 🚀"
    return (
        f"{title}\n\n"
        f"{'🔥 ' if hook else ''}{hook}…\n\n"
        f"Trecho da live de {game}. Corte gerado automaticamente com legenda profissional.\n\n"
        f"{cta}\n"
        f"#gta #gtarp #gaming"
    )


def make_hashtags(text: str, category: str, extra: Optional[List[str]] = None) -> List[str]:
    cfg = _CATEGORIES.get(category, _CATEGORIES["geral"])
    kws = extract_keywords(text, 5)
    tags: List[str] = []
    # nicho primeiro (mais específicas), depois amplas
    for kw in kws:
        tag = "#" + re.sub(r"[^a-z0-9]", "", _strip(kw).lower())
        if len(tag) > 3 and tag not in tags:
            tags.append(tag)
    for t in cfg["tags"]:
        if t not in tags:
            tags.append(t)
    for t in _TREND_TAGS:
        if t not in tags:
            tags.append(t)
    if extra:
        for t in extra:
            tt = t if t.startswith("#") else "#" + t
            if tt not in tags:
                tags.append(tt)
    return tags[:16]


def generate_metadata(
    text: str,
    category: Optional[str] = None,
    game: str = "GTA RP",
    virality_label: str = "",
    virality_total: float = 0.0,
) -> Dict:
    category = category or detect_category(text)
    titles = make_titles(text, category, game)
    title = titles[0]
    return {
        "title": title,
        "title_options": titles[:6],
        "description": make_description(text, category, title, game),
        "hashtags": make_hashtags(text, category),
        "hashtags_str": " ".join(make_hashtags(text, category)),
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
