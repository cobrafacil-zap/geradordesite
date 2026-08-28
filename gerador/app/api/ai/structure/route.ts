/**
 * API: POST /api/ai/structure
 *
 * Gera a estrutura inicial do site a partir de:
 *   { segment, tradeName, slogan, brief, templateName }
 * Retorna Site (validado por Zod).
 *
 * Implementa retry (até 2x) se a resposta falhar a validação.
 */
import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, extractJson } from '@/lib/ai';
import { SiteSchema as siteSchema } from '@/lib/generator/site-schema';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Você é um arquiteto de sites profissionais. Sua única tarefa é gerar o JSON completo de um site (SiteSchema) a partir do briefing.

Regras rígidas:
1. Responda SOMENTE com JSON válido, sem markdown, sem comentários.
2. Use o template informado como base estrutural (páginas e seções esperadas).
3. Preencha com conteúdo plausível para o segmento (empresa fictícia ilustrativa).
4. Use cores harmônicas que combinem com o segmento.
5. Navigation reflete as páginas geradas (cada página vira um link).
6. Pelo menos 4 páginas: home + 2-3 internas.
7. Cada página tem 4-8 seções relevantes.
8. NÃO invente dados reais (telefones, CNPJ). Use placeholders descritivos como "(11) 0000-0000".
9. Sem URLs externas que não tenham sido fornecidas.
10. settings.whatsapp deve estar no formato 5511999999999 (DDI+DDD+número, sem espaços).

Estrutura de cada página:
  { slug, name, title, description, sections: [{ component, variant, content }] }

Componentes disponíveis: Header, Footer, Hero, HeroSimple, Services, Specialties,
  Differentials, About, History, Stats, CTA, Contact, Map, Team, Testimonials,
  FAQ, Legal, Gallery, Products, ProductList, Cases, BlogList, Properties,
  PropertyList, MenuPreview, MenuFull, Reservation.

Variantes são strings livres — escolha a mais adequada por seção (ex: 'split', 'sticky-dark', 'centered-dark').`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { segment, tradeName, slogan, brief, templateName, preset } = body;

    if (!segment || !tradeName) {
      return NextResponse.json({ error: 'segment e tradeName são obrigatórios' }, { status: 400 });
    }

    const user = `Gere a estrutura completa de um site para:
- Nome: ${tradeName}
- Slogan: ${slogan || ''}
- Segmento: ${segment}
- Template base: ${templateName || preset || 'institucional'}
- Briefing adicional: ${brief || ''}

Siga exatamente a estrutura SiteSchema. Preencha todos os campos.`;

    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const raw = await callOpenAI({
          system: attempt === 0 ? SYSTEM_PROMPT : SYSTEM_PROMPT + '\n\nSua resposta anterior falhou a validação. Corrija para um JSON válido que passe o schema.',
          user: attempt === 0 ? user : user + `\n\nErro: ${JSON.stringify(lastError?.issues || lastError?.message)}`,
        });
        const parsed = extractJson(raw, siteSchema);
        return NextResponse.json({ ok: true, site: parsed, attempt: attempt + 1 });
      } catch (e: any) {
        lastError = e;
      }
    }
    return NextResponse.json({ ok: false, error: 'IA não retornou JSON válido após 3 tentativas', detail: String(lastError?.message || lastError) }, { status: 502 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}