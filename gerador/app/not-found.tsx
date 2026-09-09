/**
 * Página 404 global.
 *
 * Não revela que existe um painel em /admin — mostra a mesma LP
 * pública com uma mensagem "página não encontrada", mantendo a
 * persona de site público (visitante nem imagina que /admin existe).
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 mb-6">
          <span className="text-3xl">🔍</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Página não encontrada</h1>
        <p className="text-slate-400 mb-8">
          O link que você abriu não existe ou foi removido. Confira o endereço e tente de novo.
        </p>
        <Link
          href="/lp"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
        >
          💬 Falar com a Social Marketing BR
        </Link>
      </div>
    </div>
  );
}
