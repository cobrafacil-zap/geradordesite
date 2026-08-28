/**
 * siteRendererToHtml(siteSchema) → string HTML
 *
 * Renderiza um SiteSchema em HTML inline (estático) usando Tailwind CDN.
 * Usado pelo endpoint /api/preview/[id] para alimentar o iframe do editor.
 *
 * Implementação enxuta: produz um HTML com <style> inline (cores do tema)
 * e blocos semânticos por seção. Não usa os componentes React — gera direto.
 */
import type { Site, Page, Section } from '../site-schema';

function esc(s: any): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function waLink(num: string, msg?: string): string {
  const cleaned = String(num || '').replace(/\D/g, '');
  const q = msg ? `?text=${encodeURIComponent(msg)}` : '';
  return `https://wa.me/${cleaned}${q}`;
}

function pickContent(section: Section, key: string, fallback: any = ''): any {
  return section?.content?.[key] ?? fallback;
}

function renderHeader(site: Site, page: Page): string {
  const c = site;
  const nav = c.navigation || [];
  const links = nav.map((n: any) => `<a href="${esc(n.href)}" class="text-fg-muted hover:text-fg transition-colors text-sm">${esc(n.label)}</a>`).join('');
  const cta = c.settings?.whatsapp
    ? `<a href="${waLink(c.settings.whatsapp)}" target="_blank" class="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg">Fale conosco</a>`
    : '';
  return `
  <header class="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
      <a href="/" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-white font-bold text-sm">${esc((c.site.name || 'S').charAt(0))}</div>
        <span class="font-semibold text-fg">${esc(c.site.name)}</span>
      </a>
      <nav class="hidden md:flex items-center gap-6">${links}</nav>
      <div class="flex items-center gap-2">${cta}</div>
    </div>
  </header>`;
}

function renderFooter(site: Site): string {
  const c = site;
  const nav = c.navigation || [];
  const links = nav.map((n: any) => `<a href="${esc(n.href)}" class="text-fg-muted hover:text-fg text-sm">${esc(n.label)}</a>`).join('');
  return `
  <footer class="border-t border-border mt-16">
    <div class="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
      <div>
        <div class="font-semibold text-fg mb-2">${esc(c.site.name)}</div>
        <div class="text-sm text-fg-muted">${esc((c.site as any).description || '')}</div>
      </div>
      <div class="flex flex-col gap-1.5">${links}</div>
      <div class="text-sm text-fg-muted">
        ${c.settings?.phone ? `<div>${esc(c.settings.phone)}</div>` : ''}
        ${c.settings?.email ? `<div>${esc(c.settings.email)}</div>` : ''}
        ${c.settings?.address ? `<div class="mt-1">${esc(c.settings.address)}</div>` : ''}
      </div>
    </div>
    <div class="border-t border-border py-4 text-center text-xs text-fg-dim">© ${new Date().getFullYear()} ${esc(c.site.name)}</div>
  </footer>`;
}

function renderHero(section: Section): string {
  const eyebrow = pickContent(section, 'eyebrow');
  const title = pickContent(section, 'title', 'Título principal');
  const subtitle = pickContent(section, 'subtitle', '');
  const ctaLabel = pickContent(section, 'ctaLabel', 'Fale conosco');
  const ctaHref = pickContent(section, 'ctaHref', '#contato');
  const image = pickContent(section, 'image');
  return `
  <section class="py-20 md:py-28">
    <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
      <div>
        ${eyebrow ? `<div class="text-xs uppercase tracking-wider text-accent mb-3">${esc(eyebrow)}</div>` : ''}
        <h1 class="text-4xl md:text-5xl font-bold text-fg leading-tight">${esc(title)}</h1>
        ${subtitle ? `<p class="mt-4 text-lg text-fg-muted">${esc(subtitle)}</p>` : ''}
        <div class="mt-6 flex gap-3">
          <a href="${esc(ctaHref)}" class="bg-accent text-white font-medium px-5 py-3 rounded-lg inline-block">${esc(ctaLabel)}</a>
        </div>
      </div>
      ${image ? `<div><img src="${esc(image)}" alt="" class="rounded-2xl shadow-2xl w-full" /></div>` : ''}
    </div>
  </section>`;
}

function renderHeroSimple(section: Section): string {
  const title = pickContent(section, 'title');
  const subtitle = pickContent(section, 'subtitle', '');
  return `
  <section class="py-16 text-center bg-gradient-to-b from-accent/5 to-transparent">
    <div class="max-w-3xl mx-auto px-6">
      <h1 class="text-4xl md:text-5xl font-bold text-fg">${esc(title)}</h1>
      ${subtitle ? `<p class="mt-3 text-lg text-fg-muted">${esc(subtitle)}</p>` : ''}
    </div>
  </section>`;
}

