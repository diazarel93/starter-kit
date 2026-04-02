/**
 * tasks.js — Gestion decisions.md + alertes autonomes
 * L'agent peut écrire dans decisions.md sans intervention humaine
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const DECISIONS_PATH = resolve(process.env.HOME, "starter-kit/decisions.md");
const ALERTS_PATH = resolve(process.env.HOME, "starter-kit/.brain-alerts.json");

export function createTask({ title, context, priority = "normal", project = "général" }) {
  if (!existsSync(DECISIONS_PATH)) return { error: "decisions.md introuvable" };

  const date = new Date().toLocaleDateString("fr-FR");
  const priorityEmoji = { critical: "🔴", high: "🟠", normal: "🟡", low: "⚪" }[priority] ?? "🟡";

  const entry = `
## ${priorityEmoji} [${date}] ${title}
**Projet** : ${project}
**Contexte** : ${context}
**Statut** : À traiter
`;

  const current = readFileSync(DECISIONS_PATH, "utf-8");
  writeFileSync(DECISIONS_PATH, current + entry);
  return { ok: true, title, priority, project };
}

export function saveAlert({ type, message, project }) {
  let alerts = [];
  if (existsSync(ALERTS_PATH)) {
    try { alerts = JSON.parse(readFileSync(ALERTS_PATH, "utf-8")); } catch {}
  }

  const alert = {
    type,
    message,
    project,
    date: new Date().toISOString(),
    acknowledged: false,
  };

  // Éviter doublons (même message dans les 24h)
  const recentDuplicate = alerts.find(
    (a) => a.message === message && Date.now() - new Date(a.date).getTime() < 86400000
  );
  if (recentDuplicate) return { ok: false, reason: "doublon dans les 24h" };

  alerts.push(alert);
  // Garder seulement les 50 dernières alertes
  if (alerts.length > 50) alerts = alerts.slice(-50);
  writeFileSync(ALERTS_PATH, JSON.stringify(alerts, null, 2));
  return { ok: true, alert };
}

export function getRecentAlerts({ hours = 24 } = {}) {
  if (!existsSync(ALERTS_PATH)) return [];
  try {
    const alerts = JSON.parse(readFileSync(ALERTS_PATH, "utf-8"));
    const cutoff = Date.now() - hours * 3600000;
    return alerts.filter((a) => new Date(a.date).getTime() > cutoff);
  } catch {
    return [];
  }
}

export function acknowledgeAlert({ message }) {
  if (!existsSync(ALERTS_PATH)) return { ok: false };
  try {
    const alerts = JSON.parse(readFileSync(ALERTS_PATH, "utf-8"));
    const updated = alerts.map((a) =>
      a.message === message ? { ...a, acknowledged: true } : a
    );
    writeFileSync(ALERTS_PATH, JSON.stringify(updated, null, 2));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
