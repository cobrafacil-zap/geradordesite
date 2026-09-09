'use client';

import { useEffect, useRef, useState } from 'react';
import { waLink, WHATSAPP } from '../wa';
import type { PublicModel } from '../data';

const FALLBACK_GRADIENT = (color: string) =>
  `linear-gradient(135deg, ${color}22 0%, ${color}66 100%)`;

/**
 * Card público de modelo — sem auth, sem CTA "Usar".
 * Mostra miniatura (iframe lazy com /api/template-preview/lp-{slug}) e botão
 * verde WhatsApp que abre conversa com mensagem pré-preenchida.
 */
export function ModelCardPublic({ model }: { model: PublicModel }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const previewUrl = `/api/template-preview/${model.slug}`;

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const href = waLink(WHATSAPP, model.whatsappMessage);

  return (
    <div className="rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800 backdrop-blur flex flex-col">
      <div
        ref={wrapRef}
        className="aspect-[4/3] relative overflow-hidden bg-slate-900"
        style={{ background: FALLBACK_GRADIENT(model.color) }}
      >
        {shouldLoad && (
          <iframe
            key={model.slug}
            src={previewUrl}
            title={`Preview ${model.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: 'scale(0.32)',
              transformOrigin: 'top left',
              width: '312%',
              height: '312%',
              pointerEvents: 'none',
            }}
          />
        )}
        {shouldLoad && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20 animate-pulse">
              {model.emoji}
            </div>
          </div>
        )}
        <span className="absolute top-2 left-2 z-10 text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-900/80 text-slate-100 border border-slate-700">
          {model.tag}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{model.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pronto em 48h · R$ 197</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
        >
          💬 Quero esse modelo
        </a>
      </div>
    </div>
  );
}
