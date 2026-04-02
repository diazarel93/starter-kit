import { getAllCosts, getStripeMRR } from "@/lib/brain-data";
import { MetricCard } from "@/components/brain/MetricCard";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 3600;

const PROJECT_LABELS: Record<ProjectKey, string> = {
  all: "Tous projets",
  kura: "Kura",
  banlieuwood: "Banlieuwood",
  lokivo: "Lokivo",
};

export default async function FinancesPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;
  const label = PROJECT_LABELS[project];

  const [costs, stripe] = await Promise.all([getAllCosts(), getStripeMRR()]);

  const mrr = stripe ? parseFloat(stripe.mrr_usd) : 0;
  const totalCost = parseFloat(costs.total_usd);
  const marge = mrr - totalCost;
  const runway = totalCost > 0 ? (mrr > 0 ? Math.round(mrr / totalCost) : "∞") : "∞";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">FINANCES & ABONNEMENTS</h1>
        <p className="mt-1 text-sm text-white/40">{label} · MRR Stripe, coûts APIs, P&L mensuel</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {(project === "all" || project === "lokivo") && (
          <MetricCard
            label="MRR Lokivo"
            value={stripe ? `$${stripe.mrr_usd}` : "$0"}
            sub={
              stripe
                ? `${stripe.active_subs} abonnés · ARR $${stripe.arr_usd}`
                : "Stripe — tous plans"
            }
            highlight={mrr > 0}
          />
        )}
        {(project === "all" || project === "kura") && (
          <MetricCard label="MRR Kura" value="$0" sub="Stripe — pas encore actif" />
        )}
        {(project === "all" || project === "kura" || project === "banlieuwood") && (
          <MetricCard
            label="Anthropic Claude"
            value={`$${costs.anthropic.anthropic_usd}`}
            sub={
              costs.anthropic.calls > 0
                ? `${costs.anthropic.calls} appels · ${costs.anthropic.month}`
                : "Ce mois"
            }
          />
        )}
        {(project === "all" || project === "kura") && (
          <MetricCard
            label="OpenAI (Kura)"
            value={costs.openai ? `$${costs.openai.usd}` : "—"}
            sub="Kura AI"
          />
        )}
        <MetricCard
          label="Total coûts APIs"
          value={`$${costs.total_usd}`}
          sub="∑ Anthropic + OpenAI"
        />
        <MetricCard
          label="Marge mensuelle"
          value={mrr > 0 ? `$${marge.toFixed(0)}` : "—"}
          sub={mrr > 0 ? `MRR $${mrr} - Coûts $${totalCost.toFixed(2)}` : "Pas encore de revenus"}
          highlight={marge > 0}
        />
        <MetricCard label="Runway" value={String(runway)} sub="Mois restants" />
      </div>
    </div>
  );
}
