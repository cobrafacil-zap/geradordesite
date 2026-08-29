import { z } from 'zod';
import { getPack } from './templates/content/registry';
import { buildHomeSections } from './templates/layouts';

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
 * Usa o "content pack" do slug para gerar copy, cores, imagens e seções únicas
 * por template. Quando o pack não tem um campo, aplica fallback razoável.
 */
export function siteSchemaForTemplate(templateSlug: string, tradeName: string): Site {
  const pack = getPack(templateSlug);
  const siteName = tradeName || pack.slug;
  const lower = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '');

  // Home: estrutura montada por segmento (layouts.ts).
  // Cada tipo de negócio tem uma ordem de seções própria — imobiliária abre
  // com Properties, restaurante abre com MenuFull, fotógrafo abre com Gallery,
  // etc. Isso evita o problema de todos os 30 sites seguirem a mesma sequência.
  const homeSections: any[] = buildHomeSections(pack);

  return withDefaults({
    site: {
      name: siteName,
      trade: siteName,
      slogan: pack.tagline,
      segment: templateSlug,
      language: 'pt-BR',
      locale: 'pt_BR',
    },
    theme: {
      colors: {
        primary: pack.palette.primary,
        secondary: pack.palette.secondary,
        accent: pack.palette.accent,
        background: '#ffffff',
        surface: pack.palette.surface,
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e5e7eb',
      },
      typography: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
      radius: '8px',
      style: 'moderno',
    },
    navigation: [
      { label: 'Início', href: '/' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Serviços', href: '/servicos' },
      { label: 'Contato', href: '#contato' },
    ],
    pages: [
      {
        slug: '/', name: 'Início', title: siteName,
        description: pack.tagline,
        sections: homeSections,
      },
      {
        slug: '/sobre', name: 'Sobre', title: 'Sobre', description: 'Sobre a ' + siteName,
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { title: 'Sobre nós', subtitle: pack.tagline } },
          { component: 'About', variant: 'simple', content: { title: 'Nossa história', text: pack.aboutText } },
          ...(pack.team && pack.team.length
            ? [{ component: 'Team', variant: 'default', content: { title: 'Nosso time', items: pack.team } }]
            : []),
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
      {
        slug: '/servicos', name: 'Serviços', title: 'Serviços', description: 'Nossos serviços',
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { title: 'Serviços', subtitle: 'Conheça tudo o que podemos fazer por você' } },
          { component: 'Services', variant: 'grid', content: { title: 'Serviços', items: pack.services } },
          ...(pack.differentials && pack.differentials.length
            ? [{ component: 'Differentials', variant: 'default', content: { title: 'Por que nos escolher', items: pack.differentials } }]
            : []),
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
      {
        slug: '#contato', name: 'Contato', title: 'Contato', description: 'Fale com ' + siteName,
        sections: [
          { component: 'HeroSimple', variant: 'simple', content: { title: 'Contato', subtitle: 'Estamos prontos para te atender' } },
          { component: 'Contact', variant: 'simple', content: { title: 'Fale conosco', whatsapp: pack.whatsapp, email: pack.email, address: pack.address } },
          { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
        ],
      },
    ],
    seo: {
      siteUrl: 'https://' + (lower || templateSlug) + '.com.br',
      defaultDescription: pack.tagline,
      sitemap: true, robots: 'index, follow',
    },
    settings: {
      whatsapp: pack.whatsapp,
      phone: pack.phone,
      email: pack.email || ('contato@' + (lower || templateSlug) + '.com.br'),
      address: pack.address || 'Av. Paulista, 1000 — São Paulo/SP',
      hours: pack.hours || 'Seg–Sex, 9h–18h',
      cnpj: pack.cnpj,
      social: {
        instagram: pack.instagram || ('https://instagram.com/' + (lower || templateSlug)),
      },
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
