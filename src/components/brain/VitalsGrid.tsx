import { getApiCosts, getGithubBuilds } from "@/lib/brain-data";

interface Vital {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  status?: "ok" | "warn" | "danger";
}

export async function VitalsGrid() {
  const [costs, builds] = await Promise.all([
    Promise.resolve(getApiCosts()),
    getGithubBuilds(),
  ]);

  const passing = builds.filter((b) => b.status === "success").length;
  const failing = builds.filter((b) => b.status === "failure").length;
  const buildsValue = builds.every((b) => b.status === "unknown")
    ? "—"
    : `${passing}/${builds.length}`;
  const buildsStatus: Vital["status"] = failing > 0 ? "danger" : passing === builds.length ? "ok" : "warn";

  const apiCostNum = parseFloat(costs.anthropic_usd);
  const apiStatus: Vital["status"] = apiCostNum > 5 ? "warn" : apiCostNum > 20 ? "danger" : "ok";

  const vitals: Vital[] = [
    { label: "MRR Total", value: "$0", sub: "ARR: $0", trend: "flat", status: "warn" },
    { label: "Burn Rate", value: "$0/mois", sub: "Runway: ∞", trend: "flat", status: "ok" },
    { label: "Utilisateurs actifs", value: "—", sub: "Tous projets", trend: "flat", status: "ok" },
    {
      label: "Coût APIs",
      value: `$${costs.anthropic_usd}`,
      sub: `${costs.calls} appels · ${costs.month}`,
      trend: "flat",
      status: apiStatus,
    },
    { label: "Marge brute", value: "—", sub: "Revenus - Coûts", trend: "flat", status: "ok" },
    {
      label: "Builds CI",
      value: buildsValue,
      sub: failing > 0 ? `${failing} en échec` : "GitHub Actions",
      trend: failing > 0 ? "down" : passing > 0 ? "up" : "flat",
      status: buildsStatus,
    },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
        Métriques Clés
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {vitals.map((vital) => (
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
  const trendColor =
    trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/20";

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
