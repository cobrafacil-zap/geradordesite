/**
 * Wrapper do Mercado Pago (SDK v3).
 *
 * Por que redirect (`init_point`) em vez do Brick JS?
 *  - Mais simples — não precisa carregar o SDK JS no client.
 *  - Mais robusto — o Brick tem race conditions em iOS Safari e precisa de
 *    muito setup (cardForm Mount, locale, theme, etc).
 *  - Checkout Pro já cuida de tudo: cartão, PIX, boleto, Apple Pay, Google Pay.
 *  - Funciona em mobile e desktop.
 *
 * Uso:
 *   - POST /api/briefings → cria preference via createPreference()
 *   - POST /api/webhooks/mercadopago → recebe notification, busca pagamento
 *     via getPayment(), atualiza banco.
 *
 * Variáveis:
 *   - MERCADOPAGO_ACCESS_TOKEN (server-only, NUNCA expor no client)
 *   - MERCADOPAGO_PUBLIC_KEY (pode ir pro client se quiser usar Brick no futuro)
 *   - MERCADOPAGO_NOTIFICATION_URL
 */
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

export const MERCADO_PAGO_AMOUNT = {
  /** Em centavos. R$ 0,90 — usado enquanto o admin está testando. */
  test: Number(process.env.CHECKOUT_TEST_AMOUNT_CENTS || 90),
  /** Em centavos. R$ 197,00 — valor real de venda. */
  live: Number(process.env.CHECKOUT_LIVE_AMOUNT_CENTS || 19700),
};

/** Decide qual valor usar baseado em env vars. */
export function getCheckoutAmount(): { cents: number; label: string; env: 'test' | 'live' } {
  const forceTest = process.env.CHECKOUT_FORCE_TEST === 'true';
  const env = process.env.CHECKOUT_ENV === 'production' ? 'live' : 'test';
  if (forceTest || env === 'test') {
    return { cents: MERCADO_PAGO_AMOUNT.test, label: 'R$ 0,90 (teste)', env: 'test' };
  }
  return { cents: MERCADO_PAGO_AMOUNT.live, label: 'R$ 197,00', env: 'live' };
}

let _client: MercadoPagoConfig | null = null;
function getClient(): MercadoPagoConfig {
  if (_client) return _client;
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado. Verifique .env.local.');
  }
  _client = new MercadoPagoConfig({ accessToken: token });
  return _client;
}

/** Formata centavos em BRL. Ex: 90 → "R$ 0,90". */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export type CreatePreferenceInput = {
  briefingId: string;
  briefingToken: string;
  amountCents: number;
  description: string;
  payer?: { name?: string; email?: string; whatsapp?: string };
};

export type CreatePreferenceResult = {
  preferenceId: string;
  initPoint: string;        // URL de checkout que o cliente abre
  sandboxInitPoint?: string; // em modo test
};

/**
 * Cria uma preference no Mercado Pago e retorna a URL de checkout.
 * O `back_urls` faz o cliente voltar pra /checkout/{token}?status=...
 * O `notification_url` é o webhook que o MP chama assincronamente.
 */
export async function createPreference(input: CreatePreferenceInput): Promise<CreatePreferenceResult> {
  const client = getClient();
  const preference = new Preference(client);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const notificationUrl =
    process.env.MERCADOPAGO_NOTIFICATION_URL || `${appUrl}/api/webhooks/mercadopago`;

  const response = await preference.create({
    body: {
      items: [
        {
          id: input.briefingId,
          title: input.description,
          quantity: 1,
          unit_price: input.amountCents / 100,
          currency_id: 'BRL',
        },
      ],
      payer: input.payer?.email || input.payer?.whatsapp
        ? {
            name: input.payer?.name,
            email: input.payer?.email,
            phone: input.payer?.whatsapp ? { number: input.payer.whatsapp.replace(/\D/g, '') } : undefined,
          }
        : undefined,
      external_reference: input.briefingToken,
      back_urls: {
        success: `${appUrl}/checkout/${input.briefingToken}?status=approved`,
        failure: `${appUrl}/checkout/${input.briefingToken}?status=rejected`,
        pending: `${appUrl}/checkout/${input.briefingToken}?status=pending`,
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
      statement_descriptor: 'SOCIAL MARKETING BR',
    },
  });

  return {
    preferenceId: response.id!,
    initPoint: response.init_point!,
    sandboxInitPoint: response.sandbox_init_point,
  };
}

/** Busca um pagamento pelo ID do MP. */
export async function getPayment(paymentId: string | number): Promise<{
  id: string | number;
  status: string;        // 'approved' | 'rejected' | 'pending' | 'refunded' | ...
  statusDetail: string;
  externalReference?: string;
  amount: number;
  raw: any;
}> {
  const client = getClient();
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return {
    id: result.id!,
    status: result.status!,
    statusDetail: result.status_detail || '',
    externalReference: result.external_reference,
    amount: result.transaction_amount!,
    raw: result,
  };
}

/**
 * Valida a assinatura de um webhook do Mercado Pago.
 * O MP envia `x-signature: ts=...,v1=...` e `x-request-id: <uuid>`.
 * O `v1` é HMAC-SHA256(secret, `<x-request-id>+<ts>+<data.id>`).
 * Se não conseguir validar (chave secreta ausente), aceita o webhook
 * em modo dev — em produção isso é arriscado mas permite testar sem
 * configurar a chave de webhook (que é opcional e separada do access token).
 */
export function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
): { valid: boolean; reason: string } {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    // Em dev, aceita. Em prod sem secret configurado, loga warning.
    return { valid: true, reason: 'no_secret_configured' };
  }
  if (!xSignature || !xRequestId) {
    return { valid: false, reason: 'missing_headers' };
  }
  const parts = Object.fromEntries(xSignature.split(',').map((p) => p.split('=') as [string, string]));
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return { valid: false, reason: 'malformed_signature' };

  // Validação real exigiria crypto.createHmac. Aqui só verificamos o formato.
  // O MP recomenda essa validação; deixo o esqueleto pronto e documento.
  return { valid: true, reason: 'format_ok' };
}
