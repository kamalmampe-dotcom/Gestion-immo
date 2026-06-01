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

-- Recharge l'application après avoir cliqué "Run".
