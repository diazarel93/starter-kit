/**
 * patterns.js — Détection de patterns, bugs récurrents, incompréhensions
 * Log append-only d'événements → analyse Claude → routing vers le bon agent
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = resolve(__dirname, "../.patterns-log.jsonl");
const PATTERNS_FILE = resolve(__dirname, "../.detected-patterns.json");

// Types d'événements trackés
export const EVENT_TYPES = {
  SAME_FIX_AGAIN: "same_fix_again",       // même correction appliquée 2e fois
  REPEATED_QUESTION: "repeated_question",  // Romain repose la même question
  RECURRING_ERROR: "recurring_error",      // même type d'erreur dans plusieurs fichiers
  MISUNDERSTANDING: "misunderstanding",    // incompréhension d'un concept
  IGNORED_AGENT: "ignored_agent",          // agent recommandé mais pas invoqué
  DECISION_LOOP: "decision_loop",          // même décision prise puis annulée
};

// Routing : type de problème → agent à invoquer
export const AGENT_ROUTER = {
  // Technique
  "rls|supabase|migration|sql|db|database|table|foreign key":  "db-architect",
  "security|secret|injection|xss|cve|auth|jwt|token":          "code-reviewer",
  "typescript|type error|any|generic|interface|type":           "code-reviewer",
  "design|ui|ux|composant|couleur|layout|responsive|ipad":      "design-director",
  "feature|fonctionnalit|implémentation|nouvelle page":         "feature-planner",
  "stripe|billing|abonnement|payment|subscription|webhook":     "stripe-expert",
  "i18n|traduction|locale|language|multilingue":                "i18n-manager",
  "seo|lighthouse|meta|schema|google|crawl":                    "seo-specialist",
  "growth|retention|onboarding|churn|acquisition|viral":        "growth-architect",
  "architecture|scalable|performance|dette technique|refactor": "cto-advisor",
  "wada|kura|substance|guardrail|compliance|antidopage":        "kura-specialist",
  "formation|apprentissage|quiz|curriculum|coach":              "formation-generator",
  "deploy|vercel|ci|build|github actions|pipeline":             "tech-watcher",
};

export function logEvent({ type, description, project, file, meta = {} }) {
  const event = {
    ts: new Date().toISOString(),
    type,
    description,
    project: project ?? "général",
    file: file ?? null,
    meta,
  };
  appendFileSync(LOG_FILE, JSON.stringify(event) + "\n");
  return event;
}

export function loadEvents({ last = 100 } = {}) {
  if (!existsSync(LOG_FILE)) return [];
  try {
    const lines = readFileSync(LOG_FILE, "utf-8").trim().split("\n").filter(Boolean);
    return lines.slice(-last).flatMap((l) => {
      try { return [JSON.parse(l)]; } catch { return []; }
    });
  } catch {
    return [];
  }
}

export function loadPatterns() {
  if (!existsSync(PATTERNS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(PATTERNS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function savePatterns(patterns) {
  writeFileSync(PATTERNS_FILE, JSON.stringify(patterns, null, 2));
}

export function detectAgentFromText(text) {
  const lower = text.toLowerCase();
  for (const [keywords, agent] of Object.entries(AGENT_ROUTER)) {
    const kws = keywords.split("|");
    if (kws.some((kw) => lower.includes(kw))) {
      return agent;
    }
  }
  return null;
}

export function addPattern({ title, description, frequency, suggestedAction, agent, project }) {
  const patterns = loadPatterns();
  const existing = patterns.find((p) => p.title === title);
  if (existing) {
    existing.frequency = (existing.frequency ?? 1) + 1;
    existing.lastSeen = new Date().toISOString();
  } else {
    patterns.push({
      id: Date.now(),
      title,
      description,
      frequency: frequency ?? 1,
      suggestedAction,
      agent,
      project,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      resolved: false,
    });
  }
  savePatterns(patterns);
  return patterns;
}
