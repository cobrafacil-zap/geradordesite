'use client';

import { RendererProps, waLink } from './registry';

/**
 * Footer — 8 variantes
 */
export function Footer({ content, theme, nav = [], siteName = 'Sua Empresa' }: RendererProps) {
  const variant = (content?.variant as string) || 'corporate';
  const whatsapp = (content?.whatsapp as string) || '';
  const phone = (content?.phone as string) || '';
  const email = (content?.email as string) || '';
  const address = (content?.address as string) || '';
  const hours = (content?.hours as string) || '';
  const social = (content?.social as Record<string, string>) || {};
  const cnpj = (content?.cnpj as string) || '';
  const slogan = (content?.slogan as string) || '';

  const year = new Date().getFullYear();

  return (
    <footer className={`site-footer variant-${variant}`}>
      <div className="wrap">
        <div className="ft-grid">
          <div className="ft-brand">
            <div className="ft-logo">{siteName}</div>
            {slogan && <p className="ft-slogan">{slogan}</p>}
            {address && <p className="ft-line">{address}</p>}
            {hours && <p className="ft-line">{hours}</p>}
          </div>
          <div className="ft-col">
            <h4>Navegação</h4>
            <ul>
              {(nav.length > 0 ? nav : [
                { label: 'Início', href: '/' },
                { label: 'Sobre', href: '/sobre' },
                { label: 'Contato', href: '/contato' },
              ]).map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="ft-col">
            <h4>Contato</h4>
            <ul>
              {phone && <li><a href={`tel:${phone.replace(/\D/g, '')}`}>{phone}</a></li>}
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {whatsapp && <li><a href={waLink(whatsapp)} target="_blank" rel="noopener">WhatsApp</a></li>}
            </ul>
          </div>
          {(social.instagram || social.facebook || social.youtube) && (
            <div className="ft-col">
              <h4>Redes</h4>
              <ul>
                {social.instagram && <li><a href={social.instagram} target="_blank" rel="noopener">Instagram</a></li>}
                {social.facebook && <li><a href={social.facebook} target="_blank" rel="noopener">Facebook</a></li>}
                {social.youtube && <li><a href={social.youtube} target="_blank" rel="noopener">YouTube</a></li>}
              </ul>
            </div>
          )}
        </div>
        <div className="ft-bottom">
          <p>© {year} {siteName}. Todos os direitos reservados.</p>
          {cnpj && <p>CNPJ: {cnpj}</p>}
        </div>
      </div>
      {whatsapp && (
        <a href={waLink(whatsapp)} target="_blank" rel="noopener" className="wa-float" aria-label="WhatsApp">
          <span>💬</span>
        </a>
      )}
      <style>{footerStyles}</style>
    </footer>
  );
}

const footerStyles = `
.site-footer {
  background: var(--c-secondary, #0f172a);
  color: rgba(255,255,255,.85);
  padding: 64px 0 24px;
  position: relative;
}
.site-footer .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.site-footer .ft-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
.site-footer .ft-logo { font-weight: 700; font-size: 20px; color: #fff; margin-bottom: 14px; }
.site-footer .ft-slogan { font-size: 14px; line-height: 1.6; opacity: .8; margin: 0 0 16px; max-width: 320px; }
.site-footer .ft-line { font-size: 14px; line-height: 1.6; opacity: .7; margin: 0 0 6px; }
.site-footer h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; margin: 0 0 16px; opacity: .9; }
.site-footer ul { list-style: none; padding: 0; margin: 0; }
.site-footer li { margin-bottom: 10px; }
.site-footer a { color: rgba(255,255,255,.7); text-decoration: none; font-size: 14px; transition: color .15s; }
.site-footer a:hover { color: #fff; }
.site-footer .ft-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,.08);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  opacity: .6;
}
.site-footer .ft-bottom p { margin: 0; }

.site-footer.variant-minimal { background: transparent; color: var(--c-text); padding: 48px 0; border-top: 1px solid var(--c-border); }
.site-footer.variant-minimal .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
.site-footer.variant-minimal a { color: var(--c-text); opacity: .7; }
.site-footer.variant-minimal a:hover { color: var(--c-text); opacity: 1; }
.site-footer.variant-minimal .ft-bottom { color: var(--c-text-muted); border-color: var(--c-border); }

.wa-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #22c55e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(34,197,94,.4);
  z-index: 90;
  transition: transform .15s;
}
.wa-float:hover { transform: scale(1.08); }

@media (max-width: 768px) {
  .site-footer .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .site-footer.variant-minimal .ft-grid { grid-template-columns: 1fr; }
}
`;
