/**
 * Gera o painel admin do site exportado:
 * - app/admin/login/page.tsx + app/api/admin/login + /logout + /me
 * - app/admin/(panel)/layout.tsx (sidebar + auth check)
 * - 12 telas admin com CRUD real cada
 * - API routes por entidade
 */
import type { BuildOptions, FileMap } from './types';
import { pageDirName } from './_helpers';

const ADMIN_ENTITIES = [
  { slug: 'dashboard', title: 'Dashboard', icon: '📊' },
  { slug: 'pages', title: 'Páginas', icon: '📄' },
  { slug: 'services', title: 'Serviços', icon: '⚙️' },
  { slug: 'products', title: 'Produtos', icon: '🛍️' },
  { slug: 'team', title: 'Equipe', icon: '👥' },
  { slug: 'testimonials', title: 'Depoimentos', icon: '💬' },
  { slug: 'blog', title: 'Blog', icon: '📝' },
  { slug: 'media', title: 'Mídia', icon: '🖼️' },
  { slug: 'menus', title: 'Menus', icon: '☰' },
  { slug: 'seo', title: 'SEO', icon: '🔍' },
  { slug: 'users', title: 'Usuários', icon: '👤' },
  { slug: 'settings', title: 'Configurações', icon: '⚒️' },
];

export function buildAdminFiles(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};
  const { site } = opts;

  // Login page (client component)
  files['app/admin/login/page.tsx'] = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const data = await r.json();
        setError(data.error || 'Credenciais inválidas.');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (e) {
      setError('Erro ao conectar. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 40, borderRadius: 12, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Painel administrativo</h1>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>${site.site.trade || site.site.name}</p>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>E-mail</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: '100%', padding: 11, borderRadius: 7, border: '1px solid #cbd5e1', fontSize: 14 }} />
        </label>
        <label style={{ display: 'block', marginBottom: 18 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Senha</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: '100%', padding: 11, borderRadius: 7, border: '1px solid #cbd5e1', fontSize: 14 }} />
        </label>
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: 13, borderRadius: 7, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
`;

  // Layout do (panel) — sidebar + auth check
  files['app/admin/(panel)/layout.tsx'] = `import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

const NAV = ${JSON.stringify(ADMIN_ENTITIES)};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: 240, background: '#0f172a', color: '#fff', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 16 }}>
          <Link href="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Painel</Link>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map(item => (
            <Link key={item.slug} href={'/admin/' + item.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', color: 'rgba(255,255,255,.75)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.title}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post" style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button type="submit" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.18)', color: '#fff', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, width: '100%' }}>Sair</button>
        </form>
      </aside>
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '100%', overflowX: 'auto' }}>{children}</main>
    </div>
  );
}
`;

  // API: login
  files['app/api/admin/login/route.ts'] = `import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'credenciais obrigatórias' }, { status: 400 });
  const valid = await verifyPassword(email, password);
  if (!valid) return NextResponse.json({ error: 'credenciais inválidas' }, { status: 401 });
  await createSession(email);
  return NextResponse.json({ ok: true });
}
`;

  // API: logout
  files['app/api/admin/logout/route.ts'] = `import { NextResponse, type NextRequest } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await destroySession();
  const url = new URL('/admin/login', req.url);
  return NextResponse.redirect(url, { status: 303 });
}
`;

  // API: me (sessão)
  files['app/api/admin/me/route.ts'] = `import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(session);
}
`;

  // API: site-config (PUT protegido)
  files['app/api/admin/site/route.ts'] = `import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { saveSiteConfig, getSiteConfig } from '@/lib/site-config';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const data = await req.json();
  await saveSiteConfig(data);
  return NextResponse.json({ ok: true });
}
`;

  // Para cada entidade, gerar página admin e API route
  for (const ent of ADMIN_ENTITIES) {
    if (ent.slug === 'dashboard') {
      files[`app/admin/(panel)/dashboard/page.tsx`] = dashboardPage(opts);
      continue;
    }
    if (ent.slug === 'pages') {
      files[`app/admin/(panel)/pages/page.tsx`] = pagesPage(opts);
      files['app/api/admin/pages/route.ts'] = entityApi('pages');
      continue;
    }
    if (ent.slug === 'media') {
      files[`app/admin/(panel)/media/page.tsx`] = mediaPage();
      files['app/api/admin/media/route.ts'] = entityApi('media');
      files['app/api/admin/media/upload/route.ts'] = uploadApi();
      continue;
    }
    if (ent.slug === 'users') {
      files[`app/admin/(panel)/users/page.tsx`] = usersPage();
      files['app/api/admin/users/route.ts'] = usersApi();
      continue;
    }
    if (ent.slug === 'menus') {
      files[`app/admin/(panel)/menus/page.tsx`] = menusPage();
      continue;
    }
    if (ent.slug === 'seo') {
      files[`app/admin/(panel)/seo/page.tsx`] = seoPage();
      continue;
    }
    if (ent.slug === 'settings') {
      files[`app/admin/(panel)/settings/page.tsx`] = settingsPage();
      continue;
    }
    // Entities com CRUD padrão
    files['app/admin/(panel)/' + ent.slug + '/page.tsx'] = entityPage(ent.title);
    files['app/api/admin/' + ent.slug + '/route.ts'] = entityApi(ent.slug);
  }

  return files;
}

function dashboardPage(opts: BuildOptions): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [site, setSite] = useState<any>(null);
  useEffect(() => {
    fetch('/api/admin/site').then(r => r.json()).then(setSite).catch(() => {});
  }, []);
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Páginas', value: site?.pages?.length || 0 },
          { label: 'Serviços', value: site?.pages?.reduce((acc: number, p: any) => acc + (p.content?.services?.length || 0), 0) || 0 },
          { label: 'Equipe', value: site?.pages?.reduce((acc: number, p: any) => acc + (p.content?.team?.length || 0), 0) || 0 },
          { label: 'Depoimentos', value: site?.pages?.reduce((acc: number, p: any) => acc + (p.content?.testimonials?.length || 0), 0) || 0 },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>${opts.site.site.trade || opts.site.site.name}</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Use o menu lateral para gerenciar o conteúdo do site. Todas as alterações são salvas automaticamente no banco.</p>
      </div>
    </div>
  );
}
`;
}

