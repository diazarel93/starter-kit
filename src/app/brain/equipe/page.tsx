
export default async function EquipePage() {

  const roles = [
    { role: "owner", desc: "Tous les projets — accès total", color: "#FF6B35" },
    { role: "associate-lokivo", desc: "Lokivo — Produit, finances, technique", color: "#4ECDC4" },
    { role: "associate-kura", desc: "Kura — Compliance, produit, AI quality", color: "#8B5CF6" },
    { role: "associate-banlieuwood", desc: "Banlieuwood — Produit, technique", color: "#D4A843" },
    { role: "developer", desc: "Projet assigné — Technique uniquement", color: "#6B7280" },
    { role: "beta-tester", desc: "Projet assigné — Feedback form uniquement", color: "#3B82F6" },
    { role: "accountant", desc: "Tous (lecture) — Finances uniquement", color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">👥 ÉQUIPE & ACCÈS</h1>
        <p className="text-white/40 text-sm mt-1">Rôles, permissions, beta testeurs, sessions actives</p>
      </div>

      {/* Rôles */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Rôles disponibles</h3>
        <div className="space-y-2">
          {roles.map((r) => (
            <div key={r.role} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
              <code className="text-xs text-white/70 bg-white/5 px-2 py-0.5 rounded w-40 flex-shrink-0">
                {r.role}
              </code>
              <span className="text-sm text-white/40">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Membres actifs */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Membres actifs</h3>
        <p className="text-sm text-white/20 italic">Aucun membre ajouté</p>
      </div>

      {/* Beta testeurs */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Beta testeurs</h3>
        <p className="text-sm text-white/20 italic">Aucun beta testeur</p>
      </div>
    </div>
  );
}
