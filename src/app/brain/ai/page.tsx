import { getAnthropicCosts, getOpenAICosts } from "@/lib/brain-data";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 3600;

function Card({
  label, value, sub, status,
}: {
  label: string; value: string; sub?: string; status?: "ok" | "warn" | "danger" | "dim";
}) {
  const valueColor =
    status === "ok" ? "text-green-400" :
    status === "warn" ? "text-yellow-400" :
    status === "danger" ? "text-red-400" :
    status === "dim" ? "text-white/20" :
    "text-white";
  const border =
    status === "ok" ? "border-green-500/20" :
    status === "warn" ? "border-yellow-500/30" :
    status === "danger" ? "border-red-500/30" :
    "border-white/5";

  return (
    <div className={`bg-white/3 border ${border} rounded-lg p-4`}>
      <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AIPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;

  const [anthropic, openai] = await Promise.all([
    Promise.resolve(getAnthropicCosts()),
    getOpenAICosts(),
  ]);

  const totalUsd = parseFloat(anthropic.anthropic_usd) + parseFloat(openai?.usd ?? "0");
  const costStatus = totalUsd > 30 ? "danger" : totalUsd > 10 ? "warn" : "ok";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">🧠 AI & KURA</h1>
        <p className="text-white/40 text-sm mt-1">
          Coûts modèles, guardrails, pipeline RAG, evals qualité
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card
          label="Anthropic — ce mois"
          value={`$${anthropic.anthropic_usd}`}
          sub={anthropic.calls > 0 ? `${anthropic.calls} appels · ${anthropic.month}` : "Pay-as-you-go"}
          status={costStatus}
        />
        <Card
          label="OpenAI — ce mois"
          value={openai ? `$${openai.usd}` : "—"}
          sub="Kura AI (estimation usage)"
          status={openai ? costStatus : "dim"}
        />
        <Card
          label="Total AI ce mois"
          value={`$${totalUsd.toFixed(2)}`}
          sub="Anthropic + OpenAI"
          status={costStatus}
        />
        {(project === "all" || project === "kura") && (
          <>
            <Card label="GR1 déclenchés" value="—" sub="RED jamais autorisé" status="dim" />
            <Card label="GR2 — Disclaimer Canada" value="—" sub="Canadians warned" status="dim" />
            <Card label="GR3 — Inconnus" value="—" sub="Substances inconnues" status="dim" />
            <Card label="Score evals" value="—" sub="Substances correctes /100" status="dim" />
            <Card label="Fraîcheur DB WADA" value="Jan 2026" sub="Liste interdictions" status="ok" />
            <Card label="Temps réponse /ask" value="—" sub="Kura endpoint" status="dim" />
          </>
        )}
        {anthropic.detail.length > 0 && anthropic.detail.map((d) => (
          <Card key={d.model} label={`Claude ${d.model}`} value={d.cost} sub="Ce mois" />
        ))}
      </div>
    </div>
  );
}
