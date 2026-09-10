-- ─────────────────────────────────────────────────────────────────
-- 0004: Briefings de clientes + pagamentos (Mercado Pago)
-- ─────────────────────────────────────────────────────────────────
--
-- Fluxo:
--   1) Admin gera link /checkout/{token} (cria linha em briefings).
--   2) Cliente responde briefing + paga (cria linha em payments).
--   3) Webhook do MP aprova o pagamento → marca briefing como 'paid'
--      e cria project + project_version + cliente (se não existir).
--
-- Acesso:
--   - briefings / payments: o dono (owner_id) tem CRUD via RLS.
--   - Leitura pública (anônima) é feita SOMENTE via /api/briefings/[token]
--     com service-role — a RLS não dá acesso anônimo.

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,                     -- URL pública /checkout/{token}
  owner_id uuid references auth.users(id) on delete cascade not null,
  -- Respostas do briefing (8 perguntas + uploads)
  client_name text,                                -- 1. Nome da empresa
  description text,                                -- 2. O que sua empresa faz?
  services text,                                   -- 3. Quais serviços/produtos deseja destacar?
  whatsapp text,                                   -- 4. WhatsApp
  instagram text,                                  -- 4. Instagram (mesma linha)
  colors text,                                     -- 5. Quais cores deseja no site?
  reference_url text,                              -- 7. Tem algum site como referência?
  extra_info text,                                 -- 8. Alguma informação importante?
  logo_url text,                                   -- 6. Logomarca
  photos text[] default '{}'::text[],              -- 6. Fotos
  -- Estado
  status text default 'pending' check (status in ('pending','paid','expired','cancelled')),
  created_at timestamptz default now() not null,
  paid_at timestamptz,
  expires_at timestamptz default (now() + interval '7 days'),
  project_id uuid references public.projects(id) on delete set null
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid references public.briefings(id) on delete cascade not null,
  provider text not null default 'mercadopago',
  provider_id text unique,                         -- preference_id (evita duplicatas via webhook)
  payment_id text,                                 -- payment_id do MP (preenchido no webhook)
  amount_cents int not null,                       -- 90 (teste) ou 19700 (produção)
  currency text default 'BRL' not null,
  status text default 'pending' check (status in ('pending','approved','rejected','refunded','cancelled')),
  raw_response jsonb,                              -- payload completo do MP
  created_at timestamptz default now() not null,
  approved_at timestamptz
);

-- ─── Índices ─────────────────────────────────────────────────────
create index if not exists idx_briefings_token on public.briefings(token);
create index if not exists idx_briefings_status on public.briefings(status);
create index if not exists idx_briefings_owner on public.briefings(owner_id);
create index if not exists idx_briefings_project on public.briefings(project_id);
create index if not exists idx_payments_briefing on public.payments(briefing_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_provider_id on public.payments(provider_id);

-- ─── RLS ─────────────────────────────────────────────────────────
alter table public.briefings enable row level security;
alter table public.payments enable row level security;

-- Briefings: o dono (admin) tem CRUD nos briefings que ele criou
drop policy if exists "briefings_owner_all" on public.briefings;
create policy "briefings_owner_all" on public.briefings for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Payments: o dono só consegue ler/escrever via service-role (não há
-- contexto de auth.uid() no webhook). As policies abaixo só permitem
-- SELECT — escrita é via API com service-role.
drop policy if exists "payments_select_owner" on public.payments;
create policy "payments_select_owner" on public.payments for select
  using (
    exists(select 1 from public.briefings b where b.id = payments.briefing_id and b.owner_id = auth.uid())
  );
