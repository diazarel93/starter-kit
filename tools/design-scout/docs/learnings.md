# Design Scout — Mémoire persistante des apprentissages

> Ce fichier est enrichi à chaque session d'analyse. Il contient les conclusions durables,
> les patterns qui reviennent, les erreurs à ne plus reproduire.
> À lire EN PREMIER à chaque invocation du design-scout.

---

## Seuil actuel — Design Critic

```
Seuil minimum acceptable  : 62/70
Seuil "excellent"          : 65/70
Seuil "world-class"        : 68/70

Historique :
- 2026-04-03 : seuil fixé à 56/70 (baseline session intensive)
- 2026-04-04 : seuil monté à 62/70 — session 3 propositions SaaS, scores 64-67/70 après 3 rounds. Brief précis + checklist 6 règles = nouveau minimum.

Prochain palier : 2026-05-04 → passer à 64/70 si 3 sessions consécutives passent facilement
Règle : augmenter de 2pts par mois si le niveau le permet. Ne jamais baisser.

KB actuelle : 641 sites (2026-04-03) — objectif 700 en cours
Fichiers graphiques permanents :
  - kb-palettes.json       → 15 palettes par mood/secteur
  - kb-typography.json     → systèmes typo par style
  - kb-graphic-elements.json → 25 éléments graphiques (textures, patterns, formes)
  - kb-illustration-styles.json → 15 styles illustration
  - kb-animations.json     → types d'animation + timing (pending)
Couverture secteurs : luxury-fashion, streetwear, automotive, cinema, saas, gaming, media,
  art-contemporain, architecture, music, editorial-fashion, web3, civic-nonprofit,
  sport, health, beauty, food, finance, legal, btp, travel, social, crypto, dating,
  craft-beer, coffee-brand, spirits, wine-premium, outdoor, coworking,
  airlines, dashboard-analytics, pricing-page, indie-gaming,
  design-history (8 mouvements), global-design-cultures (africa/latam/middle-east),
  aesthetic-medicine, executive-search, yoga-pilates,
  surf-snow, skate-brand, tattoo-studio,
  management-consulting, legal-premium
```

**Pour mettre à jour le seuil** : modifier aussi la section "Boucle qualité obligatoire" dans design-director.md et le score minimum dans design-critic.md.

---

## Conclusions durables (2026)

### Sur le design premium dark

**Pattern validé** : Les sites premium sombres (A24, MUBI, Criterion) ont toujours la même discipline :
- Zéro élément décoratif — chaque pixel est fonctionnel ou narratif
- La couleur d'accent n'est PAS dans l'UI (bouton, nav) — elle EST le contenu
- Serif éditorial custom pour les titres films, grotesque condensé uppercase pour le reste
- Pas de gradient, pas de shadow, pas de border-radius sur les éléments principaux

**Pattern échoué** : Overlay colorée sur photo → détruit le grain cinéma, uniformise, appauvrit

---

### Sur le craft & beverage design (2026-04-03)

**Pattern craft beer** : Deux écoles diamétralement opposées — rebel/punk (BrewDog, Beavertown : couleurs vives, crânes, typographie agressive) vs nordic/minimal (Mikkeller : une police custom, blanc, zéro image). Les deux sont premium mais signalent des tribus différentes.

**Pattern café specialty** : Le whitespace généreux = signal de luxe dans le café. Tim Wendelboe, Blue Bottle utilisent l'espace vide comme argument de qualité — "on n'a pas besoin de te convaincre". Custom typography (Stumptown, Onyx) crée l'identité là où d'autres utilisent la couleur.

**Règle universelle craft** : Jamais plus de 4 couleurs. Une couleur accent vivante sur palette neutre = différenciation. Plus = dilution.

---

### Le WAAAAA peut venir du produit lui-même, pas du design (2026-04-04)

**Cas Kura** : L'audit design-critic a donné 52/70 en pointant l'absence de "singularité visuelle". C'était faux. Le WAAAAA de la landing Kura c'est la démo live interactive :
- Searchbar → "Caféine" → verdict card verte AUTHORIZED · Source DETERMINISTIC
- "Cannabis" → verdict rouge PROHIBITED · Class S8 · Confidence HIGH · KURA_DB
- "EPO" → état "Analyzing..." avec spinner → verdict

Personne dans le RegTech / compliance ne fait ça sur sa landing. Le vrai moteur tourne en direct.

**Règle critique** : Avant de chercher un effet visuel différenciant, demander : "Est-ce que le produit lui-même peut être montré en action sur la landing ?" Si oui, c'est ça le moment WAAAAA — pas un radar CSS ou une display font custom.

**Ce que ça change dans l'audit D5** :
- Un produit avec une démo fonctionnelle live = score D5 automatiquement 8+/10, même si le design est générique
- La démo Kura (searchbar + verdict card qui apparaît) = signature impossible à copier par un concurrent sans le moteur
- Le design-critic ne doit pas noter D5 sans avoir testé l'interactivité du site

**Pattern à retenir** : Design = cadre. Produit = contenu. Le meilleur cadre du monde ne compense pas un produit qui ne se montre pas. Et un produit exceptionnel qui se montre en live rend le cadre secondaire.

---

### Techniques cinématiques — Gap 30%→85% (2026-04-04)

**Constat brutal** : Les landings produites par l'agent étaient à 30% de l'excellence. L'analyse de la vraie landing Kura (Next.js, Framer Motion, videos) a révélé le gap.

**7 techniques manquantes — OBLIGATOIRES dans toute landing premium :**

1. **Logo reveal** — jamais statique. Lettre par lettre (stagger 80ms), SVG stroke-dashoffset, ou clip-path reveal. Toujours.

2. **Figure contextuelle dans le hero** — une silhouette, une forme, un objet qui dit IMMÉDIATEMENT le secteur. Athlète pour sport/santé. Globe/circuit pour tech/data. Mannequin pour mode. CSS only = radial-gradient + mask-image SVG inline + animation de pulsation.

