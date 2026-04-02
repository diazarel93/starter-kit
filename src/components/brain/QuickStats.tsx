import { getGithubBuilds, type BuildStatus } from "@/lib/brain-data";

interface Project {
  name: string;
  color: string;
  build?: BuildStatus;
  env: string;
}

const PROJECT_CONFIG = [
  { name: "Kura", color: "#4ECDC4", env: "production" },
  { name: "Lokivo", color: "#FF6B35", env: "production", repo: "diazarel93/lokivo-app" },
  { name: "Banlieuwood", color: "#D4A843", env: "production", repo: "diazarel93/atelier-banlieuwood" },
  { name: "Kura Player", color: "#8B5CF6", env: "staging" },
  { name: "Turn Up", color: "#6B7280", env: "staging" },
];

export async function QuickStats() {
  const builds = await getGithubBuilds();

  const projects: Project[] = PROJECT_CONFIG.map((p) => ({
    ...p,
    build: builds.find((b) => b.repo === (p as { repo?: string }).repo),
  }));

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
        Projets
      </h2>
      <div className="flex flex-wrap gap-2">
        {projects.map((p) => (
          <ProjectPill key={p.name} {...p} />
        ))}
      </div>
    </div>
  );
}

function ProjectPill({ name, color, env, build }: Project) {
  const buildIcon =
    build?.status === "success" ? "✓" :
    build?.status === "failure" ? "✗" :
    build?.status === "pending" ? "⟳" :
    null;

  const buildColor =
    build?.status === "success" ? "text-green-400" :
    build?.status === "failure" ? "text-red-400" :
    "text-white/30";

  return (
    <div className="flex items-center gap-2 bg-white/3 border border-white/5 rounded-lg px-3 py-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium text-white/80">{name}</span>
      <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/40">
        {env}
      </span>
      {buildIcon && (
        <span className={`text-xs font-mono ${buildColor}`} title={build?.age}>
          {buildIcon}
        </span>
      )}
    </div>
  );
}
