/**
 * API: /api/assets
 * GET — lista assets do usuário
 * DELETE — remove asset do Storage
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ assets: [], mode: 'dev' });
  }
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.storage.from('assets').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const assets = (data || []).map((f) => {
      const { data: pub } = supabase.storage.from('assets').getPublicUrl(f.name);
      return {
        id: f.id,
        name: f.name,
        url: pub.publicUrl,
        size: f.metadata?.size ?? 0,
        mime: f.metadata?.mimetype ?? 'image/*',
        createdAt: f.created_at,
      };
    });
    return NextResponse.json({ assets });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'name é obrigatório' }, { status: 400 });
    const supabase = createAdminSupabase();
    const { error } = await supabase.storage.from('assets').remove([name]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
