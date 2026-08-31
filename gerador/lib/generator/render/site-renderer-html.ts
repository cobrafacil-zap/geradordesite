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
  const variant = (section.variant || 'split').toLowerCase();
  const eyebrow = pickContent(section, 'eyebrow');
  const title = pickContent(section, 'title', 'Título principal');
  const subtitle = pickContent(section, 'subtitle', '');
  const ctaLabel = pickContent(section, 'ctaLabel', 'Fale conosco');
  const ctaHref = pickContent(section, 'ctaHref', '#contato');
  const image = pickContent(section, 'image');
  const imageAlt = pickContent(section, 'imageAlt', '');

  // ───────────────────────────────────────────────────────────
  // 1) SPLIT — clássico corporativo: texto à esquerda, imagem à direita
  // ───────────────────────────────────────────────────────────
  if (variant === 'split' || variant === 'default') {
    return `
    <section class="py-20 md:py-28">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          ${eyebrow ? `<div class="text-xs uppercase tracking-[0.2em] text-accent mb-3 font-semibold">${esc(eyebrow)}</div>` : ''}
          <h1 class="text-4xl md:text-5xl font-bold text-fg leading-[1.1]">${esc(title)}</h1>
          ${subtitle ? `<p class="mt-4 text-lg text-fg-muted leading-relaxed">${esc(subtitle)}</p>` : ''}
          <div class="mt-6 flex gap-3 flex-wrap">
            <a href="${esc(ctaHref)}" class="bg-accent text-white font-medium px-5 py-3 rounded-lg inline-block hover:opacity-90 transition">${esc(ctaLabel)}</a>
          </div>
        </div>
        ${image ? `<div class="relative"><img src="${esc(image)}" alt="${esc(imageAlt)}" class="rounded-2xl shadow-2xl w-full" /></div>` : ''}
      </div>
    </section>`;
  }

  // ───────────────────────────────────────────────────────────
  // 2) FULLBLEED — imagem de fundo cobrindo tudo, texto sobreposto
  // (restaurante, pizzaria, fotógrafo, hotel, experiência)
  // ───────────────────────────────────────────────────────────
  if (variant === 'fullbleed') {
    const bgImg = image ? `background-image:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.7)),url('${esc(image)}');background-size:cover;background-position:center;` : '';
    return `
    <section class="relative min-h-[560px] flex items-end pb-16" style="${bgImg}background-color:var(--primary);">
      <div class="relative max-w-6xl mx-auto px-6 w-full">
        ${eyebrow ? `<div class="text-xs uppercase tracking-[0.3em] text-white/80 mb-3 font-semibold">${esc(eyebrow)}</div>` : ''}
        <h1 class="text-4xl md:text-6xl font-bold text-white leading-[1.05] max-w-3xl" style="font-family:var(--font-display, var(--font-heading));">${esc(title)}</h1>
        ${subtitle ? `<p class="mt-4 text-lg text-white/85 leading-relaxed max-w-2xl">${esc(subtitle)}</p>` : ''}
        <div class="mt-6 flex gap-3 flex-wrap">
          <a href="${esc(ctaHref)}" class="bg-white text-fg font-semibold px-6 py-3 rounded-lg inline-block hover:bg-white/90 transition">${esc(ctaLabel)}</a>
        </div>
      </div>
    </section>`;
  }

  // ───────────────────────────────────────────────────────────
  // 3) CENTERED — texto centralizado em fundo branco (B2B, SaaS, agência)
  // ───────────────────────────────────────────────────────────
  if (variant === 'centered' || variant === 'centered-bold') {
    return `
    <section class="py-24 md:py-36 text-center" style="background:var(--bg-elev);">
      <div class="max-w-4xl mx-auto px-6">
        ${eyebrow ? `<div class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent mb-4 font-semibold bg-accent/10 px-3 py-1 rounded-full">${esc(eyebrow)}</div>` : ''}
        <h1 class="text-4xl md:text-6xl font-extrabold text-fg leading-[1.05]">${esc(title)}</h1>
        ${subtitle ? `<p class="mt-5 text-lg md:text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed">${esc(subtitle)}</p>` : ''}
        <div class="mt-8 flex gap-3 justify-center flex-wrap">
          <a href="${esc(ctaHref)}" class="bg-accent text-white font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90 transition shadow-lg shadow-accent/20">${esc(ctaLabel)}</a>
        </div>
      </div>
    </section>`;
  }

  // ───────────────────────────────────────────────────────────
  // 4) DARK PREMIUM — fundo escuro sólido, tipografia serif elegante
  // (luxo, boutique, construtora premium, escritório de advocacia)
  // ───────────────────────────────────────────────────────────
  if (variant === 'dark-premium' || variant === 'dark') {
    return `
    <section class="py-24 md:py-32" style="background:var(--primary);color:#fff;">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-[1fr,2fr] gap-10 items-end">
          <div>
            ${eyebrow ? `<div class="text-xs uppercase tracking-[0.3em] mb-3 font-semibold" style="color:var(--accent);">${esc(eyebrow)}</div>` : ''}
            ${image ? `<img src="${esc(image)}" alt="${esc(imageAlt)}" class="w-full rounded shadow-2xl" style="border:1px solid rgba(255,255,255,0.15);" />` : ''}
          </div>
          <div>
            <h1 class="text-4xl md:text-6xl font-bold leading-[1.05]" style="font-family:var(--font-display, var(--font-heading));font-weight:700;">${esc(title)}</h1>
            ${subtitle ? `<p class="mt-5 text-lg leading-relaxed" style="color:rgba(255,255,255,0.78);">${esc(subtitle)}</p>` : ''}
            <div class="mt-7 flex gap-3 flex-wrap">
              <a href="${esc(ctaHref)}" class="font-semibold px-6 py-3 rounded inline-block transition hover:opacity-90" style="background:var(--accent);color:#fff;">${esc(ctaLabel)}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  // ───────────────────────────────────────────────────────────
  // 5) MAGAZINE — imagem grande à esquerda, texto à direita, sem bordas
  // (imobiliária, arquitetura, interiores)
  // ───────────────────────────────────────────────────────────
  if (variant === 'magazine' || variant === 'image-left') {
    return `
    <section class="py-0">
      <div class="grid md:grid-cols-5 gap-0">
        <div class="md:col-span-2 relative" style="min-height:420px;${image ? `background-image:url('${esc(image)}');background-size:cover;background-position:center;` : 'background:var(--bg-elev);'}">
        </div>
        <div class="md:col-span-3 flex items-center py-16 md:py-20 px-8 md:px-14">
          <div>
            ${eyebrow ? `<div class="text-xs uppercase tracking-[0.25em] text-accent mb-4 font-semibold">${esc(eyebrow)}</div>` : ''}
            <h1 class="text-4xl md:text-5xl font-bold text-fg leading-[1.1]" style="font-family:var(--font-display, var(--font-heading));">${esc(title)}</h1>
            ${subtitle ? `<p class="mt-5 text-lg text-fg-muted leading-relaxed max-w-xl">${esc(subtitle)}</p>` : ''}
            <div class="mt-7 flex gap-3 flex-wrap">
              <a href="${esc(ctaHref)}" class="bg-accent text-white font-medium px-5 py-3 rounded-none inline-block hover:opacity-90 transition">${esc(ctaLabel)}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  // ───────────────────────────────────────────────────────────
  // 6) CARD-INFORMATIVO — texto em card branco sobre fundo colorido
  // (emergenciais 24h, imobiliária popular, serviços urgentes)
  // ───────────────────────────────────────────────────────────
  if (variant === 'card-informativo' || variant === 'alert') {
    return `
    <section class="py-20 md:py-28" style="background:var(--accent);">
      <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div class="bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
          ${eyebrow ? `<div class="inline-block text-xs uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full mb-4" style="background:var(--accent);color:#fff;">${esc(eyebrow)}</div>` : ''}
          <h1 class="text-3xl md:text-4xl font-extrabold text-fg leading-tight">${esc(title)}</h1>
          ${subtitle ? `<p class="mt-4 text-base text-fg-muted leading-relaxed">${esc(subtitle)}</p>` : ''}
          <div class="mt-6 flex gap-3 flex-wrap">
            <a href="${esc(ctaHref)}" class="font-bold px-6 py-3 rounded-lg inline-block text-white transition hover:opacity-90" style="background:var(--primary);">${esc(ctaLabel)}</a>
          </div>
        </div>
        ${image ? `<div class="hidden md:block"><img src="${esc(image)}" alt="${esc(imageAlt)}" class="rounded-2xl shadow-xl w-full" /></div>` : ''}
      </div>
    </section>`;
  }

  // fallback: split
  return `
  <section class="py-20 md:py-28">
    <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
      <div>
        ${eyebrow ? `<div class="text-xs uppercase tracking-wider text-accent mb-3">${esc(eyebrow)}</div>` : ''}
        <h1 class="text-4xl md:text-5xl font-bold text-fg leading-tight">${esc(title)}</h1>
        ${subtitle ? `<p class="mt-4 text-lg text-fg-muted">${esc(subtitle)}</p>` : ''}
        <a href="${esc(ctaHref)}" class="mt-6 bg-accent text-white font-medium px-5 py-3 rounded-lg inline-block">${esc(ctaLabel)}</a>
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
  const items = (section.content?.items || []) as Array<{ title: string; excerpt: string; date?: string; image?: string; tag?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-2">${esc(pickContent(section, 'title', 'Blog & Conteúdo'))}</h2>
      ${pickContent(section, 'subtitle') ? `<p class="text-fg-muted mb-8">${esc(pickContent(section, 'subtitle'))}</p>` : ''}
      <div class="grid md:grid-cols-3 gap-4">
        ${items.map((p) => `
          <article class="card-base overflow-hidden">
            ${p.image ? `<img src="${esc(p.image)}" alt="" class="w-full aspect-video object-cover" />` : ''}
            <div class="p-5">
              <div class="flex items-center gap-2 mb-2">
                ${p.tag ? `<span class="text-[10px] uppercase tracking-wider text-accent">${esc(p.tag)}</span>` : ''}
                ${p.date ? `<span class="text-xs text-fg-muted">${esc(p.date)}</span>` : ''}
              </div>
              <h3 class="font-semibold text-fg mb-2 leading-snug">${esc(p.title)}</h3>
              <p class="text-sm text-fg-muted">${esc(p.excerpt)}</p>
            </div>
          </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderProperties(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; price?: string; image?: string; desc?: string; tag?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-2 text-center">${esc(pickContent(section, 'title', 'Imóveis'))}</h2>
      ${pickContent(section, 'subtitle') ? `<p class="text-fg-muted text-center mb-8">${esc(pickContent(section, 'subtitle'))}</p>` : ''}
      <div class="grid md:grid-cols-3 gap-4">
        ${items.map((p) => `
          <div class="card-base overflow-hidden">
            ${p.image ? `<img src="${esc(p.image)}" alt="" class="w-full aspect-[4/3] object-cover" />` : ''}
            <div class="p-4">
              ${p.tag ? `<div class="text-[10px] uppercase tracking-wider text-accent mb-1">${esc(p.tag)}</div>` : ''}
              <div class="font-semibold text-fg">${esc(p.name)}</div>
              ${p.desc ? `<div class="text-sm text-fg-muted mt-1">${esc(p.desc)}</div>` : ''}
              ${p.price ? `<div class="mt-2 text-accent font-bold">${esc(p.price)}</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}
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

function renderMenuFull(section: Section): string {
  // Aceita { categories: [{name, items: [...]}] } OU { items: [...] } (formato antigo)
  const categories = (section.content?.categories as Array<{ name: string; items: Array<{ name: string; price: string; desc?: string }> }>) || [];
  const flat = (section.content?.items || []) as Array<{ name: string; price: string; desc?: string }>;
  const groups = categories.length ? categories : [{ name: 'Cardápio', items: flat }];
  return `
  <section class="py-16">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-2 text-center">${esc(pickContent(section, 'title', 'Cardápio completo'))}</h2>
      ${pickContent(section, 'subtitle') ? `<p class="text-fg-muted text-center mb-10">${esc(pickContent(section, 'subtitle'))}</p>` : ''}
      <div class="space-y-10">
        ${groups.map((g) => `
          <div>
            <h3 class="text-xl font-semibold text-fg mb-4 border-b border-border pb-2">${esc(g.name)}</h3>
            <div class="space-y-4">
              ${g.items.map((m) => `<div class="flex items-baseline justify-between gap-4 border-b border-border/40 pb-3"><div><div class="font-medium text-fg">${esc(m.name)}</div>${m.desc ? `<div class="text-sm text-fg-muted mt-0.5">${esc(m.desc)}</div>` : ''}</div><div class="text-accent font-semibold whitespace-nowrap">${esc(m.price)}</div></div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

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
          <input type="number" placeholder="Pessoas" class="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm" />
          <button class="w-full bg-accent text-white font-semibold py-3 rounded-lg">Confirmar reserva</button>
        </form>
      </div>
    </div>
  </section>`;
}

// ─────────────────────────────────────────────────────────────────
// Seções específicas por segmento — cada uma tem visual próprio
// ─────────────────────────────────────────────────────────────────

function renderChef(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; role: string; photo?: string; bio?: string }>;
  return `
  <section class="py-16" style="background:var(--bg-elev);">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-10 text-center">${esc(pickContent(section, 'title', 'Nosso time'))}</h2>
      <div class="grid md:grid-cols-3 gap-6">
        ${items.map(it => `
          <div class="card-base overflow-hidden">
            <div style="background:var(--accent);height:160px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:48px;">${it.photo ? `<img src="${esc(it.photo)}" alt="${esc(it.name)}" style="width:100%;height:100%;object-fit:cover;" />` : '👨‍🍳'}</div>
            <div class="p-4">
              <h3 class="font-bold text-fg">${esc(it.name)}</h3>
              <p class="text-xs text-accent mt-0.5">${esc(it.role)}</p>
              ${it.bio ? `<p class="text-sm text-fg-muted mt-2">${esc(it.bio)}</p>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderBrands(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; logo?: string }>;
  return `
  <section class="py-12" style="background:var(--primary);">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <p class="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 font-semibold">${esc(pickContent(section, 'title', 'Trabalhamos com'))}</p>
      <div class="flex flex-wrap justify-center gap-x-10 gap-y-4 items-center">
        ${items.map(it => `<div class="text-white/80 font-bold text-lg tracking-wide">${esc(it.name)}</div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderSchedule(section: Section): string {
  const items = (section.content?.items || []) as Array<{ day: string; hours: string }>;
  return `
  <section class="py-16">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-8 text-center">${esc(pickContent(section, 'title', 'Horários'))}</h2>
      <div class="card-base divide-y divide-border">
        ${items.map(it => `
          <div class="flex justify-between items-center px-5 py-3">
            <span class="font-medium text-fg">${esc(it.day)}</span>
            <span class="text-fg-muted">${esc(it.hours)}</span>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderInstruments(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; tag?: string }>;
  return `
  <section class="py-16" style="background:var(--primary);color:#fff;">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold mb-10 text-center" style="font-family:var(--font-display, var(--font-heading));">${esc(pickContent(section, 'title', 'Equipamentos'))}</h2>
      <div class="grid md:grid-cols-4 gap-4">
        ${items.map(it => `
          <div class="p-4 rounded-lg" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);">
            <div class="text-xs uppercase tracking-wider" style="color:var(--accent);">${esc(it.tag || 'Pro')}</div>
            <div class="font-semibold mt-1">${esc(it.name)}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderConventions(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string }>;
  return `
  <section class="py-12">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <p class="text-xs uppercase tracking-[0.3em] text-fg-muted mb-5 font-semibold">${esc(pickContent(section, 'title', 'Convênios'))}</p>
      <div class="flex flex-wrap justify-center gap-3">
        ${items.map(it => `<span class="px-4 py-2 rounded-full text-sm font-medium" style="background:var(--bg-elev);color:var(--fg);border:1px solid var(--border);">${esc(it.name)}</span>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderHighlights(section: Section): string {
  const items = (section.content?.items || []) as Array<{ title: string; desc: string; icon?: string }>;
  return `
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-3 text-center">${esc(pickContent(section, 'title', 'Diferenciais'))}</h2>
      ${pickContent(section, 'subtitle') ? `<p class="text-center text-fg-muted mb-10">${esc(pickContent(section, 'subtitle'))}</p>` : ''}
      <div class="grid md:grid-cols-2 gap-4">
        ${items.map(it => `
          <div class="card-base p-6 flex gap-4">
            <div class="text-3xl">${it.icon || '★'}</div>
            <div>
              <h3 class="font-bold text-fg">${esc(it.title)}</h3>
              <p class="text-sm text-fg-muted mt-1">${esc(it.desc)}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderMethod(section: Section): string {
  const items = (section.content?.items || []) as Array<{ step: string; title: string; desc: string }>;
  return `
  <section class="py-16" style="background:var(--bg-elev);">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-10 text-center">${esc(pickContent(section, 'title', 'Nosso método'))}</h2>
      <div class="grid md:grid-cols-4 gap-4">
        ${items.map((it, i) => `
          <div class="relative card-base p-5">
            <div class="text-4xl font-extrabold text-accent/40 mb-2">${String(i + 1).padStart(2, '0')}</div>
            <h3 class="font-bold text-fg">${esc(it.title)}</h3>
            <p class="text-sm text-fg-muted mt-2">${esc(it.desc)}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderPress(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string; quote?: string }>;
  return `
  <section class="py-12" style="background:var(--primary);color:#fff;">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <p class="text-xs uppercase tracking-[0.3em] mb-6 font-semibold" style="color:var(--accent);">${esc(pickContent(section, 'title', 'Quem falou de nós'))}</p>
      <div class="flex flex-wrap justify-center gap-6">
        ${items.map(it => `<span class="text-white/90 font-bold text-lg tracking-wide italic" style="font-family:var(--font-display, var(--font-heading));">${esc(it.name)}</span>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderLogos(section: Section): string {
  const items = (section.content?.items || []) as Array<{ name: string }>;
  return `
  <section class="py-10 border-y border-border">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex flex-wrap justify-around items-center gap-6">
        ${items.map(it => `<div class="text-fg-muted font-bold text-lg tracking-wide opacity-70">${esc(it.name)}</div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderMarquee(section: Section): string {
  const items = (section.content?.items || []) as Array<{ text: string }>;
  const repeated = [...items, ...items, ...items];
  const inner = repeated.map(it => `<span class="text-white font-bold text-lg tracking-wide">${esc(it.text)}</span>`).join('');
  const styleTag = '<style>@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-33.33%);}}</style>';
  return `
  <section class="py-6 overflow-hidden" style="background:var(--accent);">
    <div class="flex gap-12 whitespace-nowrap" style="animation: marquee 30s linear infinite;">
      ${inner}
    </div>
  </section>` + styleTag;
}

function renderProcess(section: Section): string {
  const items = (section.content?.items || []) as Array<{ title: string; desc: string }>;
  return `
  <section class="py-16">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-fg mb-10 text-center">${esc(pickContent(section, 'title', 'Como trabalhamos'))}</h2>
      <div class="space-y-4">
        ${items.map((it, i) => `
          <div class="flex gap-5 items-start card-base p-5">
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0" style="background:var(--accent);color:#fff;">${i + 1}</div>
            <div class="flex-1">
              <h3 class="font-bold text-fg text-lg">${esc(it.title)}</h3>
              <p class="text-fg-muted mt-1">${esc(it.desc)}</p>
            </div>
          </div>`).join('')}
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
  // Novas seções específicas por segmento
  Chef: renderChef,
  Brands: renderBrands,
  Schedule: renderSchedule,
  Instruments: renderInstruments,
  Conventions: renderConventions,
  Highlights: renderHighlights,
  Method: renderMethod,
  Press: renderPress,
  Logos: renderLogos,
  Marquee: renderMarquee,
  Process: renderProcess,
};

function renderSection(s: Section): string {
  const fn = RENDERERS[s.component] || ((x: Section) => `<section class="py-12"><div class="max-w-4xl mx-auto px-6 text-fg-muted">Componente não suportado: ${esc(s.component)}</div></section>`);
  try {
    return fn(s);
  } catch {
    return '';
  }
}

export function siteRendererToHtml(site: Site, opts?: { pageIdx?: number; pageSlug?: string }): string {
  const t = site.theme || { colors: { primary: '#7c5cff', secondary: '#5b8bff', accent: '#7c5cff', background: '#0a0a0f', surface: '#111118', text: '#f5f5f7' }, fonts: { heading: 'Inter', body: 'Inter' } };
  const colors = (t as any).colors || ({} as any);
  const fonts = (t as any).fonts || { heading: 'Inter', body: 'Inter' };
  const cssVars = `:root{--bg:${esc(colors.background || '#ffffff')};--bg-elev:${esc(colors.surface || '#f8fafc')};--fg:${esc(colors.text || '#0f172a')};--accent:${esc(colors.accent || colors.primary || '#7c5cff')};--accent-glow:${esc(colors.secondary || colors.accent || '#5b8bff')};--text-muted:${esc(colors.textMuted || '#64748b')};--text-dim:${esc(colors.textMuted || '#94a3b8')};--border:${esc(colors.border || '#e5e7eb')};--font-heading:'${esc(fonts.heading || 'Inter')}',sans-serif;--font-body:'${esc(fonts.body || 'Inter')}',sans-serif}`;
  const isDark = (() => {
    // detecta pelo theme.style ou luminância do background
    if ((t as any).style === 'dark-premium') return true;
    return isColorDark(colors.background || '#ffffff');
  })();
  const head = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(site.site?.name || 'Preview')}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>:root{color-scheme:${isDark ? 'dark' : 'light'}}html,body{background:var(--bg)!important;color:var(--fg)!important;font-family:var(--font-body)}.text-fg{color:var(--fg)}.text-fg-muted{color:var(--text-muted)}.text-fg-dim{color:var(--text-dim)}.bg-bg{background:var(--bg)}.bg-bg-elev{background:var(--bg-elev)}.bg-accent{background:var(--accent)}.text-accent{color:var(--accent)}.border-accent{border-color:var(--accent)}.border-border{border-color:var(--border)}.card-base{background:var(--bg-elev);border:1px solid var(--border);border-radius:14px;transition:border-color .2s}.btn-primary{background:var(--accent);color:#ffffff;padding:.5rem 1rem;border-radius:10px;font-weight:500;display:inline-block}img{max-width:100%;height:auto}a{color:inherit;text-decoration:none}${cssVars}}</style>
  `;
  // Seleciona a página a renderizar. Por padrão: 'home' ou a primeira.
  // Aceita pageIdx (0-based) ou pageSlug vindos do caller.
  const pages = site.pages || [];
  let page = pages[0];
  if (opts?.pageIdx != null && pages[opts.pageIdx]) {
    page = pages[opts.pageIdx];
  } else if (opts?.pageSlug) {
    page = pages.find((p) => p.slug === opts.pageSlug) || page;
  } else {
    page = pages.find((p) => p.slug === 'home') || pages[0];
  }
  const home = page;
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
  return `<!doctype html><html lang="pt-BR"${isDark ? ' class="dark"' : ''}><head>${head}</head><body>${body}<!--preview-debug:style=${esc((t as any).style || 'none')};bg=${esc(colors.background || 'none')};fg=${esc(colors.text || 'none')};dark=${isDark}--></body></html>`;
}

// ─────────────────────────────────────────────────────────────────
// Helpers de cor
// ─────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function isColorDark(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return L < 0.3;
}
