# Guide Esthétiques Visuelles Web — Règles & Mouvements

**Dernière mise à jour** : 2 avril 2026
**Source** : Analyse 15 mouvements design mondiaux + 13 sites référence
**Usage** : Lancer ce guide quand un client dit « je veux un style X »

---

## 1. BRUTALISME WEB

**Règles fondamentales**
- Pas de hiérarchie visuelle claire — contenu = équilibre intellectuel
- Grille 12-colonnes rompue intentionnellement
- Typographie monospace = autorité documentaire
- Lignes fines, pas d'ombre, pas de gradient
- Alignement brisé = anti-design conscient

**Palette type**
- Fond : `#FFFFFF` (blanc pur)
- Texte principal : `#000000` (noir pur)
- Accent : `#FF0000` (rouge acide, rare)
- Secondaire : `#888888` (gris neutre)

**Typographie type**
- Display : Courier New, monospace
- Body : System font ou Helvetica
- Size hero : 14-16px (petit intentionnellement)
- Style : UPPERCASE labels, all-caps sections

**Ce qui est INTERDIT**
- Gradient, shadow, blur effect
- Hero image majeur
- Rounded corners
- Hiérarchie couleur
- Animation autre que fonctionnelle
- Asymétrie sans intention
- CTA prominent

**Sites de référence**
- https://www.are.na (parfait, plateforme savoir)
- https://brutalistwebsites.com (annuaire)
- https://www.gwern.net (essayiste)

**Utiliser quand**
- Startup tech sérieuse (pas lifestyle)
- Plateforme savoir/collectif art
- Galerie concepts intellectuels
- Client rejette design BS

**Pattern CSS clé**
```css
/* Grille brisée */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 0; /* pas de gap régulier */

/* Typo brutal */
font-family: 'Courier New', monospace;
font-size: 14px;
letter-spacing: 2px;
text-transform: uppercase;

/* Border minimaliste */
border: 1px solid #000;
border-radius: 0;
```

---

## 2. DARK LUXURY / CINÉMA

