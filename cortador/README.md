# 🎬 Cortador de Vídeos com Legenda

> Transforma **lives e vídeos longos** nos **melhores cortes** (1–3 min), prontos para
> TikTok / Reels / Shorts — com **legenda profissional**, **título**, **hashtags** e
> **descrição** gerados automaticamente para cada corte.

Feito para gameplay (GTA RP e afins), mas funciona com **qualquer vídeo que tenha fala**.

`100% local` · `sem assinatura` · `ffmpeg + Python` · [`engenharia reversa`](./REVERSE_ENGINEERING.md)

---

## ✨ O que ele faz

- 🎯 **Acha os melhores takes** — análise de áudio (energia, emoção, ritmo) + janelas de 1–3 min
- 📈 **Score de viralidade** — cada corte pontuado em 7 eixos, com razões
- 🖼️ **Detecta 16:9 / 9:16 / 1:1** e reenquadra automaticamente (fundo borrado / crop / pad)
- 🅰️ **Legenda profissional queimada** — contorno, palavra-chave em cor, **emoji colorido**
- 🎨 **6 modelos de legenda** prontos (o "colocar o texto" no estilo que você quiser)
- ✍️ **Título + hashtags + descrição** por corte (guiados por evento, estilo viral)
- 📊 **Relatório** em `.md` + `.json` + legendas `.srt` / `.ass` para cada corte
- 🎛️ **Barra de progresso**, logo e banner opcionais

---

## 🌐 Interface Web (subir o vídeo → cortar → baixar)

Para usar pelo navegador, com upload — **100% privado** (o vídeo é processado na sua máquina):

```bash
cd cortador
pip3 install -r requirements-cli.txt -r requirements.txt
python3 webui.py
# abra http://localhost:8000
```

Você sobe a live, escolhe as opções (nº de cortes, formato, modelo de legenda, jogo) e
baixa os cortes prontos (MP4 + .srt/.ass + relatório). Dá para rodar em **qualquer
servidor que você controle** (Railway, Render, Fly.io, VPS) — só não use Vercel/serverless,
que não tem ffmpeg e estoura tempo/memória em vídeos grandes.

---

## 🚀 Começo rápido (CLI)

```bash
cd cortador

# 1) dependências
pip3 install -r requirements-cli.txt   # faster-whisper, numpy, scipy, pillow

# 2) rodar (baixa o modelo de transcrição na primeira vez)
python3 run.py "minha_live.mp4" -n 5 --style gaming_bold --format 9:16
```

Saída em `output/cortes/`:

```
corte_01_<titulo>.mp4    ← vídeo pronto (1080x1920) com legenda
corte_01_<titulo>.srt    ← legenda simples (para CapCut/Premiere)
corte_01_<titulo>.ass    ← legenda estilizada (para After Effects)
corte_01_<titulo>.json   ← título, hashtags, descrição, transcrição, viralidade
report.md / report.json  ← resumo de todos os cortes
```

---

## 🎛️ Opções principais

```bash
python3 run.py ENTRADA [opções]

  -o, --output DIR       pasta de saída            (padrão: output)
  -n, --count N          quantidade de cortes      (padrão: 5)
  --min-len / --max-len  duração mín/máx em s      (60 / 180)
  --target-len           duração alvo em s         (90)
  --format               9:16 | 16:9 | 1:1 | 4:5 | auto
  --reframe              blur | crop | pad | none
  --style                modelo de legenda (ver abaixo)
  --game                 jogo/nicho p/ títulos     (ex: "GTA RP")
  --language             idioma da transcrição     (pt)
  --model                tiny|base|small|medium|large
  --engine               faster | mlx
  --zoom                 zoom lento (0 = off)
  --logo PNG             marca d'água
  --banner PNG           banner do topo
  --no-emoji             desliga emoji
  --no-progress          desliga barra de progresso
  --no-render            só legendas/metadata (sem vídeo)
  --styles               lista os modelos e sai
```

### Exemplos

