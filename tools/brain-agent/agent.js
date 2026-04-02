/**
 * agent.js — Cerveau autonome
 * Boucle agentic : observe → raisonne → agit → mémorise
 */
import Anthropic from "@anthropic-ai/sdk";
import { sendTelegram } from "./tools/telegram.js";
import { getAllProjectsStatus } from "./tools/git.js";
import { readGoals, readMemory, appendToMemory } from "./tools/files.js";
import { getApiCosts, checkGithubBuilds, trackApiCall } from "./tools/apis.js";
import { webSearch, checkWadaUpdates } from "./tools/search.js";
import { createTask, saveAlert, getRecentAlerts } from "./tools/tasks.js";
import { loadPatterns, loadEvents } from "./tools/patterns.js";

// Lazy init — ANTHROPIC_API_KEY doit être set avant runAgentCycle()
let client = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const TOOLS = [
  {
    name: "send_telegram",
    description: "Envoyer un message Telegram à Romain. Max 1 message/cycle sauf urgence critique (P0).",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Markdown Telegram. Max 500 chars. Concis, actionnable." },
        silent: { type: "boolean", description: "true = pas de son (messages non urgents)" },
      },
      required: ["message"],
    },
  },
  {
    name: "get_projects_status",
    description: "État git de tous les projets (branch, dernier commit, uncommitted, non pushés)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_api_costs",
    description: "Coûts APIs ce mois : Anthropic brain-agent, GitHub rate limit",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "check_builds",
    description: "Statut CI/CD GitHub Actions pour tous les repos (dernier run, succès/échec)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "web_search",
    description: "Recherche web (veille WADA, tech stack, RegTech). Utiliser pour vérifier des infos récentes.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Requête de recherche en anglais de préférence" },
        maxResults: { type: "number", description: "Nombre de résultats (défaut 3)" },
      },
      required: ["query"],
    },
  },
  {
    name: "check_wada",
    description: "Vérifier si le site WADA est accessible et si la liste 2026 est présente",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "create_task",
    description: "Créer une tâche/décision dans decisions.md (pour choses importantes à ne pas oublier)",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Titre court de la tâche" },
        context: { type: "string", description: "Pourquoi c'est important, contexte" },
        priority: { type: "string", enum: ["critical", "high", "normal", "low"] },
        project: { type: "string", description: "Projet concerné" },
      },
      required: ["title", "context"],
    },
  },
  {
    name: "get_recent_alerts",
    description: "Lire les alertes récentes pour éviter les doublons",
    input_schema: {
      type: "object",
      properties: { hours: { type: "number", description: "Dernières X heures (défaut 24)" } },
      required: [],
    },
  },
  {
    name: "save_to_memory",
    description: "Mémoriser une info pour les prochains cycles",
    input_schema: {
      type: "object",
      properties: {
        key: { type: "string" },
        value: { type: "string" },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "get_patterns",
    description: "Lire les patterns récurrents détectés (bugs, incompréhensions, problèmes systémiques)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "do_nothing",
    description: "Ne rien faire ce cycle. Utiliser quand tout est nominal.",
    input_schema: { type: "object", properties: { reason: { type: "string" } }, required: ["reason"] },
  },
];

async function executeTool(name, input) {
  switch (name) {
    case "send_telegram":       return await sendTelegram(input);
    case "get_projects_status": return getAllProjectsStatus();
    case "get_api_costs":       return await getApiCosts();
    case "check_builds":        return await checkGithubBuilds();
    case "web_search":          return await webSearch(input);
    case "check_wada":          return await checkWadaUpdates();
    case "create_task":         return createTask(input);
    case "get_recent_alerts":   return getRecentAlerts(input);
    case "save_to_memory":      return appendToMemory(input.key, input.value);
    case "get_patterns":
      return { patterns: loadPatterns().filter((p) => !p.resolved).slice(-10) };
    case "do_nothing":
      console.log(`[agent] Rien à faire : ${input.reason}`);
      return { ok: true };
    default:
      return { error: `Outil inconnu : ${name}` };
  }
}

export async function runAgentCycle() {
  const now = new Date();
  const memory = readMemory();
  const goals = readGoals();
  const hour = now.getHours();
  const isSilent = hour >= 22 || hour < 7;

  const context = `
Date : ${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
Heure : ${hour}h${String(now.getMinutes()).padStart(2, "0")}
Mode silencieux : ${isSilent ? "OUI (22h-7h)" : "non"}
Mémoire persistante :
${JSON.stringify(memory, null, 2)}
`.trim();

  const systemPrompt = `Tu es le cerveau autonome de Romain Ndiaye Chansarel, entrepreneur tech.
Projets : Kura (RegTech antidopage), Banlieuwood (éducation cinéma), Lokivo (marketplace), Kura Player (biomarqueurs).

Tu tournes toutes les 30 minutes. Ton job : détecter ce qui mérite attention et agir si besoin.

CONTEXTE :
${context}

OBJECTIFS :
${goals}

RÈGLES :
- MAX 1 message Telegram/cycle (2 si urgence P0)
- Mode silencieux ${isSilent ? "ACTIF → ne pas envoyer de message sauf P0" : "inactif"}
- Toujours vérifier get_recent_alerts avant d'envoyer pour éviter les doublons
- Préférer do_nothing si rien d'anormal
- Messages : français, courts, 1 action claire

PRIORITÉS DE SURVEILLANCE :
🔴 P0 : build cassé en production, secret exposé, coût API × 10 normal
🟠 P1 : commits non pushés depuis 24h+, Haiku 3 dépréciation (19/04/2026), WADA update
🟡 P2 : TODO critiques, dette technique, opportunités veille
⚪ P3 : infos utiles à mémoriser, stats

PROCESSUS :
1. get_projects_status → état git
2. Optionnel si pertinent : get_api_costs, check_builds, check_wada, web_search
3. get_recent_alerts → éviter doublons
4. Décide : do_nothing ou action(s)
`;

  const messages = [
    { role: "user", content: "Lance ton cycle d'analyse." }
  ];

  // Limiter la mémoire injectée (max 2KB pour éviter l'inflation de coûts)
  const memoryKeys = Object.keys(memory).slice(-20);
  const memoryTrimmed = Object.fromEntries(memoryKeys.map((k) => [k, memory[k]]));

  for (let turn = 0; turn < 8; turn++) {
    const apiCall = getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });

    // Timeout 60s pour éviter le hang infini
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API Anthropic timeout 60s")), 60000)
    );

    const response = await Promise.race([apiCall, timeout]);

    // Tracker les coûts réels
    if (response.usage) {
      trackApiCall({
        model: "claude-haiku-4-5-20251001",
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      });
    }

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      console.log(`[agent] Cycle OK — ${turn + 1} tour(s)`);
      break;
    }

    if (response.stop_reason !== "tool_use") break;

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[agent] → ${block.name}`, JSON.stringify(block.input).substring(0, 100));
      const result = await executeTool(block.name, block.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }
}
