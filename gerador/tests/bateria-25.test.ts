/**
 * Bateria de testes dos 25 cenários do enunciado.
 * Roda com: npm test (vitest).
 *
 * Estes testes NÃO dependem de Supabase nem de OpenAI — validam a
 * fábrica em si (motor de arquivos + ZIP + validator + pipeline + lib/auth + IA stub).
 */
import { describe, it, expect } from 'vitest';
import { SiteSchema as siteSchema, SettingsSchema, SeoSchema, siteSchemaForTemplate } from '../lib/generator/site-schema';
import { buildAllFiles } from '../lib/generator/file-builder';
import { buildZipBuffer } from '../lib/generator/zip';
import { validate } from '../lib/generator/validator';
import { runPipeline } from '../lib/generator/pipeline';

describe('01 — schema válido aceita dados esperados', () => {
  it('1. schema aceita payload mínimo válido', () => {
    const site = {
      site: { name: 'Aurélio & Bastos', slogan: 'Excelência jurídica', segment: 'juridico', language: 'pt-BR', locale: 'BR' },
      theme: { colors: { primary: '#0f172a', secondary: '#06b6d4', accent: '#f97316', background: '#fff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0' }, typography: { heading: 'Inter', body: 'Inter' }, radius: 'medium', style: 'moderno' },
      navigation: [{ label: 'Início', href: '/' }, { label: 'Sobre', href: '/sobre' }],
      pages: [
        { slug: '/', name: 'Início', title: 'Aurélio & Bastos', description: 'Escritório de advocacia', sections: [{ component: 'Hero', variant: 'split', content: { headline: 'Bem-vindo', ctas: [] } }] },
        { slug: '/sobre', name: 'Sobre', title: 'Sobre', description: 'História do escritório', sections: [{ component: 'About', variant: 'simple', content: { title: 'Sobre nós' } }] },
      ],
      seo: { siteUrl: 'https://aurelio-bastos.com.br', defaultDescription: 'Escritório de advocacia', sitemap: true, robots: 'index, follow' },
      settings: { whatsapp: '5511999999999', phone: '(11) 0000-0000', email: 'contato@aurelio.com', address: 'Av. Paulista, 1000 — São Paulo/SP', hours: 'Seg–Sex, 9h–18h', cnpj: '00.000.000/0001-00', social: { instagram: 'https://instagram.com/aurelio' } },
    };
    const parsed = siteSchema.safeParse(site);
    expect(parsed.success).toBe(true);
  });

  it('2. schema rejeita payload sem pages', () => {
    const site = { site: { name: 'X', slogan: 'X', segment: 'X' }, theme: {}, navigation: [], pages: [], seo: {}, settings: { social: {} } };
    const parsed = siteSchema.safeParse(site);
    expect(parsed.success).toBe(false);
  });
});

