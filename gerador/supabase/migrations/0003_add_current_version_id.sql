-- ────────────────────────────────────────────────────────────────
-- 0003_add_current_version_id.sql
--
-- Adiciona a coluna current_version_id em projects, que aponta
-- para a versão "ativa" do projeto. Até agora, o schema tinha
-- project_versions mas o link projects.current_version_id
-- faltava — o erro
--   "Could not find the 'current_version_id' column of 'projects'
--    in the schema cache"
-- acontecia porque o PostgREST só conhece o schema que foi carregado
-- via migrations, e essa coluna não existia.
-- ────────────────────────────────────────────────────────────────

alter table public.projects
  add column if not exists current_version_id uuid
    references public.project_versions(id) on delete set null;

-- índice simples pra acelerar lookups por current_version_id
create index if not exists idx_projects_current_version
  on public.projects(current_version_id);

-- ────────────────────────────────────────────────────────────────
-- Backfill: pra projetos que já tinham versões mas nunca tiveram
-- a coluna setada, vincula à versão mais antiga.
-- ────────────────────────────────────────────────────────────────

update public.projects p
  set current_version_id = (
    select id from public.project_versions v
    where v.project_id = p.id
    order by v.created_at asc
    limit 1
  )
where p.current_version_id is null
  and exists (select 1 from public.project_versions v where v.project_id = p.id);

-- Permite SELECT da coluna via PostgREST
-- (RLS em projects já libera SELECT por owner, então sem policy nova)