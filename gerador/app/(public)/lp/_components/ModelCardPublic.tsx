'use client';

import { waLink, WHATSAPP } from '../wa';
import type { PublicModel } from '../data';
import { ModelPreviewFrame } from './ModelPreviewFrame';

/**
 * Card público de modelo.
 *
 * Preview = PRIMEIRA TELA REAL do site gerado, dentro de um iframe
 * escalado (scale 0.3 sobre 1280px). Lazy-load: só baixa quando o
 * card entra na viewport. Cada card mostra o Hero real do segmento
 * (HeroA split, HeroB full-bleed, HeroC magazine, HeroD dark, etc)
 * — então cada um dos 10 cards da LP tem uma cara visual realmente
 * diferente já na vitrine.
 */
export function ModelCardPublic({ model }: { model: PublicModel }) {
  const previewHref = `/lp/preview/${model.slug}`;
  const href = waLink(WHATSAPP, model.whatsappMessage);

  return (
    <div className="group rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 backdrop-blur flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40">
      <div className="aspect-[4/3] relative overflow-hidden">
        <ModelPreviewFrame slug={model.slug} color={model.color} label={model.name} />
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white border border-white/10">
            {model.tag}
          </span>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <span className="text-2xl drop-shadow-lg" aria-hidden>
            {model.emoji}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/80 backdrop-blur-sm text-white">
            ✓ Site real
          </span>
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold px-2 py-1 rounded bg-white/90 hover:bg-white text-slate-900 pointer-events-auto"
          >
            Tela cheia ↗
          </a>
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
