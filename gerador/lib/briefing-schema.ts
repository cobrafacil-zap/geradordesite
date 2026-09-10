/**
 * Schema Zod do briefing de cliente.
 *
 * Reusado em:
 *  - /api/briefings/[token] (PATCH — cliente salva as respostas)
 *  - /api/briefings/route.ts (POST — admin cria o briefing em branco)
 *  - /app/(public)/checkout/[token]/_components/BriefingForm.tsx (validação client)
 *
 * IMPORTANTE: todos os campos são strings opcionais. O cliente pode
 * salvar parcial (rascunho) e voltar depois pra completar.
 *
 * Validações específicas:
 *  - whatsapp: aceita só dígitos, com DDI opcional
 *  - reference_url: tem que ser URL válida (https)
 *  - photos: máx 10 URLs (limite de tamanho do schema)
 */
import { z } from 'zod';

export const BRIEFING_PHOTO_LIMIT = 10;

export const BriefingSchema = z.object({
  client_name: z.string().min(2, 'Nome da empresa é obrigatório').max(120).optional().or(z.literal('')),
  description: z.string().min(10, 'Conta um pouco mais sobre o que sua empresa faz (mín 10 letras)').max(2000).optional().or(z.literal('')),
  services: z.string().min(5, 'Lista os serviços/produtos que quer destacar (mín 5 letras)').max(2000).optional().or(z.literal('')),
  whatsapp: z
    .string()
    .regex(/^[\d\s()+-]{8,30}$/, 'WhatsApp inválido. Ex: 43 99682-0296')
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .regex(/^@?[A-Za-z0-9._]{1,30}$/, 'Instagram inválido (ex: @sualoja)')
    .optional()
    .or(z.literal('')),
  colors: z.string().max(200).optional().or(z.literal('')),
  reference_url: z
    .string()
    .url('URL inválida. Ex: https://exemplo.com.br')
    .optional()
    .or(z.literal('')),
  extra_info: z.string().max(2000).optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  photos: z.array(z.string().url()).max(BRIEFING_PHOTO_LIMIT, `Máx ${BRIEFING_PHOTO_LIMIT} fotos`).optional(),
});

export type BriefingInput = z.infer<typeof BriefingSchema>;

/** Versão "rascunho" — aceita tudo vazio/parcial. Usado no PATCH inicial. */
export const BriefingDraftSchema = BriefingSchema.partial();
export type BriefingDraft = z.infer<typeof BriefingDraftSchema>;

/** Versão "pronta pra pagar" — exige o mínimo de campos. */
export const BriefingReadySchema = z.object({
  client_name: z.string().min(2),
  description: z.string().min(10),
  services: z.string().min(5),
  whatsapp: z.string().regex(/^[\d\s()+-]{8,30}$/),
  colors: z.string().min(2),
});
export type BriefingReady = z.infer<typeof BriefingReadySchema>;
