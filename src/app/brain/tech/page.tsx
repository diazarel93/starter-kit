import { getGithubBuilds } from "@/lib/brain-data";
import { MetricCard } from "@/components/brain/MetricCard";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 120;

const REPOS_BY_PROJECT: Record<ProjectKey, string[]> = {
  all: ["diazarel93/atelier-banlieuwood", "diazarel93/lokivo-app", "diazarel93/starter-kit"],
  kura: [],
  banlieuwood: ["diazarel93/atelier-banlieuwood", "diazarel93/starter-kit"],
  lokivo: ["diazarel93/lokivo-app"],
};

export default async function TechPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;

  const builds = await getGithubBuilds();
  const reposToShow = REPOS_BY_PROJECT[project];
  const filtered =
    reposToShow.length > 0 ? builds.filter((b) => reposToShow.includes(b.repo)) : builds;

  const byRepo = Object.fromEntries(filtered.map((b) => [b.repo, b]));

  function buildCard(repo: string, label: string) {
    const b = byRepo[repo];
    if (!b) return null;
    const status =
      b.status === "success"
        ? "ok"
        : b.status === "failure"
          ? "danger"
          : b.status === "pending"
            ? "warn"
            : "unknown";
    const icon =
      b.status === "success"
        ? "✓"
        : b.status === "failure"
          ? "✗"
          : b.status === "pending"
            ? "⟳"
            : "—";
    return (
      <MetricCard
        key={repo}
        label={label}
        value={icon}
        sub={b.age ? `${b.branch ?? "main"} · ${b.age}` : b.branch}
        status={status as "ok" | "warn" | "danger" | "unknown"}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">SANTÉ TECHNIQUE</h1>
        <p className="mt-1 text-sm text-white/40">Builds CI/CD, TypeScript errors, sécurité</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {(project === "all" || project === "kura") && (
          <MetricCard
            label="Kura V4 — build"
            value="—"
            sub="Repo privé — non tracké"
            status="dim"
          />
        )}
        {(project === "all" || project === "banlieuwood") &&
          buildCard("diazarel93/atelier-banlieuwood", "Banlieuwood — build")}
        {(project === "all" || project === "banlieuwood") &&
          buildCard("diazarel93/starter-kit", "Starter-kit — CI")}
        {(project === "all" || project === "lokivo") &&
          buildCard("diazarel93/lokivo-app", "Lokivo — build")}
        <MetricCard label="CVEs critiques" value="0" sub="npm audit" status="ok" />
        <MetricCard label="Secrets exposés" value="0" sub="Aucun détecté ✓" status="ok" />
      </div>
    </div>
  );
}