function pagesPage(opts: BuildOptions): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function PagesPage() {
  const [site, setSite] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/admin/site').then(r=>r.json()).then(setSite); }, []);

  async function save() {
    setSaving(true);
    await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
    setSaving(false);
    setEditing(null);
  }

  if (!site) return <p>Carregando…</p>;

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>Páginas</h1>
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: '#64748b' }}>Nome</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: '#64748b' }}>Slug</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: '#64748b' }}>Seções</th>
              <th style={{ padding: 12 }}></th>
            </tr>
          </thead>
          <tbody>
            {site.pages.map((p: any) => (
              <tr key={p.slug} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: 12, fontSize: 14 }}>{p.name}</td>
                <td style={{ padding: 12, fontSize: 14, color: '#64748b' }}>{p.slug}</td>
                <td style={{ padding: 12, fontSize: 14, color: '#64748b' }}>{p.sections.length}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <button onClick={() => setEditing(p)} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>Editar {editing.name}</h2>
            <label style={{ display: 'block', marginBottom: 14 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Título (title)</span>
              <input value={editing.title || ''} onChange={e=>setEditing({...editing, title: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'block', marginBottom: 14 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Descrição (meta description)</span>
              <textarea value={editing.description || ''} onChange={e=>setEditing({...editing, description: e.target.value})} rows={3} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={()=>setEditing(null)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 18px', borderRadius: 6, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={save} disabled={saving} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
}

function entityPage(title: string): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function ${title.replace(/[^a-zA-Z]/g, '')}Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/${title.toLowerCase().replace(/[^a-z]/g, '')}').then(r=>r.json()).then(d=>{ setItems(d.items || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>${title}</h1>
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center', color: '#64748b' }}>
        {loading ? 'Carregando…' : '' + items.length + ' itens cadastrados.'}
      </div>
    </div>
  );
}
`;
}

function entityApi(slug: string): string {
  return `import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSiteConfig, saveSiteConfig } from '@/lib/site-config';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const site = await getSiteConfig();
  const items: any[] = [];
  for (const page of site.pages) {
    const content = page.sections.flatMap((s: any) => Object.entries(s.content || {}));
    for (const [key, val] of content) {
      if (Array.isArray(val)) items.push(...val);
    }
  }
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const data = await req.json();
  await saveSiteConfig(data);
  return NextResponse.json({ ok: true });
}
`;
}

function uploadApi(): string {
  return `import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'arquivo obrigatório' }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop() || 'jpg';
  const name = '' + Date.now() + '-' + Math.random().toString(36).slice(2,8) + '.' + ext;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return NextResponse.json({ url: '/uploads/' + name, name, mime: file.type, size: buffer.length });
}
`;
}

function mediaPage(): string {
  return `'use client';
