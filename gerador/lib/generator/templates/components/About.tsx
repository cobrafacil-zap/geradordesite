'use client';

import { RendererProps } from './registry';

export function About({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Sobre nós';
  const text = (content?.text as string) || '';
  const image = (content?.image as string) || '';
  const values = (content?.values as Array<{ name: string; desc: string }>) || [];
  const variant = (content?.variant as string) || 'side';

  return (
    <section className={`about-section variant-${variant}`} id="sobre">
      {variant === 'side' && (
        <div className="wrap about-grid">
          <div className="about-img">
            {image ? <img src={image} alt="" /> : (
              <div className="about-placeholder" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
            )}
          </div>
          <div className="about-copy">
            <h2 style={{ color: theme.text }}>{title}</h2>
            <p style={{ color: theme.textMuted }}>{text}</p>
          </div>
        </div>
      )}
      {variant === 'centered' && (
        <div className="wrap about-centered">
          <h2 style={{ color: theme.text }}>{title}</h2>
          <p style={{ color: theme.textMuted }}>{text}</p>
        </div>
      )}
      {variant === 'magazine' && (
        <div className="wrap about-magazine">
          <div className="about-mag-img">
            {image ? <img src={image} alt="" /> : (
              <div className="about-placeholder" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
            )}
          </div>
          <div className="about-mag-quote" style={{ color: theme.text }}>"{text.split('.').slice(0, 2).join('. ')}."</div>
        </div>
      )}
      {variant === 'split-wide' && (
        <div className="wrap about-split-wide">
          <div className="about-sw-text">
            <h2 style={{ color: theme.text }}>{title}</h2>
          </div>
          <div className="about-sw-body">
            <p style={{ color: theme.textMuted }}>{text}</p>
          </div>
        </div>
      )}
      {variant === 'image-full' && (
        <div className="about-full-img">
          {image ? <img src={image} alt="" /> : (
            <div className="about-placeholder" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
          )}
          <div className="about-full-overlay">
            <div className="wrap">
              <h2 style={{ color: '#fff' }}>{title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>{text}</p>
            </div>
          </div>
        </div>
      )}
      {variant === 'numbered' && (
        <div className="wrap about-numbered">
          <h2 style={{ color: theme.text }}>{title}</h2>
          <div className="about-num-grid">
            {text.split('.').filter(Boolean).slice(0, 4).map((sentence, i) => (
              <div key={i} className="about-num-item">
                <span className="about-num-num" style={{ color: theme.accent }}>0{i + 1}</span>
                <p style={{ color: theme.textMuted }}>{sentence.trim()}.</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {values.length > 0 && variant === 'side' && (
        <div className="wrap about-values-wrap">
          <div className="about-values">
            {values.map((v, i) => (
              <div key={i} className="about-value">
                <strong style={{ color: theme.text }}>{v.name}</strong>
                <span style={{ color: theme.textMuted }}>{v.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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

        .variant-centered .about-centered { text-align: center; max-width: 820px; margin-inline: auto; }
        .variant-centered h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 24px; letter-spacing: -0.02em; }
        .variant-centered p { font-size: 18px; line-height: 1.7; margin: 0; }

        .variant-magazine .about-magazine { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .about-mag-img img, .about-mag-img .about-placeholder { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 16px; }
        .about-mag-quote { font-size: clamp(28px, 3vw, 40px); font-weight: 700; line-height: 1.3; font-style: italic; }
        @media (max-width: 768px) { .variant-magazine .about-magazine { grid-template-columns: 1fr; } }

        .variant-split-wide .about-split-wide { display: grid; grid-template-columns: 1fr 2fr; gap: 64px; align-items: start; }
        .variant-split-wide h2 { font-size: clamp(28px, 3vw, 40px); font-weight: 800; margin: 0; position: sticky; top: 96px; letter-spacing: -0.02em; }
        .variant-split-wide p { font-size: 18px; line-height: 1.8; margin: 0; }
        @media (max-width: 768px) { .variant-split-wide .about-split-wide { grid-template-columns: 1fr; } .variant-split-wide h2 { position: static; } }

        .variant-image-full { padding: 0; }
        .about-full-img { position: relative; min-height: 600px; }
        .about-full-img img, .about-full-img .about-placeholder { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .about-full-overlay { position: relative; padding: 120px 0 80px; background: linear-gradient(0deg, rgba(0,0,0,0.75), rgba(0,0,0,0.3)); min-height: 600px; display: flex; align-items: flex-end; }
        .about-full-overlay h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; }
        .about-full-overlay p { font-size: 18px; line-height: 1.6; margin: 0; max-width: 720px; }

        .variant-numbered h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 48px; letter-spacing: -0.02em; text-align: center; }
        .about-num-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 1080px; margin-inline: auto; }
        .about-num-item { display: flex; gap: 20px; align-items: flex-start; }
        .about-num-num { font-size: 32px; font-weight: 800; line-height: 1; min-width: 56px; }
        .about-num-item p { font-size: 15px; line-height: 1.7; margin: 0; }
        @media (max-width: 768px) { .about-num-grid { grid-template-columns: 1fr; } }
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
  const variant = (content?.variant as string) || 'default';
  const title = (content?.title as string) || '';
  const subtitle = (content?.subtitle as string) || '';
  return (
    <section className={`stats-section variant-${variant}`}>
      {variant === 'default' && (
        <div className="stats-bg" style={{ background: theme.primary, color: '#fff' }}>
          <div className="wrap">
            {title && <h2 className="stats-title">{title}</h2>}
            <div className="stats-grid">
              {items.map((s, i) => (
                <div key={i} className="stat">
                  <div className="stat-num">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {variant === 'bar' && (
        <div className="wrap">
          <div className="stats-bar">
            {items.map((s, i) => (
              <div key={i} className="stat-bar-item" style={{ borderColor: theme.border }}>
                <div className="stat-num" style={{ color: theme.accent }}>{s.value}</div>
                <div className="stat-label" style={{ color: theme.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {variant === 'hero' && (
        <div className="stats-hero" style={{ background: theme.surface }}>
          <div className="wrap">
            <div className="stats-hero-row">
              {items.map((s, i) => (
                <div key={i} className="stat-hero-item">
                  <div className="stat-num-xl" style={{ color: theme.primary }}>{s.value}</div>
                  <div className="stat-label" style={{ color: theme.textMuted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {variant === 'inline' && (
        <div className="wrap">
          <div className="stats-inline">
            {items.map((s, i) => (
              <span key={i} className="stat-inline-item" style={{ color: theme.text }}>
                <strong style={{ color: theme.accent }}>{s.value}</strong>
                <span style={{ color: theme.textMuted }}>{s.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {variant === 'cards' && (
        <div className="wrap">
          {title && <h2 className="stats-title-out" style={{ color: theme.text, textAlign: 'center' }}>{title}</h2>}
          <div className="stats-cards">
            {items.map((s, i) => (
              <div key={i} className="stat-card" style={{ background: theme.surface, borderColor: theme.border }}>
                <div className="stat-num" style={{ color: theme.accent }}>{s.value}</div>
                <div className="stat-label" style={{ color: theme.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {variant === 'split' && (
        <div className="wrap">
          <div className="stats-split">
            <div className="stats-split-title">
              {title && <h2 style={{ color: theme.text }}>{title}</h2>}
              {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
            </div>
            <div className="stats-split-grid">
              {items.map((s, i) => (
                <div key={i} className="stat-split-item" style={{ borderColor: theme.border }}>
                  <div className="stat-num" style={{ color: theme.accent }}>{s.value}</div>
                  <div className="stat-label" style={{ color: theme.textMuted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .stats-section { padding: 64px 0; }
        .stats-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .stats-title { font-size: 28px; font-weight: 800; margin: 0 0 32px; text-align: center; }
        .stats-title-out { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0 0 48px; letter-spacing: -0.02em; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center; }
        .stat-num { font-size: 48px; font-weight: 800; line-height: 1; }
        .stat-num-xl { font-size: clamp(56px, 7vw, 88px); font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
        .stat-label { font-size: 14px; opacity: .8; margin-top: 8px; }

        .stats-bar { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 24px; padding: 24px 0; border-top: 1px solid; border-bottom: 1px solid; border-color: inherit; }
        .stat-bar-item { padding: 16px 24px; text-align: center; }
        .stat-bar-item .stat-num { font-size: 36px; }
        .stat-bar-item .stat-label { font-size: 13px; margin-top: 4px; }

        .stats-hero { padding: 80px 0; }
        .stats-hero-row { display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-around; }
        .stat-hero-item { text-align: center; min-width: 180px; }
        .stat-hero-item .stat-label { font-size: 14px; margin-top: 8px; }

        .stats-inline { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 32px 0; }
        .stat-inline-item { display: inline-flex; gap: 8px; align-items: baseline; font-size: 14px; }
        .stat-inline-item strong { font-size: 24px; font-weight: 800; }

        .stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .stat-card { padding: 32px 24px; border: 1px solid; border-radius: 14px; text-align: center; }
        .stat-card .stat-num { font-size: 40px; }
        .stat-card .stat-label { font-size: 13px; }

        .stats-split { display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; align-items: start; }
        .stats-split-title h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .stats-split-title p { font-size: 16px; line-height: 1.6; margin: 0; }
        .stats-split-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .stat-split-item { padding: 24px 0; border-top: 1px solid; }
        .stat-split-item .stat-num { font-size: 40px; }
        .stat-split-item .stat-label { font-size: 13px; }
        @media (max-width: 768px) { .stats-split { grid-template-columns: 1fr; } .stats-split-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
