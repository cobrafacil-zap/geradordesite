/**
 * /lp/preview/[slug] — preview público de um modelo, em tela cheia.
 *
 * Sem auth. Aberto em nova aba a partir do card na /lp (botão "Ver preview").
 * Iframe em viewport cheia apontando pra /api/template-preview/{slug}.
 *
 * Top bar fixa com:
 *  - "← Voltar" pra /lp
 *  - Nome do modelo (centro)
 *  - "💬 Quero esse modelo" → wa.me pré-preenchido
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PUBLIC_MODELS } from '../../data';
import { waLink, WHATSAPP } from '../../wa';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Preview do modelo — Social Marketing BR' };

export default function LpPreviewPage({ params }: { params: { slug: string } }) {
  const model = PUBLIC_MODELS.find((m) => m.slug === params.slug);
  if (!model) notFound();

  const href = waLink(WHATSAPP, model.whatsappMessage);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-950/85 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <Link
            href="/lp"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <span aria-hidden>←</span> Voltar
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl" aria-hidden>{model.emoji}</span>
            <h1 className="text-sm font-semibold truncate">{model.name}</h1>
            <span className="hidden md:inline text-xs text-slate-500">· {model.tag}</span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
          >
            💬 Quero esse modelo
          </a>
        </div>
      </header>
      <div className="flex-1 relative">
        <iframe
          src={`/api/template-preview/${model.slug}`}
          title={`Preview ${model.name}`}
          className="absolute inset-0 w-full h-full bg-white"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
