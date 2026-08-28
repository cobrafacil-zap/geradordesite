/**
 * Helpers compartilhados pelo file-builder.
 */

export function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'site';
}

export function pageDirName(slug: string): string {
  if (!slug || slug === '/' || slug === '') return 'home';
  return slugify(slug);
}

/** Garante que cada página tenha slug começando com / */
export function ensureLeadingSlash(slug: string): string {
  if (!slug) return '/';
  if (!slug.startsWith('/')) return `/${slug}`;
  return slug;
}
