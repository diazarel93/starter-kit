# BRAIN DASHBOARD — Spécification complète
> Document de travail — à enrichir en continu
> Dernière mise à jour : 2 avril 2026

---

## VISION

Un seul endroit pour voir et piloter **tout l'écosystème business de Romain** :
- Tous les projets (Lokivo, Kura, Banlieuwood, Kura Player, Turn Up Formation)
- Toutes les finances (revenus, coûts, abonnements, APIs)
- Toutes les obligations légales et réglementaires
- Tous les utilisateurs, comptes, rôles, beta testeurs
- La formation personnelle et le coaching
- L'intelligence marché et concurrentielle
- La stack technique et sa santé

**Accès par rôle** : Romain voit tout. Les associés voient leur périmètre. Les beta testeurs ont un espace dédié.

---

## SECTION 1 — BUSINESS VITALS (Vue CEO)

### Métriques financières temps réel
- MRR / ARR total et par produit
- Croissance MoM et YoY
- Burn rate mensuel (coûts totaux)
- Runway (mois restants si 0 revenu nouveau)
- Break-even prévisionnel
- Marge brute par produit

### Alertes business
- Churn spike détecté
- Coût API dépasse seuil
- Paiement échoué (Stripe)
- Utilisateur inactif depuis X jours (churn risk)

---

## SECTION 2 — PRODUITS & UTILISATEURS

### Par produit (Lokivo / Kura / Banlieuwood / Turn Up / Kura Player)

**Utilisateurs**
- Total comptes créés / actifs (DAU / WAU / MAU)
- Nouveaux inscrits cette semaine
- Taux activation (inscription → première action clé)
- Taux rétention D1 / D7 / D30
- Sessions moyennes par user / mois
- Géographie des utilisateurs

**Beta testeurs**
- Liste des beta testeurs actifs avec : nom, email, projet, date invitation, statut
- Feedback reçus (notes, commentaires)
- Bugs reportés par beta testeur
- Accès géré depuis le dashboard (inviter / révoquer / relancer)
- NPS score beta

**Comptes à créer / gérer**
- File d'attente d'invitations à envoyer
- Comptes en attente de validation
- Comptes expirés (trial terminé)
- Comptes avec paiement en échec
- Historique des emails envoyés (Resend)

**Onboarding funnel**
- Étape 1 → 2 → 3 : taux de passage par étape
- Drop-offs identifiés
- Temps moyen pour compléter l'onboarding

---

## SECTION 3 — FINANCES & ABONNEMENTS

### Revenus (Stripe)
- MRR par plan (Gratuit / Pro / Enterprise)
- Nouveaux abonnements cette semaine
- Upgrades / Downgrades / Churns
- Failed payments en attente
- Coupons / réductions actifs
- Revenu par pays

### Coûts APIs (mensuel)
| Service | Plan actuel | Coût ce mois | Quota utilisé |
|---------|-------------|--------------|---------------|
| Anthropic Claude | Pay-as-you-go | $X.XX | X tokens |
| Supabase | Pro | $X.XX | X DB / X storage |
| Vercel | Pro | $X.XX | X bandwidth |
| Resend | Pro | $X.XX | X emails |
| Upstash Redis | Pay-as-you-go | $X.XX | X requests |
| GitHub | Free/Team | $X.XX | X Actions min |
| Twilio | Pay-as-you-go | $X.XX | X SMS |
| OpenAI (Kura) | Pay-as-you-go | $X.XX | X tokens |
| Linear | Team | $X.XX | — |
| Figma | Pro | $X.XX | — |
| **TOTAL** | | **$X.XX** | |

### P&L simplifié
```
Revenus MRR         +$X.XX
─────────────────────────
APIs                -$X.XX
Outils SaaS         -$X.XX
Infrastructure      -$X.XX
─────────────────────────
Marge mensuelle     =$X.XX
```

### Alertes coûts
- Anthropic dépasse $X → alerte
- Total coûts dépasse X% du MRR → alerte
- Quota Supabase > 80% → alerte

---

## SECTION 4 — OBLIGATIONS LÉGALES & RÉGLEMENTAIRES

### RGPD / Protection des données
- Politique de confidentialité : date dernière mise à jour / lien
- CGU : date dernière mise à jour / lien
- Mentions légales : à jour ✅/❌
- Cookies : consentement implémenté ✅/❌ (par projet)
- Registre des traitements : complété ✅/❌
- DPO désigné : oui/non
- Données hébergées : pays / provider
- Durée de rétention des données : définie ✅/❌
- Droit à l'effacement : implémenté ✅/❌ (delete account)
- Export données utilisateur : implémenté ✅/❌

### Obligations Kura / RegTech
- Disclaimer Canada : actif ✅/❌
- Guardrails GR1-GR4 : status de chaque
- Liste WADA : version actuelle / date / prochaine mise à jour
- Responsabilité légale : disclaimer affiché sur chaque réponse ✅/❌
- Données médicales : traitement conforme ✅/❌
- Pas de conseil médical : wording vérifié ✅/❌

