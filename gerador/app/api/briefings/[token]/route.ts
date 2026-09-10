/**
 * API: /api/briefings/[token]
 *
 * GET  (público) → retorna briefing + status (sem dados sensíveis do owner).
 * PATCH (público) → atualiza respostas do briefing. Token no path, sem auth.
 *
 * Em dev mode (sem Supabase) → usa um store em memória + arquivo JSON.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';
import { BriefingDraftSchema, type BriefingDraft } from '@/lib/briefing-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Briefing = {
  id: string;
  token: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  client_name: string | null;
  description: string | null;
  services: string | null;
  whatsapp: string | null;
  instagram: string | null;
  colors: string | null;
  reference_url: string | null;
  extra_info: string | null;
  logo_url: string | null;
  photos: string[];
  paid_at: string | null;
  project_id: string | null;
};

const EMPTY: Omit<Briefing, 'id' | 'token'> = {
  status: 'pending',
  client_name: null,
  description: null,
  services: null,
  whatsapp: null,
  instagram: null,
  colors: null,
  reference_url: null,
  extra_info: null,
  logo_url: null,
  photos: [],
  paid_at: null,
  project_id: null,
};

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 });

  if (!isSupabaseAdminConfigured()) {
    // Dev mode: briefings são guardados em um Map em memória no processo.
    // Não persistem entre reinícios. Suficiente pra dev/teste.
    const data = devStore.get(token);
    if (!data) {
      return NextResponse.json({ ok: true, briefing: { token, ...EMPTY }, devMode: true });
    }
    return NextResponse.json({ ok: true, briefing: data, devMode: true });
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('briefings')
    .select('id, token, status, client_name, description, services, whatsapp, instagram, colors, reference_url, extra_info, logo_url, photos, paid_at, project_id')
    .eq('token', token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'briefing não encontrado' }, { status: 404 });

  return NextResponse.json({ ok: true, briefing: data });
}

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = BriefingDraftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'dados inválidos', details: parsed.error.flatten() }, { status: 400 });
  }
  const draft: BriefingDraft = parsed.data;

  if (!isSupabaseAdminConfigured()) {
    const existing = devStore.get(token) || { id: `dev-${token}`, token, ...EMPTY };
    const updated: Briefing = { ...existing, ...clean(draft) };
    devStore.set(token, updated);
    return NextResponse.json({ ok: true, briefing: updated, devMode: true });
  }

  const supabase = createAdminSupabase();
  const update = clean(draft);

  // Bloqueia update se já foi pago
  const { data: cur } = await supabase
    .from('briefings')
    .select('status, paid_at')
    .eq('token', token)
    .maybeSingle();
  if (cur?.status === 'paid') {
    return NextResponse.json({ error: 'briefing já foi pago, não pode ser editado' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('briefings')
    .update(update)
    .eq('token', token)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, briefing: data });
}

/** Converte undefined → null pra não sujar o banco; remove strings vazias. */
function clean(d: BriefingDraft): Partial<Briefing> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(d)) {
    if (v === '' || v === undefined) {
      out[k] = null;
    } else {
      out[k] = v;
    }
  }
  if (Array.isArray(d.photos)) out.photos = d.photos;
  return out;
}

// ─── Dev mode store (in-memory) ───────────────────────────────
const devStore = new Map<string, Briefing>();
