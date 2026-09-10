/**
 * API: POST /api/webhooks/mercadopago
 *
 * Webhook que o Mercado Pago chama quando o status de um pagamento muda.
 *
 * Fluxo:
 *  1) Recebe notificação (IPN/Webhook v2).
 *  2) Valida x-signature (se secret configurado).
 *  3) Identifica o pagamento (data.id = payment_id).
 *  4) Busca o pagamento via API do MP pra confirmar status.
 *  5) Se approved → atualiza payments, briefings, e cria project via
 *     briefingToProject() (idempotente).
 *
 * Em dev mode (sem MP token) → aceita payloads manuais com
 * { action: 'simulate', briefingToken, status: 'approved' } pra testar
 * o fluxo end-to-end sem gateway.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';
import { getPayment, verifyWebhookSignature } from '@/lib/mercadopago';
import { briefingToProject } from '@/lib/briefing-to-project';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  let payload: any = {};
  try { payload = JSON.parse(body); } catch { /* MP pode mandar sem JSON */ }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  const dataId = payload?.data?.id ? String(payload.data.id) : '';

  // Validação de assinatura (best-effort — secret é opcional)
  const sig = verifyWebhookSignature(xSignature, xRequestId, dataId);
  if (!sig.valid) {
    return NextResponse.json({ error: 'invalid signature', reason: sig.reason }, { status: 401 });
  }

  // Dev mode: simulação manual { action: 'simulate', briefingToken, status: 'approved' }
  if (payload?.action === 'simulate' && payload?.briefingToken) {
    return await handleSimulatedPayment(payload.briefingToken, payload.status || 'approved');
  }

  // Em dev mode sem Supabase, não tem como processar de verdade
  if (!isSupabaseAdminConfigured()) {
    console.log('[webhook] dev mode: ignorando notificação MP', { dataId, type: payload?.type });
    return NextResponse.json({ ok: true, devMode: true, ignored: true });
  }

  // Sem MP token configurado, não dá pra buscar o pagamento
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.log('[webhook] MERCADOPAGO_ACCESS_TOKEN não configurado, ignorando notificação');
    return NextResponse.json({ ok: true, devMode: true, ignored: 'no_mp_token' });
  }

  try {
    const paymentInfo = await getPayment(dataId);
    console.log('[webhook] payment status:', paymentInfo.status, 'ref:', paymentInfo.externalReference);

    if (!paymentInfo.externalReference) {
      return NextResponse.json({ error: 'payment sem external_reference' }, { status: 400 });
    }

    const supabase = createAdminSupabase();
    const token = paymentInfo.externalReference;

    // Busca briefing
    const { data: briefing, error: briefErr } = await supabase
      .from('briefings')
      .select('*')
      .eq('token', token)
      .maybeSingle();
    if (briefErr) return NextResponse.json({ error: briefErr.message }, { status: 500 });
    if (!briefing) return NextResponse.json({ error: 'briefing não encontrado' }, { status: 404 });

    // Atualiza payment
    await supabase.from('payments').upsert({
      briefing_id: briefing.id,
      provider: 'mercadopago',
      provider_id: String(paymentInfo.id),
      payment_id: String(paymentInfo.id),
      amount_cents: Math.round(paymentInfo.amount * 100),
      currency: 'BRL',
      status: mapMpStatus(paymentInfo.status),
      raw_response: paymentInfo.raw,
      approved_at: paymentInfo.status === 'approved' ? new Date().toISOString() : null,
    }, { onConflict: 'provider_id' });

    // Se aprovado, cria project e marca briefing como paid
    if (paymentInfo.status === 'approved' && briefing.status !== 'paid') {
      await supabase.from('briefings').update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      }).eq('id', briefing.id);

      await briefingToProject(briefing.id, { ...briefing, token });
    }

    return NextResponse.json({ ok: true, status: paymentInfo.status });
  } catch (e: any) {
    console.error('[webhook] erro:', e);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}

function mapMpStatus(s: string): string {
  switch (s) {
    case 'approved': return 'approved';
    case 'rejected': return 'rejected';
    case 'refunded': return 'refunded';
    case 'cancelled': return 'cancelled';
    case 'pending':
    case 'in_process':
    case 'authorized':
    default:
      return 'pending';
  }
}

async function handleSimulatedPayment(token: string, status: string) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      devMode: true,
      mode: 'simulated',
      token,
      status,
      note: 'briefing/project não persistido (sem Supabase)',
    });
  }
  const supabase = createAdminSupabase();
  const { data: briefing } = await supabase
    .from('briefings')
    .select('*')
    .eq('token', token)
    .maybeSingle();
  if (!briefing) return NextResponse.json({ error: 'briefing não encontrado' }, { status: 404 });

  await supabase.from('payments').upsert({
    briefing_id: briefing.id,
    provider: 'simulated',
    provider_id: `sim-${Date.now()}`,
    amount_cents: 90,
    currency: 'BRL',
    status: status === 'approved' ? 'approved' : status,
    raw_response: { simulated: true },
    approved_at: status === 'approved' ? new Date().toISOString() : null,
  }, { onConflict: 'provider_id' });

  if (status === 'approved' && briefing.status !== 'paid') {
    await supabase.from('briefings').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', briefing.id);
    await briefingToProject(briefing.id, { ...briefing, token });
  }

  return NextResponse.json({ ok: true, mode: 'simulated', token, status });
}

// GET: health check do endpoint
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'mercadopago-webhook',
    configured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
    supabase: isSupabaseAdminConfigured(),
  });
}
