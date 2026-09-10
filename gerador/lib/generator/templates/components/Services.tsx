'use client';

import { RendererProps, Check } from './registry';

export function Services({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Nossos Serviços';
  const subtitle = (content?.subtitle as string) || '';
  const items = (content?.items as Array<{ name: string; desc: string; icon?: string }>) || [];
  const variant = (content?.variant as string) || 'grid';

  return (
    <section className={`services-section variant-${variant}`} id="servicos">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{title}</h2>
          {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
        </div>
        {variant === 'grid' && (
          <div className="services-grid">
            {items.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon" style={{ background: theme.primary, color: '#fff' }}>
                  {s.icon || '✓'}
                </div>
                <h3 style={{ color: theme.text }}>{s.name}</h3>
                <p style={{ color: theme.textMuted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'list' && (
          <ul className="services-list">
            {items.map((s, i) => (
              <li key={i} className="service-row">
                <div className="service-row-icon" style={{ background: theme.accent, color: '#fff' }}>
                  {s.icon || '✓'}
                </div>
                <div className="service-row-text">
                  <h3 style={{ color: theme.text }}>{s.name}</h3>
                  {s.desc && <p style={{ color: theme.textMuted }}>{s.desc}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
        {variant === 'cards' && (
          <div className="services-cards">
            {items.map((s, i) => (
              <div key={i} className="service-card-large" style={{ background: theme.surface, borderColor: theme.border }}>
                <div className="service-icon-xl" style={{ background: theme.accent, color: '#fff' }}>
                  {s.icon || (i + 1)}
                </div>
                <h3 style={{ color: theme.text }}>{s.name}</h3>
                <p style={{ color: theme.textMuted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'magazine' && (
          <div className="services-magazine">
            {items.map((s, i) => (
              <div key={i} className="service-mag-row" style={{ borderColor: theme.border }}>
                <span className="service-mag-num" style={{ color: theme.accent }}>0{i + 1}</span>
                <div>
                  <h3 style={{ color: theme.text }}>{s.name}</h3>
                  {s.desc && <p style={{ color: theme.textMuted }}>{s.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 'alternating' && (
          <div className="services-alt">
            {items.map((s, i) => (
              <div key={i} className={`service-alt-row ${i % 2 ? 'reverse' : ''}`}>
                <div className="service-alt-num" style={{ background: theme.primary, color: '#fff' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ color: theme.text }}>{s.name}</h3>
                  <p style={{ color: theme.textMuted }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 'bento' && (
          <div className="services-bento">
            {items.map((s, i) => (
              <div key={i} className={`service-bento-cell size-${i % 4 === 0 ? 'lg' : 'sm'}`} style={{ background: i % 2 === 0 ? theme.surface : 'transparent', borderColor: theme.border }}>
                <h3 style={{ color: theme.text }}>{s.name}</h3>
                <p style={{ color: theme.textMuted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'columns' && (
          <div className="services-columns" style={{ columnCount: items.length > 6 ? 3 : 2 }}>
            {items.map((s, i) => (
              <div key={i} className="service-col-item">
                <h3 style={{ color: theme.text }}>{s.name}</h3>
                <p style={{ color: theme.textMuted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'inline' && (
          <div className="services-inline">
            {items.map((s, i) => (
              <div key={i} className="service-pill" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}>
                {s.icon && <span>{s.icon}</span>}
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .services-section { padding: 96px 0; }
        .services-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .section-head { text-align: center; margin-bottom: 56px; max-width: 720px; margin-inline: auto; }
        .section-head h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .section-head p { font-size: 17px; line-height: 1.6; margin: 0; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .service-card { padding: 32px 28px; background: var(--c-surface, #fff); border: 1px solid var(--c-border); border-radius: 16px; transition: border-color .2s, transform .2s; }
        .service-card:hover { border-color: var(--c-accent, #22c55e); transform: translateY(-2px); }
        .service-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .service-card h3 { font-size: 19px; font-weight: 700; margin: 0 0 10px; }
        .service-card p { font-size: 14px; line-height: 1.6; margin: 0; }

        .services-list { list-style: none; padding: 0; margin: 0; max-width: 920px; margin-inline: auto; display: flex; flex-direction: column; gap: 12px; }
        .service-row { display: flex; align-items: center; gap: 16px; padding: 18px 22px; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 12px; }
        .service-row-icon { width: 40px; height: 40px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .service-row-text h3 { font-size: 16px; font-weight: 600; margin: 0; }
        .service-row-text p { font-size: 13px; margin: 4px 0 0; opacity: 0.8; }

        .services-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; }
        .service-card-large { padding: 48px 36px; border: 1px solid; border-radius: 20px; }
        .service-icon-xl { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; margin-bottom: 24px; }
        .service-card-large h3 { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
        .service-card-large p { font-size: 15px; line-height: 1.6; margin: 0; }

        .services-magazine { max-width: 980px; margin-inline: auto; }
        .service-mag-row { display: flex; gap: 32px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid; }
        .service-mag-row:last-child { border-bottom: 0; }
        .service-mag-num { font-size: 40px; font-weight: 800; line-height: 1; flex-shrink: 0; min-width: 64px; }
        .service-mag-row h3 { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
        .service-mag-row p { font-size: 15px; line-height: 1.6; margin: 0; }

        .services-alt { max-width: 920px; margin-inline: auto; display: flex; flex-direction: column; gap: 32px; }
        .service-alt-row { display: flex; gap: 24px; align-items: center; }
        .service-alt-row.reverse { flex-direction: row-reverse; text-align: right; }
        .service-alt-num { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; }
        .service-alt-row h3 { font-size: 20px; font-weight: 700; margin: 0 0 6px; }
        .service-alt-row p { font-size: 14px; line-height: 1.6; margin: 0; }

        .services-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .service-bento-cell { padding: 32px; border: 1px solid; border-radius: 16px; }
        .service-bento-cell.size-lg { grid-column: span 2; grid-row: span 2; padding: 48px; }
        .service-bento-cell h3 { font-size: 22px; font-weight: 700; margin: 0 0 10px; }
        .service-bento-cell.size-lg h3 { font-size: 32px; }
        .service-bento-cell p { font-size: 14px; line-height: 1.6; margin: 0; }

        .services-columns { column-gap: 48px; max-width: 1080px; margin-inline: auto; }
        .service-col-item { break-inside: avoid; padding: 16px 0; border-bottom: 1px solid var(--c-border); margin-bottom: 16px; }
        .service-col-item h3 { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
        .service-col-item p { font-size: 13px; line-height: 1.6; margin: 0; }

        .services-inline { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 920px; margin-inline: auto; }
        .service-pill { padding: 12px 20px; border: 1px solid; border-radius: 999px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
      `}</style>
    </section>
  );
}

export function Specialties({ content, theme }: RendererProps) {
  return <Services content={{ ...content, title: content?.title || 'Nossas Especialidades', subtitle: content?.subtitle || 'Conheça nossos tratamentos e procedimentos' }} theme={theme} />;
}

export function Differentials({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Diferenciais';
  const subtitle = (content?.subtitle as string) || '';
  const items = (content?.items as Array<{ name: string; desc: string; icon?: string }>) || [];
  const variant = (content?.variant as string) || 'default';

  return (
    <section className={`diff-section variant-${variant}`} style={{ background: theme.surface }}>
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{title}</h2>
          {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
        </div>
        {variant === 'default' && (
          <div className="diff-grid">
            {items.map((d, i) => (
              <div key={i} className="diff-item">
                <Check size={20} />
                <div>
                  <h3 style={{ color: theme.text }}>{d.name}</h3>
                  <p style={{ color: theme.textMuted }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 'highlight' && (
          <div className="diff-highlight">
            {items.map((d, i) => (
              <div key={i} className="diff-hl-card" style={{ background: theme.background, borderColor: theme.border }}>
                <div className="diff-hl-icon" style={{ background: theme.accent, color: '#fff' }}>{d.icon || (i + 1)}</div>
                <h3 style={{ color: theme.text }}>{d.name}</h3>
                <p style={{ color: theme.textMuted }}>{d.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'bento' && (
          <div className="diff-bento">
            {items.map((d, i) => (
              <div key={i} className={`diff-bento-cell size-${i % 5 === 0 ? 'lg' : (i % 3 === 0 ? 'md' : 'sm')}`} style={{ background: i % 2 === 0 ? theme.background : 'transparent', borderColor: theme.border }}>
                <h3 style={{ color: theme.text }}>{d.name}</h3>
                <p style={{ color: theme.textMuted }}>{d.desc}</p>
              </div>
            ))}
          </div>
        )}
        {variant === 'magazine' && (
          <div className="diff-magazine">
            {items.map((d, i) => (
              <div key={i} className="diff-mag-row" style={{ borderColor: theme.border }}>
                <span className="diff-mag-num" style={{ color: theme.accent }}>0{i + 1}</span>
                <div>
                  <h3 style={{ color: theme.text }}>{d.name}</h3>
                  <p style={{ color: theme.textMuted }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 'sidebyside' && (
          <div className="diff-sbs">
            {items.map((d, i) => (
              <div key={i} className="diff-sbs-item" style={{ borderColor: theme.border }}>
                <div className="diff-sbs-bar" style={{ background: theme.accent }} />
                <div>
                  <h3 style={{ color: theme.text }}>{d.name}</h3>
                  <p style={{ color: theme.textMuted }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 'inline' && (
          <ul className="diff-inline">
            {items.map((d, i) => (
              <li key={i} className="diff-pill" style={{ background: theme.background, borderColor: theme.border, color: theme.text }}>
                <Check size={14} />
                {d.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>{`
        .diff-section { padding: 96px 0; }
        .diff-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-top: 56px; }
        .diff-item { display: flex; gap: 16px; align-items: flex-start; }
        .diff-item svg { flex-shrink: 0; color: var(--c-accent, #22c55e); margin-top: 2px; }
        .diff-item h3 { font-size: 17px; font-weight: 700; margin: 0 0 6px; }
        .diff-item p { font-size: 14px; line-height: 1.6; margin: 0; }

        .diff-highlight { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 56px; }
        .diff-hl-card { padding: 36px 28px; border: 1px solid; border-radius: 16px; }
        .diff-hl-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .diff-hl-card h3 { font-size: 19px; font-weight: 700; margin: 0 0 10px; }
        .diff-hl-card p { font-size: 14px; line-height: 1.6; margin: 0; }

        .diff-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 56px; }
        .diff-bento-cell { padding: 28px; border: 1px solid; border-radius: 14px; }
        .diff-bento-cell.size-lg { grid-column: span 2; grid-row: span 2; padding: 40px; }
        .diff-bento-cell.size-md { grid-column: span 2; }
        .diff-bento-cell h3 { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .diff-bento-cell.size-lg h3 { font-size: 26px; }
        .diff-bento-cell p { font-size: 13px; line-height: 1.6; margin: 0; }

        .diff-magazine { max-width: 920px; margin-inline: auto; }
        .diff-mag-row { display: flex; gap: 24px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid; }
        .diff-mag-row:last-child { border-bottom: 0; }
        .diff-mag-num { font-size: 36px; font-weight: 800; line-height: 1; flex-shrink: 0; min-width: 60px; }
        .diff-mag-row h3 { font-size: 20px; font-weight: 700; margin: 0 0 6px; }
        .diff-mag-row p { font-size: 14px; line-height: 1.6; margin: 0; }

        .diff-sbs { display: flex; flex-direction: column; gap: 16px; max-width: 920px; margin: 56px auto 0; }
        .diff-sbs-item { display: flex; gap: 24px; align-items: stretch; padding: 20px 24px; border: 1px solid; border-radius: 12px; }
        .diff-sbs-bar { width: 4px; border-radius: 2px; flex-shrink: 0; }
        .diff-sbs-item h3 { font-size: 17px; font-weight: 700; margin: 0 0 6px; }
        .diff-sbs-item p { font-size: 14px; line-height: 1.6; margin: 0; }

        .diff-inline { list-style: none; padding: 0; margin: 40px auto 0; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 920px; }
        .diff-pill { padding: 10px 16px; border: 1px solid; border-radius: 999px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
        .diff-item p { font-size: 14px; line-height: 1.6; margin: 0; }
      `}</style>
    </section>
  );
}
