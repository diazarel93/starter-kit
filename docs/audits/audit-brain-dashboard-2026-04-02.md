# Audit Brain Dashboard — 2 avril 2026

---

## AUDIT CODE (code-reviewer)

### Bloquant
- Aucun bloquant sécurité

### Problèmes par priorité

| # | Problème | Fichier | Statut |
|---|---|---|---|
| 1 | legal/marche/equipe ignorent `?p=` — ProjectSwitcher cassé sur ces pages | `legal/marche/equipe/page.tsx` | ✓ Corrigé |
| 2 | formation/decisions : `text-3xl` + casse normale au lieu de `text-4xl MAJUSCULES` | `formation/decisions/page.tsx` | ✓ Corrigé |
| 3 | VitalsGrid : "Burn Rate" et "Coût APIs" = même valeur, doublon | `VitalsGrid.tsx` | ✓ Corrigé |
| 4 | `require("fs")` dynamique à remplacer par import ES top-level | `brain-data.ts` | ✓ Corrigé |
| 5 | `SectionShell.tsx` — composant mort, prop `phase` inutilisée | `SectionShell.tsx` | À faire |
| 6 | formation/page.tsx : "5 messages/jour" vs mémoire "4 messages/jour" | `formation/page.tsx` | À vérifier |
| 7 | QuickStats : "Turn Up" dans filtre banlieuwood sans repo ni données | `QuickStats.tsx` | ✓ Corrigé |
| 8 | `getStripeMRR` : limite 100 abonnements sans pagination | `brain-data.ts` | À faire (post-clients) |

---

## AUDIT DESIGN (design-director)

### P0 — Critique

**1. `BrainHeader.tsx` est un composant mort**
Existe dans `/components/brain/BrainHeader.tsx` mais n'est importé nulle part. Le `layout.tsx` réimplémente un header inline. Pas de bouton déconnexion dans l'UI réelle.
→ Supprimer `BrainHeader.tsx` ou le brancher.

**2. `ProjectSwitcher` mal positionné — trop discret**
Coincé dans le topbar entre "Live" et "Brain OS". Sur iPad, trop petit et visuellement noyé. L'action principale du cockpit (filtrer par projet) devrait être dans la sidebar sous le logo.
→ Déplacer dans `BrainNav` sous le logo BRAIN.

**3. Grille 5 cards — card orpheline**
`VitalsGrid` : `grid-cols-2 lg:grid-cols-3` avec 5 cards → 1 card seule sur la dernière ligne. Quand c'est "Builds CI" en rouge, l'orpheline est critique.
→ Passer à 6 cards ou `grid-cols-2` seulement.

### P1 — Majeur

**4. 6 composants `Card` dupliqués**
`ai/page.tsx`, `finances/page.tsx`, `produits/page.tsx`, `tech/page.tsx`, `VitalsGrid.tsx`, `SectionShell.tsx` — 6 implémentations Card avec des incohérences (`tracking-widest` vs `tracking-wide`, status `"dim"` seulement dans ai, `trend` seulement dans VitalCard).
→ Créer `components/brain/Card.tsx` partagé.

**5. États zéros sans contexte**
`produits/page.tsx` : 4 zéros avec `text-white/40`. Pas de message explicatif. `ai/page.tsx` : 6 tirets en status `"dim"` pour les guardrails Kura — un bloc entier de tirets sans signal.
→ Ajouter messages contextuels (ex: "Aucun utilisateur · Supabase à connecter").

**6. `SectionShell` mort + bloc `<div><h1><p>` dupliqué sur chaque page**
Toutes les pages réimplémentent le même header. `SectionShell` n'est importé nulle part.
→ Créer un composant `PageHeader` partagé + supprimer `SectionShell`.

**7. Nav — `border-l-2 border-transparent` sur liens inactifs**
`BrainNav.tsx` ligne 57 : la bordure transparente prend de l'espace et parasite l'alignement sur iPad.
→ Appliquer `border-l-2` uniquement sur l'état actif.

### P2 — Moyen

**8. h1 `text-5xl` sur home vs `text-4xl` sur sous-pages**
Non documenté = ressemble à un oubli, pas à une hiérarchie intentionnelle.

**9. Build age invisible sur iPad**
`QuickStats.tsx` : l'âge du build est dans un `title=""` (tooltip HTML natif) — inaccessible sur iPad (pas de hover).

**10. `decisions.md` affiché en `<pre>` brut**
`decisions/page.tsx` : markdown brut en mono sur un dashboard premium = régression visuelle.

**11. Progress bars formation sans animation au mount**
`transition-all` sur `width` statique SSR → aucune animation. L'effet cinétique est perdu.

**12. `role="admin"` hardcodé dans layout**
`layout.tsx` : `<BrainNav role="admin" />` affiché en bas de nav mais toujours "admin".

**13. Dossier `vitals/` vide**
`/brain/vitals/` existe mais est vide et absent de la nav.

### Manques UI

| Manque | Impact |
|---|---|
| Pas de breadcrumb dans le topbar | Sur iPad, on ne sait pas où on est sans lire le h1 |
| Pas de timestamp "dernière MàJ" visible | `revalidate=3600` invisible pour l'utilisateur |
| Fallbacks Suspense trop petits (`h-10`, `h-14`) | AlertsPanel et QuickStats sans skeleton réaliste |
| Pas de feedback pendant changement de projet | SSR silencieux = UX floue |

### Récap effort

| Priorité | Problème | Effort |
|---|---|---|
| P0 | ProjectSwitcher → déplacer dans sidebar | 1h |
| P0 | Supprimer BrainHeader.tsx mort | 5min |
| P0 | Grid orpheline VitalsGrid | 15min |
| P1 | Card composant partagé | 2h |
| P1 | États zéros contextuels | 1h |
| P1 | PageHeader partagé + supprimer SectionShell | 1h |
| P1 | border-l nav inactive | 5min |
| P2 | Build age visible inline | 30min |
| P2 | decisions.md → rendu markdown | 1h |
| P2 | Supprimer dossier vitals/ vide | 5min |

---

*Audit généré le 2026-04-02 · code-reviewer + design-director*