**Règles fondamentales**
- Noir absolu (`#000000`) = background obligatoire
- Orange cinéma (#FF6B35) = accent de prestige
- Typographie display = majuscules, kerning serré
- Images full-bleed, cinématiques (16:9)
- Transitions subtiles, filmstrip-like
- Espace blanc généreux, noir stratégiquement

**Palette type**
- Fond : `#000000` (noir pur)
- Texte : `#FFFFFF`
- Accent primaire : `#FF6B35` (orange cinéma)
- Accent secondaire : `#E8C547` (or subtil)
- Mood : prestige-cinématique

**Typographie type**
- Display : Bebas Neue, DM Sans
- Body : Neue Haas Grotesk ou Georgia
- Size hero : 48-72px
- Style : kerning-tight, letter-spacing +1-2px, weight-medium

**Ce qui est INTERDIT**
- Gradient (sauf très subtil noir fade)
- Shadow (sauf très très subtil)
- Couleur autre que orange/or/blanc
- Photo pixelisée ou basse résolution
- Animation rapide (>300ms)
- Typo Light weight (<300)

**Sites de référence**
- https://a24films.com (studio film, référence absolue)
- https://www.criterion.com (Criterion Collection)
- Marques luxe (Cartier digital)

**Utiliser quand**
- Studio film / production vidéo
- Produit luxe (montres, parfum)
- Brand prestige souhaitant projection
- Storytelling visuel premier

**Pattern CSS clé**
```css
/* Hero cinéma */
position: relative;
width: 100%;
height: 100vh;
background: #000;
overflow: hidden;

/* Orange accent */
color: #FF6B35;
font-weight: 600;
font-size: 14px;
text-transform: uppercase;

/* Filmstrip layout */
display: grid;
grid-auto-flow: column;
gap: 4px;
overflow-x: auto;

/* Typo cinéma */
font-family: 'Bebas Neue', sans-serif;
letter-spacing: 2px;
text-transform: uppercase;
color: #FFF;
```

---

## 3. SWISS / BAUHAUS

**Règles fondamentales**
- Grille 12-colonnes rigide = TOUJOURS respectée
- Helvetica ou Neue Haas = police primaire
- Hiérarchie typographique = taille uniquement, jamais couleur
- Couleurs primaires = noir, blanc, gris uniquement
- Photographie : noir/blanc ou haute contrast
- Tous éléments sur baseline — aucun float
- Marges identiques partout (20-40px)
- Pas de decoration, pas de shadow, pas de border-radius

**Palette type**
- Fond : `#F5F5F5` (gris très clair)
- Texte : `#1A1A1A` (noir)
- Accent : `#000000` (noir acide)
- Secondaire : `#CCCCCC` (gris structure)
- Mood : rationnel-fonctionnel

**Typographie type**
- Display : Helvetica, Neue Haas Grotesk
- Body : Helvetica Neue, Arial
- Size hero : 32-48px
- Style : medium-weight, line-height 1.4, letter-spacing 0

**Ce qui est INTERDIT**
- Couleur autre que noir/blanc/gris
- Gradient
- Shadow ou depth effect
- Rounded corners
- Image couleur (sauf noir/blanc)
- Animation
- Asymétrie non-justifiée

**Sites de référence**
- https://www.helveticafilm.com (documentaire + design)
- https://www.bauhaus.de (école)
- Archives Muller-Brockmann

**Utiliser quand**
- Institution (gouvernement, finance)
- Édition sérieuse
- Client traditionnel anglophone
- Besoin confiance + fonctionnalité
- Target : décideurs C-suite

**Pattern CSS clé**
```css
/* Grille Swiss */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px;
max-width: 1200px;

/* Typographie Bauhaus */
font-family: 'Helvetica', 'Neue Haas Grotesk', sans-serif;
font-weight: 400 | 500;
letter-spacing: 0;

/* Espacement modular */
margin: 24px 0;
padding: 32px 40px;
/* multiples de 8 */

/* Photo contrast */
filter: contrast(1.2);
grayscale(100%);
```

---

## 4. TECH / FUTURISME

**Règles fondamentales**
- Noir très foncé (#08090A) = fond obligatoire
- Cyan/Violet fluo pour data/status/interactive
- Typographie Inter = variable weight
- Datavis = ligne fine, pas de fill, grid subtile
- Animation = easing ease-in-out, durée 150-300ms
- Aucune shadow sauf hover/focus (très subtile)
- Espace compact mais respiratory (12px padding min)
- Icones = monoline, stroke 1.5px

**Palette type**
- Fond : `#08090A` (noir très foncé)
- Texte : `#E5E5E5` (gris clair)
- Accent primaire : `#00E5FF` (cyan)
- Accent secondaire : `#7C3AED` (violet)
- Mood : futurisme-minimaliste

**Typographie type**
- Display : Inter (variable)
- Body : Inter
- Size hero : 24-32px
- Style : variable-weight 300-600, tight-line-height 1.2

**Ce qui est INTERDIT**
- Couleur pastel ou chaud
- Serif
- Gradient multi-couleur
- Animation jouflu (ease-in-out strict)
- Espace blanc dominant
- Ornamentation
- Shadow dur

**Sites de référence**
- https://linear.app (parfait, data app)
- https://www.cursor.com (AI tool)
- https://vercel.com (deployment)

**Utiliser quand**
- Startup SaaS/tech
- Outil travail intensif (Dev, Ops, PM)
- Users sophistiqués
- Focus performance + utilité
- Target : tech-savvy 20-40

**Pattern CSS clé**
```css
/* Background tech */
background: #08090A;
color: #E5E5E5;
transition: all 150ms ease-in-out;

/* Accent cyan */
color: #00E5FF;
font-weight: 600;
text-decoration: underline;
cursor: pointer;

/* Datavis line */
stroke: #7C3AED;
stroke-width: 1.5;
fill: none;

/* Compact layout */
padding: 12px 16px;
margin: 0;
line-height: 1.2;
```

---

## 5. SCANDINAVIAN MINIMALISM

**Règles fondamentales**
- Blanc ou beige très clair = fond (pas gris)
- Photographie de qualité = élément narratif principal
- Bois/matière naturelle en image ou accent (warm brown)
- Typographie serif élégante pour headlines
- Sans-serif neutre pour body
- Pas de drop shadow — flat light shadows max
- Espacement généreux (1.5-2x normal)
- Palette = blanc, naturel, or subtil, gris taupe

**Palette type**
- Fond : `#FFFFFF` ou `#F5F3F0`
- Texte : `#2A2A2A`
- Accent primaire : `#D4AF37` (or subtil)
- Accent secondaire : `#8B7355` (bois)
- Mood : chaud-artisanal

**Typographie type**
- Display : Spectral Serif, Caslon
- Body : Helvetica, system-font
- Size hero : 24-32px
- Style : weight 300-400, readable line-height 1.6

**Ce qui est INTERDIT**
- Couleur criardes (saturation >80)
- Photographie synthétique / low-quality
- Shadow visuelle
- Animation rapide
- Asymétrie pure (balance recherché)
- Typo display sans-serif

**Sites de référence**
- https://www.muuto.com (furniture, parfait)
- https://www.norm-architects.com (architecture)
- Design suédois classique (String, Hay)

**Utiliser quand**
- Furniture/home brand
- Luxury brand traditionnel
- Client valide artisanat/naturel
- Target : affluent nordique/EU
- Wellness/lifestyle

**Pattern CSS clé**
```css
/* Minimal nord */
background: #F5F3F0;
color: #2A2A2A;
font-family: 'Helvetica', sans-serif;

/* Image hero */
width: 100%;
height: 500px;
object-fit: cover;
object-position: center;

/* Spacing scandi */
padding: 40px 60px;
gap: 48px;
margin-bottom: 80px;

/* Serif headlines */
font-family: 'Spectral', serif;
font-weight: 300;
font-size: 28px;
line-height: 1.6;
```

---

## 6. Y2K / NÉON REVIVAL

**Règles fondamentales**
- Gradient cyan → magenta (pas linéaire, radial ok)
- Chrome/reflection effect = gloss, specularity
- Animé = blink, pulse, rotate, scale (fast 200-400ms)
- Typographie bold ultra-condensed
- MAXIMALIST — aucune subtilité
- Textures = holographique, iridescent, chrome
- Pas de natural photo — CG, synthétique ok
- Font effects = outline, shadow drop 3-5px

**Palette type**
- Fond : `#0A0A0A` (noir)
- Texte : `#FFFFFF`
- Accent primaire : `#00D4FF` (cyan)
- Accent secondaire : `#FF00FF` (magenta)
- Mood : futurismo-glossy-energy

**Typographie type**
- Display : Impact, Futura Bold
- Body : Helvetica Bold, Arial
- Size hero : 48-72px
- Style : bold-bold-bold, all-caps, letter-spacing +2-4px

**Ce qui est INTERDIT**
- Couleur naturelle
- Minimalisme (OPPOSITE)
- Serif
- Animation subtile (>300ms boring)
- Asymétrie pure
- Photo réaliste

**Sites de référence**
- https://www.chrome-hearts.com (luxury streetwear)
- Y2K revival blogs/portfolios
- Hypebeast aesthetic

**Utiliser quand**
- Streetwear/luxury tech
- Gaming/metaverse
- Client wants energy/hype
- Target : Gen Z / young millennial
- Nostalgia + futurism

**Pattern CSS clé**
```css
/* Y2K gradient */
background: linear-gradient(135deg, #00D4FF 0%, #FF00FF 100%);
filter: hue-rotate(45deg);

/* Chrome text */
text-shadow: 0 0 20px #00D4FF, 0 2px 4px rgba(0,0,0,0.8);
font-weight: 900;

/* Animation pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Holographic */
background: linear-gradient(45deg, #FF00FF, #00D4FF, #FFD700);
background-size: 200% 200%;
animation: shift 6s ease infinite;
```

---

## 7. MANGA / ANIME

**Règles fondamentales**
- Panel layout = strictement grille (3x3 ou 2x2)
- Speed lines = diagonal lines, direction = action
- Typographie ultra-bold outline + drop-shadow
- Couleur accent = rouge/orange/jaune seulement
- Contraste très haut (noir/blanc, pas gris)
- Illustration = manga-style (ligne/hachuré, pas photo)
- Emojis = utilisés comme expression/impact
- Animation = slash effects, screen-shake, impact frames

**Palette type**
- Fond : `#FFFFFF`
- Texte : `#000000`
- Accent primaire : `#FF3333` (rouge)
- Accent secondaire : `#FFD700` (or/jaune)
- Mood : kinetic-energetic

**Typographie type**
- Display : Impact, Gothic Black (Japanese)
- Body : Clear Sans, Helvetica
- Size hero : 32-56px
- Style : bold-ultra, outline 1-2px, drop-shadow 2-3px

**Ce qui est INTERDIT**
- Gradient
- Photographie réaliste
- Sans speed lines
- Couleur pastel
- Minimalisme
- Espace blanc excessif

**Sites de référence**
- https://www.shonenjump.com (manga publisher)
- Anime studio officiels
- Webtoon platforms

**Utiliser quand**
- Contenu anime/manga/gaming
- Client wants action/energy
- Storytelling visual primaire
- Target : anime fans / gaming audience

**Pattern CSS clé**
```css
/* Panel grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 2px;
border: 2px solid #000;

/* Speed lines */
position: absolute;
width: 100%;
height: 2px;
background: #000;
transform: rotate(-45deg);

/* Manga typo */
font-family: 'Impact', sans-serif;
font-weight: 900;
text-shadow:
  -1px -1px 0 #FFF, 1px -1px 0 #FFF,
  -1px 1px 0 #FFF, 1px 1px 0 #FFF,
  2px 2px 4px rgba(0,0,0,0.8);

/* Panel border */
border: 3px solid #000;
box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
```

---

## 8. MEMPHIS / MAXIMALISME

**Règles fondamentales**
- Couleurs primaires pures (jamais mélangées/grises)
- Formes géométriques simples : cercle, carré, triangle
- Pas d'alignement strict — placement ludique
- Pattern = répétition simple (dots, lines, waves)
- Typographie curved, playful, super-bold
- Illustration flat, bold outlines
- Décoration = présente partout, rien est neutre
- Animation bouncy, playful (ease-out, wobble)

**Palette type**
- Fond : `#FFD700` ou `#FF6B9D` ou `#00D9FF`
- Texte : `#000000`
- Accent primaire : `#FF6B9D` (rose)
- Accent secondaire : `#00D9FF` (cyan)
- Mood : ludique-joyeux

**Typographie type**
- Display : Futura Bold, Avant Garde, playful sans
- Body : Comic Sans revival / playful sans
- Size hero : 36-64px
- Style : ultra-bold, curved, playful-spacing

**Ce qui est INTERDIT**
- Minimalisme
- Naturel / photographe
- Subtilité
- Serif sérieux
- Couleur grise
- Asymétrie pure sans intention

**Sites de référence**
- https://www.davidcarsondesign.com (portfolio)
- Memphis Design archives
- Playful brand websites

**Utiliser quand**
- Playful brand (kids, creative, fun)
- Retro revival
- Client rejects professionalism trap
- Target : creative / young audience

**Pattern CSS clé**
```css
/* Memphis bg */
background: #FFD700;
color: #000;
border: 4px solid #FF6B9D;

/* Playful shapes */
border-radius: 0; /* squares */
width: 80px;
height: 80px;
background: #00D9FF;

/* Bold typo */
font-family: 'Futura', 'Avant Garde', sans-serif;
font-weight: 900;
font-size: 48px;

/* Pattern repeat */
background: repeating-linear-gradient(
  45deg,
  #FF6B9D 0,
  #FF6B9D 10px,
  #00D9FF 10px,
  #00D9FF 20px
);
```

---

## 9. CYBERPUNK / NÉOIR

**Règles fondamentales**
- Noir absolu background (#0A0A0A minimum)
- Néon vert (#00FF00) ou magenta (#FF0080) = accent
- Monospace font obligatoire
- Glitch effect = rgb-shift, corruption, scan-lines
- Animation flicker, glitch (frame-by-frame)
- Distorsion = wavey, scanlines, CRT effect
- Pas d'espace blanc — dense data-heavy
- Typo outline/neon-glow, pas serif

**Palette type**
- Fond : `#0A0A0A`
- Texte : `#FFFFFF`
- Accent primaire : `#00FF00` (vert fluo)
- Accent secondaire : `#FF0080` (magenta)
- Mood : dystopian-moody

**Typographie type**
- Display : Roboto Mono, Courier New Bold
- Body : Courier New
- Size hero : 32-48px
- Style : monospace-bold, letter-spacing wide, glitch-effect

**Ce qui est INTERDIT**
- Couleur pastel ou chaud
- Serif
- Espace blanc dominant
- Animation smooth
- Naturel / photo réaliste

**Sites de référence**
- https://www.neon.games (gaming studio)
- Cyberpunk aesthetic blogs
- Matrix-inspired designs

**Utiliser quand**
- Gaming, cybersecurity
- Edgy brand, tech-heavy
- Dark narrative
- Target : tech-savvy / gaming audience

**Pattern CSS clé**
```css
/* Cyberpunk bg */
background: #0A0A0A;
filter: contrast(1.3);
color: #00FF00;

/* Neon glow */
text-shadow:
  0 0 10px #00FF00,
  0 0 20px #00FF00,
  0 0 30px #FF0080;

/* Glitch RGB */
animation: glitch 2s ease-in-out infinite;
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
}

/* Scanlines */
position: relative;
background: repeating-linear-gradient(
  0deg,
  rgba(0,255,0,0.1),
  rgba(0,255,0,0.1) 2px,
  transparent 2px,
  transparent 4px
);
```

---

## 10. ART DÉCO

**Règles fondamentales**
- Géométrie = cercle, losange, triangle équilatéral
- Or (#D4A841) = accent luxe
- Symétrie bilateral obligatoire (ou radiale)
- Typographie serif élégante (Didot, Bodoni)
- Photographie produit seul sur blanc/clair
- Pas de grid visible — ordre classique
- Ratio d'or partout (section width, image size)
- Décoration pattern art-déco (chevrons, soleils)

**Palette type**
- Fond : `#F5F5F5`
- Texte : `#1A1A1A`
- Accent primaire : `#D4A841` (or)
- Accent secondaire : `#000000`
- Mood : élégant-intemporel

**Typographie type**
- Display : Didot, Bodoni Serif
- Body : Garamond, Baskerville
- Size hero : 32-48px
- Style : serif-elegant, weight 400, letter-spacing +1-2px

**Ce qui est INTERDIT**
- Asymétrie pure
- Photo naturelle / landscape
- Couleur autre que or/noir
- Minimalisme
- Modernisme
- Animation

**Sites de référence**
- https://www.cartier.com (jewelry)
- Art Déco museums
- Luxury heritage brands

**Utiliser quand**
- Luxury brand (jewelry, watches, perfume)
- Client traditionnel elegant
- High-net-worth audience
- Heritage / timeless positioning

**Pattern CSS clé**
```css
/* Art Déco center */
display: flex;
align-items: center;
justify-content: center;
text-align: center;

/* Or accent */
color: #D4A841;
border: 2px solid #D4A841;
padding: 8px 16px;

/* Serif typo */
font-family: 'Didot', 'Bodoni', serif;
font-weight: 400;
letter-spacing: 2px;

/* Ratio gold */
width: 61.8%; /* golden ratio */
margin: 0 auto;
```

---

## 11. BIOPHILIC / NATUREL

**Règles fondamentales**
- Photographie nature = élément narratif principal
- Vert naturel (#4CAF50, #558B2F) = accent primaire
- Sans-serif neutre (Helvetica, Univers)
- Pas de decoration — nature parle
- Couleurs = matériaux (vert, terre, pierre, eau)
- Texture = grain photo, pas digital pattern
- Espace blanc présent mais pas dominat
- Animation très subtile (parallax ok)

**Palette type**
- Fond : `#FFFFFF`
- Texte : `#2A3A2A`
- Accent primaire : `#4CAF50` (vert naturel)
- Accent secondaire : `#8B6F47` (terre)
- Mood : naturel-authentique

**Typographie type**
- Display : Helvetica Neue, Univers
- Body : Helvetica, system-font
- Size hero : 24-32px
- Style : clean-sans, weight 300-500, readable

**Ce qui est INTERDIT**
- Gradient
- Shadow
- Ornamentation
- Couleur synthétique
- Photo cheap / low-quality
- Animation rapide

**Sites de référence**
- https://www.patagonia.com (outdoor, parfait)
- https://www.thegoodfill.co (sustainability)
- Eco-brand websites

**Utiliser quand**
- Outdoor/eco/sustainability brand
- Environmental mission
- Client values nature/authenticity
- Target : eco-conscious audience

**Pattern CSS clé**
```css
/* Biophilic bg */
background: #FFFFFF;
color: #2A3A2A;

/* Nature green */
color: #4CAF50;
border-left: 4px solid #4CAF50;

/* Photo hero */
width: 100%;
height: 600px;
object-fit: cover;
object-position: center;

/* Breathing space */
padding: 40px 60px;
margin-bottom: 80px;
```

---

## 12. EDITORIAL / MAGAZINE

**Règles fondamentales**
- Grille colonnes strict (2-3 col)
- Typographie serif pour body (Saol, Lyon)
- Sans-serif pour headlines (très rare color accent)
- Justifié (optionnel mais recommandé)
- Ligne-height min 1.6 pour lisibilité
- Photographie = contexte, pas décoration
- Pas de gradient, pas de shadow
- Margin/padding multiples baseline (6-8px)

**Palette type**
- Fond : `#FFFFFF`
- Texte : `#1A1A1A`
- Accent primaire : `#B8860B` (subtil)
- Accent secondaire : `#CCCCCC` (divider)
- Mood : journalistique-elegant

**Typographie type**
- Display : Saol, Lyon, FF Meta Serif
- Body : Lyon Text, Georgia
- Size hero : 32-40px
- Style : serif-readable, weight 400, line-height 1.6

**Ce qui est INTERDIT**
- Grid non-colonnes
- Typo display sans-serif gras
- Couleur accent prominent
- Photo full-bleed héro
- Minimalisme extrême
- Animation

**Sites de référence**
- https://www.monocle.com (magazine, parfait)
- https://eyemagazine.com (eye magazine)
- Financial Times design

**Utiliser quand**
- Magazine/publication
- Credible brand (news, culture)
- Client values tradition/authority
- Intellectual audience
- Long-form content

**Pattern CSS clé**
```css
/* Editorial grid */
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 24px;
max-width: 1000px;

/* Serif body */
font-family: 'Saol', 'Lyon', serif;
font-size: 17px;
line-height: 1.7;
text-align: justify;

/* Sans headlines */
font-family: 'Helvetica', sans-serif;
font-weight: 600;
font-size: 28px;
line-height: 1.3;

/* Baseline spacing */
margin-bottom: 24px;
padding: 12px 0;
```

---

## 13. STREETWEAR / HIP-HOP

**Règles fondamentales**
- UPPERCASE obligatoire (brand voice)
- Or ou rouge = color accent (power)
- Typographie ultra-bold (Futura Bold, Impact)
- Drop shadow visible (2-3px offset, pas subtil)
- Logo = primacy, oversized
- Product photo = hero-scale, clean white background
- Pas de serif — pure geometric sans
- Contraste très haut (noir/blanc obligatoire)

**Palette type**
- Fond : `#FFFFFF` ou `#FF0000`
- Texte : `#FFFFFF` ou `#000000`
- Accent primaire : `#FFD700` (or)
- Accent secondaire : `#FF0000` (rouge)
- Mood : powerful-hype

**Typographie type**
- Display : Futura Bold, Impact
- Body : Helvetica Bold
- Size hero : 48-72px
- Style : ULTRA-BOLD, UPPERCASE, letter-spacing +2px

**Ce qui est INTERDIT**
- Minimalisme
- Serif
- Couleur pastel
- Subtilité shadow
- Product photo small
- Lowercase text (sauf rare)

**Sites de référence**
- https://www.supremenewyork.com (parfait)
- Hypebeast aesthetic
- Streetwear brands

**Utiliser quand**
- Streetwear/hip-hop brand
- Hype/exclusivity positioning
- Young urban audience
- Power-positioning brand

**Pattern CSS clé**
```css
/* Streetwear bold */
font-family: 'Futura', 'Impact', sans-serif;
font-weight: 900;
text-transform: uppercase;

/* Gold accent */
color: #FFD700;
text-shadow: 2px 2px 0 rgba(0,0,0,0.8);

/* Product grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;

/* Drop shadow type */
text-shadow:
  3px 3px 0 #000,
  5px 5px 0 #FFD700;
```

---

## 14. COTTAGECORE / PASTORAL

**Règles fondamentales**
- Palettes pastel = vert clair, beige, rose poudré
- Illustration folk-art style, hand-drawn feel
- Fleurs/nature = motifs récurrents
- Typographie serif romantic (Saol, Caslon)
- Photographie vintage grain, warm tones
- Texture papier, linen feel
- Asymétrie intentionnelle = placement organique
- Décoration nature, botanique, pas géométrique

**Palette type**
- Fond : `#FFFEF8`
- Texte : `#4A5D4A`
- Accent primaire : `#B8860B` (or)
- Accent secondaire : `#A0B8A0` (vert pastel)
- Mood : romantic-naturel

**Typographie type**
- Display : Saol, Serif playful
- Body : System sans-serif light
- Size hero : 24-32px
- Style : serif-romantic, weight 300-400

**Ce qui est INTERDIT**
- Couleur criardes
- Photo synthétique
- Géométrie rigide
- Animation rapide
- Minimalisme technologique
- Typo monospace

**Sites de référence**
- https://www.anthropologie.com (lifestyle, référence)
- Cottagecore Pinterest boards
- Wellness/design blogs

**Utiliser quand**
- Lifestyle/home brand
- Feminine brand
- Nature/organic focus
- Client values beauty/romance
- Target : wellness/design-conscious

**Pattern CSS clé**
```css
/* Cottagecore bg */
background: #FFFEF8;
color: #4A5D4A;

/* Pastel accent */
border: 2px solid #A0B8A0;
background: rgba(160, 184, 160, 0.1);

/* Serif romantic */
font-family: 'Saol', 'Caslon', serif;
font-weight: 400;
font-style: italic;

/* Vintage filter */
filter: sepia(0.2) saturate(0.8);
```

---

## 15. (BONUS) RÉGLES TRANSVERSALES

**Toutes les esthétiques doivent répondre à :**

1. **Cohérence palette** : max 4-5 couleurs (dont 2 neutres)
2. **Typographie hiérarchie** : max 3 styles (display, body, caption)
3. **Espacement** : multiples du même nombre (8px, 4px, 12px)
4. **Animation** : exist = justified, jamais « delight »
5. **Accessibilité** : WCAG AA min (contrast 4.5:1 body)
6. **Performance** : images <200KB optimisé, CSS <50KB
7. **Responsive** : mobile-first, breakpoints logiques
8. **Brand voice** : typographie = personnalité

---

**Comment utiliser ce guide :**

1. Client dit « je veux du brutalisme » → lire section 1
2. Copier pattern CSS clé comme base
3. Appliquer palette type (EXACT)
4. Respecter « Ce qui est INTERDIT »
5. Vérifier les sites de référence
6. Build → Tester lisibilité + perf

**Last update** : 3 avril 2026

