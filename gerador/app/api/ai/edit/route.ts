/**
 * API: POST /api/ai/edit
 *
 * Aplica edições em linguagem natural ao schema atual.
 * Retorna um JSON Patch mínimo que pode ser mergeado no Site.
 */
import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, extractJson } from '@/lib/ai';
import { SiteSchema as siteSchema } from '@/lib/generator/site-schema';

export const runtime = 'nodejs';

const SYSTEM = `Você é um editor de sites que entende comandos em linguagem natural.
Sua única tarefa: dado um SiteSchema atual e um comando do usuário, retornar o SiteSchema ATUALIZADO.

Regras:
1. Responda SOMENTE com JSON válido do SiteSchema completo.
2. Preserve toda a estrutura existente.
3. Aplique APENAS as alterações pedidas no comando.
4. Não invente dados reais — use placeholders.
5. Se o comando for ambíguo, faça a interpretação mais conservadora.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentSchema, command } = body;

    if (!currentSchema || !command) {
      return NextResponse.json({ error: 'currentSchema e command são obrigatórios' }, { status: 400 });
    }

    const user = `SCHEMA ATUAL:
${JSON.stringify(currentSchema, null, 2)}

COMANDO: ${command}

Retorne o SCHEMA ATUALIZADO aplicando a alteração pedida.`;

    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const raw = await callOpenAI({
          system: SYSTEM,
          user,
        });
        const parsed = extractJson(raw, siteSchema);
        return NextResponse.json({ ok: true, site: parsed, attempt: attempt + 1 });
      } catch (e: any) {
        lastError = e;
      }
    }
    return NextResponse.json({ ok: false, error: 'IA não retornou schema válido', detail: String(lastError?.message) }, { status: 502 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
