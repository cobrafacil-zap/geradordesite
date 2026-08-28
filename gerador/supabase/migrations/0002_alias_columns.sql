-- ─────────────────────────────────────────────────────────────────
-- Migration 0002: adiciona colunas alias *_json
-- (espelhos de schema, theme, assets, pages) para retrocompatibilidade
-- com o código atual que referencia nomes longos.
-- ─────────────────────────────────────────────────────────────────

-- projects
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='schema_json') then
    alter table public.projects add column schema_json jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='theme_json') then
    alter table public.projects add column theme_json jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='assets_json') then
    alter table public.projects add column assets_json jsonb default '[]'::jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='projects' and column_name='pages_json') then
    alter table public.projects add column pages_json jsonb;
  end if;
end $$;

-- project_versions
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='project_versions' and column_name='schema_json') then
    alter table public.project_versions add column schema_json jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='project_versions' and column_name='theme_json') then
    alter table public.project_versions add column theme_json jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='project_versions' and column_name='assets_json') then
    alter table public.project_versions add column assets_json jsonb default '[]'::jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='project_versions' and column_name='pages_json') then
    alter table public.project_versions add column pages_json jsonb;
  end if;
end $$;

-- Trigger para manter schema_json sempre sincronizado com schema (e idem theme/assets/pages)
create or replace function public.sync_alias_columns()
returns trigger
language plpgsql
as $$
begin
  if new.schema_json is null and new.schema is not null then
    new.schema_json := new.schema;
  end if;
  if new.theme_json is null and new.theme is not null then
    new.theme_json := new.theme;
  end if;
  if new.assets_json is null and new.assets is not null then
    new.assets_json := new.assets;
  end if;
  if new.pages_json is null and new.schema is not null and (new.schema ? 'pages') then
    new.pages_json := new.schema->'pages';
  end if;
  -- também escreve nos curtos
  if new.schema is null and new.schema_json is not null then
    new.schema := new.schema_json;
  end if;
  if new.theme is null and new.theme_json is not null then
    new.theme := new.theme_json;
  end if;
  if new.assets is null and new.assets_json is not null then
    new.assets := new.assets_json;
  end if;
  return new;
end $$;

drop trigger if exists trg_sync_alias_versions on public.project_versions;
create trigger trg_sync_alias_versions
  before insert or update on public.project_versions
  for each row execute function public.sync_alias_columns();

drop trigger if exists trg_sync_alias_projects on public.projects;
create trigger trg_sync_alias_projects
  before insert or update on public.projects
  for each row execute function public.sync_alias_columns();

-- Backfill: copia dados existentes
update public.project_versions pv
set schema_json = pv.schema
where pv.schema_json is null and pv.schema is not null;
update public.project_versions pv
set theme_json = pv.theme
where pv.theme_json is null and pv.theme is not null;
update public.project_versions pv
set assets_json = pv.assets
where pv.assets_json is null and pv.assets is not null;
update public.project_versions pv
set pages_json = pv.schema->'pages'
where pv.pages_json is null and pv.schema is not null;