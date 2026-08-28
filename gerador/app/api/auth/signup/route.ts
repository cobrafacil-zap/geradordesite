/**
 * POST /api/auth/signup — cadastro com email/senha.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
  }
  try {
    const { email, password, fullName } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'email e password são obrigatórios' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'senha deve ter ao menos 6 caracteres' }, { status: 400 });
    }
    const supabase = createRouteSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '' } },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, user: { id: data.user?.id, email: data.user?.email } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'erro' }, { status: 500 });
  }
}
