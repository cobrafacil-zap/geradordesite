/**
 * Gera scripts do site exportado:
 * - scripts/create-admin.mjs (prompt + bcrypt + DB insert)
 * - scripts/seed.mjs (cria site_config com dados iniciais)
 */
import type { BuildOptions, FileMap } from './types';

export function buildScripts(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};
  const usePostgres = opts.dbAdapter === 'postgres';

  files['scripts/create-admin.mjs'] = usePostgres ? pgCreateAdmin() : sqliteCreateAdmin();
  files['scripts/seed.mjs'] = usePostgres ? pgSeed(opts) : sqliteSeed(opts);

  return files;
}

function sqliteCreateAdmin(): string {
  return `import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const url = (process.env.DATABASE_URL || 'file:./database/data.db').replace(/^file:/, '');
const db = new Database(url);

const rl = createInterface({ input: process.stdin, output: process.stdout });
function ask(q) {
  return new Promise(res => rl.question(q, ans => res(ans.trim())));
}

const email = await ask('Email do admin: ');
if (!email || !email.includes('@')) { console.error('Email inválido'); process.exit(1); }
const password = await ask('Senha (mín 8): ');
if (!password || password.length < 8) { console.error('Senha muito curta'); process.exit(1); }
const name = await ask('Nome do admin: ');
rl.close();

const hash = await bcrypt.hash(password, 10);
const now = Math.floor(Date.now() / 1000);

db.prepare(\`INSERT OR REPLACE INTO admins (email, name, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)\`)
  .run(email, name || email, hash, now);

console.log('✅ Admin criado:', email);
db.close();
`;
}

function pgCreateAdmin(): string {
  return `import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const url = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname';
const sql = postgres(url, { max: 1 });

const rl = createInterface({ input: process.stdin, output: process.stdout });
function ask(q) {
  return new Promise(res => rl.question(q, ans => res(ans.trim())));
}

const email = await ask('Email do admin: ');
if (!email || !email.includes('@')) { console.error('Email inválido'); process.exit(1); }
const password = await ask('Senha (mín 8): ');
if (!password || password.length < 8) { console.error('Senha muito curta'); process.exit(1); }
const name = await ask('Nome do admin: ');
rl.close();

const hash = await bcrypt.hash(password, 10);

await sql([
  'INSERT INTO admins (email, name, password_hash, role) VALUES (',
  email, ', ',
  name || email, ', ',
  hash, ", 'admin') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash"
].join(''));

console.log('✅ Admin criado/atualizado:', email);
await sql.end();
`;
}

function sqliteSeed(opts: BuildOptions): string {
  return `import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const url = (process.env.DATABASE_URL || 'file:./database/data.db').replace(/^file:/, '');
mkdirSync(dirname(url), { recursive: true });
const db = new Database(url);

const initial = ${JSON.stringify({ data: JSON.stringify(opts.site), updatedAt: Math.floor(Date.now() / 1000) }, null, 2)};

const row = db.prepare('SELECT id FROM site_config LIMIT 1').get();
if (row) {
  db.prepare('UPDATE site_config SET data = ?, updated_at = ? WHERE id = ?')
    .run(initial.data, initial.updatedAt, row.id);
  console.log('♻️  site_config atualizado');
} else {
  db.prepare('INSERT INTO site_config (data, updated_at) VALUES (?, ?)').run(initial.data, initial.updatedAt);
  console.log('✅ site_config inserido');
}

db.close();
`;
}

function pgSeed(opts: BuildOptions): string {
  return `import postgres from 'postgres';

const url = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname';
const sql = postgres(url, { max: 1 });

const initial = ${JSON.stringify(JSON.stringify(opts.site))};

await sql(['INSERT INTO site_config (data) VALUES (', ') ON CONFLICT DO NOTHING'].join(''), [initial]);

console.log('✅ site_config populado');
await sql.end();
`;
}