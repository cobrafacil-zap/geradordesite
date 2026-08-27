'use client';

import { RendererProps, waLink } from './registry';

/**
 * Header — 10 variantes
 * centered, centered-dark, sticky-dark, split, sticky-light, transparent-dark, minimal-dark, ecommerce, simple, mega
 */
export function Header({ content, theme, nav = [], siteName = 'Sua Empresa' }: RendererProps) {
  const variant = (content?.variant as string) || 'centered';
  const whatsapp = (content?.whatsapp as string) || '';
  const phone = (content?.phone as string) || '';
  const logo = content?.logo as string | undefined;
  const ctaText = (content?.ctaText as string) || 'Fale Conosco';

  const links = nav.length > 0 ? nav : [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Contato', href: '/contato' },
  ];

  // Layout variants
  const styleVar = {
    '--c-primary': theme.primary,
    '--c-accent': theme.accent,
  } as React.CSSProperties;

  const onDark = ['centered-dark', 'sticky-dark', 'transparent-dark', 'minimal-dark'].includes(variant);

  const baseClass = `site-header variant-${variant} ${onDark ? 'on-dark' : 'on-light'}`;

  return (
    <header className={baseClass} style={{ ...styleVar, ['--c-bg' as any]: onDark ? theme.secondary : theme.background }}>
      <div className="wrap nav-in">
        <a href="/" className="logo">
          {logo ? (
            <img src={logo} alt={siteName} />
          ) : (
            <span className="logo-text">{siteName}</span>
          )}
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          {phone && <a href={`tel:${phone.replace(/\D/g, '')}`} className="nav-phone">{phone}</a>}
          <a href={waLink(whatsapp)} target="_blank" rel="noopener" className="nav-cta">{ctaText}</a>
        </div>
      </div>
      <style>{headerStyles}</style>
    </header>
  );
}

const headerStyles = `
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--c-bg, #fff);
  border-bottom: 1px solid rgba(0,0,0,.06);
  backdrop-filter: blur(12px);
}
.site-header.on-dark {
  background: rgba(15,23,42,0.92);
  border-bottom: 1px solid rgba(255,255,255,.08);
  color: #fff;
}
.site-header .wrap.nav-in {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.site-header .logo { display:flex; align-items:center; gap:10px; font-weight:700; font-size:18px; text-decoration:none; color:inherit; }
.site-header .logo img { max-height: 36px; width: auto; }
.site-header .logo-text { letter-spacing: -0.01em; }
.site-header .nav-links { display: flex; gap: 28px; flex: 1; justify-content: center; }
.site-header .nav-links a { color: inherit; opacity: .85; text-decoration: none; font-weight: 500; font-size: 15px; transition: opacity .15s; }
.site-header .nav-links a:hover { opacity: 1; }
.site-header .nav-actions { display: flex; align-items: center; gap: 14px; }
.site-header .nav-phone { font-size: 14px; opacity: .8; text-decoration: none; color: inherit; }
.site-header .nav-cta {
  background: var(--c-primary, #0f172a);
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: filter .15s;
}
.site-header .nav-cta:hover { filter: brightness(1.1); }

.site-header.variant-transparent-dark {
  position: absolute;
  background: transparent;
  border-bottom: none;
  width: 100%;
}
.site-header.variant-sticky-dark { position: sticky; background: rgba(15,23,42,0.98); }

@media (max-width: 768px) {
  .site-header .nav-links { display: none; }
  .site-header .nav-phone { display: none; }
  .site-header .wrap.nav-in { padding: 12px 16px; }
}
`;
