import { getAllCosts, getGithubBuilds, getStripeMRR } from "@/lib/brain-data";
import { MetricCard } from "@/components/brain/MetricCard";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

interface Vital {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  status?: "ok" | "warn" | "danger";
}

const REPO_BY_PROJECT: Record<ProjectKey, string[]> = {
  all: ["diazarel93/atelier-banlieuwood", "diazarel93/lokivo-app", "diazarel93/starter-kit"],
  kura: [],
  banlieuwood: ["diazarel93/atelier-banlieuwood"],
  lokivo: ["diazarel93/lokivo-app"],
};

export async function VitalsGrid({ project = "all" }: { project?: ProjectKey }) {
  const [costs, builds, stripe] = await Promise.all([
    getAllCosts(),
    getGithubBuilds(),
    getStripeMRR(),
  ]);

  const reposToShow = REPO_BY_PROJECT[project];
  const filteredBuilds =
    reposToShow.length > 0 ? builds.filter((b) => reposToShow.includes(b.repo)) : builds;

  const passing = filteredBuilds.filter((b) => b.status === "success").length;
  const failing = filteredBuilds.filter((b) => b.status === "failure").length;
  const allUnknown = filteredBuilds.every((b) => b.status === "unknown");
  const buildsValue =
    allUnknown || filteredBuilds.length === 0 ? "—" : `${passing}/${filteredBuilds.length}`;
  const buildsStatus: Vital["status"] =
    failing > 0 ? "danger" : passing === filteredBuilds.length && passing > 0 ? "ok" : "warn";

  const totalCost = parseFloat(costs.total_usd);
  const apiStatus: Vital["status"] = totalCost > 20 ? "danger" : totalCost > 8 ? "warn" : "ok";
  const apiSub = costs.openai
    ? `Anthropic $${costs.anthropic.anthropic_usd} · OpenAI $${costs.openai.usd}`
    : `Anthropic $${costs.anthropic.anthropic_usd} · ${costs.anthropic.calls} appels`;

  const mrr = stripe ? parseInt(stripe.mrr_usd) : 0;
  const mrrDisplay = stripe ? `$${stripe.mrr_usd}` : "$0";
  const arrDisplay = stripe ? `ARR: $${stripe.arr_usd}` : "ARR: $0";
  const mrrStatus: Vital["status"] = mrr > 500 ? "ok" : "warn";

  const vitals: Vital[] = [
    {
      label: "MRR Total",
      value: mrrDisplay,
      sub: stripe ? `${stripe.active_subs} abonnés · ${arrDisplay}` : arrDisplay,
      trend: mrr > 0 ? "up" : "flat",
      status: mrrStatus,
    },
    {
      label: "Coût APIs / mois",
      value: `$${costs.total_usd}`,
      sub: apiSub,
      trend: "flat",
      status: apiStatus,
    },
    {
      label: "Utilisateurs actifs",
      value: "0",
      sub: project === "all" ? "Tous projets" : project,
      trend: "flat",
      status: "warn",
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
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/30 uppercase">
        Métriques Clés
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {vitals.map((vital) => (
          <MetricCard key={vital.label} {...vital} />
        ))}
      </div>
    </div>
  );
}
