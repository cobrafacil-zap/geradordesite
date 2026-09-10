/**
 * /admin/preview/[id] — preview do site editado, em tela cheia.
 *
 * Abre em nova aba a partir do editor (/admin/projects/[id]/edit).
 * Iframe full-screen apontando pra /api/preview/[id].
 * Top bar com "← Voltar pro editor" e seletor de página.
 *
 * Auth: herdada do (admin)/layout.tsx (sem sessão → notFound()).
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Preview — Fábrica de Sites' };

export default async function AdminPreviewPage({ params }: { params: { id: string } }) {
  let projectName = 'Projeto';

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: project } = await supabase
          .from('projects')
          .select('name')
          .eq('id', params.id)
          .eq('owner_id', user.id)
          .single();
        if (!project) notFound();
        projectName = project.name;
      }
    } catch {
      // dev mode sem Supabase — mostra o preview genérico
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-950/85 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <Link
            href={`/admin/projects/${params.id}/edit`}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <span aria-hidden>←</span> Voltar pro editor
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold truncate">{projectName}</span>
            <span className="text-xs text-slate-500">· Preview</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden md:inline">Atualiza em tempo real a cada edição</span>
            <a
              href={`/api/preview/${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200"
              title="Abrir HTML puro em nova aba"
            >
              HTML ↗
            </a>
          </div>
        </div>
      </header>
      <div className="flex-1 relative">
        <iframe
          src={`/api/preview/${params.id}?pageIdx=0`}
          title="Preview do site"
          className="absolute inset-0 w-full h-full bg-white"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
