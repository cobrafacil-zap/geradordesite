/**
 * API: /api/projects/[id]
 * GET — busca projeto + versão atual
 * PATCH — atualiza schema da versão atual (autosave)
 * DELETE — remove projeto
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
    .select('*, project_versions!current_version_id(*)')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();

  if (error || !project) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { schema, theme, assets, label } = body;

  // Confirma ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, current_version_id')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();
  if (!project) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });

  // Atualiza versão atual (autosave). Se ainda não tem current_version_id,
  // cria uma nova project_versions com o schema e vincula — antes era um
  // no-op silencioso que retornava { ok: true } sem persistir nada.
  let versionId = project.current_version_id;
  if (!versionId) {
    const { data: created, error: createErr } = await supabase
      .from('project_versions')
      .insert({
        project_id: project.id,
        schema_json: schema || {},
        theme_json: theme || null,
        assets_json: assets ?? [],
        label: label || 'v1',
      })
      .select('id')
      .single();
    if (createErr) {
      return NextResponse.json({ error: 'falha ao criar versão inicial', detail: createErr.message }, { status: 500 });
    }
    versionId = created.id;
    await supabase.from('projects').update({ current_version_id: versionId }).eq('id', project.id);
  } else {
    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (schema) updatePayload.schema_json = schema;
    if (theme) updatePayload.theme_json = theme;
    if (assets !== undefined) updatePayload.assets_json = assets;
    if (label) updatePayload.label = label;
    await supabase
      .from('project_versions')
      .update(updatePayload)
      .eq('id', versionId);
  }
  // Atualiza updated_at do projeto
  await supabase
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', params.id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Remove versões em cascata (manual se RLS não fizer)
  await supabase.from('project_versions').delete().eq('project_id', params.id);
  const { error } = await supabase.from('projects').delete().eq('id', params.id).eq('owner_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
