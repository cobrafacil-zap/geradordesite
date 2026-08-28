'use client';

import { RendererProps, Check } from './registry';

export function Services({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Nossos Serviços';
  const subtitle = (content?.subtitle as string) || '';
  const items = (content?.items as Array<{ name: string; desc: string; icon?: string }>) || [];

  return (
    <section className="services-section" id="servicos">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{title}</h2>
          {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
        </div>
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
  const items = (content?.items as Array<{ name: string; desc: string }>) || [];

  return (
    <section className="diff-section" style={{ background: theme.surface }}>
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{title}</h2>
          {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
        </div>
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
      </div>
      <style>{`
        .diff-section { padding: 96px 0; }
        .diff-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-top: 56px; }
        .diff-item { display: flex; gap: 16px; align-items: flex-start; }
        .diff-item svg { flex-shrink: 0; color: var(--c-accent, #22c55e); margin-top: 2px; }
        .diff-item h3 { font-size: 17px; font-weight: 700; margin: 0 0 6px; }
        .diff-item p { font-size: 14px; line-height: 1.6; margin: 0; }
      `}</style>
    </section>
  );
}
