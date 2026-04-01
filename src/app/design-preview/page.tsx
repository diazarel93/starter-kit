// ═══════════════════════════════════════════════════════════════════════════
// DESIGN PREVIEW — Phase 2 : Directions Artistiques
//
// USAGE :
// 1. Lancez l'agent design-director pour generer 3 directions (Phase 1 + 2)
// 2. Remplissez les DIRECTIONS ci-dessous avec les specs de chaque direction
// 3. Ouvrez /design-preview pour valider visuellement avant de coder
// 4. Supprimez ce dossier apres avoir choisi une direction
//
// ═══════════════════════════════════════════════════════════════════════════

// ─── Types ─────────────────────────────────────────────────────────────────

interface DirectionConfig {
  name: string;
  concept: string;
  origin: string;
  logique: string;
  references: string[];
  layoutAscii: string;
  hierarchie: { p1: string; p2: string; p3: string; p4: string };
  actionPrincipale: string;
  navigation: string;
  canvas: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  border: string;
  accent1: string;
  accent1Bg: string;
  accent1Border: string;
  accent2: string;
  accent2Bg: string;
  accent2Border: string;
  accent3: string;
  accent3Bg: string;
  accent3Border: string;
  typo: { titres: string; body: string; labels: string; kpi: string };
  motion: { entrees: string; transitions: string; micro: string };
  scores: {
    lisibilite: string;
    coherence: string;
    effort: string;
    modernite: string;
    emotion: string;
    unicite: string;
  };
}

// ─── 3 Directions (REMPLIR avec les specs de l'agent design-director) ──────
//
// Ces 3 directions sont des EXEMPLES generiques.
// Remplacez-les avec celles generees par votre agent design-director.
//

