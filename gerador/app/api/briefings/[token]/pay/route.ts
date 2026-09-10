/**
 * API: POST /api/briefings/[token]/pay
 *
 * Gera a preference no Mercado Pago e retorna o `init_point` (URL de checkout).
 *
 * Em dev mode (sem MERCADOPAGO_ACCESS_TOKEN) → retorna URL de "simulação"
 * que o checkout usa pra marcar como pago (sem gateway real).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';
import { createPreference, getCheckoutAmount, formatBRL } from '@/lib/mercadopago';
import { BriefingReadySchema } from '@/lib/briefing-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 });

  const amount = getCheckoutAmount();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const simUrl = `${appUrl}/checkout/${token}?status=simulated&amount=${amount.cents}`;

  // Sem Supabase E sem MP → modo dev total
  if (!isSupabaseAdminConfigured() && !process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({
      ok: true,
      devMode: true,
      mode: 'simulated',
      initPoint: simUrl,
      amount: amount.cents,
      amountLabel: amount.label,
    });
  }

  // Tem Supabase: busca o briefing para validar
  if (isSupabaseAdminConfigured()) {
    const supabase = createAdminSupabase();
    const { data: briefing, error } = await supabase
      .from('briefings')
      .select('id, status, client_name, description, services, whatsapp, colors, paid_at, photos, logo_url')
      .eq('token', token)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!briefing) return NextResponse.json({ error: 'briefing não encontrado' }, { status: 404 });

    if (briefing.status === 'paid') {
      return NextResponse.json({ error: 'briefing já foi pago' }, { status: 409 });
    }

    // Valida briefing mínimo
    const readyCheck = BriefingReadySchema.safeParse({
      client_name: briefing.client_name || '',
      description: briefing.description || '',
      services: briefing.services || '',
      whatsapp: briefing.whatsapp || '',
      colors: briefing.colors || '',
    });
    if (!readyCheck.success) {
      return NextResponse.json({
        error: 'briefing incompleto',
        details: readyCheck.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    // Sem MP configurado → modo simulado
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({
        ok: true,
        devMode: true,
        mode: 'simulated',
        initPoint: simUrl,
        amount: amount.cents,
        amountLabel: amount.label,
      });
    }

    // Modo produção: cria preference
    try {
      const pref = await createPreference({
        briefingId: briefing.id,
        briefingToken: token,
        amountCents: amount.cents,
        description: `Site para ${briefing.client_name} — Social Marketing BR`,
        payer: { name: briefing.client_name, whatsapp: briefing.whatsapp },
      });

      // Salva preference_id em payments (status pending)
      await supabase.from('payments').upsert({
        briefing_id: briefing.id,
        provider: 'mercadopago',
        provider_id: pref.preferenceId,
        amount_cents: amount.cents,
        currency: 'BRL',
        status: 'pending',
        raw_response: pref,
      }, { onConflict: 'provider_id' });

      return NextResponse.json({
        ok: true,
        devMode: false,
        mode: 'mercadopago',
        initPoint: pref.initPoint,
        sandboxInitPoint: pref.sandboxInitPoint,
        amount: amount.cents,
        amountLabel: amount.label,
        preferenceId: pref.preferenceId,
      });
    } catch (e: any) {
      return NextResponse.json({
        error: 'falha ao criar preference no MP',
        message: e?.message || String(e),
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'configuração incompleta' }, { status: 500 });
}
