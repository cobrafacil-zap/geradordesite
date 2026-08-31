/**
 * API: /api/debug/[id]
 * Retorna o schema_json cru do projeto (autenticado).
 * Usado pra debug — "o que está realmente salvo no banco".
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: project, error } = await supabase
    .from('projects')
    .select('id, current_version_id, project_versions!current_version_id(schema_json, theme_json)')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();

  if (error || !project) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });

  const version: any = (project as any).project_versions;
  const schema: any = version?.schema_json;
  const summary = {
    projectId: project.id,
    current_version_id: project.current_version_id,
    themeStyle: schema?.theme?.style,
    colorsBackground: schema?.theme?.colors?.background,
    colorsText: schema?.theme?.colors?.text,
    colorsSurface: schema?.theme?.colors?.surface,
    pagesCount: schema?.pages?.length,
    pageSlugs: (schema?.pages || []).map((p: any) => p.slug),
    sectionsPerPage: (schema?.pages || []).map((p: any) => ({
      slug: p.slug,
      sections: (p.sections || []).length,
    })),
  };

  return NextResponse.json({ summary, schema });
}
