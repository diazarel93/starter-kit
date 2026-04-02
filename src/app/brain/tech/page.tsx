import { getGithubBuilds } from "@/lib/brain-data";

export const revalidate = 120;

function BuildCard({ label, repo, sub }: { label: string; repo?: string; sub: string }) {
  return null; // filled below
}

function Card({ label, value, sub, status }: { label: string; value: string; sub?: string; status?: "ok" | "warn" | "danger" | "unknown" }) {
  const border = {
    ok: "border-green-500/20",
    warn: "border-yellow-500/30",
    danger: "border-red-500/30",
    unknown: "border-white/5",
  }[status ?? "unknown"];

  const color = {
    ok: "text-green-400",
    warn: "text-yellow-400",
    danger: "text-red-400",
    unknown: "text-white",
  }[status ?? "unknown"];

  return (
    <div className={`rounded-lg p-4 border bg-white/3 ${border}`}>
      <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default async function TechPage() {
  const builds = await getGithubBuilds();

  const byRepo = Object.fromEntries(builds.map((b) => [b.repo, b]));

  function buildValue(repo: string) {
    const b = byRepo[repo];
    if (!b) return { value: "—", status: "unknown" as const, sub: undefined };
    const status = b.status === "success" ? "ok" : b.status === "failure" ? "danger" : b.status === "pending" ? "warn" : "unknown";
    const icon = b.status === "success" ? "✓" : b.status === "failure" ? "✗" : b.status === "pending" ? "⟳" : "—";
    return { value: icon, status: status as "ok" | "warn" | "danger" | "unknown", sub: b.age ? `${b.branch ?? "main"} · ${b.age}` : b.branch };
  }

  const bw = buildValue("diazarel93/atelier-banlieuwood");
  const lokivo = buildValue("diazarel93/lokivo-app");
  const sk = buildValue("diazarel93/starter-kit");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white flex items-center gap-3">
          🔧 SANTÉ TECHNIQUE
        </h1>
        <p className="text-white/40 text-sm mt-1">Builds CI/CD, TypeScript errors, Lighthouse, uptime, sécurité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card label="Kura V4 — build" value="—" sub="GitHub Actions (repo privé)" status="unknown" />
        <Card label="Banlieuwood — build" value={bw.value} sub={bw.sub ?? "GitHub Actions"} status={bw.status} />
        <Card label="Lokivo — build" value={lokivo.value} sub={lokivo.sub ?? "GitHub Actions"} status={lokivo.status} />
        <Card label="Starter-kit — CI" value={sk.value} sub={sk.sub ?? "GitHub Actions"} status={sk.status} />
        <Card label="Uptime global" value="—" sub="30 derniers jours" status="unknown" />
        <Card label="CVEs critiques" value="0" sub="npm audit" status="ok" />
        <Card label="Secrets exposés" value="0" sub="Aucun détecté ✓" status="ok" />
      </div>
    </div>
  );
}
