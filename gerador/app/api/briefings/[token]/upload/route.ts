/**
 * API: POST /api/briefings/[token]/upload
 *
 * Upload público de imagem (logomarca ou foto) para o briefing.
 * Body: FormData com file + field ('logo' | 'photos'[]) + token.
 *
 * Sem auth — o token no path é a credencial. Valida que o briefing existe
 * e ainda não foi pago (paid = read-only).
 *
 * Reutiliza a infraestrutura do /api/assets/upload: bucket 'assets' no
 * Supabase Storage, com fallback data URL em dev.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const field = (form.get('field') as string) || 'photos';
  if (!file) return NextResponse.json({ error: 'file é obrigatório' }, { status: 400 });

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'arquivo maior que 8MB' }, { status: 413 });
  }
  const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'tipo inválido. use PNG/JPG/WebP/GIF' }, { status: 415 });
  }

  // Verifica se briefing já foi pago (read-only)
  if (isSupabaseAdminConfigured()) {
    const supabase = createAdminSupabase();
    const { data: briefing } = await supabase
      .from('briefings')
      .select('status')
      .eq('token', token)
      .maybeSingle();
    if (!briefing) return NextResponse.json({ error: 'briefing não encontrado' }, { status: 404 });
    if (briefing.status === 'paid') {
      return NextResponse.json({ error: 'briefing já foi pago' }, { status: 409 });
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const filename = `briefing-${token}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

  if (!isSupabaseAdminConfigured()) {
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({ ok: true, url: dataUrl, mode: 'dev', field, filename });
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(`briefings/${token}/${filename}`, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: pub } = supabase.storage.from('assets').getPublicUrl(data.path);
  return NextResponse.json({ ok: true, url: pub.publicUrl, mode: 'prod', field, filename, path: data.path });
}
