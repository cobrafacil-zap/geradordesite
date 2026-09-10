'use client';

import Link from 'next/link';

export function ThankYou({ token, paidAt, projectId, devMode }: { token: string; paidAt: string | null; projectId: string | null; devMode: boolean }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Recebemos seu pagamento!</h1>
        <p className="text-slate-300 mb-2 text-sm md:text-base">
          Em até <span className="text-emerald-400 font-semibold">48 horas</span> seu site fica pronto.
        </p>
        <p className="text-slate-400 mb-6 text-sm">
          Vamos te chamar no WhatsApp pra confirmar alguns detalhes antes de começar.
        </p>

        {devMode && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            DEV MODE: simulação. Em produção, o webhook do MP cria o project automaticamente.
          </div>
        )}

        <div className="space-y-3">
          <a
            href="https://wa.me/5543996820296?text=Ol%C3%A1%21%20Acabei%20de%20pagar%20o%20briefing%20do%20meu%20site.%20Pode%20me%20passar%20os%20pr%C3%B3ximos%20passos%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
          >
            💬 Falar com a Social Marketing BR
          </a>
          <Link
            href="/lp"
            className="block text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Voltar para a página inicial
          </Link>
        </div>

        {projectId && (
          <p className="mt-8 text-[10px] text-slate-600 font-mono">ID: {projectId}</p>
        )}
        <p className="mt-1 text-[10px] text-slate-600 font-mono">Token: {token}</p>
      </div>
    </div>
  );
}
