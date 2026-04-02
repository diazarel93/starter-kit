/**
 * apis.js — Vérification coûts & usage APIs externes
 * Anthropic Console, Supabase Management, GitHub
 */

// Anthropic n'a pas d'API usage publique — on track localement via les appels
// Pour l'instant on lit le fichier de tracking local
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRACKING_FILE = resolve(__dirname, "../.api-costs.json");

function loadCosts() {
  if (!existsSync(TRACKING_FILE)) return { month: currentMonth(), anthropic: 0, calls: 0 };
  try {
    const data = JSON.parse(readFileSync(TRACKING_FILE, "utf-8"));
    if (data.month !== currentMonth()) return { month: currentMonth(), anthropic: 0, calls: 0 };
    return data;
  } catch {
    return { month: currentMonth(), anthropic: 0, calls: 0 };
  }
}

function currentMonth() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

export function trackApiCall({ model, inputTokens, outputTokens }) {
  const costs = loadCosts();
  // Prix Haiku 4.5 : $0.80/M input, $4/M output
  // Prix Sonnet 4.6 : $3/M input, $15/M output
  const pricing = {
    "claude-haiku-4-5-20251001": { in: 0.0000008, out: 0.000004 },
    "claude-sonnet-4-6": { in: 0.000003, out: 0.000015 },
    "claude-opus-4-6": { in: 0.000015, out: 0.000075 },
  };
  const p = pricing[model] ?? pricing["claude-haiku-4-5-20251001"];
  const cost = (inputTokens * p.in) + (outputTokens * p.out);
  costs.anthropic = (costs.anthropic ?? 0) + cost;
  costs.calls = (costs.calls ?? 0) + 1;
  costs[model] = (costs[model] ?? 0) + cost;
  writeFileSync(TRACKING_FILE, JSON.stringify(costs, null, 2));
  return cost;
}

export async function getApiCosts() {
  const costs = loadCosts();

  // GitHub API — vérifier rate limit
  let githubStatus = "non configuré";
  if (process.env.GITHUB_TOKEN) {
    try {
      const res = await fetch("https://api.github.com/rate_limit", {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      });
      const data = await res.json();
      const remaining = data.rate?.remaining ?? "?";
      const limit = data.rate?.limit ?? 5000;
      githubStatus = `${remaining}/${limit} requêtes restantes`;
    } catch {
      githubStatus = "erreur réseau";
    }
  }

  return {
    mois: costs.month,
    anthropic_usd: costs.anthropic?.toFixed(4) ?? "0.0000",
    appels_brain_agent: costs.calls ?? 0,
    github: githubStatus,
    detail_modeles: Object.entries(costs)
      .filter(([k]) => k.startsWith("claude-"))
      .map(([model, cost]) => ({ model, cost: `$${cost.toFixed(4)}` })),
  };
}

export async function checkGithubBuilds() {
  if (!process.env.GITHUB_TOKEN) return { error: "GITHUB_TOKEN non configuré" };

  const repos = ["diazarel93/starter-kit", "diazarel93/lokivo-app", "diazarel93/atelier-banlieuwood"];
  const results = [];

  for (const repo of repos) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/actions/runs?per_page=1`,
        { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
      );
      if (!res.ok) { results.push({ repo, status: "repo privé ou inaccessible" }); continue; }
      const data = await res.json();
      const run = data.workflow_runs?.[0];
      if (!run) { results.push({ repo, status: "aucun workflow" }); continue; }
      results.push({
        repo,
        status: run.conclusion ?? run.status,
        branch: run.head_branch,
        age: Math.round((Date.now() - new Date(run.created_at).getTime()) / 3600000) + "h",
      });
    } catch {
      results.push({ repo, status: "erreur réseau" });
    }
  }
  return results;
}
