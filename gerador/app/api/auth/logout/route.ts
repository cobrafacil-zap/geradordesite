/**
 * POST /api/auth/logout — encerra sessão.
 */
import { NextResponse } from 'next/server';
import { createRouteSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const supabase = createRouteSupabase();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: true }); // idempotente
  }
}
