// QuickStats — Statut rapide par projet

const PROJECTS = [
  { name: "Kura", color: "#4ECDC4", status: "active", env: "production" },
  { name: "Lokivo", color: "#FF6B35", status: "active", env: "production" },
  { name: "Banlieuwood", color: "#D4A843", status: "active", env: "production" },
  { name: "Kura Player", color: "#8B5CF6", status: "dev", env: "staging" },
  { name: "Turn Up", color: "#6B7280", status: "paused", env: "staging" },
];

export function QuickStats() {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
        Projets
      </h2>
      <div className="flex flex-wrap gap-2">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2 bg-white/3 border border-white/5 rounded-lg px-3 py-2"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-sm font-medium text-white/80">{p.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              p.status === "active"
                ? "bg-green-500/20 text-green-400"
                : p.status === "dev"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-white/10 text-white/30"
            }`}>
              {p.env}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
