import { getAllCosts, getStripeMRR } from "@/lib/brain-data";

export const revalidate = 3600;

function Card({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 border ${highlight ? "bg-green-500/5 border-green-500/20" : "bg-white/3 border-white/5"}`}>
      <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-green-400" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default async function FinancesPage() {
  const [costs, stripe] = await Promise.all([getAllCosts(), getStripeMRR()]);

  const mrr = stripe ? parseFloat(stripe.mrr_usd) : 0;
  const totalCost = parseFloat(costs.total_usd);
  const marge = mrr - totalCost;
  const runway = totalCost > 0 ? (mrr > 0 ? Math.round(mrr / totalCost) : "∞") : "∞";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white flex items-center gap-3">
          💰 FINANCES & ABONNEMENTS
        </h1>
        <p className="text-white/40 text-sm mt-1">MRR Stripe, coûts APIs, P&L mensuel, alertes budget</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card
          label="MRR"
          value={stripe ? `$${stripe.mrr_usd}` : "$0"}
          sub={stripe ? `${stripe.active_subs} abonnés · ARR $${stripe.arr_usd}` : "Stripe — tous plans"}
          highlight={mrr > 0}
        />
        <Card
          label="Anthropic Claude"
          value={`$${costs.anthropic.anthropic_usd}`}
          sub={costs.anthropic.calls > 0 ? `${costs.anthropic.calls} appels · ${costs.anthropic.month}` : "Ce mois (pay-as-you-go)"}
        />
        <Card
          label="OpenAI"
          value={costs.openai ? `$${costs.openai.usd}` : "—"}
          sub={costs.openai ? `Estimation usage · ${costs.openai.month}` : "Kura AI"}
        />
        <Card
          label="Total coûts APIs"
          value={`$${costs.total_usd}`}
          sub="∑ Anthropic + OpenAI"
        />
        <Card
          label="Marge mensuelle"
          value={mrr > 0 ? `$${marge.toFixed(0)}` : "—"}
          sub={mrr > 0 ? `MRR $${mrr} - Coûts $${totalCost.toFixed(2)}` : "Pas encore de revenus"}
          highlight={marge > 0}
        />
        <Card
          label="Runway"
          value={String(runway)}
          sub="Mois restants"
        />
      </div>
    </div>
  );
}
