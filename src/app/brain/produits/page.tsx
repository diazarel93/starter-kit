import { createClient } from "@supabase/supabase-js";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 3600;

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const isZero = value === "0" || value === "0%";
  return (
    <div className="rounded-lg p-4 border bg-white/3 border-white/5">
      <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${isZero ? "text-white/40" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

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

  const lokivoUsers = (project === "all" || project === "lokivo")
    ? await getLokivoUserCount()
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">📦 PRODUITS & UTILISATEURS</h1>
        <p className="text-white/40 text-sm mt-1">DAU/WAU/MAU, funnel activation, beta testeurs</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {(project === "all" || project === "kura") && (
          <Card label="Utilisateurs Kura" value="0" sub="DAU / MAU" />
        )}
        {(project === "all" || project === "lokivo") && (
          <Card label="Utilisateurs Lokivo" value={String(lokivoUsers ?? 0)} sub="Comptes Supabase" />
        )}
        {(project === "all" || project === "banlieuwood") && (
          <Card label="Élèves Banlieuwood" value="0" sub="Comptes actifs" />
        )}
        <Card label="Beta testeurs actifs" value="0" sub={project === "all" ? "Tous projets" : project} />
        <Card label="Taux activation" value="0%" sub="Inscription → 1ère action" />
        <Card label="Rétention D7" value="0%" sub="7 jours après inscription" />
      </div>
    </div>
  );
}