### Obligations fiscales & comptables
- Statut juridique : (à renseigner)
- Facturation : système en place ✅/❌
- TVA : applicable ✅/❌ / numéro
- Comptable / expert-comptable : contact
- Prochaine déclaration : date
- Kbis / statuts : date de dépôt

### Conformité Stripe
- Business verification : complété ✅/❌
- Stripe Connect (si marketplace) : configuré ✅/❌
- Règles de remboursement : définies ✅/❌
- Dispute rate : X% (objectif < 0.5%)

### Propriété intellectuelle
- Marques déposées : liste + statut
- Domaines : liste + expiration
- Code source : licence définie ✅/❌
- Dépendances open source : licences vérifiées ✅/❌

---

## SECTION 5 — SANTÉ TECHNIQUE

### Par projet
- Dernier déploiement : date / statut / branche
- Build status : ✅ / ❌
- TypeScript errors : X erreurs
- Tests : X passing / X failing / coverage X%
- Lighthouse score : Performance X / SEO X / A11y X
- Bundle size : X kb (objectif < X)
- Core Web Vitals : LCP / CLS / INP
- Uptime : X% (30 derniers jours)
- Dernier incident : date / durée / cause

### Base de données (par projet Supabase)
- Taille DB : X MB / quota Y
- Migrations appliquées : X / dernière le JJ/MM
- RLS : toutes les tables protégées ✅/❌
- Backups : dernière sauvegarde / fréquence
- Connexions actives
- Requêtes lentes détectées

### Sécurité
- Secrets exposés : 0 détecté ✅ / ⚠️ alerte
- Dépendances avec CVE critique : X trouvées
- Headers sécurité (HSTS, CSP) : configurés ✅/❌
- Rate limiting : en place ✅/❌
- Dernière mise à jour dépendances : date

---

## SECTION 6 — QUALITÉ AI & KURA COMPLIANCE

### Coûts AI détaillés
- Coût par feature (quel endpoint coûte le plus)
- Coût moyen par utilisateur / mois
- Modèles utilisés : Haiku X% / Sonnet X% / Opus X%
- Évolution du coût semaine sur semaine

### Qualité des réponses Kura
- Score evals : X/100 substances correctes
- Feedback utilisateurs : X% positif / X% négatif
- Guardrails déclenchés : GR1 X fois / GR2 X fois / GR3 X fois / GR4 X fois
- Substances inconnues : X requêtes cette semaine
- Requêtes Canada : X (avec disclaimer)
- Catégories les plus cherchées : S1 X% / S2 X% / S3 X%...
- Temps de réponse moyen : X sec

### Pipeline RAG
- Freshness DB substances : dernière mise à jour
- Couverture liste WADA : X% des substances indexées
- Score retrieval (pertinence) : X%

---

## SECTION 7 — INTELLIGENCE MARCHÉ

### Concurrents antidopage
- Global DRO : dernière mise à jour détectée
- e-list (WADA officielle) : statut
- Autres outils compliance sport : liste
- Différenciation Kura vs concurrents : matrice

### Veille WADA
- Dernières annonces officielles
- Nouvelles substances ajoutées / retirées
- Changements de seuils
- Calendrier : prochaine mise à jour liste (1er janv.)
- Conférences WADA à venir

### Veille tech stack
- Claude Code : version actuelle / changelog
- Next.js : version / breaking changes
- Supabase : nouvelles features
- Modèles AI : nouveautés / dépréciations (Haiku 3 → 19/04/2026)

### Opportunités marché
- RegTech sport : taille de marché / croissance
- Marchés cibles : pays / fédérations / sports prioritaires
- Événements : conférences où pitcher Kura
- Partenaires potentiels : NADOs, fédérations, équipes pro

---

## SECTION 8 — ÉQUIPE & ACCÈS

### Rôles et permissions
| Rôle | Projets | Sections visibles |
|------|---------|------------------|
| `owner` | Tous | Tout |
| `associate-lokivo` | Lokivo | Produit, finances Lokivo, technique |
| `associate-kura` | Kura | Compliance, produit, AI quality |
| `associate-banlieuwood` | Banlieuwood | Produit, technique |
| `developer` | Assigné | Technique uniquement |
| `beta-tester` | Assigné | Feedback form uniquement |
| `accountant` | Tous (lecture) | Finances uniquement |

### Gestion des comptes
- Inviter un membre : email + rôle + projet
- Révoquer un accès
- Historique connexions
- Sessions actives

### Beta testeurs
- Liste avec : nom / email / projet / date invite / dernière activité
- Feedback soumis
- Bugs reportés
- Accès expiration
- Bouton "Envoyer rappel"

---

## SECTION 9 — FORMATION PERSONNELLE

### Curriculum en cours
- Semaine X / Jour Y
- Sujet du jour (Tech + Kura)
- Prochain quiz : dans X heures (cron 20h)
- Mots du jour reçus ✅/❌

### Progression
- Streak : X jours consécutifs de quiz
- Précision globale : X%
  - Kura/Antidopage : X%
  - Dev AI : X%
  - Anglais : X%
  - RegTech/Compliance : X%
