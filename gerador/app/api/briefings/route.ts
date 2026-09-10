/**
 * API: POST /api/briefings
 *
 * Cria um novo briefing (status: pending) e retorna:
 *   { briefingId, token, checkoutUrl }
 *
 * O admin gera o link, copia e manda no WhatsApp pro cliente.
 * Em dev mode (sem Supabase) → gera token local e usa simulação.
 *
 * Auth: obrigatória (admin logado).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function newToken(): string {
  // 12 chars alfanum, sem chars ambíguos
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let t = '';
  for (let i = 0; i < 12; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

export async function POST(req: NextRequest) {
  let ownerId: string | null = null;
  let devMode = !isSupabaseConfigured();

  if (!devMode) {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'não autenticado' }, { status: 401 });
    }
    ownerId = user.id;
  } else {
    ownerId = 'dev-owner';
  }

  const token = newToken();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const checkoutUrl = `${appUrl}/checkout/${token}`;

  if (devMode) {
    return NextResponse.json({
      ok: true,
      devMode: true,
      briefingId: `dev-${Date.now().toString(36)}`,
      token,
      checkoutUrl,
    });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('briefings')
    .insert({ token, owner_id: ownerId, status: 'pending' })
    .select('id, token')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    briefingId: data.id,
    token: data.token,
    checkoutUrl,
  });
}
