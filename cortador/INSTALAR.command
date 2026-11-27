#!/bin/zsh
# ============================================================
#  🎬 INSTALADOR do Cortador de Vídeos (macOS)
#  Instala tudo o que é preciso: ffmpeg + Python + dependências
#  Rode uma única vez. Depois use o "INICIAR.command".
# ============================================================
set -u
cd "$(dirname "$0")" || exit 1

echo "======================================================"
echo "  🎬 Instalador do Cortador de Vídeos (macOS)"
echo "======================================================"
echo "  Isto vai instalar:"
echo "   • as ferramentas do Xcode (grátis, necessárias)"
echo "   • o ffmpeg (corta/renderiza o vídeo)"
echo "   • as dependências de Python (em uma pasta isolada)"
echo "  ⏱ Na 1ª vez leva de 10 a 20 minutos (baixa vários pacotes)."
echo ""

pausar() {
  echo ""
  echo -n "  Pressione qualquer tecla para fechar… "
  read -k1 -s
  echo ""
}

passo() { echo ""; echo "▶ $1"; }

# ---------- 1) Ferramentas de linha de comando do Xcode ----------
passo "1/5 Verificando as ferramentas do Xcode (grátis)…"
if ! xcode-select -p >/dev/null 2>&1; then
  echo "   ⚠️  É preciso instalar as 'Ferramentas de linha de comando do Xcode'."
  echo "   Uma janela do sistema vai abrir → clique em Instalar e espere terminar."
  echo "   (é gratuito, só precisa de internet)"
  xcode-select --install >/dev/null 2>&1 || true
  echo ""
  echo "   Depois de instalar, clique duas vezes neste arquivo de novo."
  pausar
  exit 1
fi
echo "   ✅ OK"

# ---------- 2) Python ----------
passo "2/5 Verificando o Python…"
if ! command -v python3 >/dev/null 2>&1; then
  echo "   ⚠️  Python não encontrado. Rode o item 1 de novo (instala o Python junto)."
  pausar
  exit 1
fi
PYV=$(python3 -c 'import sys; print("%d.%d" % sys.version_info[:2])' 2>/dev/null || echo "?")
echo "   ✅ Python $PYV"

# ---------- 3) ffmpeg ----------
passo "3/5 Verificando o ffmpeg (corta e renderiza o vídeo)…"
if command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1; then
  echo "   ✅ ffmpeg já está instalado"
elif command -v brew >/dev/null 2>&1; then
  echo "   Instalando com o Homebrew (pode demorar alguns minutos)…"
  brew install ffmpeg
  if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "   ⚠️  Não consegui instalar o ffmpeg. Tente rodar no Terminal:"
    echo "       brew install ffmpeg"
    pausar
    exit 1
  fi
  echo "   ✅ ffmpeg instalado"
else
  echo "   ⚠️  Não encontrei o ffmpeg nem o Homebrew neste Mac."
  echo ""
  echo "   Opção A (recomendada) — instale o Homebrew colando no Terminal:"
  echo "     /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
  echo "     Depois rode este instalador de novo."
  echo ""
  echo "   Opção B — baixe o ffmpeg em: https://ffmpeg.org/download.html"
  pausar
  exit 1
fi

# ---------- 4) Ambiente Python isolado + dependências ----------
passo "4/5 Instalando as dependências (10–20 min na 1ª vez)…"
if [ ! -d .venv ]; then
  python3 -m venv .venv || { echo "   ❌ Falha ao criar o ambiente Python."; pausar; exit 1; }
fi
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install -q --upgrade pip
if ! python -m pip install -r requirements-cli.txt -r requirements.txt python-multipart; then
  echo "   ❌ Falha ao instalar as dependências principais."
  echo "      Confira a internet e rode este arquivo de novo."
  pausar
  exit 1
fi
echo "   ✅ dependências básicas ok"

# ---------- 5) Speech Enhancer + modelo de transcrição ----------
passo "5/5 Opcionais: voz isolada + modelo de transcrição…"
if python -m pip install demucs soundfile; then
  echo "   ✅ Speech Enhancer instalado (transcrição bem mais precisa)"
else
  echo "   ⚠️  Speech Enhancer não instalado (opcional — dá pra usar sem ele)."
fi
echo "   Baixando o modelo de transcrição (uma vez só, ~500 MB)…"
if python -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')" 2>/dev/null; then
  echo "   ✅ modelo pronto"
else
  echo "   ⚠️  Não baixou agora — ele baixa sozinho no primeiro uso."
fi

echo ""
echo "======================================================"
echo "  ✅ INSTALAÇÃO CONCLUÍDA!"
echo ""
echo "  Para usar: clique duas vezes em  INICIAR.command"
echo "  Depois é só arrastar o vídeo/live e clicar em Processar."
echo "======================================================"
echo ""
echo -n "  Pressione qualquer tecla para fechar… "
read -k1 -s
echo ""
