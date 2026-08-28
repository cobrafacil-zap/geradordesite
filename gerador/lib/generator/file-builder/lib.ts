/**
 * Gera os arquivos `lib/` do site exportado:
 * - lib/db/schema.ts (Drizzle)
 * - lib/db/client.ts (inicializa Drizzle para sqlite ou postgres)
 * - lib/auth.ts (JWT + bcrypt)
 * - lib/permissions.ts (RBAC simples)
 */
import type { BuildOptions, FileMap, DbAdapter } from './types';

export function buildLibFiles(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};
  const usePostgres = opts.dbAdapter === 'postgres';

  // ── lib/db/schema.ts (Drizzle, multi-adapter) ────────────────
  files['lib/db/schema.ts'] = `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

const adapter = (process.env.DATABASE_URL || '').startsWith('postgres') ? 'pg' : 'sqlite';

${usePostgres ? pgSchema() : sqliteSchema()}

export const schema = { siteConfig, admins, services, products, team, testimonials, blogPosts, media, menus };
`;

  // ── lib/db/client.ts ─────────────────────────────────────────
  files['lib/db/client.ts'] = `import 'server-only';
${usePostgres ? postgresClient() : sqliteClient()}

export { db };
`;

  // ── lib/auth.ts ──────────────────────────────────────────────
  files['lib/auth.ts'] = `import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db, schema } from '@/lib/db/client';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'change-me-please-this-is-only-a-dev-fallback'
);
const COOKIE = 'admin_session';
const TTL = 60 * 60 * 24 * 7; // 7 dias

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(email: string, plain: string): Promise<boolean> {
  const rows = await db.select().from(schema.admins).limit(1);
  const admin = rows[0];
  if (!admin || admin.email.toLowerCase() !== email.toLowerCase()) return false;
  return bcrypt.compare(plain, admin.passwordHash);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TTL + 's')
    .sign(SECRET);
  cookies().set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: TTL,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE);
}

export async function getSession(): Promise<{ email: string; role: string } | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { email: String(payload.email), role: String(payload.role) };
  } catch { return null; }
}
`;

  // ── lib/permissions.ts ───────────────────────────────────────
  files['lib/permissions.ts'] = `export type Permission = 'manage_content' | 'manage_users' | 'manage_settings';
export function can(role: string | undefined, action: Permission): boolean {
  if (!role) return false;
  if (role === 'admin') return true;
  return false; // readonly para 'editor'
}
`;

  return files;
}

function sqliteSchema(): string {
  return `const siteConfig = sqliteTable('site_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  data: text('data').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  order: integer('order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: text('price'),
  image: text('image'),
  category: text('category'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

const team = sqliteTable('team', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role'),
  bio: text('bio'),
  photo: text('photo'),
  order: integer('order').notNull().default(0),
});

const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  author: text('author').notNull(),
  role: text('role'),
  content: text('content').notNull(),
  rating: integer('rating'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  coverImage: text('cover_image'),
  author: text('author'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  mime: text('mime'),
  alt: text('alt'),
  size: integer('size'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

const menus = sqliteTable('menus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  label: text('label').notNull(),
  href: text('href').notNull(),
  order: integer('order').notNull().default(0),
  parent: integer('parent'),
});
`;
}

function pgSchema(): string {
  return `const siteConfig = pgTable('site_config', {
  id: serial('id').primaryKey(),
  data: varchar('data', { length: '2mb' }).notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description'),
  icon: varchar('icon', { length: 100 }),
  order: integer('order').notNull().default(0),
  active: boolean('active').notNull().default(true),
});

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  price: varchar('price', { length: 50 }),
  image: varchar('image'),
  category: varchar('category', { length: 100 }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  bio: varchar('bio'),
  photo: varchar('photo'),
  order: integer('order').notNull().default(0),
});

const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  author: varchar('author', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  content: varchar('content').notNull(),
  rating: integer('rating'),
  active: boolean('active').notNull().default(true),
});

const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: varchar('excerpt'),
  content: varchar('content'),
  coverImage: varchar('cover_image'),
  author: varchar('author', { length: 255 }),
  publishedAt: timestamp('published_at'),
  active: boolean('active').notNull().default(true),
});

const media = pgTable('media', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url').notNull(),
  mime: varchar('mime', { length: 100 }),
  alt: varchar('alt'),
  size: integer('size'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 100 }).notNull(),
  href: varchar('href').notNull(),
  order: integer('order').notNull().default(0),
  parent: integer('parent'),
});
`;
}

function sqliteClient(): string {
  return `import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import * as schema from './schema';

const url = process.env.DATABASE_URL || 'file:./database/data.db';
const path = url.replace(/^file:/, '');
mkdirSync(dirname(path), { recursive: true });
const sqlite = new Database(path);
sqlite.pragma('journal_mode = WAL');
export const db = drizzle(sqlite, { schema });
`;
}

function postgresClient(): string {
  return `import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const url = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname';
const client = postgres(url, { max: 10 });
export const db = drizzle(client, { schema });
`;
}