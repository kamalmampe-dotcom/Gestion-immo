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

-- C'est tout pour la Phase 1. Recharge l'application après avoir cliqué "Run".
