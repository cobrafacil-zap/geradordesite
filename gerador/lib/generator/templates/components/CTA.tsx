'use client';

import { RendererProps, waLink } from './registry';

export function CTA({ content, theme }: RendererProps) {
  const title = (content?.title as string) || 'Pronto para começar?';
  const subtitle = (content?.subtitle as string) || 'Entre em contato e solicite um orçamento sem compromisso.';
  const ctaText = (content?.ctaText as string) || 'Fale pelo WhatsApp';
  const whatsapp = (content?.whatsapp as string) || '';

  return (
    <section className="cta-section" style={{ background: theme.primary, color: '#fff' }}>
      <div className="wrap cta-inner">
        <h2 style={{ color: '#fff' }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,.85)' }}>{subtitle}</p>
        {whatsapp && (
          <a href={waLink(whatsapp)} target="_blank" rel="noopener" className="cta-btn">
            {ctaText}
          </a>
        )}
      </div>
      <style>{`
        .cta-section { padding: 80px 0; text-align: center; }
        .cta-section .wrap { max-width: 720px; margin: 0 auto; padding: 0 24px; }
        .cta-section h2 { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; }
        .cta-section p { font-size: 17px; line-height: 1.6; margin: 0 0 32px; }
        .cta-btn { display: inline-flex; align-items: center; background: #fff; color: var(--c-primary); padding: 16px 32px; border-radius: 999px; font-weight: 700; font-size: 16px; text-decoration: none; transition: transform .15s; }
        .cta-btn:hover { transform: translateY(-2px); }
      `}</style>
    </section>
  );
}

export function Contact({ content, theme }: RendererProps) {
  const whatsapp = (content?.whatsapp as string) || '';
  const phone = (content?.phone as string) || '';
  const email = (content?.email as string) || '';
  const address = (content?.address as string) || '';
  const hours = (content?.hours as string) || '';

  return (
    <section className="contact-section" id="contato">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 style={{ color: theme.text }}>{content?.title as string || 'Entre em contato'}</h2>
            <p style={{ color: theme.textMuted }}>{content?.subtitle as string || 'Estamos prontos para atender você.'}</p>
            <div className="contact-channels">
              {phone && (
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="contact-item">
                  <strong>Telefone</strong>
                  <span>{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a href={waLink(whatsapp)} target="_blank" rel="noopener" className="contact-item">
                  <strong>WhatsApp</strong>
                  <span>{whatsapp}</span>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="contact-item">
                  <strong>E-mail</strong>
                  <span>{email}</span>
                </a>
              )}
              {address && (
                <div className="contact-item">
                  <strong>Endereço</strong>
                  <span>{address}</span>
                </div>
              )}
              {hours && (
                <div className="contact-item">
                  <strong>Horário</strong>
                  <span>{hours}</span>
                </div>
              )}
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); if (whatsapp) window.open(waLink(whatsapp, 'Olá, vim pelo site e gostaria de mais informações.'), '_blank'); }}>
            <input type="text" placeholder="Seu nome" required />
            <input type="tel" placeholder="Seu telefone" required />
            <input type="email" placeholder="Seu e-mail" />
            <textarea placeholder="Sua mensagem" rows={4} required />
            <button type="submit">Enviar mensagem</button>
          </form>
        </div>
      </div>
      <style>{`
        .contact-section { padding: 96px 0; }
        .contact-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .contact-info h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; }
        .contact-info p { font-size: 16px; line-height: 1.6; margin: 0 0 32px; }
        .contact-channels { display: flex; flex-direction: column; gap: 20px; }
        .contact-item { display: flex; flex-direction: column; gap: 4px; text-decoration: none; color: inherit; }
        .contact-item strong { font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--c-text-muted); font-weight: 600; }
        .contact-item span { font-size: 16px; font-weight: 500; color: var(--c-text); }
        .contact-form { display: flex; flex-direction: column; gap: 12px; padding: 32px; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 16px; }
        .contact-form input, .contact-form textarea { padding: 12px 16px; border: 1px solid var(--c-border); border-radius: 8px; font-family: inherit; font-size: 15px; background: #fff; color: var(--c-text); }
        .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--c-accent); }
        .contact-form button { background: var(--c-primary); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: filter .15s; }
        .contact-form button:hover { filter: brightness(1.1); }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  );
}

export function Map({ content, theme }: RendererProps) {
  const address = (content?.address as string) || '';
  return (
    <section className="map-section">
      <div className="wrap">
        <div className="map-frame" style={{ background: theme.surface, borderColor: theme.border }}>
          <span style={{ color: theme.textMuted }}>{address || 'Mapa interativo'}</span>
        </div>
      </div>
      <style>{`
        .map-section { padding: 32px 0 96px; }
        .map-section .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .map-frame { aspect-ratio: 21/9; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </section>
  );
}
