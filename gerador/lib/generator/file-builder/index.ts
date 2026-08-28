/**
 * Orquestrador do motor de arquivos: junta todos os módulos do file-builder
 * em um único FileMap pronto para virar ZIP.
 *
 * Uso:
 *   const files = buildAllFiles({
 *     projectName: 'Aurélio & Bastos',
 *     site: siteSchema,
 *     assets: [...],
 *     dbAdapter: 'sqlite',
 *     templateName: 'empresaCorporativa',
 *   });
 *   const blob = await buildZip(files);
 */
import type { BuildOptions, FileMap } from './types';
import { buildBaseConfig } from './package';
import { buildSiteFiles } from './site';
import { buildSiteComponents } from './components-site';
import { buildAdminFiles } from './admin';
import { buildLibFiles } from './lib';
import { buildMigrations } from './migrations';
import { buildScripts } from './scripts';
import { buildReadme } from './readme';

export * from './types';

export function buildAllFiles(opts: BuildOptions): FileMap {
  const all: Record<string, string> = {};

  // 1. Config base (package.json, tsconfig, next.config, tailwind, etc.)
  Object.assign(all, buildBaseConfig(opts));

  // 2. Site público (layout, páginas dinâmicas, SiteRenderer, types, site-config)
  Object.assign(all, buildSiteFiles(opts));

  // 3. Componentes do site público (components/site/*.tsx + registry)
  Object.assign(all, buildSiteComponents(opts));

  // 4. Painel admin (12 telas + API routes)
  Object.assign(all, buildAdminFiles(opts));

  // 5. lib/ (auth, db schema, db client, permissions)
  Object.assign(all, buildLibFiles(opts));

  // 6. Migrations (schema.sql + migrate.mjs + drizzle.config)
  Object.assign(all, buildMigrations(opts));

  // 7. Scripts (create-admin, seed)
  Object.assign(all, buildScripts(opts));

  // 8. README
  const readme = buildReadme(opts);
  all['README.md'] = readme;

  return all;
}