/**
 * API: /api/template-preview/[slug]
 * Renderiza o HTML estático de um modelo a partir do slug (sem precisar
 * de projeto criado). Usado pelo card "Modelos" para mostrar preview ao
 * vivo dentro do iframe e para o botão "Preview" em nova aba.
 *
 * Não exige autenticação — é um preview público do template.
 */
import { NextRequest, NextResponse } from 'next/server';
import { siteSchemaForTemplate } from '@/lib/generator/site-schema';
import { siteRendererToHtml } from '@/lib/generator/render/site-renderer-html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEMPLATE_NAMES: Record<string, string> = {
  'empresa-corporativa': 'Empresa Corporativa',
  'empresa-moderna': 'Empresa Moderna',
  'empresa-premium': 'Empresa Premium',
  'industria': 'Indústria',
  'construtora': 'Construtora',
  'startup': 'Startup',
  'empresa-local': 'Empresa Local',
  'escritorio-advocacia': 'Escritório de Advocacia',
  'clinica-medica': 'Clínica Médica',
  'odontologia': 'Odontologia',
  'estetica': 'Estética & Beleza',
  'eletricista': 'Eletricista',
  'encanador': 'Encanador',
  'mecanica': 'Mecânica / Auto Center',
  'assistencia-tecnica': 'Assistência Técnica',
  'agencia-marketing': 'Agência de Marketing',
  'limpeza': 'Limpeza',
  'imobiliaria': 'Imobiliária',
  'loja': 'Loja / Catálogo',
  'restaurante': 'Restaurante',
  'pizzaria': 'Pizzaria',
  'padaria': 'Padaria',
  'academia': 'Academia',
  'pet-shop': 'Pet Shop',
  'fotografo': 'Fotógrafo',
  'advogado': 'Advogado Autônomo',
  'contador': 'Contador',
  'corretor': 'Corretor de Imóveis',
  'personal-trainer': 'Personal Trainer',
  'consultor': 'Consultor / Autônomo',
};

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const tradeName = TEMPLATE_NAMES[slug] || slug;
  try {
    const schema = siteSchemaForTemplate(slug, tradeName);
    const html = siteRendererToHtml(schema);
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (err: any) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Preview</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="bg-slate-50 min-h-screen flex items-center justify-center p-8 text-slate-700">
        <div class="text-center"><h1 class="text-lg font-semibold mb-2">Preview indisponível</h1>
        <p class="text-sm">${(err?.message || String(err)).replace(/</g, '&lt;')}</p></div>
      </body></html>`;
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Frame-Options': 'SAMEORIGIN' },
    });
  }
}
