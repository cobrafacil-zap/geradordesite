/**
 * Gera os arquivos do site público exportado:
 * - app/layout.tsx, app/globals.css
 * - app/page.tsx (home)
 * - app/(site)/<slug>/page.tsx para cada página não-home
 * - components/SiteRenderer.tsx
 * - lib/site-config.ts
 * - lib/types.ts
 */
import type { BuildOptions, FileMap } from './types';
import { pageDirName, ensureLeadingSlash } from './_helpers';
import { ts } from './_escapes';
import type { Site } from '../site-schema';

export function buildSiteFiles(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};
  const { site } = opts;

  const name = (site.site.trade || site.site.name).replace(/'/g, "\\'");
  const slogan = (site.seo.defaultDescription || site.site.slogan || '').replace(/'/g, "\\'").slice(0, 200);
  const lang = site.site.language || 'pt-BR';
  const fontBody = (site.theme as any).fonts?.body || (site.theme as any).typography?.body || 'Inter';
  const fontHeading = (site.theme as any).fonts?.heading || (site.theme as any).typography?.heading || 'Inter';
  const font = fontBody.split(',')[0].trim().replace(/\s+/g, '+');
  const c = site.theme.colors;

  // ── layout.tsx ───────────────────────────────────────────────
  files['app/layout.tsx'] = ts`import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: '${name}', template: '%s — ${name}' },
  description: '${slogan}',
  openGraph: {
    title: '${name}',
    description: '${slogan}',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="${lang}">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

  // ── globals.css ──────────────────────────────────────────────
  files['app/globals.css'] = ts`@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --c-primary: ${c.primary};
  --c-secondary: ${c.secondary};
  --c-accent: ${c.accent};
  --c-bg: ${c.background};
  --c-surface: ${c.surface};
  --c-text: ${c.text};
  --c-text-muted: ${c.textMuted};
  --c-border: ${c.border};
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--c-bg); color: var(--c-text); font-family: ${fontBody}; }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
`;

  // ── SiteRenderer do projeto exportado ───────────────────────
  files['components/SiteRenderer.tsx'] = ts`import type { Site, Page, Asset } from '@/lib/types';
import { renderComponent } from '@/components/site/registry';

export interface SiteRendererProps {
  page: Page;
  site: Site;
  assets?: Asset[];
}

export function SiteRenderer({ page, site, assets = [] }: SiteRendererProps) {
  const theme = {
    primary: site.theme.colors.primary,
    secondary: site.theme.colors.secondary,
    accent: site.theme.colors.accent,
    background: site.theme.colors.background,
    surface: site.theme.colors.surface,
    text: site.theme.colors.text,
    textMuted: site.theme.colors.textMuted,
    border: site.theme.colors.border,
  };

  const merged: any = page.sections.reduce((acc: any, s: any) => ({ ...acc, ...s.content }), {});
  const mergedContent = {
    ...merged,
    whatsapp: site.settings.whatsapp,
    phone: site.settings.phone,
    email: site.settings.email,
    address: site.settings.address,
    hours: site.settings.hours,
    cnpj: site.settings.cnpj,
    social: site.settings.social,
  };

  const nav = site.navigation.length > 0 ? site.navigation : site.pages.map((p: any) => ({ label: p.name, href: p.slug }));

  return (
    <>
      {page.sections.map((section, i) => {
        const props = { content: { ...mergedContent, ...section.content, variant: section.variant }, settings: section.settings, theme, nav, siteName: site.site.trade || site.site.name };
        return <div key={section.id || (section.component + '-' + i)}>{renderComponent(section.component, props)}</div>;
      })}
    </>
  );
}
`;

  // ── lib/types.ts — tipos espelhados do schema ───────────────
  files['lib/types.ts'] = ts`export interface SiteSettings {
  whatsapp?: string; phone?: string; email?: string; address?: string;
  hours?: string; cnpj?: string;
  social: { instagram?: string; facebook?: string; youtube?: string; tiktok?: string };
}
export interface SiteSection { id?: string; component: string; variant: string; content: Record<string, any>; settings?: Record<string, any>; }
export interface SitePage { slug: string; name: string; title: string; description: string; h1?: string; sections: SiteSection[]; }
export interface SiteTheme {
  colors: { primary: string; secondary: string; accent: string; background: string; surface: string; text: string; textMuted: string; border: string };
  typography: { heading: string; body: string };
  radius: string; style: string;
}
export interface SiteConfig {
  site: { name: string; trade?: string; slogan: string; segment: string; language: string; locale: string };
  theme: SiteTheme;
  navigation: Array<{ label: string; href: string }>;
  pages: SitePage[];
  seo: { siteUrl: string; defaultDescription: string; defaultOg?: string; favicon?: string; robots: string; sitemap: boolean };
  settings: SiteSettings;
}
export interface Asset { id: string; name: string; url: string; origin: 'upload' | 'external' | 'reference'; mime: string; alt: string; }
`;

  // ── lib/site-config.ts — lê do banco, fallback estático ────
  const fallback = JSON.stringify(serializeSiteForExport(site));
  files['lib/site-config.ts'] = ts`import 'server-only';
import { db, schema } from '@/lib/db';
import type { SiteConfig } from '@/lib/types';

let cached: SiteConfig | null = null;

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cached) return cached;
  try {
    const row = await db.select().from(schema.siteConfig).limit(1);
    if (row.length > 0) { cached = JSON.parse(row[0].data); return cached!; }
  } catch (e) {
    // banco indisponível — usa fallback abaixo
  }
  cached = ${fallback} as SiteConfig;
  return cached!;
}

export async function saveSiteConfig(data: SiteConfig): Promise<void> {
  cached = data;
  await db.delete(schema.siteConfig);
  await db.insert(schema.siteConfig).values({ data: JSON.stringify(data), updatedAt: new Date() });
}
`;

  // ── Pages ────────────────────────────────────────────────────
  for (const page of site.pages) {
    const slug = ensureLeadingSlash(page.slug);
    const dir = pageDirName(slug);

    if (slug === '/' || slug === '') {
      files['app/page.tsx'] = String.raw`import { SiteRenderer } from '@/components/SiteRenderer';
import { getSiteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const site = await getSiteConfig();
  const page = site.pages.find(p => p.slug === '/') || site.pages[0];
  return <main><SiteRenderer page={page} site={site} /></main>;
}
`;
    } else {
      files['app/' + dir + '/page.tsx'] = String.raw`import { SiteRenderer } from '@/components/SiteRenderer';
import { getSiteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = await getSiteConfig();
  const slug = '/' + (params.slug || '');
  const page = site.pages.find(p => p.slug === slug) || site.pages[0];
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const site = await getSiteConfig();
  const slug = '/' + (params.slug || '');
  const page = site.pages.find(p => p.slug === slug) || site.pages[0];
  return <main><SiteRenderer page={page} site={site} /></main>;
}
`;
    }
  }

  // ── Se a home não existir, criar uma padrão ─────────────────
  if (!site.pages.some(p => ensureLeadingSlash(p.slug) === '/')) {
    files['app/page.tsx'] = String.raw`import { SiteRenderer } from '@/components/SiteRenderer';
import { getSiteConfig } from '@/lib/site-config';

export default async function HomePage() {
  const site = await getSiteConfig();
  return <main><SiteRenderer page={site.pages[0]} site={site} /></main>;
}
`;
  }

  return files;
}

function serializeSiteForExport(site: Site): any {
  return JSON.parse(JSON.stringify(site));
}