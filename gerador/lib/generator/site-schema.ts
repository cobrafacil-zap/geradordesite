import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────
// SiteSchema — fonte canônica de toda a estrutura de um site gerado.
// Toda resposta da IA deve passar por safeParse() deste schema.
// ─────────────────────────────────────────────────────────────────

export const ComponentNameSchema = z.enum([
  'Header', 'Footer',
  'Hero', 'HeroSimple',
  'About', 'Services', 'Specialties', 'Differentials',
  'Team', 'Testimonials', 'FAQ',
  'Gallery', 'MenuPreview', 'MenuFull', 'Reservation',
  'Properties', 'PropertyList',
  'Products', 'ProductList', 'Cases',
  'History', 'Map', 'BlogList', 'Legal',
  'CTA', 'Contact', 'Stats',
]);
export type ComponentName = z.infer<typeof ComponentNameSchema>;

export const SectionSchema = z.object({
  id: z.string().optional(),
  component: ComponentNameSchema,
  variant: z.string().default('default'),
  content: z.record(z.any()).default({}),
  settings: z.record(z.any()).optional(),
});
export type Section = z.infer<typeof SectionSchema>;

export const PageSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  h1: z.string().optional(),
  sections: z.array(SectionSchema).default([]),
});
export type Page = z.infer<typeof PageSchema>;

export const ThemeSchema = z.object({
  colors: z.object({
    primary: z.string().default('#0f172a'),
    secondary: z.string().default('#334155'),
    accent: z.string().default('#22c55e'),
    background: z.string().default('#ffffff'),
    surface: z.string().default('#f8f8fa'),
    text: z.string().default('#0f172a'),
    textMuted: z.string().default('#64748b'),
    border: z.string().default('#e5e7eb'),
  }),
  typography: z.object({
    heading: z.string().default('Inter, system-ui, sans-serif'),
    body: z.string().default('Inter, system-ui, sans-serif'),
  }),
  radius: z.string().default('8px'),
  style: z.string().default('moderno'),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});

export const SettingsSchema = z.object({
  whatsapp: z.string().regex(/^\d+$/, 'whatsapp deve conter apenas dígitos').optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email('email inválido').optional().or(z.literal('')),
  address: z.string().max(200).optional(),
  hours: z.string().max(100).optional(),
  social: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
  }).default({}),
  cnpj: z.string().max(20).optional(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const SeoSchema = z.object({
  siteUrl: z.string().max(300).default(''),
  defaultDescription: z.string().max(400).default(''),
  defaultOg: z.string().max(300).optional(),
  favicon: z.string().max(300).optional(),
  robots: z.string().default('index, follow'),
  sitemap: z.boolean().default(true),
});
export type Seo = z.infer<typeof SeoSchema>;

export const SiteSchema = z.object({
  site: z.object({
    name: z.string().min(1),
    trade: z.string().optional(),
    slogan: z.string().default(''),
    segment: z.string().default(''),
    language: z.string().default('pt-BR'),
    locale: z.string().default('pt_BR'),
  }),
  theme: ThemeSchema,
  navigation: z.array(NavLinkSchema).default([]),
  pages: z.array(PageSchema).min(1),
  seo: SeoSchema.default({ siteUrl: '', defaultDescription: '' }),
  settings: SettingsSchema.default({ social: {} }),
});
export type Site = z.infer<typeof SiteSchema>;

// ─────────────────────────────────────────────────────────────────
// Asset descriptors — o que o motor precisa para resolver imagens
// ─────────────────────────────────────────────────────────────────

export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  origin: z.enum(['upload', 'external', 'reference']),
  mime: z.string().default('image/jpeg'),
  alt: z.string().default(''),
});
export type Asset = z.infer<typeof AssetSchema>;

// ─────────────────────────────────────────────────────────────────
// Helper: parse seguro com fallback
// ─────────────────────────────────────────────────────────────────
export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: z.ZodError; raw: unknown };

export function safeParseSite(input: unknown): ParseResult<Site> {
  const result = SiteSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error, raw: input };
}

