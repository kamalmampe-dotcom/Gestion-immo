-- ============================================================
-- ImmoGestion Cameroun — SQL à coller dans Supabase
-- (Menu Supabase : SQL Editor > New query > coller > Run)
-- Sans danger : "if not exists" => rien n'est cassé si déjà fait.
-- ============================================================

-- ---------- PHASE 1 : Cœur financier ----------

-- 1) Contrats : fréquence de paiement, jour limite et pénalités
alter table contracts add column if not exists frequency     text    default 'mensuel'; -- mensuel | trimestriel | semestriel | annuel
alter table contracts add column if not exists payment_day   int     default 5;        -- jour limite du mois
alter table contracts add column if not exists penalty_mode  text    default 'fixe';   -- fixe | pourcentage
alter table contracts add column if not exists penalty_value numeric default 0;        -- montant FCFA ou % selon le mode

-- 2) Paiements : mode de paiement + annulation (jamais de suppression)
alter table payments  add column if not exists mode          text    default 'especes'; -- especes | virement | mobile_money | cheque
alter table payments  add column if not exists cancelled     boolean default false;
alter table payments  add column if not exists cancel_reason text;

-- ---------- PHASE 2 : Traçabilité (journal d'audit) ----------

create table if not exists audit_logs (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid default auth.uid(),
  actor_email text,
  action      text,   -- creation | modification | annulation | resiliation | paiement | connexion | sinistre | validation
  entity      text,   -- bien | locataire | contrat | paiement | sinistre | session
  entity_id   uuid,
  label       text,   -- libellé lisible
  created_at  timestamptz default now()
);
alter table audit_logs enable row level security;

-- Chaque bailleur voit/écrit uniquement son journal ; le super-admin voit tout.
drop policy if exists "audit owner all" on audit_logs;
create policy "audit owner all" on audit_logs for all
  using (owner_id = auth.uid() or is_super())
  with check (owner_id = auth.uid());

-- ---------- PHASE 3 : Immeubles (regroupement d'appartements) ----------
-- Un appartement peut être rattaché à un immeuble (un bien de type 'Immeuble').
alter table properties add column if not exists parent_id uuid;

-- ---------- PHASE 4 : Profil bailleur enrichi + avenants + super-admin ----------
alter table profiles  add column if not exists city               text;
alter table profiles  add column if not exists cni                text;
alter table profiles  add column if not exists address            text;
alter table profiles  add column if not exists active             boolean default true;
alter table contracts add column if not exists parent_contract_id uuid;  -- avenant

-- Permettre au super-admin de gérer les autres comptes (sinon il ne peut éditer que le sien)
drop policy if exists "profiles self" on profiles;
create policy "profiles self" on profiles for all
  using (id = auth.uid() or is_super())
  with check (id = auth.uid() or is_super());

-- ---------- PHASE 5 : Sécurité (validation contrat + désactivation) ----------
-- Le locataire ne doit pouvoir QUE valider son contrat (pas le modifier).
drop policy if exists "contracts tenant validate" on contracts;
create or replace function validate_my_contract(cid uuid) returns void
  language plpgsql security definer as $$
begin
  update contracts set validated = true
  where id = cid
    and tenant_id in (select id from tenants where lower(email) = lower(auth.email()));
end; $$;
grant execute on function validate_my_contract(uuid) to authenticated;
-- (la colonne profiles.active a déjà été ajoutée en Phase 4 ; un compte active=false est bloqué à la connexion)

-- Recharge l'application après avoir cliqué "Run".
