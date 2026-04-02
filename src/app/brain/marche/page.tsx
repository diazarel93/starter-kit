export default async function MarchePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  const veille = [
    {
      category: "WADA / Antidopage",
      items: [
        { label: "Liste interdictions 2026", status: "Janvier 2026", badge: "ok" },
        { label: "Prochaine MàJ liste", status: "1er janvier 2027", badge: "info" },
        { label: "Global DRO", status: "À surveiller", badge: "warn" },
        { label: "e-list officielle WADA", status: "À vérifier", badge: "warn" },
      ],
    },
    {
      category: "Stack technique",
      items: [
        { label: "Claude Haiku 3 → dépréciation", status: "19/04/2026", badge: "danger" },
        { label: "Next.js version", status: "v16 (actuel)", badge: "ok" },
        { label: "Supabase nouvelles features", status: "À surveiller", badge: "info" },
        { label: "Claude Code updates", status: "À surveiller", badge: "info" },
      ],
    },
    {
      category: "Marché RegTech Sport",
      items: [
        { label: "Taille marché antidopage", status: "→ connecter recherche", badge: "info" },
        { label: "Conférences WADA 2026", status: "→ Phase 8", badge: "info" },
        { label: "NADOs cibles", status: "CCES, USADA, AFLD", badge: "info" },
      ],
    },
  ];

  const badgeStyle = {
    ok: "bg-green-500/20 text-green-400",
    warn: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">MARCHÉ & VEILLE</h1>
        <p className="mt-1 text-sm text-white/40">Concurrents, WADA, stack tech, opportunités</p>
      </div>

      {p && p !== "all" && (
        <p className="rounded border border-white/5 bg-white/3 px-3 py-2 text-xs text-white/20">
          Vue globale — cette section n&apos;est pas filtrée par projet
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {veille.map((cat) => (
          <div key={cat.category} className="rounded-lg border border-white/5 bg-white/3 p-4">
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
              {cat.category}
            </h3>
            <div className="space-y-2.5">
              {cat.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-2">
                  <span className="flex-1 text-sm text-white/60">{item.label}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs whitespace-nowrap ${badgeStyle[item.badge as keyof typeof badgeStyle]}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-300">Claude Haiku 3 déprécié le 19/04/2026</p>
        <p className="mt-1 text-xs text-red-300/60">
          Migrer vers Haiku 4.5 (<code>claude-haiku-4-5-20251001</code>) avant cette date. Vérifier
          Kura V4 + bot Telegram.
        </p>
      </div>
    </div>
  );
}
