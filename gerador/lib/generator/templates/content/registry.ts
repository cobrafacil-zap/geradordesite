/**
 * Content packs por template.
 *
 * Cada entrada define personalidade visual e textual única:
 * - paleta (primary/secondary/accent)
 * - hero (eyebrow, title, subtitle, CTA, image)
 * - serviços / diferenciais / stats / FAQ / depoimentos / time
 * - footer info
 *
 * Os packs são divididos em 6 arquivos (group-1..6) por questão de
 * organização. Este arquivo só junta todos num único `PACKS`.
 */

export type ServiceItem = { icon: string; name: string; desc: string };
export type DiffItem = { name: string; desc: string };
export type TestimonialItem = { name: string; role?: string; text: string };
export type TeamItem = { name: string; role: string; photo?: string };
export type StatItem = { value: string; label: string };
export type FAQItem = { q: string; a: string };
export type ProductItem = { name: string; price?: string; image?: string; desc?: string };
export type GalleryItem = { src: string; alt?: string };
export type HistoryItem = { year: string; text: string };

export interface HeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt?: string;
}

export interface PaletteConfig {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
}

/** Define se o site renderiza com fundo escuro (true) ou claro (false). */
export type Mode = 'light' | 'dark';

export interface ContentPack {
  slug: string;
  tagline: string;
  palette: PaletteConfig;
  /** 'light' (claro) ou 'dark' (escuro). Default: detectado pela luminância de palette.primary. */
  mode?: Mode;
  aboutText: string;
  hero: HeroConfig;
  services: ServiceItem[];
  differentials: DiffItem[];
  stats?: StatItem[];
  testimonials?: TestimonialItem[];
  team?: TeamItem[];
  faq?: FAQItem[];
  products?: ProductItem[];
  menu?: Array<{ name: string; price: string; desc?: string }>;
  /** Cardápio com categorias (usado por MenuFull) */
  menuCategories?: Array<{ name: string; items: Array<{ name: string; price: string; desc?: string }> }>;
  gallery?: GalleryItem[];
  history?: HistoryItem[];
  ctaTitle: string;
  ctaLabel: string;
  address?: string;
  hours?: string;
  cnpj?: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

import { GROUP_1 } from './group-1';
import { GROUP_2 } from './group-2';
import { GROUP_3 } from './group-3';
import { GROUP_4 } from './group-4';
import { GROUP_5 } from './group-5';
import { GROUP_6 } from './group-6';

export const PACKS: Record<string, ContentPack> = {
  ...GROUP_1,
  ...GROUP_2,
  ...GROUP_3,
  ...GROUP_4,
  ...GROUP_5,
  ...GROUP_6,
};

/** Pega o pack de um slug ou devolve um fallback genérico. */
export function getPack(slug: string): ContentPack {
  return PACKS[slug] || PACKS['empresa-corporativa'];
}