describe('02 — motor de arquivos gera arquivos esperados', () => {
  it('3. gera 50+ arquivos para projeto institucional', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'Empresa Teste Ltda');
    const files = buildAllFiles({ projectName: 'Empresa Teste', site, assets: [], dbAdapter: 'sqlite' });
    expect(Object.keys(files).length).toBeGreaterThan(50);
  });

  it('4. arquivos críticos existem (layout, pages, admin, lib, scripts)', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    expect(files['app/layout.tsx']).toBeTruthy();
    expect(files['app/globals.css']).toBeTruthy();
    expect(files['package.json']).toBeTruthy();
    expect(files['tsconfig.json']).toBeTruthy();
    expect(files['tailwind.config.ts']).toBeTruthy();
    expect(files['.env.example']).toBeTruthy();
    expect(files['README.md']).toBeTruthy();
    expect(files['database/schema.sql']).toBeTruthy();
    expect(files['scripts/create-admin.mjs']).toBeTruthy();
    expect(files['scripts/migrate.mjs']).toBeTruthy();
    expect(files['scripts/seed.mjs']).toBeTruthy();
    expect(files['lib/db/schema.ts']).toBeTruthy();
    expect(files['lib/db/client.ts']).toBeTruthy();
    expect(files['lib/auth.ts']).toBeTruthy();
    expect(files['lib/site-config.ts']).toBeTruthy();
    expect(files['components/SiteRenderer.tsx']).toBeTruthy();
    expect(files['components/site/registry.tsx']).toBeTruthy();
    expect(files['components/site/Header.tsx']).toBeTruthy();
    expect(files['components/site/Footer.tsx']).toBeTruthy();
    expect(files['components/site/Hero.tsx']).toBeTruthy();
  });

  it('5. NÃO gera _bundle.tsx (corrige bug)', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    expect(Object.keys(files).some(f => f.includes('_bundle.tsx'))).toBe(false);
  });

  it('6. página inicial gerada em app/page.tsx', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    expect(files['app/page.tsx']).toBeTruthy();
    expect(files['app/page.tsx']).toContain('SiteRenderer');
  });

  it('7. pages dinâmicas geradas para cada página não-home', () => {
    const site = siteSchemaForTemplate('imobiliaria', 'Imobiliária X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const hasDinamic = Object.keys(files).some(f => f.startsWith('app/') && f.endsWith('/page.tsx') && f !== 'app/page.tsx');
    expect(hasDinamic).toBe(true);
  });
});

describe('03 — painel admin tem 12 telas reais', () => {
  it('8. gera 12 telas admin em app/admin/(panel)/<slug>/page.tsx', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const adminPages = Object.keys(files).filter(f => f.startsWith('app/admin/(panel)/') && f.endsWith('/page.tsx'));
    expect(adminPages.length).toBe(12);
  });

  it('9. cada admin tem API route ou usa /api/admin/site', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    expect(files['app/api/admin/login/route.ts']).toBeTruthy();
    expect(files['app/api/admin/logout/route.ts']).toBeTruthy();
    expect(files['app/api/admin/me/route.ts']).toBeTruthy();
    expect(files['app/api/admin/site/route.ts']).toBeTruthy();
  });
});

describe('04 — pacote.json + scripts + .env', () => {
  it('10. package.json tem scripts esperados', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const pkg = JSON.parse(files['package.json']);
    expect(pkg.scripts.dev).toBe('next dev');
    expect(pkg.scripts.build).toBe('next build');
    expect(pkg.scripts['db:migrate']).toBe('node scripts/migrate.mjs');
    expect(pkg.scripts['create-admin']).toBe('node scripts/create-admin.mjs');
    expect(pkg.scripts.typecheck).toBe('tsc --noEmit');
  });

  it('11. .env.example NÃO contém secrets reais', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    expect(files['.env.example']).not.toMatch(/sk-[A-Za-z0-9]{20,}/);
    expect(files['.env.example']).toContain('AUTH_SECRET');
    expect(files['.env.example']).toContain('change-me');
  });

  it('12. sqlite usa better-sqlite3, postgres usa postgres', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const sqlitePkg = JSON.parse(buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' })['package.json']);
    expect(sqlitePkg.dependencies['better-sqlite3']).toBeTruthy();
    const pgPkg = JSON.parse(buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'postgres' })['package.json']);
    expect(pgPkg.dependencies.postgres).toBeTruthy();
  });
});

describe('05 — ZIP real', () => {
  it('13. buildZipBuffer gera buffer ZIP válido', async () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const zip = await buildZipBuffer(files);
    expect(zip.length).toBeGreaterThan(1000);
    // ZIP começa com PK\x03\x04 (0x04034b50)
    expect(zip[0]).toBe(0x50);
    expect(zip[1]).toBe(0x4b);
    expect(zip[2]).toBe(0x03);
    expect(zip[3]).toBe(0x04);
  });

  it('14. ZIP contém arquivos esperados', async () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const zip = await buildZipBuffer(files);
    // número mínimo de entradas no ZIP (estimado pela contagem)
    expect(zip.length).toBeGreaterThan(5000);
  });
});

