/**
 * API: GET /api/briefings/list
 *
 * Lista briefings do owner (admin logado).
 * Suporta ?status=pending|paid|expired e ?limit=N.
 *
 * Auth: obrigatória.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, briefings: [], devMode: true });
  }

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'não autenticado' }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const limit = Number(url.searchParams.get('limit') || 50);

  let q = supabase
    .from('briefings')
    .select('id, token, status, client_name, whatsapp, amount_cents, paid_at, created_at, project_id')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(Math.min(limit, 200));

  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, briefings: data || [] });
}
