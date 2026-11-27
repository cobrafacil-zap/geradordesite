"""IA online (DeepSeek) — entende o conteúdo, acha os melhores momentos e escreve títulos.

Em vez de só pegar os trechos mais altos, a IA LÊ a transcrição, entende a história
e escolhe o que é mais interessante/engraçado/surpreendente — e escreve títulos
coerentes em PT-BR (como o Wayin/Opus fazem).

A chave da API fica num arquivo local protegido (.env, ignorado pelo git) ou em
uma variável de ambiente DEEPSEEK_API_KEY.
"""

from __future__ import annotations

import json
import os
import urllib.request
from typing import List, Optional

API_URL = "https://api.deepseek.com/chat/completions"
DEFAULT_MODEL = "deepseek-chat"  # V3: rápido e barato (para títulos e escolha de momentos)

_ENV_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")


def _load_key() -> str:
    key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    if key:
        return key
    try:
        with open(_ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("DEEPSEEK_API_KEY"):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except OSError:
        pass
    return ""


def is_available() -> bool:
    return bool(_load_key())


def _chat(prompt: str, system: Optional[str] = None, model: str = DEFAULT_MODEL,
          temperature: float = 0.4) -> str:
    key = _load_key()
    if not key:
        raise RuntimeError("Chave DeepSeek não encontrada (veja .env ou DEEPSEEK_API_KEY).")
    msgs = []
    if system:
        msgs.append({"role": "system", "content": system})
    msgs.append({"role": "user", "content": prompt})
    body = {"model": model, "messages": msgs, "temperature": temperature, "max_tokens": 400}
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.loads(r.read())
    return (data["choices"][0]["message"]["content"] or "").strip()


def _clean(s: str) -> str:
    s = s.strip().strip('"').strip("'").strip()
    for pre in ("Título:", "Titulo:", "Title:"):
        if s.lower().startswith(pre.lower()):
            s = s[len(pre):].strip()
    return s.strip('"').strip()


def title_for(text: str, game: str = "", model: str = DEFAULT_MODEL) -> Optional[str]:
    """Título criativo (PT-BR) no estilo viral — faz sentido com o conteúdo."""
    if not text.strip():
        return None
    onde = f" do jogo {game}" if game else ""
    prompt = (
        "Você é um editor viral de vídeos curtos brasileiro (TikTok/Reels/Shorts), especialista em games.\n"
        f"Escreva UM título curto e CRIATIVO em português do Brasil para este clipe{onde}.\n\n"
        "Estilo desejado (sigam estes exemplos):\n"
        "- De caindo aos pedaços a luxo: o glow-up em Vice City!\n"
        "- Jason e Lucia: O Encontro Desajeitado na Balada!\n"
        "- A casa mais aleatória dos games! 🤣\n"
        "- O rolê de carro virou um filme de ação! 🚨\n\n"
        "Regras: máximo 60 caracteres; criativo, divertido e com personalidade; "
        "faça sentido (descreva o que realmente acontece no clipe); "
        "pode citar personagens ou locais do jogo quando relevante; "
        "crie curiosidade; termine com UMA emoji; NÃO invente nada fora do texto.\n\n"
        f"Transcrição do clipe:\n\"\"\"{text[:900]}\"\"\"\n\n"
        "Responda APENAS com o título."
    )
    try:
        return _clean(_chat(prompt, model=model, temperature=0.6)) or None
    except Exception:
        return None


def hashtags_for(text: str, game: str = "", model: str = DEFAULT_MODEL) -> Optional[List[str]]:
    """Hashtags PT-BR para o corte (TikTok/Reels/Shorts) — inclui as do jogo (#gta6…)."""
    if not text.strip():
        return None
    g = (game or "").strip()
    dica = f"O jogo/nicho é: {g}. " if g else ""
    prompt = (
        "Você é um social media brasileiro especializado em gaming/vídeos curtos.\n"
        "Escreva 12 hashtags em português do Brasil para este clipe (TikTok/Reels/Shorts).\n"
        f"{dica}Regras: sem espaços, sempre com '#', sem repetir; coloque primeiro as "
        "hashtags do jogo/nicho (ex.: #gta6 #gtavi #gtarp quando for GTA), depois as do "
        "tema do clipe e por último as gerais/virais (ex: #brasil #viral #fyp).\n\n"
        f"Transcrição:\\n'''{text[:900]}'''\n\n"
        "Responda APENAS com as hashtags separadas por espaço."
    )
    try:
        out = _chat(prompt, model=model, temperature=0.4)
        tags = []
        for tok in out.replace(",", " ").split():
            tok = tok.strip().lstrip("#").replace(" ", "")
            if not tok or not tok.replace("_", "").isalnum():
                continue
            tag = "#" + tok.lower()
            if tag not in tags:
                tags.append(tag)
        return tags[:15] or None
    except Exception:
        return None


def describe(text: str, model: str = DEFAULT_MODEL) -> Optional[str]:
    if not text.strip():
        return None
    prompt = (
        "Escreva uma descrição curta (1-2 frases) em português do Brasil para um clipe viral, "
        f"com base nesta transcrição. Termine com um convite para assistir.\n\n\"\"\"{text[:700]}\"\"\""
    )
    try:
        return _clean(_chat(prompt, model=model, temperature=0.5)) or None
    except Exception:
        return None


def pick_best_moments(candidates: List[dict], n: int, model: str = DEFAULT_MODEL) -> List[int]:
    """Escolhe os índices dos N momentos mais interessantes (entende o conteúdo).

    candidates: lista de {"text": transcrição do trecho}.
    Retorna os índices, do melhor para o pior.
    """
    if not candidates:
        return []
    linhas = [f"[{i}] {c.get('text','')[:400]}" for i, c in enumerate(candidates)]
    prompt = (
        "Você é um caçador de momentos virais. Abaixo estão trechos de uma live. "
        f"Escolha os {n} MELHORES momentos para virar clipe curto: os mais engraçados, "
        "emocionantes, surpreendentes ou com uma história completa (começo, meio e fim). "
        "Ignore trechos sem graça, incompletos ou sem sentido.\n\n"
        + "\n\n".join(linhas)
        + f"\n\nResponda APENAS com os {n} números dos melhores, separados por vírgula, "
        "do melhor para o pior (ex: 3,0,5)."
    )
    try:
        out = _chat(prompt, model=model, temperature=0.2)
        nums: List[int] = []
        for tok in out.replace("[", " ").replace("]", " ").split(","):
            tok = tok.strip()
            if tok.isdigit() and 0 <= int(tok) < len(candidates) and int(tok) not in nums:
                nums.append(int(tok))
        for i in range(len(candidates)):
            if len(nums) >= n:
                break
            if i not in nums:
                nums.append(i)
        return nums[:n]
    except Exception:
        return list(range(min(n, len(candidates))))
