/**
 * scripts/test-setmode.ts — Simula o ciclo do ThemeTab.setMode do editor
 * e verifica se o preview (srcDoc) muda de light pra dark.
 *
 * É o teste de regressão pra "clico em Escuro e nada muda".
 */
import { siteRendererToHtml } from '../lib/generator/render/site-renderer-html';

// Mock do schema inicial (vindo do DB / IA)
let schema: any = {
  site: { name: 'Escritório Teste', trade: 'Escritório Teste', slogan: '', segment: 'lawyer' },
  theme: {
    colors: {
      primary: '#1a0b2e', secondary: '#6d28d9', accent: '#a855f7',
      background: '#ffffff', surface: '#f8fafc', text: '#0f172a',
      textMuted: '#64748b', border: '#e5e7eb',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    radius: '8px',
    style: 'moderno',
  },
  navigation: [],
  pages: [
    { slug: '/', sections: [{ component: 'Hero', variant: 'split', content: { title: 'Olá', subtitle: 's', ctaLabel: 'CTA', ctaHref: '#' } }] },
  ],
  settings: {}, seo: {},
};

// === Cópia EXATA da lógica do ThemeTab.setMode ===
function setMode(s: any, mode: 'light' | 'dark') {
  const next = JSON.parse(JSON.stringify(s));
  next.theme.style = mode === 'dark' ? 'dark-premium' : 'moderno';
  if (mode === 'dark') {
    next.theme.colors.background = '#0f172a';
    next.theme.colors.text = '#f5fafd';
    next.theme.colors.textMuted = 'rgba(245,250,253,0.7)';
    next.theme.colors.border = 'rgba(255,255,255,0.12)';
    next.theme.colors.surface = '#111118';
  } else {
    next.theme.colors.background = '#ffffff';
    next.theme.colors.text = '#0f172a';
    next.theme.colors.textMuted = '#64748b';
    next.theme.colors.border = '#e5e7eb';
    next.theme.colors.surface = '#f8fafc';
  }
  return next;
}

let pass = 0, fail = 0;
const expect = (name: string, cond: boolean) => {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fail++; console.log('  ✗', name); }
};

console.log('\n=== Estado inicial ===');
const html0 = siteRendererToHtml(schema);
expect('Começa claro', html0.includes('--bg:#ffffff'));
expect('NÃO começa dark', !html0.includes('class="dark"'));

console.log('\n=== Clica em Escuro ===');
schema = setMode(schema, 'dark');
const html1 = siteRendererToHtml(schema);
expect('Agora tem class="dark"', html1.includes('class="dark"'));
expect('Background é #0f172a', html1.includes('--bg:#0f172a'));
expect('Texto é #f5fafd', html1.includes('--fg:#f5fafd'));
expect('color-scheme:dark', html1.includes('color-scheme:dark'));
expect('NÃO tem mais bg claro', !html1.includes('--bg:#ffffff'));

console.log('\n=== Clica em Claro de volta ===');
schema = setMode(schema, 'light');
const html2 = siteRendererToHtml(schema);
expect('Volta pra claro', html2.includes('--bg:#ffffff'));
expect('NÃO tem mais class="dark"', !html2.includes('class="dark"'));
expect('Texto volta pra #0f172a', html2.includes('--fg:#0f172a'));

console.log('\n=== setMode preserva primary/accent ===');
const before = schema.theme.colors.primary;
schema = setMode(schema, 'dark');
expect('primary preservada', schema.theme.colors.primary === before);

console.log(`\n=== ${pass} ok, ${fail} falhas ===\n`);
process.exit(fail === 0 ? 0 : 1);
