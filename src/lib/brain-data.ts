/**
 * brain-data.ts — Lecture des données live pour le Brain Dashboard
 * Sources : brain-agent (local), GitHub API
 * Fonctionne en local ; fallback gracieux sur Vercel (pas de filesystem)
 */
import { homedir } from "os";
import { resolve } from "path";

const HOME = homedir();

// ─── Alertes brain-agent ───────────────────────────────────────────────────

export interface BrainAlert {
  type: "danger" | "warn" | "info";
  message: string;
  project?: string;
  date: string;
  acknowledged: boolean;
}

export function getBrainAlerts(): BrainAlert[] {
  try {
    const { readFileSync, existsSync } = require("fs");
    const path = resolve(HOME, "starter-kit/tools/brain-agent/.brain-alerts.json");
    if (!existsSync(path)) return [];
    const alerts: BrainAlert[] = JSON.parse(readFileSync(path, "utf-8"));
    return alerts
      .filter((a) => !a.acknowledged)
      .slice(-20)
      .reverse()
      .slice(0, 8);
  } catch {
    return [];
  }
}

// ─── Coûts API (brain-agent tracking) ─────────────────────────────────────

export interface ApiCosts {
  month: string;
  anthropic_usd: string;
  calls: number;
  detail: { model: string; cost: string }[];
}

export function getApiCosts(): ApiCosts {
  try {
    const { readFileSync, existsSync } = require("fs");
    const path = resolve(HOME, "starter-kit/tools/brain-agent/.api-costs.json");
    if (!existsSync(path)) return { month: "—", anthropic_usd: "0.00", calls: 0, detail: [] };
    const data = JSON.parse(readFileSync(path, "utf-8"));
    const detail = Object.entries(data)
      .filter(([k]) => k.startsWith("claude-"))
      .map(([model, cost]) => ({ model: model.replace("claude-", "").split("-")[0] ?? model, cost: `$${(cost as number).toFixed(3)}` }));
    return {
      month: data.month ?? "—",
      anthropic_usd: (data.anthropic ?? 0).toFixed(2),
      calls: data.calls ?? 0,
      detail,
    };
  } catch {
    return { month: "—", anthropic_usd: "0.00", calls: 0, detail: [] };
  }
}

// ─── GitHub CI builds ──────────────────────────────────────────────────────

export interface BuildStatus {
  name: string;
  repo: string;
  status: "success" | "failure" | "pending" | "unknown";
  branch?: string;
  age?: string;
}

const REPOS = [
  { repo: "diazarel93/starter-kit", name: "Starter Kit" },
  { repo: "diazarel93/atelier-banlieuwood", name: "Banlieuwood" },
  { repo: "diazarel93/lokivo-app", name: "Lokivo" },
];

export async function getGithubBuilds(): Promise<BuildStatus[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return REPOS.map(({ repo, name }) => ({ repo, name, status: "unknown" }));
  }

  return Promise.all(
    REPOS.map(async ({ repo, name }) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo}/actions/runs?per_page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-Agent": "brain-dashboard/1.0",
            },
            next: { revalidate: 120 },
          }
        );
        if (!res.ok) return { repo, name, status: "unknown" as const };
        const data = await res.json();
        const run = data.workflow_runs?.[0];
        if (!run) return { repo, name, status: "unknown" as const };

        const status: BuildStatus["status"] =
          run.conclusion === "success" ? "success" :
          run.conclusion === "failure" ? "failure" :
          run.status === "in_progress" || run.status === "queued" ? "pending" :
          "unknown";

        const ageMs = Date.now() - new Date(run.created_at).getTime();
        const ageH = Math.round(ageMs / 3600000);
        const age = ageH < 1 ? "<1h" : ageH < 24 ? `${ageH}h` : `${Math.round(ageH / 24)}j`;

        return { repo, name, status, branch: run.head_branch, age };
      } catch {
        return { repo, name, status: "unknown" as const };
      }
    })
  );
}