3. **Brand reveal section** — section plein viewport avec nom de marque en 15vw+, fond sombre/vidéo, moment de pause dramatique. Position : entre Problème et Solution. Non-négociable pour toute landing > 6 sections.

4. **Video background** — si fichier disponible : `<video autoplay muted loop playsinline>`. Si non : simulation CSS avec radial-gradient animé + `@keyframes` de déplacement lent + grain SVG opacity 0.03. La simulation doit BOUGER.

5. **Scroll-driven narrative (statement section)** — IntersectionObserver qui allume des mots au scroll. Mots en opacity 0.2 au repos, couleur accent au passage. Phrase courte (<10 mots), taille 5-7vw.

6. **Radar/scope animation** — pour tout produit data/tech/sécurité. Cercle rotatif avec conic-gradient + animation radarSpin 8s linear infinite. Crée une impression de surveillance active, de traitement en cours.

7. **Loading screen cinématique** — logo + barre de progression CSS. 1.5-2s max. Fade out doux (opacity transition 0.6s). Standard mondial pour les landings premium.

**Vidéos Kura disponibles pour réutilisation :**
- `hero-athlete.mp4` → silhouette athlète (hero background)
- `statement-stadium.mp4` → stade (brand reveal / statement)
- `hero-scan.mp4` → scanning (section data/tech)
- `demo-capsule.mp4` → capsule (section demo)
- Chemin absolu : `/Users/diazarel/kura-v4/kura-ai/dashboard/public/videos/`

**Règle de validation** avant chaque rendu : "Est-ce que quelque chose bouge dans chaque section ?" Si une section entière est statique → ajouter animation.

---

### Sur la génération de 3 propositions identitaires (2026-04-04)

**Contexte** : Session intensive — 3 directions (SYSTÈME/TERRAIN/SIGNAL) pour plateforme SaaS multi-disciplines. 3 rounds d'itération avec screenshots + analyse + fixes ciblés.

**Règle #1 — Le brief est plus important que le talent de l'agent**
La progression de la journée (59→67/70) n'est pas venue de l'agent qui s'est amélioré — c'est le brief qui s'est précisé. Un brief avec : ce qu'il NE faut PAS faire, les références exactes, les critères de score, les 3 directions nommées = output 8 points supérieur au premier essai.
→ **Avant de générer, investir autant de temps dans le brief que dans la génération.**

**Règle #2 — Le cockpit a ses propres lois de design**
Un cockpit intervenant (interface live en salle) n'est PAS une app SaaS normale. Lois spécifiques :
- Chrono : minimum 88px, police monospace ou display, couleur contrastée. Visible à 3m.
- Contrôles navigation (étape préc/suiv) : sticky bottom, 56px minimum de hauteur, 180px minimum de largeur, bouton principal couleur pleine (pas outline)
- Instruction centrale : serif display 28px+, max 2 lignes, jamais de blocs de texte
- Panel participants : représentation visuelle (cercles/barres), pas de liste de noms
→ **Toujours designer le cockpit comme un tableau de bord physique, pas une page web.**

**Règle #3 — Cards de disciplines : différenciation = identité**
Quand une plateforme a plusieurs modes/disciplines, les cartes ne peuvent pas toutes être identiques (dark card + icône blanc = échec). Chaque discipline doit avoir sa couleur propre, appliquée en fond de card. Contrastes : pour les couleurs claires (jaune, vert clair), texte sombre.
→ **Assigner une couleur par discipline dès le départ, l'appliquer partout de manière cohérente.**

**Règle #4 — Dark-on-dark = bug invisible**
Sidebar dark sur fond dark est le bug le plus fréquent et le moins détecté visuellement dans les maquettes. Toujours vérifier : fond sidebar vs texte nav. Ratio minimum : `#1A1A24` pour fond, crème 70% opacity pour texte = lisible.
→ **Rule : jamais fond sidebar = fond page. Différence minimum : 10% de luminosité.**

**Règle #5 — Pas de placeholder vide dans une grille**
Une grille de N items avec un item vide (N+1 cellule) est un bug visuel grave. Soit N items remplissent parfaitement la grille (4+3 avec centrage, ou 3+3+1, etc.), soit on repense la grille.
→ **Avant de valider une grille, compter les items et vérifier qu'il n'y a pas de cellule fantôme.**

**Règle #6 — Le meilleur résultat en 1 passe, pas en 3**
Pattern constaté : 3 propositions médiocres → analyse → 3 améliorations → analyse → 3 fixes = 3 rounds coûteux. Alternative : un brief ultra-précis + une seule direction poussée au max = meilleur output en moins de tokens.
→ **Pour les prochains briefs multi-direction : inclure dans le prompt les 5 règles ci-dessus comme "checklist de validation obligatoire avant de soumettre le code."**

---

### Sur le design culturel global (2026-04-03)

**Découverte clé** : Aucun studio émergent authentique (Afrique, Amérique Latine, Moyen-Orient) n'utilise de patterns folkloriques directs. L'identité culturelle s'exprime via **palette + philosophie de conception**, pas via décoration ethnique visible.

- Studios africains (Lagos, Cape Town) : minimalisme sophistiqué, afrofuturisme pour le futur imaginé, pas le passé représenté
- Studios latino (Anagrama, Estudio Doble) : intelligence créative, minimalisme professionnel pour asseoir l'autorité
- Moyen-Orient (Dubai) : refuse l'orientalisme, positionne comme plateforme d'ouverture contemporaine

**Pour Banlieuwood** : L'orange/teal fonctionne si elle signifie *énergie créative métropolitaine*, pas si elle crie "Afrique décorative".

---

### Sur les mouvements historiques — leur influence contemporaine (2026-04-03)

