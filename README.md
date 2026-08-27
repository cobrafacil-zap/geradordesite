# Gerador de Sites — Fábrica de Sites

> Plataforma comercial para criar sites completos e funcionais durante calls de vendas.
> 28 modelos distintos · export Next.js + Painel Admin · export HTML/CSS/JS estático · sem build step.

[![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-0f172a?style=flat)](https://github.com/cobrafacil-zap/geradordesite)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?style=flat&logo=vercel)](https://vercel.com)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-Privada-ff6b6b?style=flat)](#)

---

## O que é

A **Fábrica de Sites** é uma aplicação web que roda 100% no navegador (sem backend, sem build, sem dependência de servidor):

- **28 modelos** em 4 categorias — cada um com identidade visual própria (cores, layout de hero, copy, serviços, diferenciais), prontos para apresentar sem editar nada
- **Editor visual** com preview ao vivo, device toggle (Desktop/Tablet/Mobile), controle de cores, gestão de mídia com origens (upload/externa/referência/IA), referências externas com extração de cores
- **Geração de código real** — não mockups: cada projeto é exportado como **Next.js 14 com painel admin** (bcrypt + JWT + API routes) ou **HTML/CSS/JS estático multi-página**
- **Validação automática** — antes de exportar: estrutura, SEO (title, meta, OG, viewport, H1), links, imagens, placeholders, vazamento de secrets
- **ZIP real** via JSZip, pronto para `npm install` ou upload FTP

---

## Demo online

https://geradordesite.vercel.app

> Sem backend: tudo roda client-side, dados persistem em `localStorage`.

---

## Como rodar localmente

Sem build, sem `npm install`. Você só precisa de um servidor HTTP estático:

```bash
# Opção 1 — Python (já vem no macOS/Linux)
python3 -m http.server 8000 --directory gerador
# abrir http://localhost:8000

# Opção 2 — Node
npx http-server gerador -p 8000

# Opção 3 — abrir direto no navegador
open gerador/index.html   # macOS
xdg-open gerador/index.html   # Linux
start gerador/index.html   # Windows
```

> Abra no Chrome/Edge/Firefox/Safari. Não roda em IE.

---

## Como usar durante a call

1. **Dashboard** → `+ Novo Projeto`
2. **Escolha um modelo** (28 disponíveis, filtrados por categoria — Institucional, Serviços, Vendas, Profissionais)
3. **Editor** — cada aba do editor já vem preenchida com o copy do modelo (slogan, sobre, 3 serviços, 3 diferenciais, FAQ). O vendedor apenas ajusta:
   - **Info**: nome, contato, endereço
   - **Visual**: ajuste de cores se quiser
   - **Conteúdo**: refine serviços/produtos/equipe/depoimentos/FAQ
   - **Páginas**: visualize a estrutura
4. **IA de edição**: "Deixe mais sofisticado", "Adicione FAQ", "Mude as cores para azul"
5. **Apresentar**: fullscreen com toggle desktop/tablet/mobile
6. **Exportar ZIP**: escolha **Next.js + Painel Admin** (recomendado) ou **HTML Estático**, valide, baixe

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | HTML5 + CSS Variables (tema dark) + JS vanilla |
| Estado | `localStorage` (sem servidor) |
| Geração | `site-generator.js` — renderiza Home + páginas internas |
| Export ZIP | [JSZip 3.10.1](https://stuk.github.io/jszip/) (via CDN) |
| Painel admin (no export) | Next.js 14 App Router + TypeScript + Tailwind + bcryptjs + jose (JWT) + better-sqlite3 |
| Estático (no export) | HTML semântico + CSS responsivo com mobile-first media queries |

Sem bundler, sem transpiler, sem `package.json` no app rodando. Todo JS é vanilla.

---

## Estrutura do repositório

```
.
├── README.md             # este arquivo
├── package.json          # apenas metadados, sem dependências runtime
├── vercel.json           # config de deploy (outputDirectory: gerador)
├── .gitignore
└── gerador/              # a aplicação em si
    ├── index.html        # entry point
    ├── styles/app.css    # UI da plataforma (tema dark)
    ├── engine/
    │   ├── templates.js  # 7 templates × 28 modelos + MODEL_PRESETS
    │   ├── site-generator.js  # motor de geração (com 7 variantes de hero)
    │   ├── validator.js  # validação pré-export
    │   ├── zip-export.js # empacotamento JSZip
    │   └── app.js        # UI/UX completa (editor, modelos, projetos)
    └── README.md         # docs internos da pasta gerador
```

---

## Templates disponíveis

Cada modelo tem identidade visual própria (9 layouts de card distintos, 7 variantes de hero):

| Categoria | Modelos |
|-----------|--------|
| **Institucional** (8) | Corporate, Modern Business, Premium, Minimal, Empresa Local, Construção, Clínica, Imobiliária |
| **Serviços** (8) | Serviços Gerais, Eletricista, Encanador, Mecânica, Assistência Técnica, Limpeza, Agência, Fotógrafo |
| **Vendas** (6) | Landing Page de Produto, Página de Oferta, Página de Vendas, Produto Premium, Catálogo, Produto Local |
| **Profissionais** (6) | Advogado, Contador, Corretor, Personal Trainer, Consultor, Profissional Autônomo |

Cada modelo configura automaticamente no projeto:
- Slogan próprio
- Texto "Sobre a empresa"
- 3 serviços
- 3 diferenciais
- 2–3 FAQs
- Layout do hero (A split, B centrado, C magazine 3 colunas, D product spotlight, E service grid, F vitrine, G polaroids)
- Paleta de cores (primária, secundária, accent)

Vendedor só precisa adaptar copy + nome + contato durante a call.

---

## Exportação

### Next.js + Painel Admin (recomendado)

Painel administrativo completo em `/admin/*`:
- `/admin/login` — autenticação com bcrypt
- `/admin/dashboard` — visão geral
- `/admin/pages`, `/admin/services`, `/admin/products`
- `/admin/team`, `/admin/testimonials`, `/admin/blog`
- `/admin/media`, `/admin/menus`, `/admin/seo`, `/admin/settings`

Após baixar o ZIP:

```bash
cd <nome-do-site>
cp .env.example .env.local
# Edite AUTH_SECRET (openssl rand -base64 32)
npm install
npm run db:migrate
npm run create-admin   # cria o primeiro admin interativamente (mínimo 8 chars)
npm run dev
# abra http://localhost:3000 e http://localhost:3000/admin/login
```

### HTML/CSS/JS Estático

Site multi-página sem painel admin. Funciona em qualquer hospedagem (Apache, Nginx, cPanel, FTP):

```bash
# upload todos os arquivos via FTP/cPanel para a raiz pública
# pronto — não tem build, não tem dependência
```

---

## Validações automáticas (pré-export)

Antes de permitir o download do ZIP, o sistema verifica:

- ✓ Arquivos obrigatórios presentes
- ✓ Cada página com `<title>`, `<meta description>`, viewport, Open Graph
- ✓ H1 presente em cada página
- ✓ Links internos não quebrados
- ✓ Imagens referenciadas existem
- ✓ Sem placeholders (Lorem ipsum, "Nome da empresa", etc.)
- ✓ **Sem vazamento de secrets** (Supabase keys, AI keys, Stripe live keys)

Se houver erros bloqueantes, o download é cancelado com mensagem clara.

---

## Princípios

- **Não criar mockups.** Cada geração é um projeto real, editável, instalável.
- **Não inventar informações.** Copy dos modelos é template editável do segmento — não depoimento/número/certificação falsificada.
- **Não expor secrets.** Apenas `.env.example` vai no ZIP exportado.
- **Preview = Projeto.** O que o vendedor vê é o que será exportado.

---

## Deploy

A aplicação é **100% estática**. A Vercel detecta isso automaticamente.

```bash
# 1. Subir o repositório para o GitHub
git init && git add . && git commit -m "Initial commit" && git push

# 2. Conectar o repo na Vercel (https://vercel.com/new)
#    - Framework preset: Other
#    - Root directory: . (raiz do projeto)
#    - Build command: (vazio)
#    - Output directory: gerador     ← vem do vercel.json
#    - Install command: (vazio)

# 3. Deploy automático em todo push na main
```

O arquivo `vercel.json` na raiz já configura `outputDirectory: gerador` — você não precisa mexer no painel.

> **Alternativa sem GitHub**: `vercel deploy --prod` direto do CLI após `vercel login`.

---

## Licença

Privado. © Cobrafacil — Nicolas Cavalheiro.
