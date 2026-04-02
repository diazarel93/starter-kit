import { getAllCosts, getGithubBuilds, getStripeMRR } from "@/lib/brain-data";

interface Vital {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  status?: "ok" | "warn" | "danger";
}

export async function VitalsGrid() {
  const [costs, builds, stripe] = await Promise.all([
    getAllCosts(),
    getGithubBuilds(),
    getStripeMRR(),
  ]);

  // Builds
  const passing = builds.filter((b) => b.status === "success").length;
  const failing = builds.filter((b) => b.status === "failure").length;
  const allUnknown = builds.every((b) => b.status === "unknown");
  const buildsValue = allUnknown ? "—" : `${passing}/${builds.length}`;
  const buildsStatus: Vital["status"] = failing > 0 ? "danger" : passing === builds.length ? "ok" : "warn";

  // Coûts APIs
  const totalCost = parseFloat(costs.total_usd);
  const apiStatus: Vital["status"] = totalCost > 20 ? "danger" : totalCost > 8 ? "warn" : "ok";
  const apiSub = costs.openai
    ? `Anthropic $${costs.anthropic.anthropic_usd} · OpenAI $${costs.openai.usd}`
    : `Anthropic $${costs.anthropic.anthropic_usd} · ${costs.anthropic.calls} appels`;

  // Stripe MRR
  const mrr = stripe ? parseInt(stripe.mrr_usd) : 0;
  const mrrDisplay = stripe ? `$${stripe.mrr_usd}` : "$0";
  const arrDisplay = stripe ? `ARR: $${stripe.arr_usd}` : "ARR: $0";
  const mrrStatus: Vital["status"] = mrr > 500 ? "ok" : mrr > 0 ? "warn" : "warn";

  const vitals: Vital[] = [
    {
      label: "MRR Total",
      value: mrrDisplay,
      sub: stripe ? `${stripe.active_subs} abonnés · ${arrDisplay}` : arrDisplay,
      trend: mrr > 0 ? "up" : "flat",
      status: mrrStatus,
    },
    {
      label: "Burn Rate",
      value: `$${costs.total_usd}/mois`,
      sub: "APIs uniquement",
      trend: "flat",
      status: apiStatus,
    },
    {
      label: "Utilisateurs actifs",
      value: "—",
      sub: "Tous projets",
      trend: "flat",
      status: "ok",
    },
    {
      label: "Coût APIs",
      value: `$${costs.total_usd}`,
      sub: apiSub,
      trend: "flat",
      status: apiStatus,
    },
    {
      label: "Marge brute",
      value: mrr > 0 ? `${Math.round(((mrr - totalCost) / mrr) * 100)}%` : "—",
      sub: mrr > 0 ? `$${(mrr - totalCost).toFixed(0)}/mois` : "Pas encore de revenus",
      trend: mrr > totalCost ? "up" : "flat",
      status: mrr > totalCost ? "ok" : "warn",
    },
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
