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
  {
    name: "Lokivo",
    color: "#8B5CF6",
    env: "production",
    repo: "diazarel93/lokivo-app",
    projects: ["all", "lokivo"],
  },
  {
    name: "Banlieuwood",
    color: "#FF6B35",
    env: "production",
    repo: "diazarel93/atelier-banlieuwood",
    projects: ["all", "banlieuwood"],
  },
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
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/30 uppercase">
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
    build?.status === "success"
      ? "✓"
      : build?.status === "failure"
        ? "✗"
        : build?.status === "pending"
          ? "⟳"
          : null;

  const buildColor =
    build?.status === "success"
      ? "text-green-400"
      : build?.status === "failure"
        ? "text-red-400"
        : "text-white/30";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/3 px-3 py-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium text-white/80">{name}</span>
      <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/40">{env}</span>
      {buildIcon && (
        <span className={`font-mono text-xs ${buildColor}`} title={build?.age}>
          {buildIcon}
        </span>
      )}
    </div>
  );
}
