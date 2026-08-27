/**
 * Validação do projeto exportado antes de empacotar o ZIP.
 * Detecta: imports quebrados, placeholders não substituídos, sintaxe TSX inválida,
 * componentes referenciados sem definição.
 */
import type { FileMap } from './file-builder/types';

export interface ValidationIssue {
  file: string;
  line?: number;
  severity: 'error' | 'warning';
  message: string;
  rule: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: {
    files: number;
    totalBytes: number;
    tsxFiles: number;
    apiRoutes: number;
    adminPages: number;
  };
}

const PLACEHOLDER_REGEX = /\{(?!\{)([a-zA-Z_][a-zA-Z0-9_.]*)\}/g;
const IMPORT_REGEX = /(?:import|export)\s+(?:.*?\s+from\s+)?['"](@\/[^'"]+)['"]/g;
const COMPONENT_REGEX = /from\s+['"]\.\/([A-Z][a-zA-Z]+)['"]/g;

export function validate(files: FileMap): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  let totalBytes = 0;
  let tsxFiles = 0;
  let apiRoutes = 0;
  let adminPages = 0;

  // Coletar todos os componentes exportados em components/site/
  const availableComponents = new Set<string>();
  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith('components/site/') && path.endsWith('.tsx')) {
      const m = content.match(/export function ([A-Z][a-zA-Z]+)/);
      if (m) availableComponents.add(m[1]);
    }
  }

  // Coletar imports usados em cada arquivo
  for (const [path, content] of Object.entries(files)) {
    totalBytes += content.length;
    if (path.endsWith('.tsx')) tsxFiles++;
    if (path.startsWith('app/api/admin/')) apiRoutes++;
    if (path.startsWith('app/admin/(panel)/') && path.endsWith('/page.tsx')) adminPages++;

    // ── 1. Placeholders não substituídos
    let match: RegExpExecArray | null;
    while ((match = PLACEHOLDER_REGEX.exec(content))) {
      warnings.push({
        file: path,
        severity: 'warning',
        rule: 'placeholder',
        message: 'Placeholder não substituído: ' + match[0],
      });
    }
    PLACEHOLDER_REGEX.lastIndex = 0;

    // ── 2. Imports relativos quebrados (qualquer arquivo que importe './Xxx')
    let relIm: RegExpExecArray | null;
    while ((relIm = COMPONENT_REGEX.exec(content))) {
      const name = relIm[1];
      if (name !== 'registry' && !availableComponents.has(name)) {
        errors.push({
          file: path,
          severity: 'error',
          rule: 'broken-import',
          message: "Importa './" + name + "' mas nenhum arquivo define este componente.",
        });
      }
    }
    COMPONENT_REGEX.lastIndex = 0;

    // ── 3. Imports @/ para arquivos inexistentes
    let im: RegExpExecArray | null;
    while ((im = IMPORT_REGEX.exec(content))) {
      const importPath = im[1].replace(/^@\//, '');
      // Tentar resolver como arquivo .ts/.tsx
      const candidates = [
        importPath + '.ts', importPath + '.tsx',
        importPath + '/index.ts', importPath + '/index.tsx',
        importPath + '/page.tsx', importPath + '/route.ts',
      ];
      if (!candidates.some(c => files[c])) {
        // pode ser dinâmico ou gerado — só warn
        warnings.push({
          file: path,
          severity: 'warning',
          rule: 'unresolved-import',
          message: 'Import @/' + importPath + ' não pôde ser resolvido estaticamente.',
        });
      }
    }
    IMPORT_REGEX.lastIndex = 0;

    // ── 4. Sintaxe TSX: cada componente export deve ter function declarada
    if (path === 'components/site/registry.tsx') {
      const declared = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]\.\/([A-Z][a-zA-Z]+)['"]/g) || [];
      for (const decl of declared) {
        const m = decl.match(/import\s*\{\s*([^}]+)\s*\}/);
        if (!m) continue;
        const names = m[1].split(',').map(n => n.trim()).filter(Boolean);
        for (const n of names) {
          if (!availableComponents.has(n)) {
            errors.push({
              file: path,
              severity: 'error',
              rule: 'missing-component',
              message: "registry importa '" + n + "' mas não há arquivo correspondente.",
            });
          }
        }
      }
    }

    // ── 5. App routes: pages deve ter default export
    if (path.match(/\/page\.tsx$/) || path.match(/\/route\.ts$/)) {
      if (!content.includes('export default') && !content.includes('export async function')) {
        errors.push({
          file: path,
          severity: 'error',
          rule: 'no-default-export',
          message: 'page.tsx/route.ts sem export default.',
        });
      }
    }

    // ── 6. .env.example nunca deve ter valores reais (heurística simples)
    if (path === '.env.example') {
      if (/OPENAI_API_KEY\s*=\s*sk-/.test(content)) {
        errors.push({ file: path, severity: 'error', rule: 'secret-leaked', message: '.env.example contém chave OpenAI real' });
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: { files: Object.keys(files).length, totalBytes, tsxFiles, apiRoutes, adminPages },
  };
}