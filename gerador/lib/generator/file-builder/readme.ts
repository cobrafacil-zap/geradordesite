/**
 * Gera README.md do site exportado com instruções reais,
 * baseadas nos scripts disponíveis no package.json gerado.
 */
import type { BuildOptions } from './types';
import { slugify } from './_helpers';

export function buildReadme(opts: BuildOptions): string {
  const project = opts.projectName;
  const usePostgres = opts.dbAdapter === 'postgres';
  const slug = slugify(project);

  return `# ${project}

Site gerado pelo **Gerador de Sites — Fábrica de Sites Real**.

Este é um projeto Next.js 14 completo, com painel administrativo, banco de dados,
autenticação real e pronto para deploy em qualquer hospedagem Node.

---

## ✨ O que tem dentro

- **Next.js 14** (App Router + Server Components)
- **TypeScript** estrito
- **Tailwind CSS**
- **Banco de dados**: ${usePostgres ? 'PostgreSQL (Drizzle ORM)' : 'SQLite local (Drizzle ORM, sem servidor)'}
- **Autenticação**: bcrypt + JWT (HTTP-only cookie)
- **Painel admin** em \`/admin/login\` com 12 telas e CRUD real
- **API REST** em \`/api/admin/*\`
- **Open Graph + SEO** por página

---

## 🚀 Como rodar localmente

### 1. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configure o ambiente

Copie o arquivo de exemplo e edite:

\`\`\`bash
cp .env.example .env.local
\`\`\`

O \`.env.local\` precisa de:

\`\`\`
${usePostgres ? 'DATABASE_URL=postgres://user:pass@localhost:5432/dbname' : 'DATABASE_URL=file:./database/data.db'}
AUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

> **Gere um AUTH_SECRET forte**: \`openssl rand -base64 32\`

### 3. Rode as migrations

Cria as tabelas no banco:

\`\`\`bash
npm run db:migrate
\`\`\`

### 4. Crie o primeiro admin

O script vai perguntar e-mail, senha e nome:

\`\`\`bash
npm run create-admin
\`\`\`

Senha mínima: 8 caracteres. O hash bcrypt é gerado com salt 10 — **nunca** é armazenada em texto puro.

### 5. (Opcional) Popule o site_config inicial

\`\`\`bash
npm run db:seed
\`\`\`

### 6. Rode o site

\`\`\`bash
npm run dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) para o site público,
ou [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para o painel.

---

## 📁 Estrutura

\`\`\`
${slug}/
├── app/
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Layout raiz (metadata, fontes)
│   ├── globals.css
│   ├── (site)/
│   │   └── [slug]/page.tsx       # Páginas dinâmicas (/sobre, /servicos…)
│   ├── admin/
│   │   ├── login/
│   │   └── (panel)/              # 12 telas admin
│   └── api/admin/                # CRUDs
├── components/
│   ├── SiteRenderer.tsx          # Orquestrador
│   └── site/                     # Header, Footer, Hero, etc.
├── lib/
│   ├── db/
│   │   ├── client.ts             # Conexão Drizzle
│   │   └── schema.ts             # Schema
│   ├── auth.ts                   # JWT + bcrypt
│   ├── site-config.ts            # Lê config do banco
│   └── types.ts
├── database/
│   ├── schema.sql                # Schema versionado
│   └── data.db                   # (sqlite apenas — gerado)
├── scripts/
│   ├── migrate.mjs               # Roda migrations
│   ├── create-admin.mjs          # Cria admin
│   └── seed.mjs                  # Popula site_config
├── public/                       # Uploads
├── package.json
├── tailwind.config.ts
└── .env.example
\`\`\`

---

## 🔧 Scripts disponíveis

| Script | O que faz |
|---|---|
| \`npm run dev\` | Inicia o servidor de desenvolvimento |
| \`npm run build\` | Faz build de produção |
| \`npm start\` | Serve o build de produção |
| \`npm run typecheck\` | Verifica tipos TypeScript |
| \`npm run db:generate\` | Gera migrations do Drizzle |
| \`npm run db:migrate\` | Aplica migrations no banco |
| \`npm run db:seed\` | Popula \`site_config\` |
| \`npm run create-admin\` | Cria/atualiza um admin |

---

## 🚢 Deploy

### SQLite (recomendado para Hostinger, Locaweb, VPS, Fly.io)

1. Suba o projeto (sem \`database/data.db\`).
2. Configure \`.env\` no servidor com \`DATABASE_URL=file:./database/data.db\`.
3. \`npm install && npm run build\`.
4. \`npm run db:migrate && npm run create-admin\`.
5. \`npm start\`.

### Postgres (Vercel, Neon, Supabase, RDS)

1. Substitua \`DATABASE_URL\` por uma URL Postgres real.
2. \`npm install && npm run build\`.
3. \`npm run db:migrate\` (executar uma vez, fora do build).
4. \`npm run create-admin\`.
5. Deploy.

---

## 🔐 Segurança

- Senhas são armazenadas como **bcrypt hash** com salt 10. Nenhum texto puro.
- Sessão é **JWT HS256** em cookie HTTP-only, SameSite=Lax, 7 dias.
- \`AUTH_SECRET\` precisa ser único por ambiente — **nunca** commitar.
- Todas as rotas \`/api/admin/*\` checam sessão.
- CSRF: tokens não usados (SameSite=Lax + POST só em formulários autenticados).

---

## 📞 Suporte

Em caso de dúvidas, consulte a documentação do Next.js:
- [nextjs.org/docs](https://nextjs.org/docs)
- [orm.drizzle.team](https://orm.drizzle.team)

Gerado por **Gerador de Sites — Fábrica de Sites Real**.
`;
}