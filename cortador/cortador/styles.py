"""
Modelos de legenda (presets de estilo) — a "receita" de como o texto é colocado.

Cada modelo define fonte, tamanho, cores, posição, contorno e efeitos
(destaque de palavra, karaoke, bounce). É daqui que sai o visual profissional
das legendas queimadas no vídeo.

Cores ASS: formato &HAABBGGRR (Alpha, Azul, Verde, Vermelho).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class CaptionStyle:
    key: str
    label: str
    description: str
    font: str = "Montserrat-Black"
    fontsize: int = 84
    primary: str = "&H00FFFFFF"       # branco
    secondary: str = "&H00FFFFFF"
    outline: str = "&H00000000"       # preto
    back: str = "&H60000000"          # sombra/caixa semi-transparente
    bold: bool = True
    italic: bool = False
    border_style: int = 1             # 1 = contorno+sombra, 3 = caixa opaca
    outline_w: float = 4.0
    shadow: float = 2.0
    alignment: int = 2                # 2 = baixo-centro (1..9 grid de numpad)
    margin_l: int = 90
    margin_r: int = 90
    margin_v: int = 320
    spacing: float = 0.0
    uppercase: bool = True
    max_chars_per_line: int = 20
    max_lines: int = 2
    # Efeitos
    highlight_color: str = "&H0000FFFF"   # amarelo (destaque de palavra-chave)
    highlight_words: bool = True
    karaoke: bool = False
    karaoke_color: str = "&H0000D7FF"     # laranja para palavra ativa
    effect: str = "fade"                  # fade | pop | none
    line_spacing: float = 1.0

    def ass_style_line(self, name: str = "Default") -> str:
        return (
            f"Style: {name},{self.font},{self.fontsize},{self.primary},{self.secondary},"
            f"{self.outline},{self.back},{int(self.bold)},{int(self.italic)},0,0,"
            f"100,100,{self.spacing},0,{self.border_style},{self.outline_w},{self.shadow},"
            f"{self.alignment},{self.margin_l},{self.margin_r},{self.margin_v},1"
        )


# ---------------------------------------------------------------------------
# Modelos disponíveis
# ---------------------------------------------------------------------------

STYLES: Dict[str, CaptionStyle] = {}


def _register(style: CaptionStyle) -> CaptionStyle:
    STYLES[style.key] = style
    return style


# 1) Gaming Bold — o clássico de clips de GTA/gameplay (igual aos exemplos).
_register(CaptionStyle(
    key="gaming_bold",
    label="Gaming Bold",
    description="Caixa-alta pesada, contorno grosso, palavra-chave em amarelo. Estilo dos exemplos.",
    font="Montserrat-Black",
    fontsize=88,
    outline_w=5.0,
    shadow=3.0,
    margin_v=300,
    uppercase=True,
    highlight_words=True,
    highlight_color="&H0000FFFF",   # amarelo
    karaoke=False,
    effect="pop",
    max_chars_per_line=18,
))

# 2) Karaoke — palavra-a-palavra acendendo (premium, alta retenção).
_register(CaptionStyle(
    key="karaoke",
    label="Karaoke",
    description="Palavra-a-palavra com destaque progressivo. Ótimo para retenção em Shorts/Reels.",
    font="Anton-Regular",
    fontsize=80,
    outline_w=4.5,
    shadow=2.0,
    margin_v=340,
    uppercase=True,
    highlight_words=False,
    karaoke=True,
    karaoke_color="&H0000D7FF",     # laranja
    primary="&H00FFFFFF",
    effect="none",
    max_chars_per_line=20,
))

# 3) Neon — contorno colorido com "glow" (energia, hype).
_register(CaptionStyle(
    key="neon",
    label="Neon",
    description="Contorno ciano/magenta com glow. Visual cyber/hype.",
    font="BebasNeue-Regular",
    fontsize=92,
    primary="&H00FFFFFF",
    outline="&H00FF00FF",           # magenta (BGR)
    outline_w=4.0,
    shadow=6.0,
    margin_v=320,
    uppercase=True,
    highlight_words=True,
    highlight_color="&H00FFFF00",   # ciano
    effect="pop",
    max_chars_per_line=18,
))

# 4) Minimal — limpo, sem cor, para conteúdo sério/informativo.
_register(CaptionStyle(
    key="minimal",
    label="Minimal",
    description="Texto limpo, contorno fino, sem cores. Sóbrio e profissional.",
    font="Montserrat-Bold",
    fontsize=62,
    primary="&H00FFFFFF",
    outline="&H00000000",
    outline_w=2.5,
    shadow=1.5,
    margin_v=260,
    uppercase=False,
    highlight_words=False,
    effect="fade",
    max_chars_per_line=26,
))

# 5) Podcast — caixa de fundo, duas linhas, sem caixa-alta.
_register(CaptionStyle(
    key="podcast",
    label="Podcast",
    description="Caixa de fundo translúcida, texto confortável. Para trechos de conversa.",
    font="Montserrat-Bold",
    fontsize=58,
    primary="&H00FFFFFF",
    outline="&H00202020",
    back="&H90000000",
    border_style=3,
    outline_w=3.0,
    shadow=0.0,
    margin_v=220,
    uppercase=False,
    highlight_words=False,
    effect="fade",
    max_chars_per_line=28,
))

# 6) Hype — vermelho/laranja, tamanho máximo, para momentos de pico.
_register(CaptionStyle(
    key="hype",
    label="Hype",
    description="Gigante, palavras-chave em vermelho. Para o momento mais quente do corte.",
    font="ArchivoBlack-Regular",
    fontsize=96,
    primary="&H00FFFFFF",
    outline="&H00000000",
    outline_w=5.5,
    shadow=3.0,
    margin_v=300,
    uppercase=True,
    highlight_words=True,
    highlight_color="&H000000FF",   # vermelho (BGR)
    effect="pop",
    max_chars_per_line=16,
))


def get_style(key: str) -> CaptionStyle:
    if key not in STYLES:
        raise KeyError(f"Modelo de legenda desconhecido: {key!r}. Disponíveis: {list(STYLES)}")
    return STYLES[key]


def list_styles() -> List[Dict[str, str]]:
    return [
        {"key": s.key, "label": s.label, "description": s.description}
        for s in STYLES.values()
    ]


# Fontes usadas por cada modelo (para o passo de download/registro de fontes).
FONT_FILES: Dict[str, str] = {
    "Montserrat-Black": "Montserrat-Black.ttf",
    "Montserrat-Bold": "Montserrat-Bold.ttf",
    "Anton-Regular": "Anton-Regular.ttf",
    "BebasNeue-Regular": "BebasNeue-Regular.ttf",
    "ArchivoBlack-Regular": "ArchivoBlack-Regular.ttf",
}