const DIRECTIONS: DirectionConfig[] = [
  // ═══ DIRECTION A — Neo-Minimal Warm ═══
  {
    name: "Neo-Minimal Warm",
    concept:
      "L'interface comme espace de travail professionnel et chaleureux. " +
      "Inspiration : Linear meets warm paper. Densite maximale, " +
      "decoration minimale. Chaque pixel a une raison d'etre.",
    origin:
      "Le studio de design de Dieter Rams chez Braun. Des surfaces neutres, " +
      "une organisation logique, rien de superflu. La chaleur vient " +
      "de la texture (fond creme, pas blanc pur), pas de la decoration. " +
      "Reference : Braun T3 pocket radio (1958) — fonctionnel et elegant.",
    logique:
      "Pour un SaaS de productivite, la decoration est de la friction. " +
      "L'utilisateur vient accomplir une tache, pas admirer l'interface. " +
      "Le chaleureux (fond creme, accents or) evite la froideur sans ajouter " +
      "de bruit visuel. La direction la plus universelle et la plus sure.",
    references: [
      "Braun design — minimalisme fonctionnel",
      "Linear app — densite + clarte",
      "Notion — neutralite + contenu d'abord",
    ],
    layoutAscii: `
┌──────────────────────────────────────────────────────┐
│ HEADER 56px — logo | navigation | user               │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  SIDEBAR     │   MAIN CONTENT AREA                   │
│  240px       │                                       │
│              │   [Content card]                      │
│  Navigation  │   [Content card]                      │
│  + sections  │   [Content card]                      │
│              │                                       │
│              ├───────────────────────────────────────┤
│              │   FOOTER ACTIONS                      │
└──────────────┴───────────────────────────────────────┘`,
    hierarchie: {
      p1: "Contenu principal + CTA primaire (centre, 70% de l'ecran)",
      p2: "Navigation sidebar + labels de section (toujours visible)",
      p3: "Actions secondaires + filtres (barre d'outils contextuelle)",
      p4: "Settings, notifications, profil (menu utilisateur)",
    },
    actionPrincipale: "CTA primaire en haut-droite du contenu — toujours visible",
    navigation: "Sidebar fixe + breadcrumb. Navigation lineaire, aucun dead end.",
    canvas: "#faf9f7",
    surface: "#ffffff",
    elevated: "#f5f3ef",
    text: "#1c1c1c",
    muted: "#737373",
    border: "rgba(0,0,0,0.08)",
    accent1: "#FF6B35",
    accent1Bg: "rgba(255,107,53,0.08)",
    accent1Border: "rgba(255,107,53,0.20)",
    accent2: "#D4A843",
    accent2Bg: "rgba(212,168,67,0.08)",
    accent2Border: "rgba(212,168,67,0.20)",
    accent3: "#4ECDC4",
    accent3Bg: "rgba(78,205,196,0.08)",
    accent3Border: "rgba(78,205,196,0.20)",
    typo: {
      titres: "Inter, 20-32px, weight 700, letter-spacing -0.02em",
      body: "Inter, 14-16px, weight 400, line-height 1.6",
      labels: "Inter, 11px, weight 600, uppercase, tracking 0.1em",
      kpi: "Inter, 28-40px, weight 800, tabular-nums",
    },
    motion: {
      entrees: "fade-up 200ms ease-out, stagger 30ms par element",
      transitions: "fade 150ms ease-out (changement de section)",
      micro: "scale 0.98 → 1.0 sur tap, 100ms ease-out",
    },
    scores: {
      lisibilite: "10/10",
      coherence: "9/10",
      effort: "S",
      modernite: "8/10",
      emotion: "7/10",
      unicite: "6/10",
    },
  },

  // ═══ DIRECTION B — Premium Dark ═══
  {
    name: "Premium Dark",
    concept:
      "L'interface comme outil pro nocturne. Fond noir chaud (pas froid), " +
      "surfaces avec depth, accents qui brillent. " +
      "Pour les power users qui passent 8h/jour dans l'outil.",
    origin:
      "Les salles de controle NASA et les studios d'enregistrement professionnels. " +
      "L'obscurite n'est pas une contrainte mais un choix : elle reduit la fatigue " +
      "visuelle en session longue et fait ressortir les informations critiques " +
      "comme des voyants lumineux dans le noir. Reference : regie de tournage " +
      "BBC — dark mode avant que ca s'appelle dark mode.",
    logique:
      "Un outil utilise 6-8h/jour en mode professionnel justifie le dark mode. " +
      "Les accents (#FF6B35, #D4A843) ressortent davantage sur fond sombre. " +
      "La profondeur (surfaces a 3 niveaux) cree une hierarchie claire " +
      "sans avoir besoin de couleurs fortes. Direction la plus distinctive.",
    references: [
      "Salle de controle NASA Houston",
      "Raycast — dark mode magistral",
      "Linear dark mode",
    ],
    layoutAscii: `
┌──────────────────────────────────────────────────────┐
│ HEADER 48px — minimal, titre + actions essentielles  │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  SIDEBAR     │   MAIN CONTENT                        │
│  220px       │                                       │
│  dark/glass  │   Cards avec elevation               │
│              │   Accents lumineux                   │
│  Navigation  │   Data dense, lisible                │
│  avec icones │                                       │
│              ├───────────────────────────────────────┤
│              │   ACTION BAR (fixe)                  │
└──────────────┴───────────────────────────────────────┘`,
    hierarchie: {
      p1: "Donnees critiques + CTA principal (accent visible dans le dark)",
      p2: "Navigation sidebar + etat systeme (toujours visible)",
      p3: "Actions contextuelles + filtres",
      p4: "Settings + profil (minimal, discret)",
    },
    actionPrincipale: "Action bar fixe en bas — visible en permanence",
    navigation: "Sidebar avec icones + labels. Command palette (⌘K).",
    canvas: "#0f0f17",
    surface: "#161625",
    elevated: "#1e1e30",
    text: "#f0f0f5",
    muted: "#737390",
    border: "rgba(240,240,245,0.08)",
    accent1: "#FF6B35",
    accent1Bg: "rgba(255,107,53,0.10)",
    accent1Border: "rgba(255,107,53,0.25)",
    accent2: "#D4A843",
    accent2Bg: "rgba(212,168,67,0.08)",
    accent2Border: "rgba(212,168,67,0.25)",
    accent3: "#4ECDC4",
    accent3Bg: "rgba(78,205,196,0.10)",
    accent3Border: "rgba(78,205,196,0.25)",
    typo: {
      titres: "Inter, 18-28px, weight 700, letter-spacing -0.01em",
      body: "Inter, 13-14px, weight 400, line-height 1.5",
      labels: "Inter, 10px, weight 700, uppercase, tracking 0.15em",
      kpi: "Inter, 32px, weight 900, tabular-nums, monospace feel",
    },
    motion: {
      entrees: "fade 150ms ease-out, minimal — la vitesse prime",
      transitions: "crossfade 200ms ease-out (changement de vue)",
      micro: "border-color glow sur hover, 200ms ease",
    },
    scores: {
      lisibilite: "8/10",
      coherence: "10/10",
      effort: "M",
      modernite: "10/10",
      emotion: "9/10",
      unicite: "8/10",
    },
  },

  // ═══ DIRECTION C — Bold Typographic ═══
  {
    name: "Bold Typographic",
    concept:
      "La typographie comme element hero. Fond blanc pur, titres massifs, " +
      "contenu d'abord. La couleur est utilisee chirurgicalement — " +
      "seulement pour ce qui compte vraiment.",
    origin:
      "Les grands magazines editoriaux (Monocle, Wallpaper*, Kinfolk). " +
      "L'espace blanc n'est pas du vide — c'est du luxe. " +
      "La typographie porte le poids visuel. Les accents de couleur " +
      "resonnent exactement parce qu'ils sont rares. " +
      "Reference : la mise en page d'une couverture Kinfolk.",
    logique:
      "Si votre contenu est fort (texte, donnees, insights), " +
      "ne le noyer pas dans des elements visuels. Laissez-le respirer. " +
      "Cette direction communique la confiance : un produit qui a " +
      "suffisamment confiance en son contenu pour ne pas decorer. " +
      "Direction la plus difficile a bien executer, mais la plus distinctive.",
    references: [
      "Magazine Kinfolk — editorial minimalisme",
      "Stripe.com — typographie premium",
      "Vercel — space + type forward",
    ],
    layoutAscii: `
┌──────────────────────────────────────────────────────┐
│ NAV 60px — logo centré ou gauche, navigation minimal │
├──────────────────────────────────────────────────────┤
│                                                      │
│   PAGE HERO — titre massif 48-72px                  │
│   Sous-titre descriptif                             │
│   [CTA principal]    [CTA secondaire]               │
│                                                      │
├──────────────────────────────────────────────────────┤
│   [Block 1/3]   [Block 2/3]   [Block 3/3]           │
│                                                      │
│   CONTENT — large whitespace, max-width 720px        │
│                                                      │
└──────────────────────────────────────────────────────┘`,
    hierarchie: {
      p1: "Titre hero + CTA principal (typographie massive, impossible a rater)",
      p2: "Contenu principal (max-width, respirant, ligne-hauteur genereux)",
      p3: "Navigation + CTAs secondaires",
      p4: "Footer, legal, liens utilitaires",
    },
    actionPrincipale: "CTA hero — gros, centre ou gauche-aligné, couleur d'accent",
    navigation: "Nav minimaliste. Scroll naturel. Pas de sidebar.",
    canvas: "#ffffff",
    surface: "#f9f9f9",
    elevated: "#f0f0f0",
    text: "#111111",
    muted: "#666666",
    border: "rgba(0,0,0,0.06)",
    accent1: "#FF6B35",
    accent1Bg: "rgba(255,107,53,0.06)",
    accent1Border: "rgba(255,107,53,0.15)",
    accent2: "#111111",
    accent2Bg: "rgba(17,17,17,0.05)",
    accent2Border: "rgba(17,17,17,0.15)",
    accent3: "#4ECDC4",
    accent3Bg: "rgba(78,205,196,0.06)",
    accent3Border: "rgba(78,205,196,0.15)",
    typo: {
      titres: "Inter/Cal Sans, 48-72px, weight 800-900, letter-spacing -0.03em",
      body: "Inter, 16-18px, weight 400, line-height 1.7, max-width 65ch",
      labels: "Inter, 12px, weight 600, uppercase, tracking 0.1em",
      kpi: "Inter, 40-64px, weight 900, tabular-nums, accent color",
    },
    motion: {
      entrees: "fade-up 400ms ease-out, scroll-triggered",
      transitions: "fade 300ms ease-in-out",
      micro: "underline slide sur liens, 200ms ease",
    },
    scores: {
      lisibilite: "9/10",
      coherence: "8/10",
      effort: "M",
      modernite: "9/10",
      emotion: "8/10",
      unicite: "9/10",
    },
  },
];

