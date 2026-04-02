import { getGithubBuilds, type BuildStatus } from "@/lib/brain-data";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

interface Project {
  name: string;
  color: string;
  build?: BuildStatus;
  env: string;
  projects: ProjectKey[];
}

const PROJECT_CONFIG: (Omit<Project, "build"> & { repo?: string })[] = [
  { name: "Kura", color: "#4ECDC4", env: "production", projects: ["all", "kura"] },
  { name: "Kura Player", color: "#8B5CF6", env: "staging", projects: ["all", "kura"] },
  { name: "Lokivo", color: "#8B5CF6", env: "production", repo: "diazarel93/lokivo-app", projects: ["all", "lokivo"] },
  { name: "Banlieuwood", color: "#FF6B35", env: "production", repo: "diazarel93/atelier-banlieuwood", projects: ["all", "banlieuwood"] },
  { name: "Turn Up", color: "#6B7280", env: "staging", projects: ["all", "banlieuwood"] },
];

export async function QuickStats({ project = "all" }: { project?: ProjectKey }) {
  const builds = await getGithubBuilds();

  const filtered = PROJECT_CONFIG.filter((p) => p.projects.includes(project));
  const projects: Project[] = filtered.map((p) => ({
    ...p,
    build: builds.find((b) => b.repo === p.repo),
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
