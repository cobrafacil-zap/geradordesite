'use client';

import { RendererProps } from './registry';

export function About({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Sobre nós';
  const text = (content?.text as string) || '';
  const image = (content?.image as string) || '';
  const values = (content?.values as Array<{ name: string; desc: string }>) || [];

  return (
    <section className="about-section" id="sobre">
      <div className="wrap about-grid">
        <div className="about-img">
          {image ? (
            <img src={image} alt="" />
          ) : (
            <div className="about-placeholder" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
          )}
        </div>
        <div className="about-copy">
          <h2 style={{ color: theme.text }}>{title}</h2>
          <p style={{ color: theme.textMuted }}>{text}</p>
          {values.length > 0 && (
            <div className="about-values">
              {values.map((v, i) => (
                <div key={i} className="about-value">
                  <strong style={{ color: theme.text }}>{v.name}</strong>
                  <span style={{ color: theme.textMuted }}>{v.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .about-section { padding: 96px 0; }
        .about-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: center; }
        .about-img img, .about-placeholder { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 16px; }
        .about-copy h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 20px; letter-spacing: -0.02em; }
        .about-copy p { font-size: 16px; line-height: 1.7; margin: 0 0 24px; }
        .about-values { display: grid; gap: 14px; margin-top: 24px; }
        .about-value { display: flex; gap: 12px; flex-direction: column; }
        .about-value strong { font-size: 16px; font-weight: 700; }
        .about-value span { font-size: 14px; line-height: 1.5; }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  );
}

export function History({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ year: string; text: string }>) || [];
  return (
    <section className="history-section">
      <div className="wrap">
        <h2 style={{ color: theme.text }}>{content?.title as string || 'Nossa história'}</h2>
        <div className="timeline">
          {items.map((it, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-year" style={{ color: theme.accent }}>{it.year}</div>
              <p style={{ color: theme.textMuted }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .history-section { padding: 96px 0; }
        .history-section .wrap { max-width: 880px; margin: 0 auto; padding: 0 24px; }
        .history-section h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0 0 48px; text-align: center; letter-spacing: -0.02em; }
        .timeline { display: flex; flex-direction: column; gap: 32px; border-left: 2px solid var(--c-border); padding-left: 32px; }
        .timeline-item { position: relative; }
        .timeline-item::before { content: ''; position: absolute; left: -38px; top: 8px; width: 12px; height: 12px; border-radius: 999px; background: var(--c-accent); }
        .timeline-year { font-weight: 800; font-size: 18px; margin-bottom: 6px; }
      `}</style>
    </section>
  );
}

export function Stats({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ value: string; label: string }>) || [];
  return (
    <section className="stats-section" style={{ background: theme.primary, color: '#fff' }}>
      <div className="wrap">
        <div className="stats-grid">
          {items.map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .stats-section { padding: 64px 0; }
        .stats-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center; }
        .stat-num { font-size: 48px; font-weight: 800; line-height: 1; }
        .stat-label { font-size: 14px; opacity: .8; margin-top: 8px; }
      `}</style>
    </section>
  );
}