- Mots appris : X total
- Coaching tips reçus : X cette semaine

### Radar de compétences
```
Dev AI          ████████░░ 80%
Kura/Antidopage ██████░░░░ 60%
Anglais pro     █████░░░░░ 50%
Founder CTO     ████░░░░░░ 40%
RegTech marché  ███░░░░░░░ 30%
```

### Agents invoqués (cette semaine)
- Top 5 agents utilisés
- Agents jamais utilisés (rappel)
- Recommandation agent-guardian

---

## SECTION 10 — DÉCISIONS & STRATÉGIE

### Décisions actives (decisions.md live)
- Toutes les décisions avec date / contexte / statut
- Recherche full-text
- Filtre par projet / domaine

### Roadmap visuelle
```
Maintenant     → Kura V4 production
30 jours       → Brain Dashboard live
90 jours       → Lokivo 1000 users
180 jours      → Kura première conférence WADA
1 an           → Lever de fonds ou rentabilité
```

### Leçons apprises
- learnings.md live
- Searchable
- Enrichi automatiquement par agent-guardian

### Prochaines milestones
- Par projet : objectif + date + responsable

---

## ARCHITECTURE TECHNIQUE

### Stack
```
Next.js 16 App Router
Supabase (auth + data)
Tailwind CSS 4 + shadcn/ui
Recharts (graphiques)
TanStack Query (cache + refresh)
Vercel (hosting)
```

### Sources de données
```typescript
// APIs externes
anthropic-usage.ts   → Anthropic Console API ou Langfuse
github.ts            → GitHub REST API v3
vercel.ts            → Vercel API
supabase-mgmt.ts     → Supabase Management API
stripe.ts            → Stripe API
resend.ts            → Resend API
upstash.ts           → Upstash API
wada-scraper.ts      → Scraping site officiel WADA

// Local / fichiers
projects-json.ts     → starter-kit/projects.json
decisions-md.ts      → starter-kit/decisions.md
bot-logs.ts          → /tmp/coach-logs, .bot-state.json
curriculum.ts        → docs/curriculum/*.json
git-status.ts        → shell exec git commands
```

### Refresh rates
```
Temps réel (WebSocket)  → alertes critiques, build status
Toutes les 5 min        → coûts APIs, uptime
Toutes les heures       → métriques produit, Stripe
Chaque jour             → formation, decisions, WADA
Manuel                  → données légales, roadmap
```

### Authentification
```
Supabase Auth
→ Magic link (email)
→ Rôles stockés dans supabase: user_roles table
→ Middleware Next.js vérifie rôle avant chaque section
```

---

## PLAN DE BUILD

### Phase 1 — Fondations (Jour 1)
- Repo `brain/` initialisé depuis starter-kit template
- Auth Supabase + système de rôles
- Layout principal avec navigation par section
- Routing protégé par rôle

### Phase 2 — Coûts & APIs (Jour 2)
- GitHub API : repos, CI, PRs
- Vercel API : deployments, erreurs
- Supabase Management API : DB health
- Section Finances : tableau des coûts

### Phase 3 — Business (Jour 3)
- Stripe API : MRR, churn, abonnés
- Section Business Vitals
- Alertes coûts

### Phase 4 — Kura Compliance (Jour 4)
- Section compliance : guardrails stats
- Fraîcheur DB substances
- Evals score
- Veille WADA

### Phase 5 — Utilisateurs & Beta (Jour 5)
- Gestion comptes par projet
- Interface beta testeurs
- Invitations et révocations

### Phase 6 — Formation (Jour 6)
- Historique coaching depuis logs
- Streak et précision
- Radar compétences
- Connexion avec bot Telegram

### Phase 7 — Légal & Stratégie (Jour 7)
- Checklist obligations légales
- decisions.md live
- Roadmap visuelle

### Phase 8 — Intelligence marché (Jour 8)
- Veille WADA automatique
- Concurrents
- Événements calendrier

### Phase 9 — Polish & Deploy (Jour 9)
- Dark mode complet
- Mobile responsive
- Notifications push
- Déploiement Vercel production
- Accès associés configuré

---

## CE QU'ON NE FAIT PAS (hors scope v1)

- App mobile native (web responsive suffit)
- Intégration comptabilité (QuickBooks, Pennylane) — v2
- Tableau de bord clients (chaque client a son propre dashboard produit)
- BI avancée (dbt, Metabase) — si volume justifie

---

## QUESTIONS OUVERTES

1. Hébergement : Vercel (public avec auth) ou local Mac uniquement ?
2. Anthropic API : pas de dashboard usage officiel → Langfuse ou tracking manuel ?
3. Associés : ont-ils accès maintenant ou après MVP ?
4. Mobile : responsive web suffit ou app Telegram pour notifications ?
5. Données légales : remplies manuellement ou connectées à un service ?
6. Comptable : accès lecture finances oui/non ?

---

*Ce document est la spec vivante du Brain Dashboard.
Enrichir au fil des sessions avec Cowork ou Claude Code.*
