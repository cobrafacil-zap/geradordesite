'use client';

import type { Page, Site } from '../site-schema';
import { renderComponent } from './registry';
import type { RendererProps } from '../templates/components/registry';
import type { ReactNode } from 'react';

/**
 * SiteRenderer — recebe o schema canônico de um site + assets + theme e
 * renderiza a árvore completa de uma página. Este componente é o mesmo
 * usado tanto pelo preview do Gerador quanto pelo site exportado.
 */
export interface SiteRendererProps {
  page: Page;
  site: Site;
  assets?: Record<string, string>;
}

export function SiteRenderer({ page, site, assets = {} }: SiteRendererProps): ReactNode {
  const theme: RendererProps['theme'] = {
    primary: site.theme.colors.primary,
    secondary: site.theme.colors.secondary,
    accent: site.theme.colors.accent,
    background: site.theme.colors.background,
    surface: site.theme.colors.surface,
    text: site.theme.colors.text,
    textMuted: site.theme.colors.textMuted,
    border: site.theme.colors.border,
  };

  // Combina settings globais com settings do site
  const mergedContent = {
    ...page.sections.reduce((acc: any, s) => ({ ...acc, ...s.content }), {}),
    whatsapp: site.settings.whatsapp,
    phone: site.settings.phone,
    email: site.settings.email,
    address: site.settings.address,
    hours: site.settings.hours,
    cnpj: site.settings.cnpj,
    social: site.settings.social,
  };

  const nav = site.navigation.length > 0
    ? site.navigation
    : site.pages.map(p => ({ label: p.name, href: p.slug }));

  return (
    <>
      {page.sections.map((section, i) => {
        const props: RendererProps = {
          content: { ...mergedContent, ...section.content, variant: section.variant },
          settings: section.settings,
          theme,
          assets,
          nav,
          siteName: site.site.trade || site.site.name,
        };
        return <div key={section.id || `${section.component}-${i}`}>{renderComponent(section.component, props)}</div>;
      })}
    </>
  );
}

/**
 * Resolve imagens referenciadas nos sections.
 */
export function resolveAssets(assets: Array<{ id: string; url: string; alt?: string }>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const a of assets) map[a.id] = a.url;
  return map;
}