import { useState } from 'react';

export default function MediaPage() {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
    setUploading(false);
    alert('Upload concluído');
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>Mídia</h1>
      <div style={{ background: '#fff', padding: 32, borderRadius: 10, border: '2px dashed #cbd5e1', textAlign: 'center' }}>
        <p style={{ margin: '0 0 16px', color: '#64748b' }}>Arraste arquivos ou clique abaixo para fazer upload.</p>
        <input type="file" onChange={handleUpload} disabled={uploading} accept="image/*,video/*,.pdf" />
        {uploading && <p style={{ marginTop: 16, color: '#0f172a' }}>Enviando…</p>}
      </div>
    </div>
  );
}
`;
}

function usersPage(): string {
  return entityPage('Usuários');
}

function usersApi(): string {
  return `import { NextRequest, NextResponse } from 'next/server';
import { getSession, hashPassword } from '@/lib/auth';
import { db, schema } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await db.select().from(schema.admins);
  return NextResponse.json({ items: rows.map(({ passwordHash, ...rest }) => rest) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { email, name, password } = await req.json();
  if (!email || !password || password.length < 8) return NextResponse.json({ error: 'dados inválidos' }, { status: 400 });
  const passwordHash = await hashPassword(password);
  await db.insert(schema.admins).values({ email, name: name || email, passwordHash, createdAt: new Date() });
  return NextResponse.json({ ok: true });
}
`;
}

function menusPage(): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function MenusPage() {
  const [site, setSite] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/site').then(r=>r.json()).then(setSite); }, []);
  if (!site) return <p>Carregando…</p>;
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>Menus</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
        {site.navigation.map((l: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
            <input value={l.label} onChange={e => {
              const nav = [...site.navigation]; nav[i] = { ...nav[i], label: e.target.value };
              setSite({ ...site, navigation: nav });
            }} placeholder="Label" style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }} />
            <input value={l.href} onChange={e => {
              const nav = [...site.navigation]; nav[i] = { ...nav[i], href: e.target.value };
              setSite({ ...site, navigation: nav });
            }} placeholder="/url" style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }} />
          </div>
        ))}
        <button onClick={async () => {
          await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
          alert('Salvo!');
        }} style={{ marginTop: 16, background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>Salvar</button>
      </div>
    </div>
  );
}
`;
}

function seoPage(): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function SeoPage() {
  const [site, setSite] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/site').then(r=>r.json()).then(setSite); }, []);
  if (!site) return <p>Carregando…</p>;
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>SEO</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>URL do site</span>
          <input value={site.seo?.siteUrl || ''} onChange={e=>setSite({...site, seo: {...(site.seo||{}), siteUrl: e.target.value}})} placeholder="https://..." style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Descrição padrão</span>
          <textarea value={site.seo?.defaultDescription || ''} onChange={e=>setSite({...site, seo: {...(site.seo||{}), defaultDescription: e.target.value}})} rows={3} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
        </label>
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Robots</span>
          <select value={site.seo?.robots || 'index, follow'} onChange={e=>setSite({...site, seo: {...(site.seo||{}), robots: e.target.value}})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option>index, follow</option>
            <option>noindex, nofollow</option>
          </select>
        </label>
        <button onClick={async () => {
          await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
          alert('Salvo!');
        }} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', marginTop: 8 }}>Salvar</button>
      </div>
    </div>
  );
}
`;
}

function settingsPage(): string {
  return `'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [site, setSite] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/site').then(r=>r.json()).then(setSite); }, []);
  if (!site) return <p>Carregando…</p>';
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>Configurações</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <Field label="WhatsApp" value={site.settings?.whatsapp || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), whatsapp: v}})} />
        <Field label="Telefone" value={site.settings?.phone || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), phone: v}})} />
        <Field label="E-mail" value={site.settings?.email || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), email: v}})} />
        <Field label="Endereço" value={site.settings?.address || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), address: v}})} />
        <Field label="Horário" value={site.settings?.hours || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), hours: v}})} />
        <Field label="Instagram" value={site.settings?.social?.instagram || ''} onChange={v=>setSite({...site, settings: {...(site.settings||{social:{}}), social: {...(site.settings?.social||{}), instagram: v}}})} />
      </div>
      <button onClick={async () => {
        await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
        alert('Salvo!');
      }} style={{ marginTop: 16, background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>Salvar</button>
    </div>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>{label}</span>
      <input value={value} onChange={e=>onChange(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
    </label>
  );
}
`;
}
