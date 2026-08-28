'use client';

import { RendererProps } from './registry';

export function Team({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ name: string; role: string; bio?: string; image?: string }>) || [];
  if (items.length === 0) return null;

  return (
    <section className="team-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Nossa equipe'}</h2>
          {content?.subtitle && <p style={{ color: theme.textMuted }}>{content.subtitle as string}</p>}
        </div>
        <div className="team-grid">
          {items.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {m.image ? <img src={m.image} alt={m.name} /> : m.name.charAt(0)}
              </div>
              <h3 style={{ color: theme.text }}>{m.name}</h3>
              <p className="team-role" style={{ color: theme.accent }}>{m.role}</p>
              {m.bio && <p className="team-bio" style={{ color: theme.textMuted }}>{m.bio}</p>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .team-section { padding: 96px 0; background: var(--c-surface, #f8f8fa); }
        .team-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .section-head { text-align: center; margin-bottom: 56px; max-width: 720px; margin-inline: auto; }
        .section-head h2 { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .section-head p { font-size: 17px; line-height: 1.6; margin: 0; }
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; }
        .team-card { text-align: center; }
        .team-avatar { width: 120px; height: 120px; border-radius: 999px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 800; color: #fff; overflow: hidden; }
        .team-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .team-card h3 { font-size: 19px; font-weight: 700; margin: 0 0 4px; }
        .team-role { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px; }
        .team-bio { font-size: 14px; line-height: 1.6; margin: 0; }
      `}</style>
    </section>
  );
}

export function Testimonials({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ name: string; text: string; role?: string }>) || [];
  if (items.length === 0) return null;

  return (
    <section className="testimonials-section">
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'O que dizem nossos clientes'}</h2>
        </div>
        <div className="testimonials-grid">
          {items.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars" style={{ color: theme.accent }}>★★★★★</div>
              <p style={{ color: theme.text }}>&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-meta">
                <strong style={{ color: theme.text }}>{t.name}</strong>
                {t.role && <span style={{ color: theme.textMuted }}>{t.role}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .testimonials-section { padding: 96px 0; }
        .testimonials-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 56px; }
        .testimonial-card { padding: 32px; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 16px; }
        .testimonial-stars { font-size: 18px; letter-spacing: 2px; margin-bottom: 16px; }
        .testimonial-card p { font-size: 16px; line-height: 1.7; margin: 0 0 20px; }
        .testimonial-meta { display: flex; flex-direction: column; gap: 2px; }
        .testimonial-meta strong { font-size: 15px; }
        .testimonial-meta span { font-size: 13px; }
      `}</style>
    </section>
  );
}

export function FAQ({ content, theme }: RendererProps) {
  const items = (content?.items as Array<{ q: string; a: string }>) || [];
  if (items.length === 0) return null;

  return (
    <section className="faq-section" style={{ background: theme.surface }}>
      <div className="wrap">
        <div className="section-head">
          <h2 style={{ color: theme.text }}>{content?.title as string || 'Perguntas frequentes'}</h2>
        </div>
        <div className="faq-list">
          {items.map((f, i) => (
            <details key={i} className="faq-item">
              <summary style={{ color: theme.text }}>{f.q}</summary>
              <p style={{ color: theme.textMuted }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <style>{`
        .faq-section { padding: 96px 0; }
        .faq-section .wrap { max-width: 880px; margin: 0 auto; padding: 0 24px; }
        .section-head { text-align: center; margin-bottom: 48px; }
        .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item { background: #fff; border: 1px solid var(--c-border); border-radius: 12px; padding: 20px 24px; cursor: pointer; }
        .faq-item[open] { border-color: var(--c-accent); }
        .faq-item summary { font-weight: 600; font-size: 16px; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .faq-item summary::after { content: '+'; font-size: 24px; color: var(--c-accent); font-weight: 400; transition: transform .2s; }
        .faq-item[open] summary::after { content: '−'; }
        .faq-item p { margin: 16px 0 0; line-height: 1.6; font-size: 15px; }
      `}</style>
    </section>
  );
}

export function Legal({ content, theme }: RendererProps) {
  const text = (content?.text as string) || 'Política de privacidade padrão.';
  return (
    <section className="legal-section">
      <div className="wrap">
        <h1 style={{ color: theme.text }}>Política de Privacidade</h1>
        <div style={{ color: theme.textMuted }}>
          {text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <style>{`
        .legal-section { padding: 80px 0; }
        .legal-section .wrap { max-width: 800px; margin: 0 auto; padding: 0 24px; }
        .legal-section h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; margin: 0 0 32px; letter-spacing: -0.02em; }
        .legal-section p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
      `}</style>
    </section>
  );
}