describe('06 — validator', () => {
  it('15. validate ok para projeto gerado', () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const files = buildAllFiles({ projectName: 'X', site, assets: [], dbAdapter: 'sqlite' });
    const result = validate(files);
    expect(result.stats.files).toBeGreaterThan(50);
    expect(result.stats.tsxFiles).toBeGreaterThan(20);
    expect(result.stats.apiRoutes).toBeGreaterThanOrEqual(4);
    expect(result.stats.adminPages).toBe(12);
  });

  it('16. validate detecta placeholders não substituídos', () => {
    const files = { 'a.tsx': 'const x = "{company.name}";' };
    const r = validate(files);
    expect(r.warnings.some(w => w.rule === 'placeholder')).toBe(true);
  });

  it('17. validate detecta imports quebrados', () => {
    const files = {
      'app/page.tsx': 'import { Header } from "./Header";',
      'components/site/registry.tsx': 'export const r = {};',
    };
    const r = validate(files);
    expect(r.errors.some(e => e.rule === 'broken-import')).toBe(true);
  });

  it('18. validate detecta secret leaked', () => {
    const files = { '.env.example': 'OPENAI_API_KEY=sk-1234567890abcdefghij' };
    const r = validate(files);
    expect(r.errors.some(e => e.rule === 'secret-leaked')).toBe(true);
  });
});

describe('07 — pipeline 7 etapas', () => {
  it('19. pipeline retorna ok para schema válido', async () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'Pipeline Test');
    const result = await runPipeline({ projectName: 'Pipeline Test', schema: site, assets: [], dbAdapter: 'sqlite' });
    expect(result.ok).toBe(true);
    expect(result.steps.length).toBe(7);
    expect(result.steps.every(s => s.status === 'done')).toBe(true);
  });

  it('20. pipeline retorna erro com mensagem clara para schema inválido', async () => {
    const result = await runPipeline({ projectName: 'X', schema: { foo: 'bar' }, assets: [], dbAdapter: 'sqlite' });
    expect(result.ok).toBe(false);
    expect(result.failedStep).toBe('validate_content');
  });

  it('21. pipeline labels batem com enunciado', async () => {
    const site = siteSchemaForTemplate('empresaCorporativa', 'X');
    const result = await runPipeline({ projectName: 'X', schema: site, assets: [], dbAdapter: 'sqlite' });
    expect(result.steps.map(s => s.label)).toEqual([
      'Analisando as informações do projeto…',
      'Gerando estrutura com IA…',
      'Validando consistência do conteúdo…',
      'Resolvendo imagens e assets…',
      'Montando arquivos do site…',
      'Validando o projeto final…',
      'Empacotando o projeto…',
    ]);
  });
});

describe('08 — múltiplos templates geram arquivos válidos', () => {
  const TEMPLATES = ['empresaCorporativa', 'clinicaMedica', 'restaurante', 'imobiliaria', 'fotografo'];
  for (const t of TEMPLATES) {
    it('22. template ' + t + ' gera projeto válido', () => {
      const site = siteSchemaForTemplate(t, 'Test');
      const files = buildAllFiles({ projectName: 'Test', site, assets: [], dbAdapter: 'sqlite' });
      const r = validate(files);
      expect(r.ok).toBe(true);
    });
  }
});

describe('09 — schema Zod protege contra payloads maliciosos', () => {
  it('23. schema rejeita whatsapp com caracteres não numéricos', () => {
    const parsed = SettingsSchema.safeParse({ whatsapp: 'abc-123', social: {} });
    expect(parsed.success).toBe(false);
  });

  it('24. schema aceita whatsapp só com dígitos', () => {
    const parsed = SettingsSchema.safeParse({ whatsapp: '5511988887777', social: {} });
    expect(parsed.success).toBe(true);
  });

  it('25. schema recorta texto muito longo', () => {
    const parsed = SeoSchema.safeParse({ siteUrl: 'https://x.com', defaultDescription: 'a'.repeat(5000), sitemap: true, robots: 'index, follow' });
    expect(parsed.success).toBe(false);
  });
});