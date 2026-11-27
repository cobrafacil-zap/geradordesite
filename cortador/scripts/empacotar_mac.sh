#!/bin/zsh
# Empacota o Cortador de Vídeos para enviar para outra pessoa (macOS).
# Uso:  ./scripts/empacotar_mac.sh
# Saída: ~/Desktop/Cortador-de-Videos.zip
set -eu

cd "$(dirname "$0")/.."
SRC="$PWD"
NAME="Cortador-de-Videos"
OUT="$HOME/Desktop/$NAME"
ZIP="$HOME/Desktop/$NAME.zip"

echo "▶ Montando o pacote em $OUT …"
rm -rf "$OUT" "$ZIP"
mkdir -p "$OUT"

# código + configuração necessária para rodar
rsync -a \
  --exclude 'output_web/' \
  --exclude 'output/' \
  --exclude '_work/' \
  --exclude '.venv/' \
  --exclude '__pycache__/' \
  --exclude '*.pyc' \
  --exclude '.DS_Store' \
  --exclude '.git/' \
  --exclude 'api/' \
  --exclude 'scripts/' \
  --exclude 'vercel.json' \
  --exclude 'fly.toml' \
  --exclude 'Dockerfile' \
  --exclude 'REVERSE_ENGINEERING.md' \
  "$SRC/" "$OUT/"

# a chave da IA vai junto (o usuário escolheu compartilhar)
if [ -f "$SRC/.env" ]; then
  cp "$SRC/.env" "$OUT/.env"
fi

# pastas que o rsync pode não ter copiado se vazias
mkdir -p "$OUT/assets" "$OUT/fonts"

# permissões dos instaladores (duplo clique)
chmod +x "$OUT/INSTALAR.command" "$OUT/INICIAR.command"
find "$OUT" -name '.DS_Store' -delete 2>/dev/null || true
xattr -cr "$OUT" 2>/dev/null || true

echo "▶ Compactando em $ZIP …"
ditto -c -k --sequesterRsrc --keepParent "$OUT" "$ZIP"

echo ""
echo "✅ Pronto! Envie este arquivo para a sua amiga:"
echo "   $ZIP"
echo ""
echo "   Tamanho: $(du -h "$ZIP" | cut -f1)"
echo "   (Ela descompacta, clica duas vezes em INSTALAR.command e depois em INICIAR.command)"
