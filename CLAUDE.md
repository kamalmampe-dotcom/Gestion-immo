# ImmoGestion Cameroun — Contexte projet (lire en premier)

## Qui je suis (le porteur du projet)
Je m'appelle Junior. **Je ne suis pas développeur.** Explique-moi toujours en français, simplement, et **demande-moi confirmation avant de modifier ou supprimer des fichiers.** Quand tu as fini une amélioration, **fais un commit clair et pousse sur GitHub** : mon site se redéploie tout seul sur Vercel.

## Ce qu'est le projet
Application web de **gestion locative pour bailleurs au Cameroun**, que je veux **vendre** à mon bailleur puis à d'autres (2 à 5 la première année). Elle doit rester **belle, simple et fiable**.

## Stack (à respecter absolument)
- **Un seul fichier `index.html`** : HTML + CSS + JavaScript « vanilla » (PAS de framework, PAS d'étape de build npm). C'est volontaire : je déploie en glissant le fichier sur GitHub, sans rien installer.
- **Supabase** = base de données + connexion (Auth) + stockage des photos. Les 2 clés sont collées tout en haut de `index.html` (la clé « anon » est publique par design ; la sécurité vient des règles RLS).
- **Vercel** héberge le site (auto-déploiement depuis GitHub).
- **PWA** : `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` (installable sur téléphone).
- Librairies via CDN uniquement : `@supabase/supabase-js@2`, `jspdf` (PDF), `Chart.js` (graphiques).

## Contraintes non négociables
- **Budget = 0 FCFA/mois.** Uniquement des offres gratuites.
- **PAS de Mobile Money.** Les paiements sont **saisis manuellement**.
- **Garder un seul fichier `index.html`** tant que c'est raisonnable (je dois pouvoir déployer sans outils).
- Interface en **français**, montants en **FCFA**, contexte camerounais (CNI, relances **WhatsApp** via liens `wa.me`).
- **Pas de tirets cadratins (—)** dans les textes affichés.

## Design (déjà en place, à conserver)
- Couleurs : **bleu** (`--accent #2563eb`) + **marine** (`--primary #0f172a`) sur fond clair (`#f9fafb`). Vert = succès, rouge = alerte, orange = avertissement. (Thème bleu choisi le 2026-05-31, remplace l'ancien vert/or.)
- Polices : **Bricolage Grotesque** (titres, classe `.dsp`) + **Plus Jakarta Sans** (texte).
- Réutilise les variables CSS et classes existantes (`.btn`, `.card`, `.b`, `.modal`, etc.).

## Base de données Supabase (tables existantes)
Toutes ont une colonne `owner_id uuid default auth.uid()` et une règle RLS `owner_id = auth.uid()` :
- `properties` (biens) : type, name, city, rent_amount, status, rooms, surface, photo_url, **archived**
- `tenants` (locataires) : full_name, phone, email, cni, photo_url, **profession, cni_doc_url, profession_doc_url, archived**
- `contracts` : property_id, tenant_id, start_date, end_date, rent_amount, deposit_amount, status, **validated, archived**
- `payments` : contract_id, tenant_id, property_id, type, amount, status, period, paid_at
- `incidents` (sinistres) : property_id, tenant_id, title, description, type, priority, status, cost, contractor, photo_before, photo_after, **comments (jsonb)**, resolved_at
- Bucket de stockage **`photos`** (public) pour les images et les documents (CNI, justificatifs).
- **`profiles`** (1 par utilisateur connecté = bailleur/super-admin) : id (=auth.uid), full_name, phone, company, photo_url, **role** ('owner' | 'super'). Le super-admin (role='super', via la fonction `is_super()`) voit et gère TOUTES les données par RLS.

## Ce qui marche déjà (v3)
Connexion email/mot de passe · tableau de bord avec graphiques (revenus 6 mois, occupation) et cartes d'analyse (taux de recouvrement, loyers attendus, bien le plus rentable) · biens avec photo · locataires avec photo · contrats + bail PDF · paiements manuels + quittance PDF + relance WhatsApp · sinistres (photo avant/après, timeline d'évolution, commentaires, coût/réparateur).

**Ajouté depuis (juin 2026) :** portail locataire complet · édition de toutes les fiches · factures PDF · export Excel (CSV) · filtres mois/année + KPI avancés (bénéfice net, dépenses maintenance, contrats expirants, ancienneté des impayés) · graphiques revenus-par-bien et évolution-des-impayés · recherche globale · alertes contrats expirants · vue Kanban des sinistres · WhatsApp contextuel · centre de notifications (cloche) · archivage (biens/locataires/contrats) · profil bailleur + super-admin · profil locataire avec upload CNI/justificatif + validation de contrat. La PWA charge en « cache d'abord » (sw.js v2) et jsPDF est chargé à la demande.

## Prochaine étape à développer : le PORTAIL LOCATAIRE
Objectif : un locataire se connecte avec **email + mot de passe** et voit **uniquement ses données**.
1. Détecter le rôle à la connexion : si l'email connecté correspond à un `tenants.email`, afficher l'**espace locataire** ; sinon l'espace bailleur.
2. Le locataire voit : son logement, son contrat, ses paiements/quittances, ses sinistres.
3. **Le locataire ET le bailleur peuvent déclarer un sinistre** (avec photo).
4. Sécurité Supabase (RLS) : ajouter des règles pour que le locataire puisse LIRE ses lignes (tenants/contracts/payments/incidents le concernant) et CRÉER un sinistre. Prévoir que `incidents.owner_id` soit celui du **bailleur** même quand c'est le locataire qui déclare (via un trigger sur la table à partir du bien).
5. **Donne-moi le SQL à coller dans Supabase** quand il y en a, expliqué pas à pas.

## Méthode de travail attendue
- Avance par **petites étapes testables**.
- Avant un gros changement, **explique le plan** et attends mon accord (tu peux utiliser le mode plan).
- Après validation : modifie `index.html`, **commit + push**, et dis-moi quoi tester.
- Si tu touches à Supabase, donne-moi le SQL + les clics, je n'ai pas le réflexe technique.
