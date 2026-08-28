'use client';

import { RendererProps, waLink, Check } from './registry';

/**
 * Hero — 15+ variantes
 * A: split (img dir + copy esq)
 * B: centrado com imagem de fundo
 * C: magazine (3 colunas com cards)
 * D: product spotlight
 * E: service grid compacto
 * F: vitrine 3 cards (imobiliária/restaurante)
 * G: gallery polaroids
 */
export function Hero({ content, theme, siteName }: RendererProps) {
  const variant = (content?.variant as string) || 'A';
  const data = {
    title: content?.title || content?.slogan || siteName || 'Transforme seu negócio',
    subtitle: content?.subtitle || content?.slogan || '',
    cta: content?.cta || 'Fale Conosco',
    ctaSecondary: content?.ctaSecondary || '',
    image: content?.image || '',
    whatsapp: content?.whatsapp || '',
    badge: content?.badge || '',
    stats: content?.stats || [],
    cards: content?.cards || [],
  };

  return (
    <section className={`hero hero-${variant.toLowerCase()}`}>
      {variant === 'A' && <HeroA data={data} theme={theme} />}
      {variant === 'B' && <HeroB data={data} theme={theme} />}
      {variant === 'C' && <HeroC data={data} theme={theme} />}
      {variant === 'D' && <HeroD data={data} theme={theme} />}
      {variant === 'E' && <HeroE data={data} theme={theme} />}
      {variant === 'F' && <HeroF data={data} theme={theme} />}
      {variant === 'G' && <HeroG data={data} theme={theme} />}
      {!['A','B','C','D','E','F','G'].includes(variant) && <HeroA data={data} theme={theme} />}
      <style>{heroStyles}</style>
    </section>
  );
}

type HeroData = {
  title: string; subtitle: string; cta: string; ctaSecondary: string;
  image: string; whatsapp: string; badge: string;
  stats: any[]; cards: any[];
};
type Th = RendererProps['theme'];

