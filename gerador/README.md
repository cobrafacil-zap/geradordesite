# Gerador de Sites — Fábrica de Sites

Ferramenta comercial para criar sites completos e funcionais durante calls de vendas.

## O que é

Aplicação web que:
- Cria projetos a partir de 28 modelos em 4 categorias (Institucional, Serviços, Vendas, Profissionais)
- Gera sites **com múltiplas páginas** adaptados ao segmento (clínica, imobiliária, restaurante, empresa, serviços, loja, profissional liberal)
- Exporta projetos **reais** em dois formatos:
  - **Next.js 14** (App Router) com painel administrativo funcional, autenticação JWT, bcrypt, API routes, TypeScript, Tailwind
  - **HTML/CSS/JS estático** para hospedagem tradicional
- Inclui **biblioteca de mídia** com origem dos assets (upload, externa, referência)
- Permite **referências externas** (URLs) com extração de cores e título
- Valida estrutura, SEO, placeholders, links quebrados e vazamento de secrets antes de exportar
- Gera **ZIP real** pronto para `npm install` ou upload FTP

## Estrutura

```
gerador/
├── index.html              # Entry point
├── styles/app.css          # UI da plataforma
└── engine/
    ├── templates.js        # 7 templates de site (clínica, imobiliária, etc)
    ├── site-generator.js   # Motor de geração de arquivos
    ├── validator.js        # Validações pré-export
    ├── zip-export.js       # Empacotamento JSZip
    └── app.js              # Aplicação principal (UI/UX)
```

## Como usar

### 1. Abra a plataforma

```bash
cd gerador
python3 -m http.server 8000
# Acesse http://localhost:8000
```

Ou abra `index.html` diretamente no navegador (Chrome/Edge/Firefox/Safari).

### 2. Fluxo durante a call

1. **Dashboard** → "+ Novo Projeto"
2. Escolha um **modelo** (28 disponíveis, filtrados por categoria)
3. **Editor** — preencha:
   - **Info**: empresa, contato, sobre, logo
   - **Visual**: 8 estilos, color pickers, sugestão automática por segmento
   - **Conteúdo**: serviços, produtos, equipe, FAQ, depoimentos, imagens
   - **Páginas**: visualize a estrutura gerada
4. **IA de edição**: "Deixe mais sofisticado", "Adicione FAQ", etc.
5. **Apresentar**: modo fullscreen, desktop/tablet/mobile
6. **Exportar ZIP**: escolha Next.js ou Static, valide, baixe

### 3. Após a venda

Para o projeto **Next.js** exportado:
```bash
cd clinica-vida
cp .env.example .env.local
# Edite AUTH_SECRET (openssl rand -base64 32)
npm install
npm run db:migrate
npm run create-admin
npm run dev
# Acesse http://localhost:3000 e http://localhost:3000/admin/login
```

Para o projeto **estático**:
- Faça upload de todos os arquivos via FTP/cPanel
- Funciona em Apache, Nginx, hospedagem compartilhada

## Templates disponíveis

| ID | Segmento | Páginas |
|----|----------|---------|
| `clinica-premium` | Clínica | Home, Sobre, Especialidades, Equipe, Contato, Política |
| `imobiliaria` | Imobiliária | Home, Imóveis, Sobre, Corretores, Contato |
| `restaurante` | Restaurante | Home, Cardápio, Sobre, Reservas, Contato |
| `empresa-corporativa` | Empresa | Home, Sobre, Serviços, Cases, Blog, Contato |
| `servicos-gerais` | Prestador | Home, Serviços, Sobre, Contato |
| `loja-produtos` | Loja | Home, Produtos, Sobre, Contato |
| `profissional-liberal` | Liberal | Home, Sobre, Serviços, Contato |

## Painel administrativo (apenas Next.js)

Rotas protegidas em `/admin/*`:
- `/admin/login` — login com bcrypt
- `/admin/dashboard` — visão geral
- `/admin/pages`, `/admin/services`, `/admin/products`
- `/admin/team`, `/admin/testimonials`, `/admin/blog`
- `/admin/media`, `/admin/menus`, `/admin/seo`, `/admin/settings`

Criar primeiro admin: `npm run create-admin` (prompt seguro, mínimo 8 caracteres).

## Validações automáticas

Antes de permitir download, o sistema verifica:
- ✓ Arquivos obrigatórios presentes
- ✓ Cada página com `<title>`, `<meta description>`, viewport, Open Graph
- ✓ H1 presente em cada página
- ✓ Links internos não quebrados
- ✓ Imagens referenciadas existem
- ✓ Sem placeholders (Lorem ipsum, "Nome da empresa", etc.)
- ✓ Sem vazamento de secrets (Supabase keys, AI keys, etc.)

## Princípios

- **Não criar mockups**. Cada geração é um projeto real, editável, instalável.
- **Não inventar informações**. Conteúdo só vem do que o vendedor inseriu.
- **Não expor secrets**. `.env.example` apenas, sem valores reais.
- **Preview = Projeto**. O que o vendedor vê é o que será exportado.
