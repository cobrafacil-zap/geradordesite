/**
 * API: /api/projects/[id]/versions
 * GET — lista todas as versões do projeto
 * POST — cria nova versão (checkpoint manual a partir da versão atual)
 * PATCH — body: {versionId} → restaura versão (cria nova versão com aquele conteúdo)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ versions: [] });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Confirma ownership
  const { data: proj } = await supabase
    .from('projects')
    .select('id')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();
  if (!proj) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });

  const { data, error } = await supabase
    .from('project_versions')
    .select('id, label, created_at')
    .eq('project_id', params.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ versions: data || [] });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const label = body.label || ('v' + Date.now());

  const { data: proj } = await supabase
    .from('projects')
    .select('id, current_version_id')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();
  if (!proj) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });

  // Pega conteúdo da versão atual
  const { data: current } = await supabase
    .from('project_versions')
    .select('schema_json, theme_json, pages_json, assets_json')
    .eq('id', proj.current_version_id)
    .single();
  if (!current) return NextResponse.json({ error: 'versão atual inválida' }, { status: 400 });

  // Cria nova versão com mesmo conteúdo (checkpoint)
  const { data: nova, error } = await supabase
    .from('project_versions')
    .insert({
      project_id: proj.id,
      label,
      schema_json: current.schema_json,
      theme_json: current.theme_json,
      pages_json: current.pages_json,
      assets_json: current.assets_json,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from('projects').update({ current_version_id: nova.id }).eq('id', proj.id);
  return NextResponse.json({ ok: true, version: nova });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { versionId } = await req.json();
  if (!versionId) return NextResponse.json({ error: 'versionId é obrigatório' }, { status: 400 });

  const { data: target } = await supabase
    .from('project_versions')
    .select('id, schema_json, theme_json, pages_json, assets_json, project_id')
    .eq('id', versionId)
    .single();
  if (!target) return NextResponse.json({ error: 'versão não encontrada' }, { status: 404 });

  // Confirma que versão pertence ao projeto
  if (target.project_id !== params.id) {
    return NextResponse.json({ error: 'versão não pertence ao projeto' }, { status: 400 });
  }

  // Cria nova versão com conteúdo da target
  const { data: nova, error } = await supabase
    .from('project_versions')
    .insert({
      project_id: params.id,
      label: 'restore ' + new Date().toISOString().slice(0, 16),
      schema_json: target.schema_json,
      theme_json: target.theme_json,
      pages_json: target.pages_json,
      assets_json: target.assets_json,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from('projects').update({ current_version_id: nova.id }).eq('id', params.id);
  return NextResponse.json({ ok: true, version: nova });
}
