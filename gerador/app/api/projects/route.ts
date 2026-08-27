/**
 * API: /api/projects
 * GET — lista projetos do usuário autenticado
 * POST — cria novo projeto (cria versão inicial com schema vazio)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { createAdminSupabase } from '@/lib/supabase';
import { siteSchemaForTemplate } from '@/lib/generator/site-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ projects: [], mode: 'dev' });
  }
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('projects')
      .select('id, name, template_id, status, current_version_id, created_at, updated_at')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ projects: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, templateId, tradeName, segment } = body;
    if (!name) {
      return NextResponse.json({ error: 'name é obrigatório' }, { status: 400 });
    }

    // Gera schema inicial baseado no template (ou vazio se não houver template)
    const initialSchema = templateId
      ? siteSchemaForTemplate(templateId, tradeName || name)
      : null;

    if (!isSupabaseConfigured()) {
      // Modo dev: retorna projeto mock
      return NextResponse.json({
        ok: true,
        project: {
          id: 'dev-' + Date.now(),
          name,
          template_id: templateId || null,
          status: 'draft',
        },
        mode: 'dev',
      });
    }

    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    // Cria projeto + versão inicial em transação lógica
    const { data: project, error: pErr } = await supabase
      .from('projects')
      .insert({ owner_id: user.id, name, template_id: templateId || null, status: 'draft' })
      .select()
      .single();
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

    if (initialSchema) {
      const { data: version, error: vErr } = await supabase
        .from('project_versions')
        .insert({
          project_id: project.id,
          label: 'v1',
          schema_json: initialSchema,
          theme_json: initialSchema.theme,
          pages_json: initialSchema.pages,
          assets_json: [],
        })
        .select()
        .single();
      if (vErr) return NextResponse.json({ error: vErr.message }, { status: 400 });

      // Seta current_version_id
      await supabase
        .from('projects')
        .update({ current_version_id: version.id })
        .eq('id', project.id);
    }

    return NextResponse.json({ ok: true, project });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
