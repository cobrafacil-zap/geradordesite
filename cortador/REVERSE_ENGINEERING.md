# 🔬 Engenharia Reversa — Plataformas de Clipagem com IA

> Estudo das plataformas líderes de "long → shorts" (Opus Clip, Klap, Submagic, Vizard)
> e como cada recurso foi **traduzido para código** neste cortador. Objetivo: entregar
> o mesmo resultado profissional, 100% local, sem assinatura.

---

## 1. O que as plataformas líderes fazem

| Recurso | Opus Clip | Klap | Submagic | Vizard | **Este cortador** |
|---|---|---|---|---|---|
| Achar "melhores momentos" | ✅ ClipAnything (áudio+visual+sentimento) | ✅ AI Editing | ✅ Magic Clips | ✅ AI Clipping | ✅ `analysis.py` + `virality.py` |
| Score de viralidade | ✅ | ✅ | ➖ | ✅ | ✅ `virality.py` (7 eixos) |
| Reframe 16:9 ⇄ 9:16 | ✅ ReframeAnything (object tracking) | ✅ AI Reframe (Gaming/Split) | ✅ | ✅ center subjects | ✅ `probe.py` (blur/crop/pad) |
| Legendas dinâmicas | ✅ 99% | ✅ | ✅ 99% / 118 idiomas | ✅ + AI Emoji | ✅ `paint.py` (contorno/keyword/emoji) |
| Keyword highlight | ✅ | ✅ | ✅ | ✅ | ✅ destaque + cor |
| Emoji na legenda | ➖ | ➖ | ✅ | ✅ AI Emoji | ✅ emoji colorido inline |
| Remover silêncio (jump cut) | ✅ | ✅ | ✅ 1-click | ✅ | ✅ encaixe em pausas |
| Auto-zoom / punch-in | ✅ | ✅ | ✅ Auto-Zoom | ➖ | ✅ zoom lento opcional |
| Título + hashtags + descrição | ✅ | ✅ | ✅ Auto Description | ✅ Social Caption | ✅ `metadata.py` |
| Brand template (fonte/cor/logo) | ✅ | ✅ | ✅ | ✅ | ✅ `styles.py` + logo/banner |
| CTA final | ✅ "strong call-to-action" | ➖ | ➖ | ➖ | ✅ no template de metadata |
| Layout Gaming / Split | ➖ | ✅ AI Reframe 2 | ➖ | ➖ | ✅ preserva layout da live |
| Safe zones (UI TikTok/Reels) | ✅ | ✅ | ✅ | ✅ | ✅ `safe_bottom` |

---

## 2. Como cada "segredo" foi implementado

### 🎯 Detecção de melhores takes (`analysis.py`)
As plataformas falam em "highlighting moments" usando **áudio + visual + sentimento**.
Aqui, um pipeline rápido e escalável (funciona em lives de 2h+):
1. Extrai o áudio (mono 16 kHz) — barato.
2. Calcula **energia (RMS) por segundo**.
3. Pontua cada trecho com: **volume**, **picos de emoção** (grito/risada acima da média),
   **densidade de fala** e **variação dinâmica** (altos e baixos = editável).
4. Varre **janelas deslizantes (60–180 s)** e escolhe as de maior pontuação, sem sobreposição.
5. **Encaixa os cortes em pausas naturais** (snap para vales de energia) — cortes limpos.

### 📈 Score de viralidade (`virality.py`) — engenharia reversa de Opus/Klap/Vizard
Em vez de um número mágico, cada corte é pontuado em **7 eixos** (0–100 final):

| Eixo | O que mede | Como |
|---|---|---|
| `hook` | força dos primeiros 3 s | energia inicial + gatilhos ("não acredito", "?", "!" ) |
| `emotion` | picos de emoção | percentil 95 da energia |
| `dynamics` | ritmo (retenção) | desvio-padrão da energia |
| `speech` | clareza/ritmo de fala | palavras/segundo (ideal 1,6–4,5) |
| `semantic` | surpresa/curiosidade | léxico de emoção no texto |
| `trend` | tema em alta | léxico de nicho (GTA, RP, fuga…) |
| `loop` | fecho em clímax | energia dos últimos segundos |

