/**
 * /setup — página de diagnóstico mostrada quando o app não tem Supabase configurado.
 * Ajuda o usuário a entender exatamente o que falta.
 */
import { Check } from 'lucide-react';
import Link from 'next/link';

interface CheckResult {
  name: string;
  ok: boolean;
  hint: string;
}

export const dynamic = 'force-dynamic';

export default function SetupPage() {
  const checks: CheckResult[] = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hint: 'URL do projeto Supabase (Settings → API → Project URL)',
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hint: 'Chave pública (anon public) do Supabase',
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hint: 'Chave privada (service_role) — apenas server-side',
    },
    {
      name: 'GEMINI_API_KEY',
      ok: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      hint: 'Chave grátis em https://aistudio.google.com/apikey',
    },
  ];

  const allOk = checks.every((c) => c.ok);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
              <path d="M3 7l9-4 9 4M3 7l9 4 9-4M3 7v10l9 4m0-14v14m9-14v10l-9 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Fábrica de Sites</h1>
          <p className="text-slate-400">
            {allOk
              ? 'Tudo configurado! Recarregue a página inicial.'
              : 'Complete a configuração para começar a gerar sites'}
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Variáveis de ambiente
          </h2>
          <ul className="space-y-3">
            {checks.map((c) => (
              <li key={c.name} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    c.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {c.ok ? <Check size={12} /> : '!'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-slate-200">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.hint}</div>
                </div>
                <div className={`text-xs font-medium ${c.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {c.ok ? 'OK' : 'faltando'}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3">Como configurar na Vercel</h2>
          <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Abra o painel do projeto em <span className="text-indigo-400">vercel.com</span></li>
            <li>Vá em <strong>Settings → Environment Variables</strong></li>
            <li>Adicione cada variável acima com seu valor</li>
            <li>Faça um novo deploy (ou aguarde o próximo push)</li>
          </ol>
          <div className="mt-4 flex gap-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
            >
              Tentar dashboard →
            </Link>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              Pegar chave Gemini grátis ↗
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Após adicionar as env vars, recarregue esta página.
        </p>
      </div>
    </div>
  );
}