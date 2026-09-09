'use client';

import { useEffect, useRef, useState } from 'react';
import { waLink, WHATSAPP } from '../wa';
import type { PublicModel } from '../data';

/**
 * Card público de modelo — sem auth, sem CTA "Usar".
 *
 * Estratégia de preview:
 * 1. SEMPRE mostra um preview composto: gradiente da cor do modelo + emoji
 *    grande + headline simulada + 3 "chips" de seção. Isso já é rico o
 *    suficiente pra diferenciar modelos sem gastar banda.
 * 2. AO HOVER (desktop) ou ao tocar (mobile) → carrega o iframe real via
 *    /api/template-preview/{slug} com IntersectionObserver + flag hover.
 *    Se o usuário não interagir, o iframe nunca é requisitado.
 * 3. Lazy absoluto: só renderiza iframe se a) está em viewport, b) hover/tap.
 *
 * Resultado: o visitante já vê diferença visual entre os 9 cards (cores,
 * ícones, headlines), e quem quiser "ver de verdade" passa o mouse.
 */
export function ModelCardPublic({ model }: { model: PublicModel }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const previewUrl = `/api/template-preview/${model.slug}`;

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '150px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldRenderIframe = inView && hovered;
  const href = waLink(WHATSAPP, model.whatsappMessage);

  // Gradiente derivado da cor do modelo — sempre visível.
  const bgGradient = `linear-gradient(135deg, ${model.color} 0%, ${model.color}cc 60%, ${model.color}66 100%)`;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      className="group rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 backdrop-blur flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {/* Camada 1: preview composto (sempre visível) */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between text-white"
          style={{ background: bgGradient }}
        >
          {/* Topo: tag + emoji */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm text-white">
              {model.tag}
            </span>
            <span className="text-3xl drop-shadow-lg" aria-hidden>
              {model.emoji}
            </span>
          </div>
          {/* Centro: headline simulada */}
          <div className="space-y-1">
            <p className="text-base md:text-lg font-extrabold leading-tight whitespace-pre-line drop-shadow-md">
              {model.previewHeadline}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
          {/* Rodapé: chips de seção + "demo" */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white">
              Demo
            </span>
            <span className="text-[9px] text-white/80">Passe o mouse pra ver o site real</span>
          </div>
        </div>

        {/* Camada 2: iframe real (só no hover) */}
        {shouldRenderIframe && (
          <iframe
            key={model.slug}
            src={previewUrl}
            title={`Preview ${model.name}`}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full border-0 bg-white transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: 'scale(0.32)',
              transformOrigin: 'top left',
              width: '312%',
              height: '312%',
            }}
          />
        )}

        {/* Indicador de "carregando preview" */}
        {shouldRenderIframe && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-xl animate-pulse">
              {model.emoji}
            </div>
          </div>
        )}
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