| Mouvement | Ce qu'il apporte aujourd'hui |
|-----------|------------------------------|
| Swiss/International Style | Structure des dashboards, grille des design systems |
| Constructivisme | Affiches événementielles, editoriaux politisés |
| Art Nouveau | Marques wellness, beauté organique, luxury botanique |
| De Stijl | UI minimaliste, landing pages tech brutales |
| Postmodernisme | Branding "anti-branding", streetwear ironique |
| Grunge | Zines digitaux, imprimé indie, esthétique lo-fi |

**Règle** : Connaître l'histoire du design permet de choisir une référence consciemment plutôt que de la recycler inconsciemment.

---

### Sur la contre-culture premium (2026-04-03)

**Règle fondamentale** : Authenticité = refuser le arrondi. Zero `border-radius` en contre-culture. Le "friendly" détruit la tribu.

**Couleur = positionnement politique** — Volcom choisit rouge sang (#A80000) pas bleu lifestyle. Ce choix signale une posture, pas une esthétique.

**Skateable vs Lifestyle** : deux mondes distincts. Skateable (Polar, Bronze56K) = utilité et épure. Lifestyle (Welcome) = mystique et illustration. Ne pas mélanger.

**Tattoo premium** : 3 stratégies gagnantes — Legacy (patine vintage intentionnelle), Fine Art contemporain (spécialisation technique), Celebrity Accessible (portfolio-hero + walk-in).

**Tribe markers** : micro-codes d'appartenance (Helvetica pur = rigor scandinave, neon yellow = Y2K nostalgia, GIF retro = patina earned). Ces codes ne se feignent pas.

---

### Sur le consulting & legal premium (2026-04-03)

**Paradoxe de l'ennui** : Les meilleurs cabinets (McKinsey, BCG, Bain) évitent le boring par un accent chromatique inattendu — lime (#7EF473 BCG), teal, rouge pur. Pas de multicolore, UNE couleur forte.

**Legal vs Consulting** :
- Legal : blanc/gris + zéro accent = restraint maximum = confiance absolue
- Consulting : accent vibrante + contenu riche (podcasts, insights) = modernité crédible

**Pour Banlieuwood** : L'orange #FF6B35 est déjà plus vibrant que n'importe quel concurrent B2B. La mitigation = photographie authentique (élèves en atelier) + métriques quantifiées + typographie légère et généreuse.

---

### Sur les UI patterns SaaS (2026-04-03)

**Dashboard analytics** : Hierachie données via cards [value + label + chart], pas tableaux. Monospace pour les chiffres critiques. Dark mode systématique pour les sessions longues.

**Pricing pages** : Cascade additive (chaque tier = antérieur + nouvelles features). Badge psychologique ("Most Popular") sur le tier business = 80% des conversions. Free limits explicites > promesses vagues = meilleur taux de conversion.

---

### Sur les landings EdTech / culturelles

**Erreur récurrente** : Mettre trop d'éléments en compétition dans le hero.
- A24 : 2 éléments (photo + liste de titres)
- Banlieuwood actuel : 8 éléments → neutralisation mutuelle
- Règle : hero = max 4 éléments, UN seul CTA

**Pattern validé** : L'alternance dark/light crée le rythme respiratoire. Sans elle, la page est fatigante.

---

### Sur la typographie éditoriale

**Insight clé** : La puissance d'une typo vient de son utilisation radicale, pas de son choix.
- Bebas Neue à 80px = bon choix
- Bebas Neue à 80px SANS padding, pleine largeur, sur fond de photo = niveau A24
- Bebas Neue à 80px dans un container centré avec padding standard = niveau EdTech générique

**Règle** : La taille seule ne suffit pas. Le contexte spatial (respiration, tension, contraste de fond) fait la différence.

---

### Sur la photographie en design cinéma

**Erreur commune** : Ajouter un overlay coloré pour "harmoniser" avec la charte.
**Solution correcte** : Choisir une photo dont l'éclairage naturel s'intègre à la charte.
- Photo contre-jour urbain nocturne → intègre naturellement un fond sombre
- Lumière de projecteur sur un visage → intègre naturellement un fond noir
- Pas de filtre : le cinéma c'est la lumière réelle, pas la correction colorimétrique

---

### Sur les témoignages

**Anti-pattern** : Card blanche avec étoiles dorées et photo avatar = Trustpilot = générique = nuit à la marque premium
**Pattern validé** : Citation pleine largeur en typo monumentale + légende en uppercase small avec tiret accent = éditorial = crédible

---

## Audit A24 vs Banlieuwood — Synthèse (2026-04-03)

**Score A24** : 66.5/70
**Score Banlieuwood** : 44/70
**Gap** : -22.5 points

**Ce que Banlieuwood fait bien** :
- Headline "SPECTATEURS HIER. / RÉALISATEURS AUJOURD'HUI." — niveau A24
- Choix Bebas Neue — cohérent avec le cinéma
- Conviction du discours ("Sans notes, sans classement")
- Mobile : propre, meilleure discipline que le desktop

**Chantiers prioritaires identifiés** :
1. Retirer le widget cockpit du hero (impact massif)
2. Supprimer overlay photo (impact fort)
3. Réduire hero à 4 éléments (impact fort)
4. Alterner fond noir / fond clair (impact moyen-fort)
5. Témoignages en citations monumentales (impact moyen)

---

## Sites analysés avec insights notables

### A24 Films (a24films.com) — World-reference
- **Insight** : Navigation brutalement minimale ("MENU" + hamburger) assumée comme parti-pris éditorial
- **Insight** : Les accents couleur sont DANS le contenu, jamais dans l'UI
- **Pattern réutilisable** : Footer 3 colonnes uppercase condensé, input email brutalist

### Banlieuwood (atelier-banlieuwood.vercel.app) — Niveau actuel : 44/70
- **Diagnostic** : L'énergie et l'intention d'A24 sont là. La discipline du silence manque.
- **Meilleur élément** : Le copywriting du headline
- **Pire élément** : Widget cockpit SaaS dans le hero cinéma

---

## Insights cross-secteurs — Session 2026-04-03 (batch massif 246+ sites)

### Luxe sub-esthétique — la granularité qui compte

**Règle critique** : "Luxury" n'est PAS un style. C'est 10 styles distincts qui s'excluent mutuellement.
- Gucci = baroque camp flora maximalism (green-red, serif display orné)
- Margiela = déconstruction anonymat numéros (blanc, pas de logo, subversif)
- Prada = intellectualisme kitsch sophistiqué (triangle, nylon utilitaire, paradoxe)
- Hermès = artisanat sellier silence premium (orange box, carré, pas de drop)
- Bottega = intrecciato discrétion craft (terra, pattern tissé, no logo)
- Jacquemus = soleil Provence minimalisme méridional (pastels, ombre, légèreté)
- Celine (Hedi) = rigueur parisienne sans serif absolue (neutralité, épure, froid)
- Loewe = craft espagnol surréalisme (anagram, peau naturelle, artistique)

**Application** : Quand un client dit "je veux du luxe" → DEMANDER : lequel ? L'ambiance va tout changer.

---

### Gaming — le dark premium est le même partout

**Insight transversal** : Les jeux premium (FromSoftware, Annapurna) et le cinéma premium (A24) partagent la MÊME discipline visuelle :
- Fond sombre (#0a0a0a)
- 1 couleur accent (5-15% de surface)
- Zéro décoration
- Photographie/screenshot comme protagoniste

**Application** : Ce pattern marche pour Banlieuwood — on est à l'intersection cinéma + gaming (créativité jeune).

---

### Sport — deux écoles opposées

**École 1 — Explosion dynamique** (Nike, Adidas, Salomon) : vidéo haute-énergie, typo stacked gras, monochrome + accents saturés
**École 2 — Raffinement minimal** (On Running, Rapha) : whitespace sacré, typo light, autorité par le silence

**Application** : Banlieuwood = école 2 (on ne crie pas, on convainc par la conviction).

---

### Gastronomy / Food — warmth triggers

**Pattern validé** : Les palettes peach/sage/burgundy/off-white déclenchent l'appétit et la chaleur. Blanc pur = clinique = froid.
**Noma insight** : CSS variables pour thèmes saisonniers → applicable à Banlieuwood pour curriculum spiralaire (chaque niveau = palette progression).

---

### Esthétiques visuelles — 14 mouvements cartographiés

Fichier permanent : `aesthetics-guide.md` (1017 lignes)
Mouvements couverts : Brutalisme, Dark Luxury/Cinéma, Swiss/Bauhaus, Tech/Futurisme,
  Scandinave Minimal, Y2K/Néon, Manga/Anime, Memphis, Cyberpunk, Art Déco,
  Biophilic/Naturel, Editorial/Magazine, Streetwear/Hip-Hop, Cottagecore

**Usage** : Quand un client dit "je veux du Y2K" ou "un truc manga" → ouvrir `aesthetics-guide.md`, section correspondante → palette exacte + typo + CSS pattern + interdictions.

---

### Santé / Médical — trust sans stérilité

**Ancien paradigme** : bleu clinique + vert sanitaire
**Nouveau paradigme** : noir premium + orange/cyan (Oura, Eight Sleep, Hims) = confiance moderne
**Pattern clé** : Résultats mesurables ("62% pain reduction") > specs abstraits

---

### Dating / Social — trust avant design

**Insight** : Les plateformes premium posent la confiance AVANT l'esthétique.
**Anti-pattern** : Images couple "posées" de stock → détruit la crédibilité instantanément
**Pattern** : Testimonials spécifiques ("getting married") > promesses vagues

---

### Agences créatives — la forme vend la stratégie

**Pattern validé** : Les meilleures agences (Pentagram, Work & Co, AREA 17) ne listent pas leurs services. Leur design EST la preuve de leur expertise.
- TBWA : le backslash `/` comme symbole graphique de disruption — une seule forme = toute l'identité
- AREA 17 : retenue maximale = perception luxe maximale
- **Application Banlieuwood** : ne pas expliquer ce qu'on fait — le montrer dans la conception même du site

---

### Institutions éducatives — le paradoxe du prestige

**Règle inverse** : Les institutions les plus fortes communiquent le prestige le MOINS visuellement.
- MIT et École 42 (polaires opposés dans l'esprit) partagent la même austérité
- Les écoles faibles surcompensent avec des ornements
- **Nord-Américain** : prestige par quantification (rankings, chiffres, alumni)
- **Français** : prestige par restrainte intellectuelle et silence

---

### D2C premium — la transparence comme matière design

**Insight clé** : Everlane affiche le coût réel vs marge. Cette transparence n'est pas dans le footer — elle EST le design.
- Friction reduction = luxury signal (monogramming, free returns, calculateurs)
- Communauté remplace le gatekeeping : UGC > aspirational lifestyle
- **Application** : pour Banlieuwood, montrer la pédagogie réelle (pas les promesses) = confiance D2C

---

### AI/Tech — dark mode comme signal developer

**Pattern constant** : 8/10 startups AI ont le dark mode natif. Ce n'est pas une tendance — c'est un signal "on parle aux développeurs/chercheurs".
- Code visible dans 5/10 (démo > marketing)
- Neon cyberpunk = perçu comme daté par les vraies équipes tech
- Custom typography = signal d'investissement dans les détails

---

### Streaming — la hiérarchie de l'artwork

**Insight MUBI/Criterion vs Netflix** :
- Netflix : algorithme → thumbnail wars → uniformisation vers le bas
- MUBI/Criterion : curation éditoriale → artwork comme objet culturel → élévation
- Dark mode non négociable sur streaming (fatigue oculaire + immersion)
- **Application** : les élèves Banlieuwood = créateurs → leurs œuvres méritent le traitement MUBI, pas le traitement Netflix

---

### Mode contemporaine — authenticité fondateur vs héritage maison

**Pattern** : A.P.C., Rouje, Wales Bonner — le fondateur nommé = autorité créative. Pas besoin d'héritage historique.
- Single accent color très stratégique (pas palette riche)
- Photography narrative : lifestyle domestic > photo studio aspirationnelle
- **Application** : Romain Ndiaye Chansarel comme fondateur visible = crédibilité pédagogique authentique

---

## Patterns récurrents dans la KB (500+ patterns)

> À enrichir à chaque session

**Typographie éditoriale** (présent dans 73% des world-reference) :
- Serif display custom pour les titres, grotesque condensé pour le reste
- Taille radicale (120px+) sur les éléments principaux
- Zéro webfont générique (pas de Open Sans, Lato, Roboto en world-reference)

**Palette discipline** (présent dans 89% des world-reference) :
- Max 2 couleurs actives simultanément
- La couleur accent = outil de narration, pas décoration
- Blanc pur ou noir pur — jamais de gris moyen comme fond principal

**Photo cinéma** (présent dans 100% des sites cinéma world-reference) :
- Lumière naturelle dramatique
- Zéro overlay colorée
- Crop serré sur l'émotion (yeux, mains, texture)

---

---

## Échelle typographique validée — Banlieuwood (2026-04-03)

> À utiliser par design-generator et design-director comme référence absolue.

```
H1 hero        : min 10vw = ~140px à 1440px. Jamais centré. Toujours aligné gauche ou bas-gauche.
                 Doit occuper min 70% de la largeur du container.
                 Si une ligne tient en 40% de largeur → trop petit, augmenter.

H2 section     : 5-6vw = 64-80px en Bebas Neue
H3 sous-titre  : Bebas 32-40px
Body           : Plus Jakarta Sans 15-16px, line-height 1.65-1.7
Label uppercase: 10-11px, letter-spacing 3-4px, text-transform uppercase
Citation mono  : Bebas 36-72px selon longueur du texte

Règle radicale : La taille seule ne suffit pas.
Bebas 140px dans un container avec padding standard = générique.
Bebas 140px pleine largeur, débordant légèrement = niveau A24.
```

---

## Tension visuelle — Règles (2026-04-03)

> Chaque section doit avoir AU MOINS UN moment de tension. Sans tension = page plate = SaaS générique.

**Formes de tension valides :**
- Typographie qui déborde du container de 10-20px à droite (overflow: visible)
- Image qui sort du padding latéral vers le bord de l'écran
- Whitespace dramatiquement asymétrique (ex: 160px en bas, 24px en haut)
- Un seul mot en taille extrême (200px+) qui prend toute la ligne
- Texte ancré en bas-gauche d'une photo pleine hauteur (pattern A24)
- Numéros d'index énormes (#01 en 180px) qui débordent dans la section

**Ce qui N'est PAS de la tension :**
- Couleur d'accent sur un bouton
- Border-radius sur une card
- Shadow légère sur un élément
- Gradient de fond

---

## Rythme des sections — Règle d'alternance (2026-04-03)

```
Section 1 : dark (#0D0B09) — HERO
Section 2 : dark — Partners strip (compact, 60-80px)
Section 3 : dark → OU light (#F7F3EA) — Manifesto / Statégie
Section 4 : light (#F7F3EA) — Photos / Contenu riche
Section 5 : dark — Témoignage (citation monumentale)
Section 6 : light — Méthode / Features
Section 7 : dark — Cockpit / Produit
Section 8 : dark → semi (#080706) — Films
Section 9 : light — CTA final (contraste maximal avant footer)
Section 10 : dark — Footer
```

**Règle :** Jamais 3 sections dark consécutives sans cassure forte (image pleine largeur ou typographie monumentale isolée).

---

## Section méthode — Patterns interdits et valides (2026-04-03)

**INTERDIT :** Grille 5 colonnes égales avec titre + description (= Moodle, Notion, SaaS générique)

**VALIDES :**
1. Timeline verticale avec timecodes monospace (variante Cockpit Cinéma)
2. Blocs numérotés archivaux : `01/` en Bebas 180px + nom phase + description — vertical staggeré
3. Table éditorial : colonnes Phase | Timecode | Description | Compatible
4. Full-bleed staggeré : chaque phase = bande pleine largeur alternant fond/texte
5. Horizontal scroll (mobile only) : 5 phases en scrollable row

---

## Photos — Standards CSS fallback (2026-04-03)

Quand les vraies photos ne sont pas disponibles, le fallback OBLIGATOIRE :

```css
/* Simulation photo cinéma — CORRECT */
.photo-zone {
  background: linear-gradient(135deg, #2a1e10 0%, #1a1208 40%, #0f0c09 100%);
  position: relative;
}
.photo-zone::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  opacity: 1;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* INTERDIT */
.placeholder { background: #808080; } /* rectangle gris mort */
```

Silhouette humaine simulée (si pas de photo de personnes) :
```css
.silhouette {
  clip-path: polygon(30% 0%, 70% 0%, 85% 40%, 80% 100%, 20% 100%, 15% 40%);
  background: linear-gradient(180deg, rgba(180,140,70,0.12) 0%, rgba(80,60,30,0.25) 100%);
  /* gradient chaud pour rappeler la peau sous lumière cinéma */
}
```

---

## Scores critic loop — Seuils (2026-04-03)

```
Score acceptable pour livraison : 18/25 minimum
Score "grandiose" : 22/25+

Décomposition :
- Tension visuelle (5 pts) : débordement, overlap, asymétrie présents ?
- Typo monumentale (5 pts) : H1 ≥ 10vw, pleine largeur, pas sagement encadré ?
- Qualité simulation photo (5 pts) : grain visible, pas de rectangles gris ?
- Alternance dark/light (5 pts) : rythme correct, jamais 3 dark consécutifs ?
- Différence vs templates (5 pts) : ressemble à A24 ou à Moodle/Notion ?
```

---

## Principes artistiques — Session 2026-04-03 (Romain Ndiaye Chansarel)

> Ces principes ont été validés en session intensive. Ils gouvernent toute future génération.

**1. WAAAAA standard** — Le seul test qui compte. Réaction involontaire. Mâchoire qui tombe. Tout le reste est secondaire.

**2. Chaque pixel = composition globale** — Rien n'est là par défaut. Le crédit vertical à 8px rotated 90deg fait partie de la composition au même titre que le H1 à 240px. Chaque élément sait où il est.

**3. Pâte artistique réelle** — La signature de l'auteur est lisible. Comme Godard vs Spielberg : on reconnaît la main. Les 3 proposals (A/B/C) ont des ADN radicalement différents et inimitables.

**4. Améliorer TOUTES les sections, pas seulement le hero** — L'audit doit aller de haut en bas, section par section. Footer inclus. Le footer de A24 n'est pas un footer générique.

**5. Chaque remarque = modification directe + enregistrement mémoire** — Pas de "je vais retenir". Modifier le fichier ET sauvegarder en mémoire dans la même action.

**6. Les 3 ADN distincts validés :**
- A (Béton Brut) : TYPOGRAPHIE = IMAGE. Zéro photo déco. Noir absolu. Annotation archivale.
- B (Pellicule Vivante) : PHOTO DOMINE. Editorial magazine. Gold = émotion, orange = action.
- C (Cockpit Cinéma) : FOND CLAIR. EdTech assume. Filmstrip WOW. Footer institutionnel crème.

**7. Erreurs communes à bannir :**
- Footer générique 3-col sans identité → chaque footer a un marqueur distinctif (orange A, gold B, crème C)
- Contraste FAIL sur labels/meta (#3a3a3a sur fond noir) → min #555 pour texte fonctionnel
- SaaS dot list dans une section cockpit → remplacer par specs numériques éditoriaux
- Hiérarchie plate dans les stats → 1200 doit dominer physiquement 47 et 8

**9. Structure marketing + commercial — ordre des sections pour le funnel institutionnel :**
```
1. ATTENTION    → Hero (brand identity immédiate)
2. LÉGITIMITÉ   → Strip partenaires / établissements (confiance early dans la page)
3. PROBLÈME     → Manifeste / Pourquoi (le droit, pas le privilège)
4. PREUVES      → Stats + Films + Photos (track record tangible)
5. SOLUTION     → Méthode (comment ça se passe en pratique)
6. PRODUIT      → Cockpit (l'outil concret qu'on vend aux établissements)
7. VALIDATION   → Témoignage (humain, pas institutionnel)
8. ACTION       → CTA (adressé explicitement aux établissements)
```
La cible est une institution (directeur école, MJC, fondation) mais la marque parle AUSSI aux jeunes.
Le strip partenaires (CNAF, Région IDF, CNC, ÉducNat...) doit apparaître TÔT — avant la méthode.

**8. Clients primaires = institutions B2B** (écoles, État, ÉducNat, MJC, fondations) mais la marque reste forte — Kourtrajmé model : respecté par l'institution ET par la rue.

---

## Batch Cinéma + Festivals — Insights (2026-04-03)

### Vue d'ensemble du batch (10 sites : MUBI, Criterion, Letterboxd, BFI, Tribeca, Sundance, Berlinale, Cannes, IFC Center, Raindance)

**Conclusion majeure** : Dans le secteur cinéma, les sites world-reference ont un parti-pris radical commun :
- Le design est au service du contenu filmique — jamais l'inverse
- L'accent couleur est précis, unique, et réservé à un seul usage
- La typo signature (Riforma/MUBI, Ciutadella/Berlinale, Trade Gothic/Sundance) IS le design

---

### MUBI (mubi.com) — World-reference — 2026-04-03
- **Insight** : Bleu #001489 ultra-profond utilisé UNIQUEMENT sur le CTA email. Zéro autre usage. C'est la discipline maximale : une seule couleur, un seul endroit.
- **Pattern réutilisable** : Vidéo-background en hero avec texte animé progressif (fade + translateY) — le cinéma comme matière première de l'interface
- **Erreur observée** : Aucune — MUBI est un modèle de cohérence. Custom font (Riforma) + discipline couleur + vidéo = triangle parfait

### Criterion Collection (criterion.com) — World-reference — 2026-04-03
- **Insight majeur** : Le numéro de spine rouge (Spine #1, #2...) est une invention de design. Criterion a créé un système de catalogage qui EST l'identité de marque. À retenir pour Banlieuwood : créer un système de numérotation propre aux films des élèves = identité immédiate.
- **Pattern réutilisable** : Grid dense de covers = déclaration d'abondance culturelle sans hiérarchie marketing
- **Erreur à éviter** : Ne pas imiter la densité sans avoir le contenu exceptionnel pour la justifier

### Letterboxd (letterboxd.com) — Excellent — 2026-04-03
- **Insight** : Dark mode natif #14181C (bleu-noir) plutôt que noir pur — plus cinématique, moins agressif. Le vert #00C030 pour l'action "watched" = feedback émotionnel positif codé dans la couleur.
- **Pattern réutilisable** : Les posters films SONT l'interface — les affiches sont les données visuelles primaires, la typo s'efface
- **Confirmation du pattern validé** : Fond bleu-noir (#14181C) plutôt que #000000 pur = à appliquer dans le concept B de Banlieuwood

### BFI (bfi.org.uk) — Excellent — 2026-04-03
- **Insight rare** : Institution culturelle britannique qui choisit le violet #783DF6 comme couleur primaire. Audace rare pour une institution. La couleur est leur déclaration d'indépendance créative contre l'académisme.
- **Pattern réutilisable** : Focus state coloré (#FF22C9 outline) comme élément de design ET d'accessibilité simultanément — efficience totale
- **Nouveau pattern** : Box-shadow dégradé "0px 5px 0px #783DF6" sur les cards = effet "lift" premium sans animation

### Berlinale (berlinale.de) — Excellent — 2026-04-03
- **Insight typographique majeur** : Ciutadella (police custom exclusive) dans une palette quasi-monochrome. ZERO couleur sauf le noir, blanc, gris. C'est le courage typographique le plus radical du batch — ils font confiance à la typographie seule.
- **Pattern réutilisable** : Progressive font loading (FOFT) comme soin technique qui honore la typographie — à implémenter sur Banlieuwood
- **Règle confirmée** : La palette monochrome ne fonctionne qu'avec une typographie exceptionnelle. Sans police signature = palette morte.

### Sundance (sundance.org) — Excellent — 2026-04-03
- **Insight** : Trade Gothic Condensed Bold EST l'identité Sundance depuis des décennies. Un festival qui a construit son design sur une seule police devient reconnaissable instantanément. Banlieuwood fait la même chose avec Bebas Neue — ce choix est validé long terme.
- **Pattern réutilisable** : Accent jaune #FED105 exclusivement sur les états hover de navigation = signal fonctionnel mais mémorable

### IFC Center (ifccenter.com) — Good — 2026-04-03
- **Insight** : Design entièrement achromatique — les affiches Kubrick, Lynch, Godard SONT la palette de couleurs du site. Décision de design radicale et cohérente.
- **Pattern réutilisable** : Pour les sites de salles de cinéma : laisser les affiches créer toute la couleur, le design reste en retrait total

---

## Synthèse comparative — Cinéma sector (2026-04-03)

| Site | Niveau | Différenciateur | Applicable à Banlieuwood |
|------|--------|----------------|--------------------------|
| MUBI | World-ref | Police custom + vidéo hero + mono-accent | Vidéo hero concept B |
| Criterion | World-ref | Grid covers + spine numbers | Système numérotation films élèves |
| Letterboxd | Excellent | Dark #14181C + vert validation | Fond concept B |
| BFI | Excellent | Violet bold + gradient CTA | Gradient CTA landing |
| Berlinale | Excellent | Police custom + monochrome | Soin font loading |
| Sundance | Excellent | Trade Gothic + jaune nav | Valide Bebas Neue long terme |
| Cannes | Good | Palme d'Or IS the design | Créer un objet identitaire fort |
| Tribeca | Good | Photos > design | Photos de tournage dans le hero |
| IFC Center | Good | Affiches = palette | Concept archive films |
| Raindance | Good | Community + endorsements | Quotes style Ken Loach |

**Pattern statistique** : 100% des sites cinéma world-reference ont une police distinctive (custom ou très précisément choisie). 0% utilise un webfont générique (Roboto, Open Sans, Lato). Banlieuwood avec Bebas Neue est dans le bon camp.

**Nouvelle règle ajoutée** : L'identité d'un site cinéma tient en 1 binôme : typo signature + couleur d'accent unique. MUBI = Riforma + bleu #001489. Berlinale = Ciutadella + monochrome. Sundance = Trade Gothic + jaune #FED105. Letterboxd = Graphik + vert #00C030. Banlieuwood = Bebas Neue + orange #FF6B35. C'est le bon niveau de précision identitaire.

---

## Instructions pour enrichir ce fichier

À chaque session d'analyse, le design-scout DOIT ajouter :
1. Le nom du site analysé + son niveau (world-reference / excellent / good)
2. L'insight le plus notable (1-2 phrases)
3. Si applicable : correction d'une conclusion précédente ou confirmation
4. Si un pattern revient pour la 3ème fois : l'inscrire dans "Patterns récurrents"

Format d'entrée :
```
### [NOM DU SITE] ([url]) — [niveau] — [DATE]
- **Insight** : [observation précise]
- **Pattern réutilisable** : [comment l'appliquer]
- **Erreur observée** : [si applicable]
```

---

## Veille concurrentielle — Où on se situe (2026-04-03)

### Ce que les concurrents font mieux sur des points précis

**Lovart AI** — MCoT (Mind Chain of Thought) : analyse context business + audience + brand avant de générer. "Design memory" : importe des assets, les catégorise, les réutilise pour cohérence. Génère les visuels directement (logo, packaging, social). **Ce qu'ils n'ont pas** : notre KB sectorielle de 500+ sites analysés.

**Jasper KB** — accepte texte, audio, image, vidéo, URLs. Multi-format natif. **À voler** : accepter des PDFs de brand guidelines clients dans la KB.

**Relevance AI** — output structuré en 2 dimensions : **Soul** (stratégie, audience, business) + **Body** (visuel, palette, typo). Plus vendable qu'un rapport technique. **À intégrer immédiatement dans nos outputs.**

**v0 / Bolt / Lovable** — génération de code React propre en secondes, preview live. Aucune KB sectorielle. Partent de zéro à chaque prompt.

### Ce qu'on a qu'ils n'ont pas

1. **KB sectorielle 500+ sites** avec analyse pattern réelle — personne n'a ça
2. **28 agents interconnectés** avec brief partagé (brand-strategist → design-generator → critic)
3. **aesthetics-guide.md** — 14 mouvements codifiés avec palette + typo + CSS + interdictions
4. **Feedback loop explicite** — 👍/👎 qui priorise les préférences

### Ce qu'on doit voler (roadmap)

- **De Lovart** : connecter génération image (Midjourney API ou Replicate)
- **De Jasper** : ingestion PDFs brand guidelines dans la KB
- **De Relevance AI** : structurer outputs design en Soul + Body — l'adopter maintenant dans design-director et design-generator
- **De v0** : mode preview live avec capture screenshot automatique

### Gaps non pensés — à construire

1. **Photo direction briefs** — "comment briefer un photographe" pour chaque aesthetic (light setup, composition, mood)
2. **Social media design patterns** — Instagram grid, Stories, TikTok thumbnails, OG images
3. **Logo/identité design reference** — wordmark vs lettermark vs emblème vs symbole
4. **Responsive/mobile patterns** — KB est desktop-focusée, mobile-first manque
5. **Brand voice guide** — comment le copy et le design s'alignent (Oatly humor + Patagonia honnêteté)
6. **Packaging design** — boîtes, étiquettes, sacs, unboxing experience
7. **Signage/Environmental** — touchpoints physiques de marque


---

## Références World-Class — Sites à Décortiquer (2026-04-04)

> Ces sites sont des œuvres — chaque technique est documentée pour être maîtrisée.
> Source : Adveris "Sites innovants de l'année 2026" + veille directe.

### Terminal Industries — terminal-industries.com (⭐ #1 Adveris 2026)

**Adresse** : https://terminal-industries.com/
**Catégorie** : Industrie / B2B / branding — Dark + Lime

**Palette DNA** :
- Background : `#052424` (vert très sombre — pas noir pur)
- Accent : `#abff02` (lime électrique — PAS jaune, PAS vert — entre les deux)
- Texte secondaire : `rgba(255,255,255, 0.1-0.4)` (transparences fines)
- États actifs : lime sur fond dark green

**Typographie** :
- Primaire : SuisseIntl (sans-serif suisse — proche de Neue Haas Grotesk)
- Mono : Geist Mono (code, données techniques)
- Titres : `10.256vw` avec `-0.308vw` letter-spacing — fluidité TOTALE par viewport
- Corps : `min(1.4375rem, 5.897vw)` — jamais de px fixes pour le corps

**Techniques d'animation — CHAQUE UNE À MAÎTRISER** :

1. **Color transition text animée** (signature Terminal Industries)
   - Texte qui passe de gris clair → lime → vert foncé
   - `@keyframes color-transition { 0% {color: #ccc} 30% {color: #abff02} 100% {color: #052424} }`
   - Timing : `cubic-bezier(.19,1,.22,1)` — overshoot naturel

2. **Reveal vertical pur** (pas fade — slide)
   - `.reveal-y-enter-active` : `opacity fade + translateY(100%)`
   - Durée enter : 0.6s / exit : 0.4s
   - Easing : `cubic-bezier(.39,.575,.565,1)`
   - À 0.6s avec TranslateY(100%) → TranslateY(0) le mouvement EST l'animation, pas l'opacity

3. **Nav link — centered dot** (micro-interaction signature)
   - `.nav a:after` = petit point centré sous le texte
   - `transform: scale(0)` → `scale(1.01)` au hover
   - C'est UN pixel qui change tout. Minimal mais distinctif.

4. **Underline direction — right to left**
   - `.link-active:after` : underline avec `transform-origin: right`
   - Apparaît de droite à gauche (contre-intuitif = mémorable)

5. **Button hover — slide-up fill**
   - `::before` pseudo-element part de `translateY(100%)` → `translateY(0)` au hover
   - Effet : couleur qui monte de bas en haut dans le bouton
   - Durée : 0.2s (feedback rapide)

6. **Mobile menu — backdrop blur** 
   - Panel : `blur(30px)` + `background: #0000004d`
   - Chevron rotate 180° sur open

7. **Grid 12 colonnes en vw**
   - Gutters : `min(3.646vw, 93.3333px)` — jamais de gap fixe
   - Mobile : 2 colonnes + `5.128vw` padding
   - Principe : TOUT en relatif/viewport pour scaling parfait

8. **Will-change déclaré sur toutes les animations**
   - `will-change: transform, opacity, filter` sur chaque élément animé
   - Hardware-acceleration obligatoire → 60fps garanti

**Référence motion globale** :
- Feedback UI rapide : 0.15-0.2s (couleur, bg, border, opacity)
- Reveals de contenu : 0.6-1.2s (transforms)
- Transitions de page : 0.5s opacity

### Autres références Adveris 2026 — À explorer

| Site | DNA | Technique signature |
|------|-----|---------------------|
| landon-norris.com | Sport, bold, héritage F1 | Hero design qui a créé un standard web sport |
| bruno-simon.com | Portfolio 3D isométrique | Navigation spatiale interactive — pas de scroll |
| glenncatteeuw.com | Minimal typographique | "Controlled rhythm" — précision micro-interactions |
| symphony-of-vines.unseen.co | 3D WebGL nature | Textures et lighting temps réel |
| ribbit.dk | Motion design | Rythme sans ostentation |
| sunmetalon.com | Wireframe + typo | Structure wireframe + élégance typographique |

### Ce qu'on apprend de Terminal Industries pour nos agents

**Règle 1 — Couleur accent ≠ blanc cassé ni noir pur**
Le lime `#abff02` est IMPOSSIBLE à ignorer sur `#052424`. La tension entre les deux crée l'énergie.
→ Nos futurs designs : chercher l'accent qui crée une tension maximale sans agresser.

**Règle 2 — Typo en vw = respiration à toutes les tailles**
Un H1 à `10.256vw` est gigantesque sur desktop, parfait sur mobile. Plus de casse.
→ Adopter `clamp()` ou `vw` pour tous nos gros titres.

**Règle 3 — Un seul micro-interaction signature**
Le dot sous le nav link C'EST Terminal Industries. Une seule chose, parfaitement exécutée.
→ Chaque brand doit avoir son micro-interaction propre. Un seul. Pas dix.

**Règle 4 — Color transition sur texte = différenciation immédiate**
Personne ne fait ça. L'animation de couleur sur le texte au scroll est reconnaissable en 1 seconde.
→ Ajouter à notre arsenal CSS : `@keyframes text-color-reveal`

**Règle 5 — Dark n'est pas `#000000`**
`#052424` = presque noir mais avec une dominante verte subtile qui prépare le lime.
`#02030A` pour Kura = noir avec dominante bleue qui prépare le cyan. Même logique.

