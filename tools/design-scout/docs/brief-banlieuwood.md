# Brief Banlieuwood — Auto-inject dans tous les agents créatifs

> Ce fichier est le contexte minimal obligatoire pour tout travail créatif sur Banlieuwood.
> Tout agent créatif DOIT le lire avant de produire quoi que ce soit.

## Ce qu'est Banlieuwood

**Association de cinéma** fondée en 2015 — pas un SaaS pur, pas une école élitiste, pas une ONG misérabiliste.
**Co-fondateurs** : Adrian Younsi, Romain Ndiaye Chansarel + Wadi Anwar Laadam.

Banlieuwood a **3 axes distincts** — toujours préciser lequel avant de commencer :

| Axe | Ce que c'est | Bonnes références | Mauvaises références |
|-----|-------------|-------------------|---------------------|
| **Production films** | Courts-métrages, docs, fictions avec/pour jeunes de quartiers | A24, NEON, Kourtrajmé, Criterion | Netflix, Marvel, studio blockbuster |
| **Ateliers formation** | 8 modules pédagogiques, intervenants en milieu scolaire | Kourtrajmé école, ateliers Varan, festivals jeunesse | FEMIS, ESEC, écoles élitistes |
| **EdTech logiciel** | Cockpit intervenant + interface élève (atelier-banlieuwood.vercel.app) | A24 (esthétique) + Duolingo (engagement) | Moodle, Kahoot, SaaS scolaire générique |

## Identité de marque

**WHY** : Donner accès au cinéma à ceux qui n'y ont pas accès naturellement — les meilleurs films viennent souvent de ceux qui ont le plus à raconter.

**HOW** : Ateliers en milieu scolaire/associatif, pédagogie par la pratique (on fait des films, on ne théorise pas), outil numérique qui supporte sans bureaucratiser.

**WHAT** : Ateliers cinéma (8 modules M1-M8), productions de films, logiciel EdTech pour intervenants.

**Tagline** : "Là où le béton rencontre la pellicule"

**Archétype** : Le Créateur + Le Rebelle

**Gamme** : Premium accessible (pas luxury, pas mass market)

## Cible & Anti-cible

**Persona principal** : Jeune 16-28 ans, quartiers populaires, passion cinéma latente ou déclarée, peu ou pas de réseau dans le milieu artistique.

**Anti-cible** : Étudiant FEMIS, fils/fille de producteur, clientèle aisée habituée au cinéma — ce n'est PAS pour eux.

## Tokens de design

```
--bw-orange: #FF6B35      (couleur primaire, CTAs, accents)
--bw-or: #D4A843          (or, secondaire)
--bw-teal: #4ECDC4        (teal, badges, highlights)
--bw-bg: #0D0B09          (noir cinéma)
--bw-bg-light: #F7F3EA    (beige chaud — sections alternées)
Font titres : Bebas Neue
Font body   : Plus Jakarta Sans
```

## Règles design non-négociables

- **JAMAIS** de fond blanc pur (#FFF) sur Banlieuwood — c'est du beige chaud (#F7F3EA) ou noir cinéma
- **JAMAIS** de style SaaS corporate (grille symétrique, card shadow, badge coloré generic)
- **JAMAIS** de leaderboard ou classement entre élèves (doctrine)
- **TOUJOURS** partir d'une photo réelle (pas stock avec filtre), grain cinéma
- **TOUJOURS** la typographie Bebas Neue pour les titres
- Les témoignages = citations monumentales, pas des cards avec étoiles

## Points de douleur actuels (design)

D'après l'audit A24 vs Banlieuwood (2026-04-03) :
1. Hero trop chargé (8 éléments) → cible : 4 max
2. Widget cockpit SaaS visible dans le hero landing → à cacher
3. Overlay colorée sur photo → à supprimer ou réduire à 20% opacity
4. Pas d'alternance fond noir / fond clair → ajouter sections bg-bw-bg-light
5. Témoignages en cards → passer en citations pleine largeur style magazine

## Score actuel vs cible

| Dimension | Actuel | Cible 6 mois |
|-----------|--------|--------------|
| Typographie | 7/10 | 9/10 |
| Palette / discipline | 6/10 | 9/10 |
| Hiérarchie / layout | 5.5/10 | 8.5/10 |
| Photographie | 6/10 | 8/10 |
| Cohérence marque | 6.5/10 | 9/10 |