function renderServices(section: Section): string {
  const title = pickContent(section, 'title', 'Serviços');
  const items = (section.content?.items || []) as Array<{ name: string; desc: string; icon?: string }>;
  const cards = items.map((it) => `
    <div class="card-base p-6">
      <div class="text-2xl mb-2">${esc(it.icon || '✦')}</div>
      <div class="font-semibold text-fg">${esc(it.name)}</div>
      <div class="text-sm text-fg-muted mt-1">${esc(it.desc)}</div>
    </div>`).join('');
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(title)}</h2>
      <div class="grid md:grid-cols-3 gap-4">${cards}</div>
    </div>
  </section>`;
}

function renderSpecialties(section: Section): string {
  return renderServices(section); // alias visual
}

function renderDifferentials(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; desc: string }>;
  const cards = items.map((it) => `
    <div class="flex gap-3">
      <div class="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">✓</div>
      <div>
        <div class="font-semibold text-fg">${esc(it.name)}</div>
        <div class="text-sm text-fg-muted mt-1">${esc(it.desc)}</div>
      </div>
    </div>`).join('');
  return `
  <section class="py-16">
    <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-x-12 gap-y-8">${cards}</div>
  </section>`;
}

function renderAbout(section: Section): string {
  const title = pickContent(section, 'title', 'Sobre nós');
  const text = pickContent(section, 'text', '');
  const image = pickContent(section, 'image');
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 class="text-3xl font-bold text-fg mb-4">${esc(title)}</h2>
        <p class="text-fg-muted leading-relaxed">${esc(text)}</p>
      </div>
      ${image ? `<div><img src="${esc(image)}" alt="" class="rounded-2xl w-full" /></div>` : ''}
    </div>
  </section>`;
}

