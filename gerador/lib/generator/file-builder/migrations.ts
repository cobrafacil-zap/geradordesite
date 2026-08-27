/**
 * Gera migrations SQL + script de migrate.
 * Cria database/schema.sql e scripts/migrate.mjs.
 */
import type { BuildOptions, FileMap } from './types';

export function buildMigrations(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};
  const usePostgres = opts.dbAdapter === 'postgres';

  // ── database/schema.sql — referência do schema final ──────
  files['database/schema.sql'] = usePostgres ? pgSchema() : sqliteSchema();

  // ── scripts/migrate.mjs — roda as migrations reais ────────
  files['scripts/migrate.mjs'] = usePostgres ? pgMigrate() : sqliteMigrate();

  // ── drizzle.config.ts — config do drizzle-kit ─────────────
  files['drizzle.config.ts'] = `import 'dotenv/config';
import type { Config } from 'drizzle-kit';
export default {
  schema: './lib/db/schema.ts',
  out: './database/migrations',
  dialect: '${usePostgres ? 'postgresql' : 'sqlite'}',
  dbCredentials: {
    url: process.env.DATABASE_URL || '${usePostgres ? 'postgres://user:pass@localhost:5432/dbname' : 'file:./database/data.db'}',
  },
} satisfies Config;
`;

  return files;
}

function sqliteSchema(): string {
  return `-- Schema SQLite do site exportado
-- Rodar com: npm run db:migrate

CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image TEXT,
  category TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT,
  published_at INTEGER,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime TEXT,
  alt TEXT,
  size INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  parent INTEGER
);
`;
}

function pgSchema(): string {
  return `-- Schema Postgres do site exportado
-- Rodar com: npm run db:migrate

CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  data VARCHAR NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(50),
  image TEXT,
  category VARCHAR(100),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  photo TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  mime VARCHAR(100),
  alt TEXT,
  size INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  href TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  parent INTEGER
);
`;
}

function sqliteMigrate(): string {
  return `import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const url = (process.env.DATABASE_URL || 'file:./database/data.db').replace(/^file:/, '');
mkdirSync(dirname(url), { recursive: true });
const db = new Database(url);
db.pragma('journal_mode = WAL');

const schema = readFileSync(join(process.cwd(), 'database', 'schema.sql'), 'utf8');
db.exec(schema);

console.log('✅ Migração aplicada em', url);
db.close();
`;
}

function pgMigrate(): string {
  return `import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

const url = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname';
const sql = postgres(url, { max: 1 });
const schema = readFileSync(join(process.cwd(), 'database', 'schema.sql'), 'utf8');

try {
  await sql.unsafe(schema);
  console.log('✅ Migração aplicada em', url);
} finally {
  await sql.end();
}
`;
}