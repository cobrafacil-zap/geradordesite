'use client';

import { RendererProps } from './registry';

export function HeroSimple({ content, theme }: RendererProps) {
  const title = (content?.title as string) || '';
  const subtitle = (content?.subtitle as string) || '';
  const breadcrumb = (content?.breadcrumb as string) || '';
  const image = (content?.image as string) || '';

  return (
    <section className="hero-simple" style={{ background: theme.surface }}>
      <div className="wrap">
        {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
        <h1 style={{ color: theme.text }}>{title}</h1>
        {subtitle && <p style={{ color: theme.textMuted }}>{subtitle}</p>}
      </div>
      <style>{`
        .hero-simple { padding: 80px 0 64px; text-align: center; }
        .hero-simple .wrap { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .hero-simple .breadcrumb { font-size: 13px; color: var(--c-text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px; font-weight: 600; }
        .hero-simple h1 { font-size: clamp(36px, 4.5vw, 56px); font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.1; }
        .hero-simple p { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; margin: 0; max-width: 720px; margin-inline: auto; }
      `}</style>
    </section>
  );
}
