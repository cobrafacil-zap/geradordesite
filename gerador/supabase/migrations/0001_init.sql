-- ─────────────────────────────────────────────────────────────────
-- Fábrica de Sites — Schema do Gerador (Sistema A)
-- ─────────────────────────────────────────────────────────────────

-- Profiles (espelha auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Clientes
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  segment text,
  whatsapp text,
  phone text,
  email text,
  city text,
  state text,
  notes text,
  created_at timestamptz default now() not null
);

-- Projetos
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  template_id text not null,
  status text default 'draft' check (status in ('draft','generating','ready','failed')),
  schema jsonb,
  theme jsonb,
  assets jsonb,
  generation_log jsonb default '[]'::jsonb,
  error_message text,
  zip_path text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Versões de projeto (autosave + checkpoints)
create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  label text not null,
  schema jsonb not null,
  theme jsonb not null,
  assets jsonb,
  created_at timestamptz default now() not null
);

-- Assets (mídia do projeto)
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  url text not null,
  origin text default 'upload' check (origin in ('upload','external','reference')),
  mime text,
  alt text,
  created_at timestamptz default now() not null
);

-- Referências visuais (sites/Instagram/etc)
create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  type text default 'site' check (type in ('site','instagram','visual')),
  title text,
  palette jsonb,
  created_at timestamptz default now() not null
);

-- Templates (catálogo interno — gerado pelo motor)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  segment text not null,
  description text,
  default_theme jsonb,
  pages jsonb,
  presets jsonb,
  created_at timestamptz default now() not null
);

-- ─── Índices ──────────────────────────────────────────────────────
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_clients_owner on public.clients(owner_id);
create index if not exists idx_versions_project on public.project_versions(project_id, created_at desc);
create index if not exists idx_assets_project on public.assets(project_id);
create index if not exists idx_assets_owner on public.assets(owner_id);
create index if not exists idx_templates_category on public.templates(category);

-- ─── Row Level Security ───────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.assets enable row level security;
alter table public.references enable row level security;
alter table public.templates enable row level security;

-- Profiles: o dono lê/atualiza o próprio perfil
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Policies genéricas para tabelas do owner
drop policy if exists "clients_owner_all" on public.clients;
create policy "clients_owner_all" on public.clients for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "projects_owner_all" on public.projects;
create policy "projects_owner_all" on public.projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "versions_owner_all" on public.project_versions;
create policy "versions_owner_all" on public.project_versions for all using (
  exists(select 1 from public.projects p where p.id = project_versions.project_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.projects p where p.id = project_versions.project_id and p.owner_id = auth.uid())
);

drop policy if exists "assets_owner_all" on public.assets;
create policy "assets_owner_all" on public.assets for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "references_owner_all" on public.references;
create policy "references_owner_all" on public.references for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Templates: leitura pública (catálogo do gerador), escrita só service role
drop policy if exists "templates_read_all" on public.templates;
create policy "templates_read_all" on public.templates for select using (true);

-- ─── Trigger: criar profile ao registrar ──────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Trigger: updated_at em projects ──────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute procedure public.touch_updated_at();
