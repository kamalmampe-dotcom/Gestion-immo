-- ===================================================================
-- ImmoGestion Cameroun — SCHÉMA SQL COMPLET (idempotent / sans danger)
-- -------------------------------------------------------------------
-- À coller dans Supabase : SQL Editor > New query > tout coller > Run.
-- "if not exists" / "drop ... if exists" => relançable sans rien casser.
-- Sur ta base ACTUELLE (qui marche déjà), seuls les blocs PHASE 1 et
-- PHASE 2 sont vraiment nouveaux ; le reste ne fait que confirmer
-- l'existant. Tu peux tout lancer en une fois sans risque.
-- ===================================================================

-- ---------- 0) Extension pour gen_random_uuid() ----------
create extension if not exists pgcrypto;

-- (La fonction is_super() est créée plus bas, APRÈS la table profiles
--  qu'elle utilise, sinon PostgreSQL refuse : "profiles does not exist".)

-- ===================================================================
-- 2) TABLES (création si absentes)
-- ===================================================================

create table if not exists profiles (
  id         uuid primary key default auth.uid(),
  full_name  text,
  phone      text,
  company    text,
  photo_url  text,
  city       text,
  cni        text,
  address    text,
  role       text default 'owner',          -- 'owner' | 'super'
  active     boolean default true,
  created_at timestamptz default now()
);

create table if not exists properties (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid default auth.uid(),
  type        text,
  name        text,
  city        text,
  rent_amount numeric default 0,
  status      text default 'vacant',         -- vacant | reserve | occupe | preavis | maintenance
  rooms       int,
  surface     numeric,
  photo_url   text,
  parent_id   uuid,                          -- appartement rattaché à un immeuble
  archived    boolean default false,
  created_at  timestamptz default now()
);

create table if not exists tenants (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid default auth.uid(),
  full_name          text,
  phone              text,
  email              text,
  cni                text,
  photo_url          text,
  profession         text,
  cni_doc_url        text,
  profession_doc_url text,
  archived           boolean default false,
  created_at         timestamptz default now()
);

create table if not exists contracts (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid default auth.uid(),
  property_id    uuid,
  tenant_id      uuid,
  start_date     date,
  end_date       date,
  rent_amount    numeric default 0,
  deposit_amount numeric default 0,
  status         text default 'actif',       -- brouillon | attente | actif | resilie
  validated      boolean default false,
  archived       boolean default false,
  frequency      text default 'mensuel',     -- mensuel | trimestriel | semestriel | annuel
  payment_day    int default 5,
  penalty_mode   text default 'fixe',        -- fixe | pourcentage
  penalty_value  numeric default 0,
  created_at     timestamptz default now()
);

create table if not exists payments (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid default auth.uid(),
  contract_id   uuid,
  tenant_id     uuid,
  property_id   uuid,
  type          text,                         -- loyer | caution | avance | penalite | remboursement
  amount        numeric default 0,
  status        text default 'paye',          -- paye | en_attente | retard
  period        text,
  paid_at       date,
  mode          text default 'especes',       -- especes | virement | mobile_money | cheque
  cancelled     boolean default false,
  cancel_reason text,
  created_at    timestamptz default now()
);

create table if not exists incidents (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid default auth.uid(),
  property_id  uuid,
  tenant_id    uuid,
  title        text,
  description  text,
  type         text,
  priority     text,
  status       text default 'declare',
  cost         numeric,
  contractor   text,
  photo_before text,
  photo_after  text,
  comments     jsonb default '[]'::jsonb,
  resolved_at  timestamptz,
  created_at   timestamptz default now()
);

create table if not exists audit_logs (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid default auth.uid(),
  actor_email text,
  action      text,
  entity      text,
  entity_id   uuid,
  label       text,
  created_at  timestamptz default now()
);

-- ===================================================================
-- 3) COLONNES AJOUTÉES (au cas où les tables existaient déjà sans elles)
-- ===================================================================
alter table properties add column if not exists archived           boolean default false;
alter table properties add column if not exists parent_id          uuid;    -- appartement rattaché à un immeuble
alter table tenants    add column if not exists profession         text;
alter table tenants    add column if not exists cni_doc_url        text;
alter table tenants    add column if not exists profession_doc_url text;
alter table tenants    add column if not exists archived           boolean default false;
alter table contracts  add column if not exists validated          boolean default false;
alter table contracts  add column if not exists archived           boolean default false;
-- PHASE 1 :
alter table contracts  add column if not exists frequency          text    default 'mensuel';
alter table contracts  add column if not exists payment_day        int     default 5;
alter table contracts  add column if not exists penalty_mode       text    default 'fixe';
alter table contracts  add column if not exists penalty_value      numeric default 0;
alter table payments   add column if not exists mode               text    default 'especes';
alter table payments   add column if not exists cancelled          boolean default false;
alter table payments   add column if not exists cancel_reason      text;
alter table incidents  add column if not exists comments           jsonb   default '[]'::jsonb;
alter table profiles   add column if not exists role               text    default 'owner';
alter table profiles   add column if not exists city               text;
alter table profiles   add column if not exists cni                text;
alter table profiles   add column if not exists address            text;
alter table profiles   add column if not exists active             boolean default true;
alter table contracts  add column if not exists parent_contract_id uuid;    -- avenant rattaché au contrat d'origine