function renderHistory(section: Section): string {
  const items = (section.content?.items || []) as Array<{ year: string; text: string }>;
  return `
  <section class="py-16">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Nossa história'))}</h2>
      <div class="space-y-6 border-l-2 border-accent/30 pl-6">
        ${items.map((it) => `<div><div class="text-accent font-semibold text-sm">${esc(it.year)}</div><div class="text-fg-muted mt-1">${esc(it.text)}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderStats(section: Section): string {
  const items = (section.content?.items || []) as Array<{ value: string; label: string }>;
  return `
  <section class="py-12 bg-bg-elev/40">
    <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      ${items.map((it) => `<div><div class="text-3xl md:text-4xl font-bold text-accent">${esc(it.value)}</div><div class="text-sm text-fg-muted mt-1">${esc(it.label)}</div></div>`).join('')}
    </div>
  </section>`;
}

function renderCTA(section: Section): string {
  const title = pickContent(section, 'title', 'Pronto para começar?');
  const ctaLabel = pickContent(section, 'ctaLabel', 'Fale conosco');
  const ctaHref = pickContent(section, 'ctaHref', '#contato');
  return `
  <section class="py-20">
    <div class="max-w-4xl mx-auto px-6 text-center bg-gradient-to-br from-accent/15 to-accent-glow/10 rounded-3xl p-12 border border-accent/20">
      <h2 class="text-3xl md:text-4xl font-bold text-fg">${esc(title)}</h2>
      <a href="${esc(ctaHref)}" class="mt-6 inline-block bg-accent text-white font-medium px-6 py-3 rounded-lg">${esc(ctaLabel)}</a>
    </div>
  </section>`;
}

function renderContact(section: Section): string {
  const title = pickContent(section, 'title', 'Contato');
  return `
  <section class="py-16" id="contato">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(title)}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="card-base p-5"><div class="text-xs text-fg-muted mb-1">WhatsApp</div><div class="text-fg">${esc(section.content?.whatsapp || '')}</div></div>
        <div class="card-base p-5"><div class="text-xs text-fg-muted mb-1">Email</div><div class="text-fg">${esc(section.content?.email || '')}</div></div>
        <div class="card-base p-5"><div class="text-xs text-fg-muted mb-1">Endereço</div><div class="text-fg">${esc(section.content?.address || '')}</div></div>
      </div>
    </div>
  </section>`;
}

function renderMap(section: Section): string {
  const url = pickContent(section, 'mapEmbedUrl');
  return url ? `<section class="py-8"><div class="max-w-6xl mx-auto px-6"><iframe src="${esc(url)}" class="w-full h-96 rounded-2xl border border-border" loading="lazy"></iframe></div></section>` : '';
}

function renderTeam(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; role: string; photo?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Equipe'))}</h2>
      <div class="grid md:grid-cols-3 gap-6">
        ${items.map((m) => `
          <div class="card-base p-5 text-center">
            ${m.photo ? `<img src="${esc(m.photo)}" alt="" class="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />` : `<div class="w-20 h-20 rounded-full mx-auto mb-3 bg-accent/15 flex items-center justify-center text-2xl text-accent font-bold">${esc((m.name || '?').charAt(0))}</div>`}
            <div class="font-semibold text-fg">${esc(m.name)}</div>
            <div class="text-xs text-fg-muted">${esc(m.role)}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderTestimonials(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; text: string; role?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Depoimentos'))}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        ${items.map((t) => `<div class="card-base p-6"><div class="text-3xl text-accent mb-2">"</div><p class="text-fg leading-relaxed">${esc(t.text)}</p><div class="mt-4 text-sm"><div class="font-semibold text-fg">${esc(t.name)}</div>${t.role ? `<div class="text-fg-muted">${esc(t.role)}</div>` : ''}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderFAQ(section: Section): string {
  const items = (section.content?.items || []) as Array<{ q: string; a: string }>;
  return `
  <section class="py-16">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Perguntas frequentes'))}</h2>
      <div class="space-y-3">
        ${items.map((it) => `<details class="card-base p-4 group"><summary class="cursor-pointer font-medium text-fg flex items-center justify-between">${esc(it.q)}<span class="text-accent group-open:rotate-45 transition-transform">+</span></summary><div class="mt-3 text-sm text-fg-muted">${esc(it.a)}</div></details>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderLegal(section: Section): string {
  return `<section class="py-12"><div class="max-w-3xl mx-auto px-6 prose"><h2 class="text-2xl font-bold text-fg mb-3">${esc(pickContent(section, 'title', 'Texto legal'))}</h2><div class="text-sm text-fg-muted whitespace-pre-wrap">${esc(pickContent(section, 'text', ''))}</div></div></section>`;
}

function renderGallery(section: Section): string {
  const items = (section.content?.items || []) as Array<{ src: string; alt?: string }>;
  return `
  <section class="py-12">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      ${items.map((it) => `<img src="${esc(it.src)}" alt="${esc(it.alt || '')}" class="rounded-lg w-full aspect-square object-cover" />`).join('')}
    </div>
  </section>`;
}

function renderProducts(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; price?: string; image?: string; desc?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Produtos'))}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        ${items.map((p) => `
          <div class="card-base overflow-hidden">
            ${p.image ? `<img src="${esc(p.image)}" alt="" class="w-full aspect-square object-cover" />` : ''}
            <div class="p-4">
              <div class="font-semibold text-fg">${esc(p.name)}</div>
              ${p.desc ? `<div class="text-sm text-fg-muted mt-1">${esc(p.desc)}</div>` : ''}
              ${p.price ? `<div class="mt-2 text-accent font-bold">${esc(p.price)}</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderProductList(section: Section): string { return renderProducts(section); }

function renderCases(section: Section): string {
  const items = (section.content?.items || []) as Array<{ title: string; desc: string; tag?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Cases'))}</h2>
      <div class="grid md:grid-cols-2 gap-4">
        ${items.map((c) => `<div class="card-base p-6"><div class="text-xs text-accent mb-2">${esc(c.tag || '')}</div><div class="font-semibold text-fg mb-2">${esc(c.title)}</div><div class="text-sm text-fg-muted">${esc(c.desc)}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderBlogList(section: Section): string {
  const items = (section.content?.items || []) as Array<{ title: string; excerpt: string; date?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8">${esc(pickContent(section, 'title', 'Blog'))}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        ${items.map((p) => `<article class="card-base p-5"><div class="text-xs text-fg-muted mb-2">${esc(p.date || '')}</div><h3 class="font-semibold text-fg mb-2">${esc(p.title)}</h3><p class="text-sm text-fg-muted">${esc(p.excerpt)}</p></article>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderProperties(section: Section): string { return renderProducts(section); }
function renderPropertyList(section: Section): string { return renderProducts(section); }

function renderMenuPreview(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; price: string; desc?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Cardápio'))}</h2>
      <div class="space-y-4">
        ${items.map((m) => `<div class="flex items-baseline justify-between gap-4 border-b border-border pb-3"><div><div class="font-medium text-fg">${esc(m.name)}</div>${m.desc ? `<div class="text-sm text-fg-muted">${esc(m.desc)}</div>` : ''}</div><div class="text-accent font-semibold whitespace-nowrap">${esc(m.price)}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderMenuFull(section: Section): string { return renderMenuPreview(section); }

function renderReservation(section: Section): string {
  return `
  <section class="py-16">
    <div class="max-w-md mx-auto px-6">
      <div class="card-base p-6">
        <h2 class="text-2xl font-bold text-fg mb-4 text-center">${esc(pickContent(section, 'title', 'Reservar mesa'))}</h2>
        <form class="space-y-3">
          <input type="text" placeholder="Nome" class="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm" />
          <input type="date" class="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm" />
          <input type="time" class="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Pessoas" min="1" class="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm" />
          <button type="button" class="w-full bg-accent text-white py-2.5 rounded-lg font-medium">Reservar</button>
        </form>
      </div>
    </div>
  </section>`;
}

const RENDERERS: Record<string, (s: Section) => string> = {
  Header: () => '', // renderizado fora
  Footer: () => '', // renderizado fora
  Hero: renderHero,
  HeroSimple: renderHeroSimple,
  Services: renderServices,
  Specialties: renderSpecialties,
  Differentials: renderDifferentials,
  About: renderAbout,
  History: renderHistory,
  Stats: renderStats,
  CTA: renderCTA,
  Contact: renderContact,
  Map: renderMap,
  Team: renderTeam,
  Testimonials: renderTestimonials,
  FAQ: renderFAQ,
  Legal: renderLegal,
  Gallery: renderGallery,
  Products: renderProducts,
  ProductList: renderProductList,
  Cases: renderCases,
  BlogList: renderBlogList,
  Properties: renderProperties,
  PropertyList: renderPropertyList,
  MenuPreview: renderMenuPreview,
  MenuFull: renderMenuFull,
  Reservation: renderReservation,
};

function renderSection(s: Section): string {
  const fn = RENDERERS[s.component] || ((x: Section) => `<section class="py-12"><div class="max-w-4xl mx-auto px-6 text-fg-muted">Componente não suportado: ${esc(s.component)}</div></section>`);
  try {
    return fn(s);
  } catch {
    return '';
  }
}

export function siteRendererToHtml(site: Site): string {
  const t = site.theme || { colors: { primary: '#7c5cff', secondary: '#5b8bff', accent: '#7c5cff', background: '#0a0a0f', surface: '#111118', text: '#f5f5f7' }, fonts: { heading: 'Inter', body: 'Inter' } };
  const colors = (t as any).colors || ({} as any);
  const fonts = (t as any).fonts || { heading: 'Inter', body: 'Inter' };
  const cssVars = `:root{--bg:${esc(colors.background || '#ffffff')};--bg-elev:${esc(colors.surface || '#f8fafc')};--fg:${esc(colors.text || '#0f172a')};--accent:${esc(colors.accent || colors.primary || '#7c5cff')};--accent-glow:${esc(colors.secondary || colors.accent || '#5b8bff')};--text-muted:${esc(colors.textMuted || '#64748b')};--text-dim:${esc(colors.textMuted || '#94a3b8')};--border:${esc(colors.border || '#e5e7eb')};--font-heading:'${esc(fonts.heading || 'Inter')}',sans-serif;--font-body:'${esc(fonts.body || 'Inter')}',sans-serif}`;
  const head = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(site.site?.name || 'Preview')}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>:root{color-scheme:light}html,body{background:var(--bg);color:var(--fg);font-family:var(--font-body)}.text-fg{color:var(--fg)}.text-fg-muted{color:var(--text-muted)}.text-fg-dim{color:var(--text-dim)}.bg-bg{background:var(--bg)}.bg-bg-elev{background:var(--bg-elev)}.bg-accent{background:var(--accent)}.text-accent{color:var(--accent)}.border-accent{border-color:var(--accent)}.border-border{border-color:var(--border)}.card-base{background:var(--bg-elev);border:1px solid var(--border);border-radius:14px;transition:border-color .2s}.btn-primary{background:var(--accent);color:white;padding:.5rem 1rem;border-radius:10px;font-weight:500;display:inline-block}img{max-width:100%;height:auto}a{color:inherit;text-decoration:none}${cssVars}}</style>
  `;
  // Renderiza apenas a primeira página (home)
  const home = site.pages?.find((p) => p.slug === 'home') || site.pages?.[0];
  if (!home) {
    return `<!doctype html><html><head>${head}</head><body><div class="min-h-screen flex items-center justify-center text-fg-muted">Nenhuma página definida.</div></body></html>`;
  }
  const body = `
    ${renderHeader(site, home)}
    <main>
      ${home.sections.map(renderSection).join('\n')}
    </main>
    ${renderFooter(site)}
  `;
  return `<!doctype html><html lang="pt-BR" class="dark"><head>${head}</head><body>${body}</body></html>`;
}