Resultado: **score + rótulo + razões em linguagem humana** ("abre com um hook forte",
"picos de energia", "fecha em clímax").

### 🖼️ Reframe inteligente (`probe.py`)
Como o *ReframeAnything* da Opus e o *AI Reframe* da Klap:
- Detecta o formato (16:9, 9:16, 1:1, 4:5) e o alvo.
- **`blur`** (padrão): fundo desfocado preenchendo o quadro + vídeo centralizado — visual profissional.
- **`crop`**: recorte central que preenche.
- **`pad`**: barras preservando tudo.
- Preserva **layouts de live** (webcam + gameplay + overlays), como nos seus exemplos.
- Zona segura (`safe_bottom`) para a UI do TikTok/Reels/Shorts.

### 🅰️ Legendas profissionais (`paint.py` + `caption_engine.py`)
O grande diferencial das plataformas são as **captions que seguram a retenção**.
Como o build do ffmpeg local não tem `libass`, usamos **Pillow + `overlay`** (controle total):
- Tipografia pesada, **contorno grosso**, sombra.
- **Keyword highlight** em cor (amarelo/vermelho/ciano) — igual aos exemplos.
- **Emoji colorido inline** (Apple Color Emoji, com fallback) — estilo Submagic/Vizard.
- Quebra inteligente em 1–2 linhas por **largura medida** (não por caractere).
- **6 modelos de legenda** (`styles.py`) = os "modelos de legenda de colocar o texto".
- Exporta também `.srt` e `.ass` (para CapCut/Premiere/After Effects).

### ✍️ Metadata social (`metadata.py`)
Como o *Auto Description* (Submagic) e *Social Caption* (Vizard):
- Extrai **palavras-chave** (filtrando preenchimento) do texto transcrito.
- Detecta **categoria/evento** ("Assalto", "Fuga", "Tiroteio", "Capotamento"…) por léxico.
- Gera **títulos guiados por evento** (estilo dos exemplos: "Fuga com Joias Termina em Capotamento Épico").
- **Hashtags** misturadas: nicho → categoria → trending.
- **Descrição com CTA** (o "strong call-to-action" da Opus).
- Opcional: refina via **LLM** se `OPENAI_API_KEY` estiver definida.

---

## 3. O que NÃO foi copiado (e por quê)

- **B-roll gerado por IA** (Submagic/Vizard): exige modelos generativos de imagem/vídeo.
  Ficou de fora do escopo local; pode ser adicionado depois com um provedor de IA.
- **Object/face tracking em movimento** (Opus ReframeAnything): há OpenCV disponível
  (`cv2`) para um tracking por rosto, mas o reframe por `blur/crop` já cobre 95% dos casos
  de live. O tracking fino pode ser plugado em `probe.build_reframe_filter`.
- **Publicação/agendamento** (todos): fora do escopo — aqui o entregável é o arquivo pronto
  + metadata para colar.

---

## 4. Princípios adotados (a "receita" das boas clipagens)

1. **Hook nos primeiros 3 segundos** — começar em emoção/pergunta, não em contexto.
2. **Um arco por corte** — tensão → clímax → fecho (bom pra loop).
3. **Legendas que não poluem** — 1–2 linhas, palavra-chave em destaque, emoji pontual.
4. **Cortes de 1–3 min** — formato ideal para Shorts/Reels/TikTok (o usuário pediu 1–3 min).
5. **Título = evento + emoção + jogo**, não clickbait vazio.
6. **Hashtags: específicas primeiro, amplas depois.**
7. **Zona segura** — nada de texto embaixo onde fica a UI da plataforma.

---

*Documento vivo: cada recurso da tabela acima tem um módulo correspondente no código.*
