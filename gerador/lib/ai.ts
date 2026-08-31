/**
 * Helpers de IA (Google Gemini) usados pelo Gerador.
 *
 * SDK oficial: @google/generative-ai
 * Modelo padrão: gemini-2.0-flash (free tier: 15 req/min, 1500 req/dia)
 * Obtenha sua chave grátis em: https://aistudio.google.com/apikey
 *
 * Resposta validada por Zod em todas as rotas.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const MODEL_DEFAULT = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
export const MODEL_FALLBACK = 'gemini-2.5-flash';

export interface AiCallOptions {
  model?: string;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}

function getKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY não configurada. Obtenha grátis em https://aistudio.google.com/apikey');
  }
  return key;
}

export async function callOpenAI(opts: AiCallOptions): Promise<string> {
  const genai = new GoogleGenerativeAI(getKey());
  const model = opts.model || MODEL_DEFAULT;
  const m = genai.getGenerativeModel({
    model,
    systemInstruction: opts.system,
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      maxOutputTokens: opts.maxTokens ?? 8000,
    },
  });
  const result = await m.generateContent(opts.user);
  const text = result.response.text();
  return text ?? '';
}

/** Alias semântico (mantido para retrocompatibilidade com imports existentes). */
export const callGemini = callOpenAI;

let lastErr = '';

/** Extrai JSON de uma resposta (mesmo se vier com markdown ou ruído em volta). */
export function extractJson<T>(raw: string, schema: z.ZodType<T>): T {
  lastErr = '';
  // Tenta match direto
  try {
    return schema.parse(JSON.parse(raw));
  } catch (e: any) { lastErr = `parse: ${e?.message?.slice(0, 200)}`; }
  // Tenta extrair bloco ```json ... ```
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) {
    try { return schema.parse(JSON.parse(m[1])); } catch (e: any) { lastErr = `block: ${e?.message?.slice(0, 200)}`; }
  }
  // Tenta primeiro { ... } balanceado
  const start = raw.indexOf('{');
  if (start >= 0) {
    let depth = 0;
    for (let i = start; i < raw.length; i++) {
      if (raw[i] === '{') depth++;
      else if (raw[i] === '}') {
        depth--;
        if (depth === 0) {
          try { return schema.parse(JSON.parse(raw.slice(start, i + 1))); } catch (e: any) { lastErr = `slice: ${e?.message?.slice(0, 200)}`; break; }
        }
      }
    }
  }
  throw new Error(`Resposta da IA não contém JSON válido. ${lastErr || ''}`);
}