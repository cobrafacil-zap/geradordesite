/**
 * POST /api/projects/[id]/duplicate — duplica projeto + última versão.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Carrega original
  const { data: orig } = await supabase
    .from('projects')
    .select('*, project_versions!current_version_id(*)')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();
  if (!orig) return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });

  const version = (orig as any).project_versions;

  // Cria novo projeto
  const { data: novo, error: pErr } = await supabase
    .from('projects')
    .insert({
      owner_id: user.id,
      name: orig.name + ' (cópia)',
      template_id: orig.template_id,
      status: 'draft',
    })
    .select()
    .single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

  // Cria versão clonada
  if (version) {
    const { data: novaVersao } = await supabase
      .from('project_versions')
      .insert({
        project_id: novo.id,
        label: 'v1',
        schema_json: version.schema_json,
        theme_json: version.theme_json,
        pages_json: version.pages_json,
        assets_json: version.assets_json,
      })
      .select()
      .single();
    if (novaVersao) {
      await supabase
        .from('projects')
        .update({ current_version_id: novaVersao.id })
        .eq('id', novo.id);
    }
  }

  return NextResponse.json({ ok: true, project: novo });
}