```bash
# 5 cortes verticais estilo gaming, com emoji e barra de progresso
python3 run.py "live.mp4" -n 5 --style gaming_bold --format 9:16 --game "GTA RP"

# saída horizontal, legenda minimal, sem emoji
python3 run.py "podcast.mp4" --format 16:9 --style minimal --no-emoji

# só gerar legendas + títulos (rápido, sem renderizar vídeo)
python3 run.py "live.mp4" --no-render

# usar GPU Apple (mais rápido) e modelo maior (mais preciso)
python3 run.py "live.mp4" --engine mlx --model medium
```

---

## 🎨 Modelos de legenda ("colocar o texto")

Cada modelo define fonte, cor, contorno, posição e efeitos. Veja a vitrine em
[`examples/modelos/`](./examples/modelos/).

| Modelo | Visual | Uso |
|---|---|---|
| `gaming_bold` | Caixa-alta pesada, keyword amarela, emoji | gameplay / clipes (igual aos exemplos) |
| `karaoke` | Palavra-a-palavra acendendo | alta retenção em Shorts/Reels |
| `neon` | Contorno ciano/magenta com glow | hype, cyber |
| `minimal` | Limpo, sem cor, contorno fino | conteúdo sério/informativo |
| `podcast` | Caixa de fundo translúcida | trechos de conversa |
| `hype` | Gigante, keyword vermelha | momento mais quente do corte |

```bash
python3 run.py --styles     # lista todos
```

Quer um visual novo? Edite [`cortador/styles.py`](./cortador/styles.py) — cada `CaptionStyle`
é um "modelo de legenda" declarativo (fonte, cores, contorno, emoji, destaque).

---

## 🧠 Como ele escolhe os cortes

1. **Análise de áudio** → energia por segundo, picos de emoção, densidade de fala.
2. **Janelas deslizantes (60–180 s)** → as de maior pontuação, sem sobreposição.
3. **Snap em pausas** → cortes começam/terminam em silêncio natural.
4. **Score de viralidade** → hook, emoção, dinâmica, fala, semântica, trend, loop.
5. **Transcrição** (faster-whisper) → legendas + base para título/hashtags.

Detalhes em [`REVERSE_ENGINEERING.md`](./REVERSE_ENGINEERING.md).

---

## 📦 Estrutura

```
cortador/
├── run.py                # entrada rápida
├── requirements.txt
├── fonts/                # fontes embutidas (Anton, Montserrat, Bebas, Archivo)
├── examples/
│   ├── modelos/          # vitrine dos modelos de legenda
│   └── assets/           # exemplos de logo e banner
└── cortador/
    ├── probe.py          # ffprobe + detecção de formato + reframe
    ├── analysis.py       # análise de áudio + seleção de melhores takes
    ├── transcribe.py     # faster-whisper / mlx-whisper (timestamps por palavra)
    ├── caption_engine.py # quebra de texto + destaque + emoji
    ├── paint.py          # pintura das legendas/overlays (Pillow)
    ├── styles.py         # modelos de legenda (presets)
    ├── captions.py       # exportação SRT / ASS
    ├── virality.py       # score de viralidade (7 eixos)
    ├── metadata.py       # título, hashtags, descrição
    ├── render.py         # ffmpeg: corte + reframe + overlays + legenda
    ├── pipeline.py       # orquestra tudo
    └── cli.py            # linha de comando
```

---

## ⚙️ Requisitos

- **Python 3.9+**
- **ffmpeg** no PATH (qualquer build com `overlay`/`drawbox` — o padrão já serve)
- Dependências da CLI: `pip3 install -r requirements-cli.txt`
- (Opcional) `OPENAI_API_KEY` para refinar títulos via LLM

> As legendas são renderizadas com **Pillow + overlay**, então **não** precisa de
> ffmpeg com `libass`. Se o seu ffmpeg tiver `libass`, o `.ass` também é exportado.

---

## 🧪 Verificação rápida

```bash
# roda em 1 min com um recorte curto
ffmpeg -ss 0 -t 120 -i "live.mp4" -c copy teste.mp4
python3 run.py teste.mp4 -n 1 --model base
```
