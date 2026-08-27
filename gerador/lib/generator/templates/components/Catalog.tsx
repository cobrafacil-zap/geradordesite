'use client';

import { RendererProps, waLink } from './registry';

export function Gallery({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ src: string; alt?: string; caption?: string }>) || [];
  if (items.length === 0) {
    // Placeholder grid
    return (
      <section className="gallery-section">
        <div className="wrap">
          <div className="section-head">
            <h2 style={{ color: theme.text }}>{content?.title as string || 'Galeria'}</h2>
          </div>
          <div className="gallery-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="gallery-item" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
            ))}
          </div>
        </div>
        <style>{galleryStyles}</style>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Galeria'}</h2>
        </div>
        <div className="gallery-grid">
          {items.map((it, i) => (
            <figure key={i} className="gallery-item">
              <img src={it.src} alt={it.alt || ''} loading="lazy" />
              {it.caption && <figcaption style={{ color: theme.textMuted }}>{it.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
      <style>{galleryStyles}</style>
    </section>
  );
}

const galleryStyles = `
.gallery-section { padding: 96px 0; }
.gallery-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.section-head { text-align: center; margin-bottom: 48px; }
.section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0; letter-spacing: -0.02em; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.gallery-item { aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; margin: 0; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-item figcaption { padding: 12px; font-size: 13px; }
`;

export function Products({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ name: string; desc: string; price?: string; image?: string }>) || [];
  const whatsapp = (content?.whatsapp as string) || '';

  return (
    <section className="products-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Produtos em destaque'}</h2>
        </div>
        <div className="products-grid">
          {items.map((p, i) => (
            <div key={i} className="product-card">
              <div className="product-img" style={{ background: p.image ? undefined : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
              </div>
              <div className="product-body">
                <h3 style={{ color: theme.text }}>{p.name}</h3>
                <p style={{ color: theme.textMuted }}>{p.desc}</p>
                {p.price && <div className="product-price" style={{ color: theme.primary }}>{p.price}</div>}
                {whatsapp && (
                  <a href={waLink(whatsapp, `Olá, tenho interesse no produto ${p.name}`)} target="_blank" rel="noopener" className="product-cta" style={{ background: theme.primary, color: '#fff' }}>
                    Tenho interesse
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .products-section { padding: 96px 0; }
        .products-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 56px; }
        .product-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 16px; overflow: hidden; transition: transform .2s; }
        .product-card:hover { transform: translateY(-4px); }
        .product-img { aspect-ratio: 1; }
        .product-img img { width: 100%; height: 100%; object-fit: cover; }
        .product-body { padding: 24px; }
        .product-body h3 { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .product-body p { font-size: 14px; line-height: 1.5; margin: 0 0 12px; }
        .product-price { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .product-cta { display: inline-block; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: filter .15s; }
        .product-cta:hover { filter: brightness(1.1); }
      `}</style>
    </section>
  );
}

export function ProductList({ content, theme }: RendererProps) {
  return <Products content={{ ...content, title: content?.title || 'Todos os Produtos' }} theme={theme} />;
}

export function Cases({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ name: string; desc: string; tag?: string }>) || [];
  return (
    <section className="cases-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Cases de sucesso'}</h2>
        </div>
        <div className="cases-grid">
          {items.map((c, i) => (
            <div key={i} className="case-card" style={{ borderTopColor: theme.accent }}>
              {c.tag && <span className="case-tag" style={{ background: theme.accent, color: '#fff' }}>{c.tag}</span>}
              <h3 style={{ color: theme.text }}>{c.name}</h3>
              <p style={{ color: theme.textMuted }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .cases-section { padding: 96px 0; background: var(--c-surface); }
        .cases-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .cases-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 48px; }
        .case-card { padding: 32px; background: #fff; border-radius: 12px; border: 1px solid var(--c-border); border-top-width: 4px; border-top-style: solid; }
        .case-tag { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .case-card h3 { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .case-card p { font-size: 14px; line-height: 1.6; margin: 0; }
      `}</style>
    </section>
  );
}

export function BlogList({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ title: string; excerpt: string; date?: string; image?: string; category?: string }>) || [];
  return (
    <section className="blog-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Blog & Artigos'}</h2>
        </div>
        <div className="blog-grid">
          {items.map((p, i) => (
            <article key={i} className="blog-card">
              <div className="blog-img" style={{ background: p.image ? undefined : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
              </div>
              <div className="blog-body">
                {p.category && <span className="blog-cat" style={{ color: theme.accent }}>{p.category}</span>}
                <h3 style={{ color: theme.text }}>{p.title}</h3>
                <p style={{ color: theme.textMuted }}>{p.excerpt}</p>
                {p.date && <span className="blog-date" style={{ color: theme.textMuted }}>{p.date}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .blog-section { padding: 96px 0; }
        .blog-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-top: 48px; }
        .blog-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 16px; overflow: hidden; transition: transform .2s; }
        .blog-card:hover { transform: translateY(-4px); }
        .blog-img { aspect-ratio: 16/9; }
        .blog-img img { width: 100%; height: 100%; object-fit: cover; }
        .blog-body { padding: 24px; }
        .blog-cat { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .blog-card h3 { font-size: 18px; font-weight: 700; margin: 8px 0; }
        .blog-card p { font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
        .blog-date { font-size: 12px; }
      `}</style>
    </section>
  );
}

export function Properties({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ title: string; price: string; meta: string; image?: string }>) || [];
  const whatsapp = (content?.whatsapp as string) || '';
  return (
    <section className="properties-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Imóveis em destaque'}</h2>
        </div>
        <div className="properties-grid">
          {items.map((p, i) => (
            <div key={i} className="property-card">
              <div className="property-img" style={{ background: p.image ? undefined : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                {p.price && <span className="property-price" style={{ background: theme.primary, color: '#fff' }}>{p.price}</span>}
              </div>
              <div className="property-body">
                <h3 style={{ color: theme.text }}>{p.title}</h3>
                <p style={{ color: theme.textMuted }}>{p.meta}</p>
                {whatsapp && (
                  <a href={waLink(whatsapp, `Olá, tenho interesse no imóvel ${p.title}`)} target="_blank" rel="noopener" className="property-cta" style={{ borderColor: theme.primary, color: theme.primary }}>
                    Quero saber mais
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .properties-section { padding: 96px 0; background: var(--c-surface); }
        .properties-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .properties-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 48px; }
        .property-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--c-border); }
        .property-img { aspect-ratio: 4/3; position: relative; }
        .property-img img { width: 100%; height: 100%; object-fit: cover; }
        .property-price { position: absolute; bottom: 12px; left: 12px; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; }
        .property-body { padding: 24px; }
        .property-body h3 { font-size: 17px; font-weight: 700; margin: 0 0 6px; }
        .property-body p { font-size: 14px; margin: 0 0 16px; }
        .property-cta { display: inline-block; padding: 10px 18px; border: 1.5px solid; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: all .15s; }
        .property-cta:hover { background: var(--c-primary); color: #fff !important; }
      `}</style>
    </section>
  );
}

export function PropertyList({ content, theme }: RendererProps) {
  return <Properties content={{ ...content, title: content?.title || 'Nossos imóveis' }} theme={theme} />;
}

export function MenuPreview({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ name: string; desc: string; price: string }>) || [];
  return (
    <section className="menu-preview">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Cardápio'}</h2>
        </div>
        <div className="menu-grid">
          {items.slice(0, 6).map((m, i) => (
            <div key={i} className="menu-item">
              <div className="menu-item-head">
                <h3 style={{ color: theme.text }}>{m.name}</h3>
                <span className="menu-dots"></span>
                <span className="menu-price" style={{ color: theme.primary }}>{m.price}</span>
              </div>
              {m.desc && <p style={{ color: theme.textMuted }}>{m.desc}</p>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .menu-preview { padding: 96px 0; }
        .menu-preview .wrap { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .section-head { text-align: center; margin-bottom: 48px; }
        .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .menu-grid { display: flex; flex-direction: column; gap: 24px; }
        .menu-item-head { display: flex; align-items: baseline; gap: 12px; }
        .menu-item-head h3 { font-size: 17px; font-weight: 700; margin: 0; }
        .menu-dots { flex: 1; border-bottom: 1px dotted var(--c-border); height: 1px; }
        .menu-price { font-size: 16px; font-weight: 700; }
        .menu-item p { font-size: 14px; line-height: 1.6; margin: 6px 0 0; }
      `}</style>
    </section>
  );
}

export function MenuFull({ content, theme }: RendererProps) {
  return <MenuPreview content={content} theme={theme} />;
}

export function Reservation({ content, theme }: RendererProps) {
  const whatsapp = (content?.whatsapp as string) || '';
  return (
    <section className="reservation-section" id="contato">
      <div className="wrap reservation-inner">
        <div className="reservation-copy">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Reserve sua mesa'}</h2>
          <p style={{ color: theme.textMuted }}>{content?.subtitle as string || 'Garanta seu horário com antecedência.'}</p>
        </div>
        <form className="reservation-form" onSubmit={(e) => { e.preventDefault(); if (whatsapp) window.open(waLink(whatsapp, 'Olá, gostaria de fazer uma reserva.'), '_blank'); }}>
          <input type="text" placeholder="Nome completo" required />
          <input type="tel" placeholder="Telefone" required />
          <div className="reservation-row">
            <input type="date" required />
            <input type="time" required />
            <input type="number" placeholder="Pessoas" min={1} max={20} required />
          </div>
          <textarea placeholder="Observações" rows={3} />
          <button type="submit" style={{ background: theme.primary }}>Confirmar reserva</button>
        </form>
      </div>
      <style>{`
        .reservation-section { padding: 96px 0; background: var(--c-surface); }
        .reservation-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .reservation-copy h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; }
        .reservation-copy p { font-size: 16px; line-height: 1.6; margin: 0; }
        .reservation-form { display: flex; flex-direction: column; gap: 12px; padding: 32px; background: #fff; border-radius: 16px; border: 1px solid var(--c-border); }
        .reservation-form input, .reservation-form textarea { padding: 12px 16px; border: 1px solid var(--c-border); border-radius: 8px; font-family: inherit; font-size: 15px; }
        .reservation-form input:focus, .reservation-form textarea:focus { outline: none; border-color: var(--c-accent); }
        .reservation-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .reservation-form button { color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; }
        @media (max-width: 768px) {
          .reservation-inner { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  );
}
