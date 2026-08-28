/**
 * Gera package.json, tsconfig.json, next.config.ts, tailwind.config.ts,
 * postcss.config.js, .gitignore, .env.example.
 */
import type { BuildOptions } from './types';

export function buildBaseConfig(opts: BuildOptions): Record<string, string> {
  const files: Record<string, string> = {};
  const theme = opts.theme || opts.site.theme;

  const usePostgres = opts.dbAdapter === 'postgres';

  files['package.json'] = JSON.stringify({
    name: slugify(opts.projectName),
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      'db:generate': usePostgres ? 'drizzle-kit generate' : 'drizzle-kit generate',
      'db:migrate': usePostgres ? 'node scripts/migrate.mjs' : 'node scripts/migrate.mjs',
      'db:seed': 'node scripts/seed.mjs',
      'create-admin': 'node scripts/create-admin.mjs',
      typecheck: 'tsc --noEmit',
    },
    dependencies: {
      next: '14.2.15',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'better-sqlite3': usePostgres ? undefined : '^11.3.0',
      postgres: usePostgres ? '^3.4.4' : undefined,
      drizzle_orm: '^0.36.0',
      bcryptjs: '^2.4.3',
      jose: '^5.9.6',
      'lucide-react': '^0.460.0',
      zod: '^3.23.8',
    },
    devDependencies: {
      '@types/better-sqlite3': usePostgres ? undefined : '^7.6.11',
      '@types/node': '^22.7.0',
      '@types/react': '^18.3.12',
      '@types/react-dom': '^18.3.1',
      'drizzle-kit': '^0.28.0',
      autoprefixer: '^10.4.20',
      postcss: '^8.4.47',
      tailwindcss: '^3.4.13',
      typescript: '^5.6.3',
    },
  }, null, 2)
    .replace(/"undefined"/g, 'undefined')
    .replace(/,(\s*[}\]])/g, '$1');

  files['tsconfig.json'] = JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules', '.next'],
  }, null, 2);

  files['next.config.mjs'] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
};
export default nextConfig;
`;

  files['tailwind.config.ts'] = `import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: { extend: {
    colors: {
      brand: {
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        accent: '${theme.colors.accent}',
        background: '${theme.colors.background}',
        surface: '${theme.colors.surface}',
        text: '${theme.colors.text}',
        muted: '${theme.colors.textMuted}',
      },
    },
    fontFamily: {
      sans: ['${theme.typography.body.split(',')[0].trim()}', 'system-ui', 'sans-serif'],
      heading: ['${theme.typography.heading.split(',')[0].trim()}', 'system-ui', 'sans-serif'],
    },
    borderRadius: { xl: '0.875rem', '2xl': '1.125rem' },
  } },
  plugins: [],
};
export default config;
`;

  files['postcss.config.js'] = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`;

  files['.gitignore'] = `node_modules/
.next/
out/
build/
.env
.env.local
.env.*.local
*.log
database/*.db
database/*.db-journal
data/
`;

  files['next-env.d.ts'] = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`;

  files['.env.example'] = `# Banco — escolha o adapter
DATABASE_URL=${usePostgres ? 'postgres://user:pass@localhost:5432/dbname' : 'file:./database/data.db'}

# Auth — gere com: openssl rand -base64 32
AUTH_SECRET=change-me-to-a-random-32-byte-base64-string

# URL pública do site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

  return files;
}

function slugify(s: string): string {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'site';
}
