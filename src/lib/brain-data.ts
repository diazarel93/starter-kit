/**
 * brain-data.ts — Lecture des données live pour le Brain Dashboard
 * Sources : brain-agent (local), GitHub API, OpenAI, Stripe, Resend
 */
import { readFileSync, existsSync } from "fs";
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

// ─── Coûts API (brain-agent tracking Anthropic local) ─────────────────────

export interface ApiCosts {
  month: string;
  anthropic_usd: string;
  calls: number;
  detail: { model: string; cost: string }[];
}

export function getAnthropicCosts(): ApiCosts {
  try {
    const path = resolve(HOME, "starter-kit/tools/brain-agent/.api-costs.json");
    if (!existsSync(path)) return { month: "—", anthropic_usd: "0.00", calls: 0, detail: [] };
    const data = JSON.parse(readFileSync(path, "utf-8"));
    const detail = Object.entries(data)
      .filter(([k]) => k.startsWith("claude-"))
      .map(([model, cost]) => ({
        model: model.replace("claude-", "").split("-")[0] ?? model,
        cost: `$${(cost as number).toFixed(3)}`,
      }));
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

// ─── OpenAI costs (billing API) ────────────────────────────────────────────

export interface OpenAICosts {
  usd: string;
  month: string;
}

export async function getOpenAICosts(): Promise<OpenAICosts | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");

    // Query usage for each day of the current month and sum up
    let totalTokens = 0;
    const daysInMonth = now.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${y}-${m}-${String(day).padStart(2, "0")}`;
      const res = await fetch(`https://api.openai.com/v1/usage?date=${date}`, {
        headers: { Authorization: `Bearer ${key}` },
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const entry of data.data ?? []) {
        totalTokens += (entry.n_context_tokens_total ?? 0) + (entry.n_generated_tokens_total ?? 0);
      }
    }

    // Estimation coût : ~$0.002 / 1K tokens (moyenne gpt-4o-mini)
    const estimatedUsd = (totalTokens / 1000) * 0.002;
    return { usd: estimatedUsd.toFixed(2), month: `${y}-${m}` };
  } catch {
    return null;
  }
}

// ─── Stripe MRR ────────────────────────────────────────────────────────────

export interface StripeMRR {
  mrr_usd: string;
  arr_usd: string;
  active_subs: number;
}

export async function getStripeMRR(): Promise<StripeMRR | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    // Fetch active subscriptions (max 100)
    const res = await fetch(
      "https://api.stripe.com/v1/subscriptions?status=active&limit=100&expand[]=data.plan",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(key + ":").toString("base64")}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const subs = data.data ?? [];

    // MRR = somme des montants mensuels normalisés
    let mrrCents = 0;
    for (const sub of subs) {
      const plan = sub.plan ?? sub.items?.data?.[0]?.plan;
      if (!plan) continue;
      const amount = plan.amount ?? 0;
      const interval = plan.interval ?? "month";
      const count = plan.interval_count ?? 1;
      // Normalise en mensuel
      const monthlyAmount =
        interval === "year" ? amount / (12 * count) :
        interval === "week" ? (amount * 52) / (12 * count) :
        amount / count;
      mrrCents += monthlyAmount;
    }

    const mrr = mrrCents / 100;
    return {
      mrr_usd: mrr.toFixed(0),
      arr_usd: (mrr * 12).toFixed(0),
      active_subs: subs.length,
    };
  } catch {
    return null;
  }
}

// ─── Resend quota ──────────────────────────────────────────────────────────

export interface ResendQuota {
  remaining: number;
  limit: number;
}

export async function getResendQuota(): Promise<ResendQuota | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    // Resend free tier = 3000/mois, 100/jour — pas d'API quota directe
    // On vérifie juste que la clé est valide
    return { remaining: 3000, limit: 3000 };
  } catch {
    return null;
  }
}

// ─── Coûts API agrégés ─────────────────────────────────────────────────────

export interface AllCosts {
  anthropic: ApiCosts;
  openai: OpenAICosts | null;
  total_usd: string;
  month: string;
}

export async function getAllCosts(): Promise<AllCosts> {
  const [anthropic, openai] = await Promise.all([
    Promise.resolve(getAnthropicCosts()),
    getOpenAICosts(),
  ]);
  const totalUsd =
    parseFloat(anthropic.anthropic_usd) + parseFloat(openai?.usd ?? "0");
  return {
    anthropic,
    openai,
    total_usd: totalUsd.toFixed(2),
    month: anthropic.month,
  };
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
