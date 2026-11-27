#!/bin/zsh
# ============================================================
#  🎬 INICIAR o Cortador de Vídeos (macOS)
#  Abre o cortador no navegador. Pode fechar esta janela para parar.
# ============================================================
set -u
cd "$(dirname "$0")" || exit 1

pausar() {
  echo ""
  echo -n "  Pressione qualquer tecla para fechar… "
  read -k1 -s
  echo ""
}

# já instalado?
if [ ! -x .venv/bin/python ]; then
  echo "  ⚠️  Ainda não foi instalado."
  echo "     Clique duas vezes em  INSTALAR.command  e espere terminar."
  pausar
  exit 1
fi

# já está rodando? então só abre no navegador
if lsof -nP -i :8000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "  ✅ O cortador já está rodando → abrindo no navegador…"
  open "http://localhost:8000"
  exit 0
fi

# verifica ffmpeg (o cortador avisa se faltar)
if ! command -v ffmpeg >/dev/null 2>&1 && [ ! -x /opt/homebrew/bin/ffmpeg ] && [ ! -x /usr/local/bin/ffmpeg ]; then
  echo "  ⚠️  ffmpeg não encontrado. Rode o INSTALAR.command antes."
  pausar
  exit 1
fi

echo "  🎬 Abrindo o Cortador de Vídeos em  http://localhost:8000"
echo "     • Para parar: feche esta janela ou aperte Ctrl+C"
echo "     • Os vídeos prontos ficam na pasta  output_web/  (dentro desta pasta)"
echo ""

( sleep 4; open "http://localhost:8000" ) &

.venv/bin/python webui.py
