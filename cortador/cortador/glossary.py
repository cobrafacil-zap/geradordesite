"""Context grounding — corrige nomes/térmicos na transcrição.

Ideia emprestada do whisper-transcribe: usar um glossário do nicho para corrigir
os erros típicos do Whisper em nomes próprios, gírias e termos (ex.: "GTA RP",
"Skyline", "Brian", "Caixa Eletrônico", "FiveM"). Isso deixa a legenda e o título
bem mais precisos.

Como usar: monte um glossário do seu nicho (termo -> formas erradas) e rode
`ground_text()` sobre o texto transcrito.
"""

from __future__ import annotations

import re
from typing import Dict, List, Tuple


# glossário padrão focado em GTA RP / gaming (amplie à vontade)
DEFAULT_GLOSSARY: Dict[str, List[str]] = {
    # termo correto : variantes erradas que o Whisper costuma produzir
    "GTA RP": ["gta arpe", "gta erpê", "gê tei a arpe", "gta rap", "gta hip"],
    "GTA": ["gê tei a", "gê ta", "gta"],
    "FiveM": ["five m", "five m", "faiv m", "5m"],
    "Skyline": ["sky line", "scar line", "cai line", "escailine"],
    "Brian": ["braian", "bryan", "brain", "brião"],
    "Caixa Eletrônico": ["caixa eletrônico", "caixa eletrico", "caixa eletrônco", "caixa életronico"],
    "Polícia": ["policia", "polícia", "polisa", "pulícia"],
    "Assalto": ["asalto", "assalto"],
    "Roleplay": ["role play", "rool play", "rolê play"],
    "Drift": ["drifte", "drift", "drif"],
    "Tuning": ["tunig", "tunning", "tunin"],
    "Missão": ["misão", "missao", "mição"],
    "Estrelas": ["estrelas", "estrela"],
    "Preso": ["preso", "preso"],
}

# correções extras: padrão (regex) -> substituição (aplicadas em caixa-alta/baixa)
_EXTRA: List[Tuple[str, str]] = [
    (r"\bkkkk+\b", "kkkk"),
    (r"\bhaha+\b", "haha"),
]


def build_lookup(glossary: Dict[str, List[str]] | None = None) -> List[Tuple[str, str]]:
    """Constrói pares (errado -> correto) preservando capitalização do original."""
    glossary = glossary or DEFAULT_GLOSSARY
    pairs: List[Tuple[str, str]] = []
    for correct, wrongs in glossary.items():
        for w in wrongs:
            if w.strip() and w.strip().lower() != correct.lower():
                pairs.append((w.strip(), correct))
    # mais longos primeiro, para "GTA RP" vencer "GTA"
    pairs.sort(key=lambda p: len(p[0]), reverse=True)
    return pairs


def _match_case(original: str, corrected: str) -> str:
    """Mantém o padrão de capitalização do texto original."""
    if original.isupper():
        return corrected.upper()
    if original.istitle():
        return corrected.title()
    if original.islower():
        return corrected.lower()
    return corrected


def ground_text(text: str, glossary: Dict[str, List[str]] | None = None) -> str:
    """Aplica o glossário e as correções extras sobre o texto."""
    if not text:
        return text
    out = text
    for wrong, correct in build_lookup(glossary):
        pattern = re.compile(r"\b" + re.escape(wrong) + r"\b", re.IGNORECASE)
        out = pattern.sub(lambda m: _match_case(m.group(0), correct), out)
    for pat, rep in _EXTRA:
        out = re.sub(pat, rep, out, flags=re.IGNORECASE)
    return out


def load_glossary_file(path: str) -> Dict[str, List[str]]:
    """Carrega um glossário simples no formato 'correto: errado1, errado2'."""
    result: Dict[str, List[str]] = dict(DEFAULT_GLOSSARY)
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or ":" not in line:
                    continue
                key, vals = line.split(":", 1)
                result[key.strip()] = [v.strip() for v in vals.split(",") if v.strip()]
    except OSError:
        pass
    return result