function HeroA({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="wrap hero-a-grid">
      <div className="hero-a-copy">
        {data.badge && <span className="hero-badge">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
        <div className="hero-actions">
          {data.whatsapp && (
            <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary">
              {data.cta}
            </a>
          )}
          {data.ctaSecondary && <a href="#contato" className="btn-ghost">{data.ctaSecondary} →</a>}
        </div>
        {data.stats.length > 0 && (
          <div className="hero-stats">
            {data.stats.map((s: any, i: number) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-num">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hero-a-img">
        {data.image ? <img src={data.image} alt="" /> : <div className="hero-img-placeholder" />}
      </div>
    </div>
  );
}

function HeroB({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="hero-b-bg" style={data.image ? { backgroundImage: `linear-gradient(135deg, ${theme.primary}E6, ${theme.secondary}E6), url(${data.image})` } : { background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
      <div className="wrap hero-b-inner">
        {data.badge && <span className="hero-badge light">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
        <div className="hero-actions center">
          {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary light">{data.cta}</a>}
          {data.ctaSecondary && <a href="#contato" className="btn-ghost light">{data.ctaSecondary} →</a>}
        </div>
      </div>
    </div>
  );
}

function HeroC({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="wrap hero-c-grid">
      <div className="hero-c-copy">
        {data.badge && <span className="hero-badge">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
        <div className="hero-actions">
          {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary">{data.cta}</a>}
        </div>
      </div>
      <div className="hero-c-cards">
        {(data.cards.length > 0 ? data.cards : [
          { title: 'Squad Senior', desc: 'Engenheiros com 8+ anos' },
          { title: 'On-call', desc: 'Plantão com SLA contratual' },
          { title: 'Observabilidade', desc: 'Tracing e métricas desde o dia 1' },
        ]).map((c: any, i: number) => (
          <div key={i} className="hero-c-card">
            <div className="card-num">0{i + 1}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroD({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="hero-d-bg" style={{ background: `linear-gradient(180deg, ${theme.secondary}, ${theme.primary})` }}>
      <div className="wrap hero-d-grid">
        <div className="hero-d-product">
          {data.image ? <img src={data.image} alt="" /> : <div className="product-img-placeholder"><span>★</span></div>}
        </div>
        <div className="hero-d-copy">
          {data.badge && <span className="hero-badge light">{data.badge}</span>}
          <h1>{data.title}</h1>
          {data.subtitle && <p>{data.subtitle}</p>}
          <div className="hero-actions">
            {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary light">{data.cta}</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroE({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="wrap hero-e-inner">
      <div className="hero-e-top">
        {data.badge && <span className="hero-badge">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
      </div>
      <div className="hero-e-grid">
        {(data.cards.length > 0 ? data.cards : [
          { icon: '⚡', title: 'Rápido', desc: 'Resposta em até 24h' },
          { icon: '✓', title: 'Garantido', desc: '90 dias de garantia' },
          { icon: '★', title: 'Avaliado', desc: '4.9 de satisfação' },
        ]).map((c: any, i: number) => (
          <div key={i} className="hero-e-card">
            <div className="hero-e-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="hero-actions center">
        {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary">{data.cta}</a>}
      </div>
    </div>
  );
}

function HeroF({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="wrap hero-f-inner">
      <div className="hero-f-copy">
        {data.badge && <span className="hero-badge">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
        <div className="hero-actions">
          {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary">{data.cta}</a>}
        </div>
      </div>
      <div className="hero-f-cards">
        {(data.cards.length > 0 ? data.cards : [
          { tag: 'Venda', title: 'Apartamento 3 dorms', meta: 'Centro · 95m²' },
          { tag: 'Aluguel', title: 'Casa com piscina', meta: 'Bela Vista · 4 vagas' },
          { tag: 'Lançamento', title: 'Studio Garden', meta: 'Lançamento · 32m²' },
        ]).map((c: any, i: number) => (
          <div key={i} className="hero-f-card">
            <div className="hero-f-img"></div>
            <span className="hero-f-tag">{c.tag}</span>
            <h3>{c.title}</h3>
            <p>{c.meta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroG({ data, theme }: { data: HeroData; theme: Th }) {
  return (
    <div className="wrap hero-g-inner">
      <div className="hero-g-copy">
        {data.badge && <span className="hero-badge">{data.badge}</span>}
        <h1>{data.title}</h1>
        {data.subtitle && <p>{data.subtitle}</p>}
        <div className="hero-actions">
          {data.whatsapp && <a href={waLink(data.whatsapp)} target="_blank" rel="noopener" className="btn-primary">{data.cta}</a>}
        </div>
      </div>
      <div className="hero-gallery-grid">
        <div className="g-photo g-1"></div>
        <div className="g-photo g-2"></div>
        <div className="g-photo g-3"></div>
        <div className="g-photo g-4"></div>
        <div className="g-photo g-5"></div>
      </div>
    </div>
  );
}

const heroStyles = `
.hero { padding: 80px 0; position: relative; overflow: hidden; }
.wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.hero-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--c-accent, #22c55e);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 999px;
  margin-bottom: 24px;
}
.hero-badge.light { background: rgba(255,255,255,0.18); color: #fff; }
.hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; line-height: 1.05; margin: 0 0 24px; letter-spacing: -0.02em; }
.hero p { font-size: clamp(16px, 2vw, 20px); line-height: 1.6; margin: 0 0 32px; opacity: 0.85; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-actions.center { justify-content: center; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  background: var(--c-primary);
  color: #fff;
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  font-size: 16px;
  transition: filter .15s, transform .1s;
}
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-primary.light { background: #fff; color: var(--c-primary); }
.btn-ghost { color: inherit; padding: 14px 24px; text-decoration: none; font-weight: 500; opacity: .85; }
.btn-ghost:hover { opacity: 1; }
.btn-ghost.light { color: #fff; }

/* Hero A — split */
.hero-a-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center; }
.hero-a-copy h1 { color: var(--c-text, #0f172a); }
.hero-a-copy p { color: var(--c-text-muted, #64748b); }
.hero-stats { display: flex; gap: 32px; margin-top: 48px; }
.hero-stat-num { font-size: 32px; font-weight: 800; color: var(--c-primary); }
.hero-stat-label { font-size: 13px; color: var(--c-text-muted); }
.hero-a-img { position: relative; }
.hero-a-img img { width: 100%; height: auto; border-radius: 16px; box-shadow: 0 24px 64px -16px rgba(0,0,0,.2); }
.hero-img-placeholder { aspect-ratio: 4/3; background: linear-gradient(135deg, var(--c-primary), var(--c-accent)); border-radius: 16px; }

/* Hero B — bg image */
.hero-b-bg { background-size: cover; background-position: center; padding: 140px 0; color: #fff; text-align: center; }
.hero-b-inner h1, .hero-b-inner p { color: #fff; }
.hero-b-inner { max-width: 800px; margin: 0 auto; }

/* Hero C — magazine */
.hero-c-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: center; }
.hero-c-copy h1 { color: var(--c-text); }
.hero-c-cards { display: flex; flex-direction: column; gap: 20px; }
.hero-c-card { padding: 28px; background: var(--c-surface, #f8f8fa); border-radius: 12px; border: 1px solid var(--c-border); }
.hero-c-card h3 { margin: 8px 0; font-size: 20px; color: var(--c-text); }
.hero-c-card p { margin: 0; font-size: 14px; color: var(--c-text-muted); }
.card-num { font-size: 13px; font-weight: 700; color: var(--c-accent); letter-spacing: 0.08em; }

/* Hero D — product */
.hero-d-bg { padding: 100px 0; color: #fff; }
.hero-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.hero-d-grid h1, .hero-d-grid p { color: #fff; }
.product-img-placeholder { aspect-ratio: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 120px; color: #fff; }
.product-img-placeholder img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }

/* Hero E — service grid */
.hero-e-inner { text-align: center; }
.hero-e-inner h1 { color: var(--c-text); }
.hero-e-inner > .hero-e-top p { color: var(--c-text-muted); max-width: 700px; margin: 0 auto 56px; }
.hero-e-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
.hero-e-card { padding: 32px 24px; background: var(--c-surface); border-radius: 12px; border: 1px solid var(--c-border); }
.hero-e-icon { font-size: 32px; margin-bottom: 16px; }
.hero-e-card h3 { color: var(--c-text); margin: 0 0 8px; font-size: 18px; }
.hero-e-card p { color: var(--c-text-muted); margin: 0; font-size: 14px; }

/* Hero F — vitrine */
.hero-f-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; align-items: center; }
.hero-f-copy h1 { color: var(--c-text); }
.hero-f-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.hero-f-card { background: var(--c-surface); border-radius: 12px; overflow: hidden; padding-bottom: 16px; border: 1px solid var(--c-border); }
.hero-f-img { aspect-ratio: 1; background: linear-gradient(135deg, var(--c-primary), var(--c-accent)); }
.hero-f-tag { display: inline-block; padding: 4px 10px; background: var(--c-primary); color: #fff; font-size: 11px; font-weight: 600; border-radius: 999px; margin: 12px 12px 8px; }
.hero-f-card h3 { color: var(--c-text); margin: 4px 12px; font-size: 16px; }
.hero-f-card p { color: var(--c-text-muted); margin: 0 12px; font-size: 13px; }

/* Hero G — gallery */
.hero-g-inner { display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px; align-items: center; }
.hero-g-copy h1 { color: var(--c-text); }
.hero-gallery-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 12px; height: 480px; }
.g-photo { background: linear-gradient(135deg, var(--c-primary), var(--c-secondary)); border-radius: 8px; }
.g-1 { grid-row: span 2; }

@media (max-width: 768px) {
  .hero-a-grid, .hero-c-grid, .hero-d-grid, .hero-f-inner, .hero-g-inner { grid-template-columns: 1fr; gap: 40px; }
  .hero-e-grid, .hero-f-cards { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 16px; }
  .hero-gallery-grid { height: 320px; }
}
`;
