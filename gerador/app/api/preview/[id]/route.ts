/**
 * API: /api/preview/[id]
 * Gera HTML inline do site (a partir do schema da versão atual) e serve como text/html.
 * Usado pelo iframe de preview no editor.
 *
 * Estratégia: renderiza o SiteRenderer em HTML estático (mesma lógica dos componentes
 * de site, mas sem React). Para preview rápido, serve um HTML enxuto que importa Tailwind
 * via CDN e renderiza o site inline.
 *
 * O preview NÃO exige auth server-side — o usuário já está autenticado na página
 * /edit (Server Component), e o id do projeto é um UUID não-enumerável.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { siteRendererToHtml } from '@/lib/generator/render/site-renderer-html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // 1) Sem Supabase configurado → preview placeholder (em dev) ou 503 (em prod)
  if (!isSupabaseConfigured()) {
    const html = buildPlaceholder(
      'Modo dev sem Supabase',
      'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local. ' +
      'Enquanto isso, mostramos um preview estático para você conferir o visual.'
    );
    return htmlResponse(html);
  }

  const supabase = createServerSupabase();

  // 2) Tenta autenticar via cookie de sessão. Em iframe, o cookie DEVERIA vir
  //    (mesma origem). Se não vier, caímos para service-role como fallback.
  const { data: { user } } = await supabase.auth.getUser();

  let project: any = null;
  let version: any = null;

  if (user) {
    const res = await supabase
      .from('projects')
      .select('id, current_version_id')
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .single();
    project = res.data;
  } else {
    // 3) Fallback: usa service-role para localizar o projeto (acesso de leitura).
    //    Isso resolve o caso comum de sessão expirada/iframe sem cookie.
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = await import('@/lib/supabase');
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const res = await admin.from('projects').select('id, current_version_id').eq('id', params.id).single();
      project = res.data;
    }
  }

  if (!project?.current_version_id) {
    const html = buildPlaceholder(
      'Projeto ainda não gerado',
      'Clique em "Gerar site" para criar a primeira versão. O preview aparecerá aqui automaticamente.'
    );
    return htmlResponse(html);
  }

  // Carrega o schema da versão (tenta via user, depois admin)
  if (user) {
    const res = await supabase
      .from('project_versions')
      .select('schema_json')
      .eq('id', project.current_version_id)
      .single();
    version = res.data;
  } else {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = await import('@/lib/supabase');
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const res = await admin.from('project_versions').select('schema_json').eq('id', project.current_version_id).single();
      version = res.data;
    }
  }

  if (!version?.schema_json) {
    const html = buildPlaceholder(
      'Versão vazia',
      'A versão atual não tem schema. Gere o site novamente para atualizar o preview.'
    );
    return htmlResponse(html);
  }

  try {
    const html = siteRendererToHtml(version.schema_json);
    return htmlResponse(html);
  } catch (err: any) {
    const html = buildPlaceholder(
      'Erro ao renderizar preview',
      err?.message || String(err)
    );
    return htmlResponse(html);
  }
}

function htmlResponse(html: string) {
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
      // Libera embed em iframe mesmo em dev
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}

function buildPlaceholder(title: string, message: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Preview — ${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center p-8">
  <div class="max-w-xl text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 mb-4">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9-4 9 4M3 7l9 4 9-4M3 7v10l9 4m0-14v14m9-14v10l-9 4"/></svg>
    </div>
    <h1 class="text-2xl font-bold mb-2">${escapeHtml(title)}</h1>
    <p class="text-slate-600 mb-6">${escapeHtml(message)}</p>
    <div class="inline-flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      Preview aguardando conteúdo
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}