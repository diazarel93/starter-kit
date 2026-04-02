import { getAnthropicCosts, getOpenAICosts } from "@/lib/brain-data";
import { MetricCard } from "@/components/brain/MetricCard";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 3600;

export default async function AIPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;

  const [anthropic, openai] = await Promise.all([
    Promise.resolve(getAnthropicCosts()),
    getOpenAICosts(),
  ]);

  const totalUsd = parseFloat(anthropic.anthropic_usd) + parseFloat(openai?.usd ?? "0");
  const costStatus: "ok" | "warn" | "danger" =
    totalUsd > 30 ? "danger" : totalUsd > 10 ? "warn" : "ok";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">AI & KURA</h1>
        <p className="mt-1 text-sm text-white/40">
          Coûts modèles, guardrails, pipeline RAG, evals qualité
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <MetricCard
          label="Anthropic — ce mois"
          value={`$${anthropic.anthropic_usd}`}
          sub={
            anthropic.calls > 0 ? `${anthropic.calls} appels · ${anthropic.month}` : "Pay-as-you-go"
          }
          status={costStatus}
        />
        <MetricCard
          label="OpenAI — ce mois"
          value={openai ? `$${openai.usd}` : "—"}
          sub="Kura AI (estimation usage)"
          status={openai ? costStatus : "dim"}
        />
        <MetricCard
          label="Total AI ce mois"
          value={`$${totalUsd.toFixed(2)}`}
          sub="Anthropic + OpenAI"
          status={costStatus}
        />
        {(project === "all" || project === "kura") && (
          <>
            <MetricCard label="GR1 déclenchés" value="—" sub="RED jamais autorisé" status="dim" />
            <MetricCard
              label="GR2 — Disclaimer Canada"
              value="—"
              sub="Canadians warned"
              status="dim"
            />
            <MetricCard label="GR3 — Inconnus" value="—" sub="Substances inconnues" status="dim" />
            <MetricCard
              label="Score evals"
              value="—"
              sub="Substances correctes /100"
              status="dim"
            />
            <MetricCard
              label="Fraîcheur DB WADA"
              value="Jan 2026"
              sub="Liste interdictions"
              status="ok"
            />
            <MetricCard label="Temps réponse /ask" value="—" sub="Kura endpoint" status="dim" />
          </>
        )}
        {anthropic.detail.length > 0 &&
          anthropic.detail.map((d) => (
            <MetricCard key={d.model} label={`Claude ${d.model}`} value={d.cost} sub="Ce mois" />
          ))}
      </div>
    </div>
  );
}