/** Aplica defaults progressivos a um schema parcial. */
export function withDefaults(input: Partial<Site> & { site: { name: string } }): Site {
  const minimal: Site = {
    site: {
      name: input.site.name,
      trade: input.site.trade || input.site.name,
      slogan: input.site.slogan || '',
      segment: input.site.segment || '',
      language: input.site.language || 'pt-BR',
      locale: input.site.locale || 'pt_BR',
    },
    theme: input.theme || ThemeSchema.parse({}),
    navigation: input.navigation || [],
    pages: input.pages || [],
    seo: input.seo || SeoSchema.parse({}),
    settings: input.settings || SettingsSchema.parse({}),
  };
  return SiteSchema.parse(minimal);
}

/**
 * Constrói um Site completo a partir de um template conhecido + nome comercial.
 * Usado pelos testes e como fallback quando a IA não retorna schema válido.
 */
export function siteSchemaForTemplate(templateSlug: string, tradeName: string): Site {
  const siteName = tradeName || 'Empresa';
  const lower = siteName.toLowerCase();
  return withDefaults({
    site: {
      name: siteName,
      trade: siteName,
      slogan: 'Excelência em ' + templateSlug,
      segment: templateSlug,
      language: 'pt-BR',
      locale: 'pt_BR',
    },
    theme: {
      colors: {
        primary: '#0f172a', secondary: '#06b6d4', accent: '#f97316',
        background: '#ffffff', surface: '#f8fafc',
        text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0',
      },
      typography: { heading: 'Inter', body: 'Inter' },
      radius: 'medium',
      style: 'moderno',
    },
    navigation: [
      { label: 'Início', href: '/' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Serviços', href: '/servicos' },
      { label: 'Contato', href: '/contato' },
    ],
    pages: [
      {
        slug: '/', name: 'Início', title: siteName, description: 'Página inicial de ' + siteName,
        sections: [
          { component: 'Header', variant: 'sticky-dark', content: { whatsapp: '5511999999999' } },
          { component: 'Hero', variant: 'split', content: { headline: 'Bem-vindo à ' + siteName, subheadline: 'Confira nossos serviços', ctas: [{ label: 'Fale conosco', href: '/contato' }] } },
          { component: 'Services', variant: 'grid', content: { title: 'Serviços', items: [] } },
          { component: 'CTA', variant: 'centered', content: { title: 'Pronto para começar?' } },
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
      {
        slug: '/sobre', name: 'Sobre', title: 'Sobre', description: 'Sobre a ' + siteName,
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { headline: 'Sobre nós', breadcrumb: 'Início > Sobre' } },
          { component: 'About', variant: 'simple', content: { title: 'Nossa história' } },
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
      {
        slug: '/servicos', name: 'Serviços', title: 'Serviços', description: 'Nossos serviços',
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { headline: 'Serviços' } },
          { component: 'Services', variant: 'grid', content: { title: 'Serviços', items: [] } },
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
      {
        slug: '/contato', name: 'Contato', title: 'Contato', description: 'Fale com ' + siteName,
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { headline: 'Contato' } },
          { component: 'Contact', variant: 'simple', content: { title: 'Fale conosco' } },
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
    ],
    seo: {
      siteUrl: 'https://' + lower.replace(/[^a-z0-9]+/g, '-') + '.com.br',
      defaultDescription: siteName + ' — ' + 'soluções profissionais',
      sitemap: true, robots: 'index, follow',
    },
    settings: {
      whatsapp: '5511999999999',
      phone: '(11) 0000-0000',
      email: 'contato@' + lower.replace(/[^a-z0-9]+/g, '') + '.com',
      address: 'Av. Paulista, 1000 — São Paulo/SP',
      hours: 'Seg–Sex, 9h–18h',
      cnpj: '00.000.000/0001-00',
      social: { instagram: 'https://instagram.com/' + lower.replace(/[^a-z0-9]+/g, '') },
    },
  });
}

// ─────────────────────────────────────────────────────────────────
// Estrutura mínima de página — garante que pelo menos Home existe
// ─────────────────────────────────────────────────────────────────
export function ensureHomePage(site: Site): Site {
  if (site.pages.some(p => p.slug === '/' || p.slug === '')) return site;
  const home: Page = {
    slug: '/',
    name: 'Início',
    title: site.site.name,
    description: site.seo.defaultDescription || site.site.slogan,
    sections: [],
  };
  return { ...site, pages: [home, ...site.pages] };
}
