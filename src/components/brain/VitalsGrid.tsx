// VitalsGrid — Métriques CEO temps réel
// Data sources: Stripe (MRR), GitHub (builds), Supabase (users), APIs (costs)

interface Vital {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  status?: "ok" | "warn" | "danger";
  project?: string;
}

const VITALS: Vital[] = [
  { label: "MRR Total", value: "$0", sub: "ARR: $0", trend: "flat", status: "warn" },
  { label: "Burn Rate", value: "$0/mois", sub: "Runway: ∞", trend: "flat", status: "ok" },
  { label: "Utilisateurs actifs", value: "—", sub: "Tous projets", trend: "flat", status: "ok" },
  { label: "Coût APIs", value: "—/mois", sub: "Ce mois", trend: "flat", status: "ok" },
  { label: "Marge brute", value: "—", sub: "Revenus - Coûts", trend: "flat", status: "ok" },
  { label: "Builds passants", value: "—", sub: "GitHub CI", trend: "flat", status: "ok" },
];

export function VitalsGrid() {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
        Métriques Clés
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {VITALS.map((vital) => (
          <VitalCard key={vital.label} {...vital} />
        ))}
      </div>
    </div>
  );
}

function VitalCard({ label, value, sub, trend, status }: Vital) {
  const statusColor = {
    ok: "border-green-500/20",
    warn: "border-yellow-500/30",
    danger: "border-red-500/30",
  }[status ?? "ok"];

  const trendIcon = { up: "↑", down: "↓", flat: "—" }[trend ?? "flat"];
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/20";

  return (
    <div className={`bg-white/3 border ${statusColor} rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <p className="text-xs text-white/30 uppercase tracking-wide">{label}</p>
        <span className={`text-xs ${trendColor}`}>{trendIcon}</span>
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}
