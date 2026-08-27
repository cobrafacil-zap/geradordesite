/**
 * Helpers de IA (OpenAI) usados pelo Gerador.
 * Resposta validada por Zod em todas as rotas.
 */
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const MODEL_DEFAULT = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export const MODEL_FALLBACK = 'gpt-4o-mini';

export interface AiCallOptions {
  model?: string;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callOpenAI(opts: AiCallOptions): Promise<string> {
  const model = opts.model || MODEL_DEFAULT;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }
  const { text } = await generateText({
    model: openai(model),
    system: opts.system,
    prompt: opts.user,
    temperature: opts.temperature ?? 0.4,
    maxTokens: opts.maxTokens ?? 4000,
  });
  return text;
}

/** Extrai JSON de uma resposta (mesmo se vier com markdown ou ruído em volta). */
export function extractJson<T>(raw: string, schema: z.ZodType<T>): T {
  // Tenta match direto
  try {
    return schema.parse(JSON.parse(raw));
  } catch {}
  // Tenta extrair bloco ```json ... ```
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) {
    try { return schema.parse(JSON.parse(m[1])); } catch {}
  }
  // Tenta último { ... } balanceado
  const start = raw.indexOf('{');
  if (start >= 0) {
    let depth = 0;
    for (let i = start; i < raw.length; i++) {
      if (raw[i] === '{') depth++;
      else if (raw[i] === '}') {
        depth--;
        if (depth === 0) {
          try { return schema.parse(JSON.parse(raw.slice(start, i + 1))); } catch { break; }
        }
      }
    }
  }
  throw new Error('Resposta da IA não contém JSON válido.');
}