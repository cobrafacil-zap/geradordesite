'use client';

import { waLink, WHATSAPP } from '../wa';
import type { PublicModel } from '../data';

/**
 * Card público de modelo — sem auth, sem iframe inline pesado.
 *
 * Estratégia de preview:
 * 1. SEMPRE mostra um preview composto: gradiente da cor do modelo + emoji
 *    grande + headline simulada + 3 "chips" de seção. Diferencia os 10
 *    modelos visualmente sem gastar banda.
 * 2. Botão "🔍 Ver preview" abre /lp/preview/{slug} em nova aba com o
 *    template em viewport cheia.
 * 3. ZERO iframes inline no card → página muito mais leve.
 */
export function ModelCardPublic({ model }: { model: PublicModel }) {
  const bgGradient = `linear-gradient(135deg, ${model.color} 0%, ${model.color}cc 60%, ${model.color}66 100%)`;
  const previewHref = `/lp/preview/${model.slug}`;
  const href = waLink(WHATSAPP, model.whatsappMessage);

  return (
    <div className="group rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 backdrop-blur flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between text-white"
          style={{ background: bgGradient }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm text-white">
              {model.tag}
            </span>
            <span className="text-3xl drop-shadow-lg" aria-hidden>
              {model.emoji}
            </span>
          </div>
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
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white">
              Demo
            </span>
            <span className="text-[9px] text-white/80">Clique em "Ver preview" pra abrir o site real</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{model.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pronto em 48h · R$ 197</p>
        </div>
        <div className="flex gap-2">
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-100 text-sm font-medium transition-colors"
          >
            🔍 Ver preview
          </a>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
          >
            💬 Quero
          </a>
        </div>
      </div>
    </div>
  );
}