-- ===================================================================
-- 3bis) Fonction super-admin (créée APRÈS la table profiles)
--       security definer => contourne la RLS pour éviter toute récursion.
-- ===================================================================
create or replace function is_super() returns boolean
  language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'super');
$$;

-- ===================================================================
-- 4) RLS : activer + politiques (bailleur = ses lignes ; super = tout)
-- ===================================================================
alter table profiles   enable row level security;
alter table properties enable row level security;
alter table tenants    enable row level security;
alter table contracts  enable row level security;
alter table payments   enable row level security;
alter table incidents  enable row level security;
alter table audit_logs enable row level security;

-- Profil : chacun le sien (le super voit tout)
drop policy if exists "profiles self" on profiles;
create policy "profiles self" on profiles for all
  using (id = auth.uid() or is_super())
  with check (id = auth.uid() or is_super());

-- Biens
drop policy if exists "properties owner" on properties;
create policy "properties owner" on properties for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid() or is_super());

-- Locataires
drop policy if exists "tenants owner" on tenants;
create policy "tenants owner" on tenants for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid() or is_super());

-- Contrats
drop policy if exists "contracts owner" on contracts;
create policy "contracts owner" on contracts for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid() or is_super());

-- Paiements
drop policy if exists "payments owner" on payments;
create policy "payments owner" on payments for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid() or is_super());

-- Sinistres
drop policy if exists "incidents owner" on incidents;
create policy "incidents owner" on incidents for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid() or is_super());

-- Journal d'audit
drop policy if exists "audit owner all" on audit_logs;
create policy "audit owner all" on audit_logs for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid());

-- ===================================================================
-- 5) PORTAIL LOCATAIRE : le locataire LIT ses lignes + déclare un sinistre
--    (identifié par son email = celui de sa fiche tenants)
-- ===================================================================
drop policy if exists "tenants self read" on tenants;
create policy "tenants self read" on tenants for select
  using (lower(email) = lower(auth.email()));

drop policy if exists "contracts tenant read" on contracts;
create policy "contracts tenant read" on contracts for select
  using (tenant_id in (select id from tenants where lower(email) = lower(auth.email())));

drop policy if exists "payments tenant read" on payments;
create policy "payments tenant read" on payments for select
  using (tenant_id in (select id from tenants where lower(email) = lower(auth.email())));

drop policy if exists "incidents tenant read" on incidents;
create policy "incidents tenant read" on incidents for select
  using (tenant_id in (select id from tenants where lower(email) = lower(auth.email())));

drop policy if exists "incidents tenant insert" on incidents;
create policy "incidents tenant insert" on incidents for insert
  with check (tenant_id in (select id from tenants where lower(email) = lower(auth.email())));

-- Le locataire peut valider son contrat (passe validated à true)
drop policy if exists "contracts tenant validate" on contracts;
create policy "contracts tenant validate" on contracts for update
  using (tenant_id in (select id from tenants where lower(email) = lower(auth.email())));

-- ===================================================================
-- 6) TRIGGER : un sinistre déclaré par le locataire reçoit owner_id du bailleur
-- ===================================================================
create or replace function set_incident_owner() returns trigger
  language plpgsql security definer as $$
begin
  if new.owner_id is null then
    select owner_id into new.owner_id from properties where id = new.property_id;
  end if;
  return new;
end; $$;

drop trigger if exists trg_incident_owner on incidents;
create trigger trg_incident_owner before insert on incidents
  for each row execute function set_incident_owner();

-- ===================================================================
-- 7) STOCKAGE (buckets + accès)
-- ===================================================================
insert into storage.buckets (id, name, public) values ('photos','photos',true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents','documents',false)
  on conflict (id) do nothing;

-- Photos : lecture publique, écriture par tout utilisateur connecté
drop policy if exists "photos read"  on storage.objects;
create policy "photos read"  on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "photos write" on storage.objects;
create policy "photos write" on storage.objects for insert to authenticated with check (bucket_id = 'photos');
drop policy if exists "photos upd"   on storage.objects;
create policy "photos upd"   on storage.objects for update to authenticated using (bucket_id = 'photos');
drop policy if exists "photos del"   on storage.objects;
create policy "photos del"   on storage.objects for delete to authenticated using (bucket_id = 'photos');

-- Documents (CNI, justificatifs) : privés, accessibles aux utilisateurs connectés
-- (l'appli génère des liens signés temporaires ; le bailleur consulte les pièces de ses locataires)
drop policy if exists "documents read"  on storage.objects;
create policy "documents read"  on storage.objects for select to authenticated using (bucket_id = 'documents');
drop policy if exists "documents write" on storage.objects;
create policy "documents write" on storage.objects for insert to authenticated with check (bucket_id = 'documents');

-- ===================================================================
-- FIN. Recharge l'application après "Run".
-- ===================================================================
