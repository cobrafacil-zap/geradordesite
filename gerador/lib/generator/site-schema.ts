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
  'Products', 'ProductList', 'Cases', 'Process',
  'History', 'Map', 'BlogList', 'Legal',
  'CTA', 'Contact', 'Stats',
  'Chef', 'Brands', 'Schedule', 'Instruments', 'Conventions',
  'Highlights', 'Method', 'Press', 'Logos', 'Marquee',
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
  // Aceita 'fonts' (preferido pelo editor/renderer) OU 'typography' (legado do file-builder).
  // Sempre materializa como 'fonts' no schema normalizado.
  fonts: z.object({
    heading: z.string().default('Inter, system-ui, sans-serif'),
    body: z.string().default('Inter, system-ui, sans-serif'),
  }).default({ heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' }),
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
}).passthrough(); // permite campos não-canônicos (ex: _originalImages na aba Imagens)
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
// Navigation + Pages customizadas por slug
//
// Cada segmento tem seu próprio menu e estrutura de páginas internas
// (não apenas a home) — assim o site não parece todo igual com
// "Início / Sobre / Serviços / Contato" repetido em 35 vezes.
// ─────────────────────────────────────────────────────────────────

type NavLink = { label: string; href: string };
type AnySection = Record<string, any>;

/** Gera a barra de navegação principal de acordo com o segmento. */
export function pickNavigation(slug: string): NavLink[] {
  const map: Record<string, NavLink[]> = {
    restaurante: [
      { label: 'Início', href: '/' },
      { label: 'Cardápio', href: '#cardapio' },
      { label: 'Reservas', href: '#reservas' },
      { label: 'Contato', href: '#contato' },
    ],
    pizzaria: [
      { label: 'Início', href: '/' },
      { label: 'Cardápio', href: '#cardapio' },
      { label: 'Reservas', href: '#reservas' },
      { label: 'Contato', href: '#contato' },
    ],
    padaria: [
      { label: 'Início', href: '/' },
      { label: 'Produtos', href: '#produtos' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    'empresa-local': [
      { label: 'Início', href: '/' },
      { label: 'Produtos', href: '#produtos' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    'clinica-medica': [
      { label: 'Início', href: '/' },
      { label: 'Especialidades', href: '#especialidades' },
      { label: 'Convênios', href: '#convenios' },
      { label: 'Corpo clínico', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    odontologia: [
      { label: 'Início', href: '/' },
      { label: 'Tratamentos', href: '#servicos' },
      { label: 'Equipe', href: '/sobre' },
      { label: 'Convênios', href: '#convenios' },
      { label: 'Contato', href: '#contato' },
    ],
    estetica: [
      { label: 'Início', href: '/' },
      { label: 'Procedimentos', href: '#servicos' },
      { label: 'Resultados', href: '#resultados' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    'escritorio-advocacia': [
      { label: 'Início', href: '/' },
      { label: 'Áreas de atuação', href: '#servicos' },
      { label: 'Como atuamos', href: '#processo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    advogado: [
      { label: 'Início', href: '/' },
      { label: 'Áreas', href: '#servicos' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    contador: [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Como trabalho', href: '#metodo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    corretor: [
      { label: 'Início', href: '/' },
      { label: 'Imóveis', href: '#imoveis' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Mapa', href: '#mapa' },
      { label: 'Contato', href: '#contato' },
    ],
    consultor: [
      { label: 'Início', href: '/' },
      { label: 'Como trabalho', href: '#metodo' },
      { label: 'Onde atuo', href: '#servicos' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    personal: [
      { label: 'Início', href: '/' },
      { label: 'Modalidades', href: '#servicos' },
      { label: 'Horários', href: '#horarios' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    academia: [
      { label: 'Início', href: '/' },
      { label: 'Modalidades', href: '#servicos' },
      { label: 'Horários', href: '#horarios' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    'pet-shop': [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Time', href: '/sobre' },
      { label: 'Horários', href: '#horarios' },
      { label: 'Contato', href: '#contato' },
    ],
    imobiliaria: [
      { label: 'Início', href: '/' },
      { label: 'Imóveis', href: '#imoveis' },
      { label: 'Como comprar', href: '#metodo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Mapa', href: '#mapa' },
      { label: 'Contato', href: '#contato' },
    ],
    construtora: [
      { label: 'Início', href: '/' },
      { label: 'Empreendimentos', href: '#imoveis' },
      { label: 'Como comprar', href: '#metodo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    industria: [
      { label: 'Início', href: '/' },
      { label: 'Capacidades', href: '#servicos' },
      { label: 'Tecnologia', href: '#tecnologia' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    loja: [
      { label: 'Início', href: '/' },
      { label: 'Coleção', href: '#produtos' },
      { label: 'Marcas', href: '#marcas' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    limpeza: [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Como trabalhamos', href: '#metodo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    mecanica: [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Marcas', href: '#marcas' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    eletricista: [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Por que nos chamar', href: '#diferenciais' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    encanador: [
      { label: 'Início', href: '/' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Como atendemos', href: '#metodo' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    'assistencia-tecnica': [
      { label: 'Início', href: '/' },
      { label: 'Reparos', href: '#servicos' },
      { label: 'Marcas', href: '#marcas' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    fotografo: [
      { label: 'Início', href: '/' },
      { label: 'Portfólio', href: '#galeria' },
      { label: 'Coberturas', href: '#servicos' },
      { label: 'Equipamentos', href: '#tecnologia' },
      { label: 'Sobre', href: '/sobre' },
    ],
    'empresa-corporativa': [
      { label: 'Início', href: '/' },
      { label: 'A empresa', href: '/sobre' },
      { label: 'Soluções', href: '#servicos' },
      { label: 'Cases', href: '#cases' },
      { label: 'Contato', href: '#contato' },
    ],
    'empresa-moderna': [
      { label: 'Início', href: '/' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Soluções', href: '#servicos' },
      { label: 'Cases', href: '#cases' },
      { label: 'Contato', href: '#contato' },
    ],
    'empresa-premium': [
      { label: 'Início', href: '/' },
      { label: 'Tradição', href: '/sobre' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Contato', href: '#contato' },
    ],
    startup: [
      { label: 'Início', href: '/' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Soluções', href: '#servicos' },
      { label: 'Cases', href: '#cases' },
      { label: 'Contato', href: '#contato' },
    ],
    'agencia-marketing': [
      { label: 'Início', href: '/' },
      { label: 'Cases', href: '#cases' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Contato', href: '#contato' },
    ],
  };
  if (map[slug]) return map[slug];
  // Fallback padrão (não-LP)
  return [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Contato', href: '#contato' },
  ];
}

/** Gera as páginas internas (Sobre, Serviços, Contato) com conteúdo coerente. */
export function buildPagesForSlug(slug: string, siteName: string, pack: any, homeSections: AnySection[]): AnySection[] {
  const sobreTitle = pickSobreTitle(slug);
  const servicoTitle = pickServicoTitle(slug);
  return [
    {
      slug: '/', name: 'Início', title: siteName,
      description: pack.tagline,
      sections: homeSections,
    },
    {
      slug: '/sobre', name: sobreTitle, title: sobreTitle, description: sobreTitle + ' — ' + siteName,
      sections: [
        { component: 'HeroSimple', variant: 'simple', content: { title: sobreTitle, subtitle: pack.tagline } },
        { component: 'About', variant: 'simple', content: { title: 'Quem somos', text: pack.aboutText } },
        ...(pack.team && pack.team.length
          ? [{ component: 'Team', variant: 'default', content: { title: 'Nosso time', items: pack.team } }]
          : []),
        { component: 'Footer', variant: 'simple', content: { floatingWa: true } },
      ],
    },
    {
      slug: '#servicos', name: servicoTitle, title: servicoTitle, description: servicoTitle + ' — ' + siteName,
      sections: [
        { component: 'HeroSimple', variant: 'simple', content: { title: servicoTitle, subtitle: 'Conheça tudo o que podemos fazer por você' } },
        { component: 'Services', variant: 'grid', content: { title: servicoTitle, items: pack.services } },
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
  ];
}

function pickSobreTitle(slug: string): string {
  if (slug === 'restaurante' || slug === 'pizzaria') return 'A casa';
  if (slug === 'clinica-medica' || slug === 'odontologia' || slug === 'estetica') return 'A clínica';
  if (slug === 'academia') return 'A academia';
  if (slug === 'pet-shop') return 'Quem somos';
  if (slug === 'fotografo') return 'Sobre mim';
  if (slug === 'escritorio-advocacia' || slug === 'advogado') return 'O escritório';
  if (slug === 'imobiliaria' || slug === 'corretor' || slug === 'construtora') return 'A empresa';
  if (slug === 'padaria') return 'A padaria';
  return 'Sobre nós';
}

function pickServicoTitle(slug: string): string {
  if (slug === 'restaurante' || slug === 'pizzaria' || slug === 'padaria') return 'Cardápio';
  if (slug === 'clinica-medica') return 'Especialidades';
  if (slug === 'odontologia') return 'Tratamentos';
  if (slug === 'estetica') return 'Procedimentos';
  if (slug === 'academia' || slug === 'personal') return 'Modalidades';
  if (slug === 'escritorio-advocacia' || slug === 'advogado') return 'Áreas de atuação';
  if (slug === 'imobiliaria' || slug === 'corretor' || slug === 'construtora') return 'Imóveis';
  if (slug === 'loja' || slug === 'empresa-local') return 'Produtos';
  if (slug === 'fotografo') return 'Coberturas';
  return 'Serviços';
}

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
  // Shim de compatibilidade: se o input vier com o nome legado `theme.typography`,
  // migra pra `theme.fonts` (que é o que renderer/editor esperam).
  const themeInput: any = input.theme || {};
  if (themeInput.typography && !themeInput.fonts) {
    themeInput.fonts = themeInput.typography;
  }
  if (themeInput.typography) delete themeInput.typography;
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

  // Define se o site é claro ou escuro. Padrão: claro. Pack pode forçar
  // 'dark' (premium, fotógrafo, escritório boutique) ou 'light'.
  const isDark = pack.mode === 'dark';
  const themeColors = isDark
    ? {
        // Tema escuro: fundo é surface escuro, texto é claro
        primary: pack.palette.primary,
        secondary: pack.palette.secondary,
        accent: pack.palette.accent,
        background: pack.palette.primary, // fundo escuro
        surface: pack.palette.surface || shadeColor(pack.palette.primary, 0.15),
        text: '#f5fafd',
        textMuted: 'rgba(245,250,253,0.7)',
        border: 'rgba(255,255,255,0.12)',
      }
    : {
        // Tema claro: fundo branco, texto escuro
        primary: pack.palette.primary,
        secondary: pack.palette.secondary,
        accent: pack.palette.accent,
        background: '#ffffff',
        surface: pack.palette.surface || '#f8fafc',
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e5e7eb',
      };

  const isLanding = templateSlug.startsWith('lp-');

  const site = withDefaults({
    site: {
      name: siteName,
      trade: siteName,
      slogan: pack.tagline,
      segment: templateSlug,
      language: 'pt-BR',
      locale: 'pt_BR',
    },
    theme: {
      colors: themeColors,
      fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
      radius: '8px',
      style: isDark ? 'dark-premium' : 'moderno',
    },
    navigation: isLanding
      ? [
          { label: 'Início', href: '/' },
          { label: 'Garantir vaga', href: '#captura' },
        ]
      : pickNavigation(templateSlug),
    pages: (isLanding
      ? [
          {
            slug: '/', name: 'Início', title: siteName,
            description: pack.tagline,
            sections: homeSections as any,
          },
        ]
      : buildPagesForSlug(templateSlug, siteName, pack, homeSections)) as any,
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
  // Garante o campo não-canônico `_originalImages` para a aba Imagens do editor.
  // Mantém o shape { [pathDaImagemNoSchema]: urlOriginal } para "Restaurar".
  (site as any)._originalImages = (site as any)._originalImages || {};
  return site;
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

// ─────────────────────────────────────────────────────────────────
// Helpers de cor: detectar luminância (dark/light) e clarear/escurecer
// ─────────────────────────────────────────────────────────────────

/** Converte "#rrggbb" em [r, g, b] (0–255). Aceita hex de 3 ou 6 dígitos. */
function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Luminância relativa (WCAG). Retorna 0 (preto) a 1 (branco). */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** Devolve true se a cor for escura o suficiente pra virar tema dark. */
function isColorDark(hex: string): boolean {
  return luminance(hex) < 0.25;
}

/** Clareia ou escurece uma cor base por um fator (-1 = preto, 1 = branco). */
function shadeColor(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const target = factor < 0 ? 0 : 255;
  const f = Math.abs(factor);
  const nr = Math.round(r + (target - r) * f);
  const ng = Math.round(g + (target - g) * f);
  const nb = Math.round(b + (target - b) * f);
  return '#' + [nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('');
}