// ─── Micro-helpers ─────────────────────────────────────────────────────────

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color }}>
      {children}
    </p>
  );
}

function Divider({ color }: { color: string }) {
  return <div className="h-px w-full my-10" style={{ background: color }} />;
}

// ─── MINI APP PREVIEW (generique — adapter selon le projet) ───────────────

function MiniAppPreview({ d, index }: { d: DirectionConfig; index: number }) {
  // Layout A : sidebar + main (neo-minimal)
  if (index === 0) {
    return (
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: d.border, background: d.canvas }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: d.border, background: d.surface }}>
          <span className="text-[13px] font-bold" style={{ color: d.text }}>Projet</span>
          <div className="flex-1" />
          <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{ color: d.canvas, background: d.accent1 }}>
            + Nouveau
          </button>
        </div>
        <div className="flex" style={{ minHeight: 160 }}>
          {/* Sidebar */}
          <div className="w-[120px] border-r p-3 space-y-1" style={{ borderColor: d.border, background: d.elevated }}>
            {["Dashboard", "Contenu", "Analytics", "Settings"].map((item, i) => (
              <div key={item} className="px-2 py-1.5 rounded-lg text-[11px] font-medium" style={
                i === 0 ? { background: d.accent1Bg, color: d.accent1 } : { color: d.muted }
              }>{item}</div>
            ))}
          </div>
          {/* Main */}
          <div className="flex-1 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[{ v: "1,240", l: "Utilisateurs", c: d.accent1 }, { v: "98%", l: "Uptime", c: d.accent3 }, { v: "24", l: "Nouveaux", c: d.accent2 }].map(k => (
                <div key={k.l} className="rounded-xl p-3 border" style={{ background: d.surface, borderColor: `${k.c}25` }}>
                  <span className="text-xl font-black block" style={{ color: k.c }}>{k.v}</span>
                  <span className="text-[10px]" style={{ color: d.muted }}>{k.l}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-3" style={{ background: d.surface, borderColor: d.border }}>
              <div className="h-2 rounded-full mb-2" style={{ background: d.elevated }}>
                <div className="h-full rounded-full" style={{ width: "68%", background: d.accent1 }} />
              </div>
              <p className="text-[12px]" style={{ color: d.muted }}>68% de l'objectif mensuel atteint</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout B : dark premium (3 zones)
  if (index === 1) {
    return (
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: d.border, background: d.canvas }}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: d.border }}>
          <span className="w-2 h-2 rounded-full" style={{ background: d.accent1, boxShadow: `0 0 6px ${d.accent1}` }} />
          <span className="text-[12px] font-bold" style={{ color: d.text }}>Dashboard</span>
          <div className="flex-1" />
          <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: d.muted, background: d.elevated }}>⌘K</span>
        </div>
        <div className="flex" style={{ minHeight: 160 }}>
          {/* Sidebar dark */}
          <div className="w-[80px] border-r flex flex-col gap-2 p-2" style={{ borderColor: d.border, background: d.surface }}>
            {[
              { icon: "⊞", label: "Home" },
              { icon: "◈", label: "Data" },
              { icon: "◉", label: "Live" },
              { icon: "⚙", label: "Config" },
            ].map((item, i) => (
              <div key={item.label} className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg" style={
                i === 0 ? { background: d.accent1Bg } : {}
              }>
                <span className="text-base" style={{ color: i === 0 ? d.accent1 : d.muted }}>{item.icon}</span>
                <span className="text-[8px]" style={{ color: i === 0 ? d.accent1 : `${d.muted}80` }}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* Main */}
          <div className="flex-1 p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {[{ v: "2,840", l: "Total", c: d.accent1 }, { v: "+12%", l: "Growth", c: d.accent3 }].map(k => (
                <div key={k.l} className="rounded-lg p-2.5 border" style={{ borderColor: `${k.c}20`, background: `${k.c}06` }}>
                  <span className="text-xl font-black" style={{ color: k.c }}>{k.v}</span>
                  <span className="text-[10px] block" style={{ color: d.muted }}>{k.l}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border p-2.5" style={{ borderColor: d.border, background: d.surface }}>
              <p className="text-[11px] mb-2" style={{ color: d.muted }}>Activite recente</p>
              {["Deployment reussi", "Nouveau user connecte", "Alert resolue"].map((item, i) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? d.accent3 : i === 1 ? d.accent1 : d.accent2 }} />
                  <span className="text-[11px]" style={{ color: i === 0 ? d.text : d.muted }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout C : bold typographic (landing/editorial)
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: d.border, background: d.canvas }}>
      {/* Nav minimal */}
      <div className="flex items-center gap-4 px-6 py-3 border-b" style={{ borderColor: d.border }}>
        <span className="text-[14px] font-black" style={{ color: d.text }}>Brand</span>
        <div className="flex-1" />
        {["Product", "Pricing", "Docs"].map(item => (
          <span key={item} className="text-[12px]" style={{ color: d.muted }}>{item}</span>
        ))}
        <button className="px-3 py-1 rounded-lg text-[11px] font-bold" style={{ color: d.canvas, background: d.text }}>
          Get started
        </button>
      </div>
      {/* Hero */}
      <div className="px-8 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: d.accent1 }}>Nouveau</p>
        <h1 className="text-[28px] font-black leading-none mb-4" style={{ color: d.text, letterSpacing: "-0.03em" }}>
          Votre produit,<br />
          <span style={{ color: d.accent1 }}>simplifie.</span>
        </h1>
        <p className="text-[13px] leading-relaxed mb-5" style={{ color: d.muted }}>
          Une description concise qui explique la valeur en 2 lignes max.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl text-[12px] font-bold" style={{ color: "#fff", background: d.text }}>
            Commencer gratuitement
          </button>
          <button className="px-4 py-2 rounded-xl text-[12px] font-semibold border" style={{ color: d.text, borderColor: d.border }}>
            Voir la demo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DIRECTION CARD ─────────────────────────────────────────────────────────

