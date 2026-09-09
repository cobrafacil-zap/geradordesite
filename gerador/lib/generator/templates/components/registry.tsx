/**
 * Renderer type — cada componente recebe { content, settings, theme } e retorna JSX.
 */
import type { CSSProperties, ReactNode } from 'react';

export interface RendererProps {
  content: Record<string, any>;
  settings?: Record<string, any>;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
  assets?: Record<string, string>;
  nav?: Array<{ label: string; href: string }>;
  siteName?: string;
}

export type Renderer = (props: RendererProps) => ReactNode;

/** Helper: monta um style baseado no tema */
export function tStyles(theme: RendererProps['theme']): CSSProperties {
  return {
    '--c-primary': theme.primary,
    '--c-secondary': theme.secondary,
    '--c-accent': theme.accent,
    '--c-bg': theme.background,
    '--c-surface': theme.surface,
    '--c-text': theme.text,
    '--c-text-muted': theme.textMuted,
    '--c-border': theme.border,
  } as CSSProperties;
}

/** Helper: link WhatsApp */
export function waLink(num: string | undefined, msg?: string): string {
  if (!num) return '#';
  const digits = String(num).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg || 'Olá, gostaria de saber mais.')}`;
}

/** Helper: ícone simples (chevron, check, etc.) */
export function Chevron({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Check({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Image references — a aba Imagens do editor usa isto pra listar
// todas as imagens que aparecem no schema, agrupadas por seção/página.
// ─────────────────────────────────────────────────────────────────

export interface ImageRef {
  /** Caminho até a string no schema, ex: "pages[0].sections[0].content.image" */
  path: string;
  /** URL atual (pode ser string vazia) */
  current: string;
  /** Texto alternativo, se houver */
  alt?: string;
  /** Contexto legível: "Hero · /início" */
  context: string;
}

/** Chaves (em `content`) que carregam uma URL de imagem direta. */
const SINGLE_IMAGE_KEYS = ['image', 'logo', 'photo', 'avatar', 'cover', 'src', 'thumb', 'thumbnail'];

/**
 * Percorre um objeto arbitrário e coleta todos os campos que parecem
 * conter uma URL de imagem. Usado pelo painel Imagens para listar tudo
 * o que o usuário pode trocar sem depender da IA.
 */
export function getReferencedImages(site: any): ImageRef[] {
  const refs: ImageRef[] = [];
  if (!site || !Array.isArray(site.pages)) return refs;

  for (let pi = 0; pi < site.pages.length; pi++) {
    const page = site.pages[pi];
    if (!page || typeof page !== 'object') continue;
    const pageName = page.name || page.slug || `Página ${pi + 1}`;

    if (!Array.isArray(page.sections)) continue;
    for (let si = 0; si < page.sections.length; si++) {
      const section = page.sections[si];
      if (!section || typeof section !== 'object') continue;
      const compName = section.component || 'Section';
      const variant = section.variant || '';
      const context = `${compName}${variant ? ` · ${variant}` : ''} · /${page.slug?.replace(/^\//, '') || pageName}`;

      const content = section.content;
      if (!content || typeof content !== 'object') continue;

      // Campos singulares (image, logo, photo, cover, src, etc.)
      for (const key of SINGLE_IMAGE_KEYS) {
        const val = content[key];
        if (typeof val === 'string' && /^https?:\/\//.test(val)) {
          refs.push({
            path: `pages[${pi}].sections[${si}].content.${key}`,
            current: val,
            alt: content[`${key}Alt`] || content.alt,
            context,
          });
        }
      }

      // Arrays: items[], gallery[], team[], products[], properties[], cases[], menuCategories[]
      for (const arrKey of ['items', 'gallery', 'team', 'products', 'properties', 'cases', 'properties', 'cards', 'testimonials']) {
        const arr = content[arrKey];
        if (!Array.isArray(arr)) continue;
        for (let ai = 0; ai < arr.length; ai++) {
          const item = arr[ai];
          if (!item || typeof item !== 'object') continue;
          for (const key of SINGLE_IMAGE_KEYS) {
            const val = item[key];
            if (typeof val === 'string' && /^https?:\/\//.test(val)) {
              refs.push({
                path: `pages[${pi}].sections[${si}].content.${arrKey}[${ai}].${key}`,
                current: val,
                alt: item.alt || item.name,
                context: `${context} · ${item.name || `item ${ai + 1}`}`,
              });
            }
          }
        }
      }

      // menuCategories[].items[] — drill aninhado
      if (Array.isArray(content.menuCategories)) {
        for (let ci = 0; ci < content.menuCategories.length; ci++) {
          const cat = content.menuCategories[ci];
          if (!cat || !Array.isArray(cat.items)) continue;
          for (let ii = 0; ii < cat.items.length; ii++) {
            const item = cat.items[ii];
            if (!item || typeof item !== 'object') continue;
            for (const key of SINGLE_IMAGE_KEYS) {
              const val = item[key];
              if (typeof val === 'string' && /^https?:\/\//.test(val)) {
                refs.push({
                  path: `pages[${pi}].sections[${si}].content.menuCategories[${ci}].items[${ii}].${key}`,
                  current: val,
                  alt: item.name,
                  context: `${context} · ${cat.name} · ${item.name || `item ${ii + 1}`}`,
                });
              }
            }
          }
        }
      }
    }
  }

  return refs;
}

/**
 * Aplica um patch ao schema: substitui o valor em `path` (formato JS dotted/bracket)
 * pelo novo valor. Retorna um novo objeto (não muta `site`).
 *
 * Ex: setAtPath(site, "pages[0].sections[0].content.image", "https://...")
 */
export function setAtPath(obj: any, path: string, value: any): any {
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  const tokens = parsePath(path);
  let cur: any = next;
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i];
    const seg = cur[t];
    cur[t] = Array.isArray(seg) ? [...seg] : (typeof seg === 'object' && seg !== null ? { ...seg } : (typeof tokens[i + 1] === 'number' ? [] : {}));
    cur = cur[t];
  }
  cur[tokens[tokens.length - 1]] = value;
  return next;
}

function parsePath(path: string): (string | number)[] {
  const out: (string | number)[] = [];
  // split on dots, then on brackets
  const re = /([^.\[\]]+)|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[2] !== undefined) out.push(Number(m[2]));
    else if (m[1] !== undefined) out.push(m[1]);
  }
  return out;
}
