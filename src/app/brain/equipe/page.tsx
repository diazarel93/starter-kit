export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  const roles = [
    { role: "owner", desc: "Tous les projets — accès total", color: "#FF6B35" },
    { role: "associate-lokivo", desc: "Lokivo — Produit, finances, technique", color: "#4ECDC4" },
    { role: "associate-kura", desc: "Kura — Compliance, produit, AI quality", color: "#8B5CF6" },
    {
      role: "associate-banlieuwood",
      desc: "Banlieuwood — Produit, technique",
      color: "#D4A843",
    },
    { role: "developer", desc: "Projet assigné — Technique uniquement", color: "#6B7280" },
    { role: "beta-tester", desc: "Projet assigné — Feedback form uniquement", color: "#3B82F6" },
    { role: "accountant", desc: "Tous (lecture) — Finances uniquement", color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">ÉQUIPE & ACCÈS</h1>
        <p className="mt-1 text-sm text-white/40">
          Rôles, permissions, beta testeurs, sessions actives
        </p>
      </div>

      {p && p !== "all" && (
        <p className="rounded border border-white/5 bg-white/3 px-3 py-2 text-xs text-white/20">
          Vue globale — cette section n&apos;est pas filtrée par projet
        </p>
      )}

      {/* Rôles */}
      <div className="rounded-lg border border-white/5 bg-white/3 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Rôles disponibles
        </h3>
        <div className="space-y-2">
          {roles.map((r) => (
            <div key={r.role} className="flex items-center gap-3">
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: r.color }}
              />
              <code className="w-40 flex-shrink-0 rounded bg-white/5 px-2 py-0.5 text-xs text-white/70">
                {r.role}
              </code>
              <span className="text-sm text-white/40">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Membres actifs */}
      <div className="rounded-lg border border-white/5 bg-white/3 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Membres actifs
        </h3>
        <p className="text-sm text-white/20 italic">
          Aucun membre ajouté — à configurer dans les paramètres du projet
        </p>
      </div>

      {/* Beta testeurs */}
      <div className="rounded-lg border border-white/5 bg-white/3 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Beta testeurs
        </h3>
        <p className="text-sm text-white/20 italic">
          Aucun beta testeur — à configurer dans les paramètres du projet
        </p>
      </div>
    </div>
  );
}