function DirectionCard({ d, index }: { d: DirectionConfig; index: number }) {
  const letter = ["A", "B", "C"][index];
  const isRecommended = index === 0; // Changer selon la direction recommandee

  return (
    <section className="space-y-6">
      {/* ── Titre + concept ── */}
      <div className="rounded-2xl border p-6" style={{ background: d.surface, borderColor: d.border, boxShadow: isRecommended ? `0 0 0 2px ${d.accent1}40` : "none" }}>
        <div className="flex items-start gap-4 mb-4">
          <span
            className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl font-black shrink-0"
            style={{ background: d.accent1Bg, color: d.accent1, border: `1px solid ${d.accent1Border}` }}
          >
            {letter}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black" style={{ color: d.text }}>
                Direction {letter} — &ldquo;{d.name}&rdquo;
              </h2>
              {isRecommended && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ color: d.accent1, background: d.accent1Bg, border: `1px solid ${d.accent1Border}` }}>
                  Recommandee
                </span>
              )}
            </div>
            <p className="text-[14px] leading-relaxed" style={{ color: d.muted }}>
              {d.concept}
            </p>
          </div>
        </div>

        {/* References */}
        <div className="flex flex-wrap gap-2">
          {d.references.map((ref) => (
            <span key={ref} className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold border" style={{ color: d.accent2, background: d.accent2Bg, borderColor: d.accent2Border }}>
              {ref}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mini preview ── */}
      <div>
        <SectionLabel color={d.muted}>Apercu visuel</SectionLabel>
        <MiniAppPreview d={d} index={index} />
      </div>

      {/* ── Argumentaire ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.accent1}>Origine</SectionLabel>
          <p className="text-[13px] leading-relaxed" style={{ color: d.text }}>{d.origin}</p>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.accent1}>Logique strategique</SectionLabel>
          <p className="text-[13px] leading-relaxed" style={{ color: d.text }}>{d.logique}</p>
        </div>
      </div>

      {/* ── Palette ── */}
      <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
        <SectionLabel color={d.muted}>Palette</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Canvas", color: d.canvas },
            { label: "Surface", color: d.surface },
            { label: "Elevated", color: d.elevated },
            { label: "Text", color: d.text },
            { label: "Muted", color: d.muted },
            { label: "Accent 1", color: d.accent1 },
            { label: "Accent 2", color: d.accent2 },
            { label: "Accent 3", color: d.accent3 },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md border" style={{ background: c.color, borderColor: d.border }} />
              <div>
                <p className="text-[10px] font-semibold" style={{ color: d.text }}>{c.label}</p>
                <p className="text-[10px] font-mono" style={{ color: d.muted }}>{c.color}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Layout ASCII + hierarchie ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.muted}>Layout ASCII</SectionLabel>
          <pre className="text-[11px] leading-snug overflow-x-auto" style={{ color: d.text, fontFamily: "monospace" }}>{d.layoutAscii}</pre>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.muted}>Hierarchie</SectionLabel>
          <div className="space-y-2.5">
            {[
              { label: "P1 — visible 0s", value: d.hierarchie.p1 },
              { label: "P2 — visible 2s", value: d.hierarchie.p2 },
              { label: "P3 — 1 tap", value: d.hierarchie.p3 },
              { label: "P4 — 2+ taps", value: d.hierarchie.p4 },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: d.accent1 }}>{item.label}</p>
                <p className="text-[12px]" style={{ color: d.text }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Typo + Motion + Scores ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.muted}>Typographie</SectionLabel>
          <div className="space-y-2">
            {Object.entries(d.typo).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] font-bold uppercase" style={{ color: d.accent1 }}>{k}</p>
                <p className="text-[11px]" style={{ color: d.text }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.muted}>Motion</SectionLabel>
          <div className="space-y-2">
            {Object.entries(d.motion).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] font-bold uppercase" style={{ color: d.accent1 }}>{k}</p>
                <p className="text-[11px]" style={{ color: d.text }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: d.surface, borderColor: d.border }}>
          <SectionLabel color={d.muted}>Scores</SectionLabel>
          <div className="space-y-2">
            {Object.entries(d.scores).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <p className="text-[11px]" style={{ color: d.muted }}>{k}</p>
                <p className="text-[11px] font-bold" style={{ color: v.includes("10") ? d.accent3 : v === "S" ? d.accent3 : v === "L" ? d.accent1 : d.text }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";

export default function DesignPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="min-h-screen py-16 px-4 md:px-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white/30 mb-3">
            Design Preview — Phase 2
          </p>
          <h1 className="text-5xl font-black text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
            3 Directions Artistiques
          </h1>
          <p className="text-[15px] text-white/50 max-w-2xl">
            Chaque direction est un systeme complet issu d&apos;une etude, pas une ambiance.
            Choisissez la direction qui correspond le mieux a votre brief avant de coder.
          </p>
          <div className="mt-4 px-4 py-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 inline-block">
            <p className="text-[12px] text-yellow-400/80">
              A supprimer apres validation de la direction choisie.
              Remplacer le contenu des DIRECTIONS par ceux generes par l&apos;agent design-director.
            </p>
          </div>
        </div>

        {/* Directions */}
        <div className="space-y-20">
          {DIRECTIONS.map((d, i) => (
            <div key={d.name}>
              <DirectionCard d={d} index={i} />
              {i < DIRECTIONS.length - 1 && <Divider color="rgba(255,255,255,0.06)" />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/20">
            Design Preview — Outil interne — Ne pas deployer en production
          </p>
        </div>
      </div>
    </div>
  );
}
