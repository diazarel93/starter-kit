import { createClient } from "@supabase/supabase-js";
import { MetricCard } from "@/components/brain/MetricCard";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 3600;

async function getLokivoUserCount(): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return 0;
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;

  const lokivoUsers = project === "all" || project === "lokivo" ? await getLokivoUserCount() : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">PRODUITS & UTILISATEURS</h1>
        <p className="mt-1 text-sm text-white/40">DAU/WAU/MAU, funnel activation, beta testeurs</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {(project === "all" || project === "kura") && (
          <MetricCard label="Utilisateurs Kura" value="0" sub="DAU / MAU" status="warn" />
        )}
        {(project === "all" || project === "lokivo") && (
          <MetricCard
            label="Utilisateurs Lokivo"
            value={String(lokivoUsers ?? 0)}
            sub="Comptes Supabase"
            status={lokivoUsers ? "ok" : "warn"}
          />
        )}
        {(project === "all" || project === "banlieuwood") && (
          <MetricCard label="Élèves Banlieuwood" value="0" sub="Comptes actifs" status="warn" />
        )}
        <MetricCard
          label="Beta testeurs actifs"
          value="0"
          sub={project === "all" ? "Tous projets" : project}
          status="warn"
        />
        <MetricCard
          label="Taux activation"
          value="0%"
          sub="Inscription → 1ère action"
          status="warn"
        />
        <MetricCard label="Rétention D7" value="0%" sub="7 jours après inscription" status="warn" />
      </div>
    </div>
  );
}
