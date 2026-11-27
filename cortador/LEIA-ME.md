# 🎬 Cortador de Vídeos — Guia rápido (macOS)

Corta suas lives/vídeos longos nos **melhores momentos** (1–3 min), no formato
**9:16 vertical**, com **título, legenda e hashtags em português** prontos para
colar no TikTok / Reels / Shorts. Tudo acontece **no seu computador** — nada é
enviado para fora.

---

## ⚙️ Requisitos

- Mac (Intel ou Apple Silicon) com **macOS 12 ou mais novo**
- **~10 GB livres** no disco (o ffmpeg e os pacotes Python ocupam isso)
- Internet só na **instalação** (e para a IA escrever os títulos)

---

## 📦 Instalar (uma única vez)

1. Abra a pasta e clique **duas vezes** em **`INSTALAR.command`**
2. Se o macOS bloquear ("não é um aplicativo de um desenvolvedor identificado"):
   - clique com o **botão direito** no arquivo → **Abrir** → **Abrir**
3. Espere terminar (de 10 a 20 minutos na primeira vez — baixa vários pacotes)
   - Ele instala: ferramentas do Xcode (grátis), **ffmpeg** e as dependências de Python
4. Quando aparecer **✅ INSTALAÇÃO CONCLUÍDA**, é só fechar a janela

> Dica: se o Terminal pedir a sua senha é normal (para instalar o Homebrew/ffmpeg).

---

## ▶️ Usar

1. Clique duas vezes em **`INICIAR.command`**
2. O navegador abre em **http://localhost:8000**
3. **Escolha o arquivo** (o vídeo ou a live) → ajuste as opções → **▶ Processar vídeo**
4. Uma **barra de progresso** mostra o que está sendo feito
   (analisar → transcrever → IA escolhendo os momentos → renderizar)
5. Quando terminar, aparece a página **🔥 Momentos Virais** com todos os cortes

### Em cada corte você tem:
- 🎥 o vídeo para **assistir** (clique na miniatura) e **baixar (MP4)**
- 📄 arquivos de **legenda (.srt / .ass)** e **relatório**
- ✏️ **Título** · 📝 **Legenda** · #️⃣ **Hashtags** — cada um com botão **📋 Copiar**
- ⭐ **Copiar tudo** → título + legenda + hashtags de uma vez (cola direto na rede)

### ⏹ Para parar
Feche a janela do Terminal (ou aperte `Ctrl+C`).

---

## 📁 Onde ficam os arquivos

| O quê | Onde |
|---|---|
| Vídeos prontos (MP4, SRT, ASS) | `output_web/<id do trabalho>/cortes/` |
| Relatório (JSON/Markdown) | `output_web/<id do trabalho>/` |
| Apagar trabalhos antigos | no site: **📁 Meus trabalhos** → 🗑️ |

> 💾 O site mostra o **espaço livre no disco** na tela inicial. Se estiver apertado,
> apague trabalhos antigos — eles ocupam vários GB cada.

---

## 🧠 Sobre a IA

A IA (**DeepSeek**) é quem **escolhe os melhores momentos** e escreve
**título, legenda e hashtags em PT-BR** (ex.: `#gta6 #gtavi`).
A chave já vem configurada neste pacote — é só usar.

- Custo: **centavos por live** (a DeepSeek é muito barata)
- Para **desligar a IA**: desmarque a caixinha 🧠 antes de processar
  (aí os títulos/hashtags saem por regras automáticas, sem custo)

---

## 🛠️ Problemas comuns

**"Não é um aplicativo de um desenvolvedor identificado"**
→ Clique com o botão direito no `.command` → **Abrir** → **Abrir**.

**O terminal abre e fecha sozinho**
→ Abra o **Terminal** (⌘+Espaça, digite "Terminal") e arraste o `INSTALAR.command`
para dentro dele, depois aperte Enter. Assim você vê a mensagem de erro.

**"ffmpeg: command not found"**
→ Rode o `INSTALAR.command` de novo (ele instala o ffmpeg).

**"Porta8000 já está em uso" / página não abre**
→ Feche as janelas antigas do Terminal e rode o `INICIAR.command` de novo.

**A transcrição sai errada / sem sentido**
→ Instale o Speech Enhancer: rode no Terminal
`.venv/bin/pip install demucs soundfile` (é o que o instalador já faz).

**Processamento travado / "disco cheio"**
→ Libere espaço: apague trabalhos antigos em **📁 Meus trabalhos**.

---

## 🔒 Privacidade

- Seus vídeos **não saem do seu Mac** (só o trecho de texto da transcrição vai
  para a IA escrever o título/legenda — nunca o vídeo).
- Nada é compartilhado, não há login, não há nuvem.
