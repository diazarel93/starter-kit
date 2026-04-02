/**
 * agent.js — Cerveau autonome
 * Boucle agentic : observe → raisonne → agit → mémorise
 */
import Anthropic from "@anthropic-ai/sdk";
import { sendTelegram } from "./tools/telegram.js";
import { getAllProjectsStatus } from "./tools/git.js";
import { readDecisions, readGoals, readMemory, appendToMemory } from "./tools/files.js";

// Lazy init — ANTHROPIC_API_KEY doit être set avant runAgentCycle()
let client = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// Outils disponibles pour l'agent
const TOOLS = [
  {
    name: "send_telegram",
    description: "Envoyer un message Telegram à Romain. Utiliser pour alertes, tips, résumés. Max 1 message par cycle sauf urgence critique.",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Message en Markdown Telegram. Max 500 chars. Concis et actionnable." },
        silent: { type: "boolean", description: "true = pas de notification sonore (pour messages non urgents)" },
      },
      required: ["message"],
    },
  },
  {
    name: "get_projects_status",
    description: "Récupérer l'état git de tous les projets (branch, dernier commit, uncommitted changes, commits non pushés)",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "save_to_memory",
    description: "Sauvegarder une information importante en mémoire persistante pour les prochains cycles",
    input_schema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Clé mémoire (ex: 'last_alert_haiku', 'kura_build_failing_since')" },
        value: { type: "string", description: "Valeur à mémoriser" },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "do_nothing",
    description: "Ne rien faire ce cycle. Utiliser quand tout va bien et qu'aucune action n'est nécessaire.",
    input_schema: { type: "object", properties: { reason: { type: "string" } }, required: ["reason"] },
  },
];

async function executeTool(name, input) {
  switch (name) {
    case "send_telegram":
      return await sendTelegram(input);
    case "get_projects_status":
      return getAllProjectsStatus();
    case "save_to_memory":
      return appendToMemory(input.key, input.value);
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

  // Contexte injecté dans le system prompt
  const context = `
Date : ${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
Heure : ${hour}h${String(now.getMinutes()).padStart(2, "0")}
Mémoire : ${JSON.stringify(memory, null, 2)}
`.trim();

  const systemPrompt = `Tu es le cerveau autonome de Romain Ndiaye Chansarel, entrepreneur tech (Kura, Banlieuwood, Lokivo).

Tu tournes en boucle toutes les 30 minutes et tu dois décider si quelque chose nécessite une action.

CONTEXTE ACTUEL :
${context}

TES OBJECTIFS :
${goals}

RÈGLES ABSOLUES :
- Envoyer MAX 1 message Telegram par cycle (sauf alerte critique = max 2)
- Ne pas répéter un message envoyé dans les 6 dernières heures (vérifie la mémoire)
- Entre 22h et 7h : mode silencieux — n'envoyer que si urgence P0
- Préférer do_nothing si tout va bien
- Messages Telegram : courts, actionnables, en français

PROCESSUS :
1. Appelle get_projects_status pour voir l'état des projets
2. Analyse : y a-t-il quelque chose d'anormal ou d'important ?
3. Décide : action nécessaire ou do_nothing ?
4. Si action : envoie 1 message et/ou mémorise
`;

  const messages = [
    { role: "user", content: "Analyse le contexte et décide quoi faire ce cycle." }
  ];

  // Boucle agentic (max 5 tours)
  for (let turn = 0; turn < 5; turn++) {
    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001", // Haiku = moins cher pour surveiller en continu
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });

    // Ajouter la réponse à l'historique
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      console.log(`[agent] Cycle terminé après ${turn + 1} tour(s)`);
      break;
    }

    if (response.stop_reason !== "tool_use") break;

    // Exécuter tous les tool calls
    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[agent] → ${block.name}`, JSON.stringify(block.input).substring(0, 80));
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
