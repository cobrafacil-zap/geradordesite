/**
 * API: POST /api/assets/upload
 *
 * Upload de imagem para Supabase Storage.
 * Body: FormData com file + projectId (opcional) + path (opcional).
 *
 * Estratégia:
 *  - Se Supabase configurado → upload para bucket "assets" (público).
 *  - Senão → fallback dev: retorna data URL.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'file é obrigatório' }, { status: 400 });

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'arquivo maior que 8MB' }, { status: 413 });
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'tipo inválido. use PNG/JPG/WebP/GIF/SVG' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    if (!isSupabaseAdminConfigured()) {
      // Modo dev: retorna data URL
      const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({ ok: true, url: dataUrl, mode: 'dev', filename });
    }

    const supabase = createAdminSupabase();
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: pub } = supabase.storage.from('assets').getPublicUrl(data.path);
    return NextResponse.json({ ok: true, url: pub.publicUrl, mode: 'prod', filename, path: data.path });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'falha no upload' }, { status: 500 });
  }
}
