/**
 * API: /api/preview/[id]
 * Gera HTML inline do site (a partir do schema da versão atual) e serve como text/html.
 * Usado pelo iframe de preview no editor.
 *
 * Estratégia: renderiza o SiteRenderer em HTML estático (mesma lógica dos componentes
 * de site, mas sem React). Para preview rápido, serve um HTML enxuto que importa Tailwind
 * via CDN e renderiza o site inline.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { siteRendererToHtml } from '@/lib/generator/render/site-renderer-html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return new NextResponse(
      '<!doctype html><html><body style="font-family:sans-serif;padding:40px;background:#0a0a0f;color:#f5f5f7"><h1>Supabase não configurado</h1><p>Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local para habilitar preview.</p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('unauthorized', { status: 401 });
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, current_version_id')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();
  if (!project?.current_version_id) {
    return new NextResponse('projeto sem versão', { status: 404 });
  }

  const { data: version } = await supabase
    .from('project_versions')
    .select('schema_json')
    .eq('id', project.current_version_id)
    .single();
  if (!version?.schema_json) {
    return new NextResponse('versão sem schema', { status: 404 });
  }

  const html = siteRendererToHtml(version.schema_json);
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}
