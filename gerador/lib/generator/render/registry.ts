'use client';

import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Header } from '../templates/components/Header';
import { Footer } from '../templates/components/Footer';
// (ReactNode já importado acima)
import { Hero } from '../templates/components/Hero';
import { HeroSimple } from '../templates/components/HeroSimple';
import { Services, Specialties, Differentials } from '../templates/components/Services';
import { About, History, Stats } from '../templates/components/About';
import { CTA, Contact, Map } from '../templates/components/CTA';
import { Team, Testimonials, FAQ, Legal } from '../templates/components/Social';
import { Gallery, Products, ProductList, Cases, BlogList, Properties, PropertyList, MenuPreview, MenuFull, Reservation } from '../templates/components/Catalog';

import type { RendererProps } from '../templates/components/registry';

/**
 * Registry central de componentes — o mesmo é usado tanto pelo preview
 * do Gerador quanto pelo SiteRenderer do projeto exportado.
 */
export const COMPONENT_REGISTRY = {
  Header,
  Footer,
  Hero,
  HeroSimple,
  About,
  Services,
  Specialties,
  Differentials,
  Team,
  Testimonials,
  FAQ,
  CTA,
  Contact,
  Map,
  History,
  Stats,
  Gallery,
  Products,
  ProductList,
  Cases,
  BlogList,
  Properties,
  PropertyList,
  MenuPreview,
  MenuFull,
  Reservation,
  Legal,
} as const;

export type ComponentKey = keyof typeof COMPONENT_REGISTRY;

export function renderComponent(name: string, props: RendererProps): ReactNode {
  const Comp = (COMPONENT_REGISTRY as any)[name];
  if (!Comp) {
    if (typeof window !== 'undefined') console.warn(`[renderer] Componente desconhecido: ${name}`);
    return null;
  }
  return createElement(Comp, props);
}

export function getAvailableComponents(): string[] {
  return Object.keys(COMPONENT_REGISTRY);
}
