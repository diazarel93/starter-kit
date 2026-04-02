/**
 * idea.js — Agent Idée : transforme une idée brute en plan complet
 * Quand Romain a une idée → cet outil prépare tout de A à Z
 */
import Anthropic from "@anthropic-ai/sdk";
import { sendTelegram } from "./telegram.js";
import { webSearch } from "./search.js";
import { createTask } from "./tasks.js";
import { appendToMemory } from "./files.js";
import { writeFileSync } from "fs";
import { resolve } from "path";

let client = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const IDEA_TOOLS = [
  {
    name: "web_search",
    description: "Chercher des infos sur le marché, la concurrence, la technologie",
    input_schema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "save_plan",
    description: "Sauvegarder le plan complet dans docs/ideas/",
    input_schema: {
      type: "object",
      properties: {
        filename: { type: "string", description: "Nom du fichier (ex: kura-player-biomarqueurs)" },
        content: { type: "string", description: "Contenu Markdown complet du plan" },
      },
      required: ["filename", "content"],
    },
  },
  {
    name: "create_first_tasks",
    description: "Créer les 3 premières tâches concrètes dans decisions.md",
    input_schema: {
      type: "object",
      properties: {
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              context: { type: "string" },
              priority: { type: "string", enum: ["critical", "high", "normal", "low"] },
              project: { type: "string" },
            },
          },
        },
      },
      required: ["tasks"],
    },
  },
  {
    name: "notify_ready",
    description: "Envoyer le résumé de l'analyse à Romain via Telegram",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Résumé court du plan (max 400 chars)" },
        planFile: { type: "string", description: "Chemin vers le fichier plan généré" },
      },
      required: ["summary"],
    },
  },
];

async function executeIdeaTool(name, input) {
  switch (name) {
    case "web_search":
      return await webSearch(input);
    case "save_plan": {
      const dir = resolve(process.env.HOME, "starter-kit/docs/ideas");
      const { mkdirSync } = await import("fs");
      mkdirSync(dir, { recursive: true });
      const path = resolve(dir, `${input.filename}.md`);
      writeFileSync(path, input.content);
      return { ok: true, path };
    }
    case "create_first_tasks": {
      const results = [];
      for (const task of (input.tasks ?? [])) {
        results.push(createTask(task));
      }
      return { ok: true, created: results.length };
    }
    case "notify_ready":
      return await sendTelegram({
        message: `💡 *Plan prêt !*\n\n${input.summary}\n\n📄 Fichier : \`docs/ideas/${input.planFile ?? "plan"}.md\``,
      });
    default:
      return { error: `Outil inconnu : ${name}` };
  }
}

/**
 * processIdea — Point d'entrée principal
 * @param {string} idea - L'idée brute de Romain
 * @param {string} context - Contexte (projet, contraintes, budget...)
 */
export async function processIdea(idea, context = "") {
  const systemPrompt = `Tu es l'agent Idée de Romain Ndiaye Chansarel.

Quand Romain a une idée, tu prépares TOUT pour qu'il puisse l'exécuter immédiatement :

## Ton plan de travail (toujours dans cet ordre)
1. **Recherche** : 2-3 web_search pour valider marché, concurrence, faisabilité tech
2. **Analyse** : problème réel, solution, différenciation, risques
3. **Plan complet** via save_plan (Markdown structuré) :
   - Vision & problème résolu
   - Cible (qui, combien, où)
   - Solution technique (stack, architecture, effort)
   - Business model (pricing, revenus)
   - Roadmap 30/90/180 jours
   - Risques & mitigation
   - Connexions avec projets existants (Kura, Lokivo, Banlieuwood...)
4. **3 premières tâches** via create_first_tasks (concrètes, actionnables)
5. **Notification** via notify_ready

## Règles
- Toujours chercher avant d'inventer
- Plan réaliste pour un solo founder / micro-équipe
- Connexions avec l'existant (réutiliser Supabase, Stripe, agents, etc.)
- Coût estimé pour MVP en tokens Claude et $ infrastructure

## Contexte Romain
- Projets : Kura (RegTech antidopage), Banlieuwood (éducation cinéma iPad), Lokivo (marketplace), Kura Player
- Stack maîtrisée : Next.js 16, Supabase, Python FastAPI, Claude API
- Budget solo founder : économiser sur tout, aller vite
`;

  const messages = [
    {
      role: "user",
      content: `Idée : "${idea}"${context ? `\n\nContexte : ${context}` : ""}`,
    },
  ];

  console.log(`[idea-agent] Analyse de l'idée : "${idea}"`);

  for (let turn = 0; turn < 12; turn++) {
    const response = await getClient().messages.create({
      model: "claude-sonnet-4-6", // Sonnet pour la réflexion stratégique
      max_tokens: 4096,
      system: systemPrompt,
      tools: IDEA_TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      console.log(`[idea-agent] Analyse terminée (${turn + 1} tours)`);
      break;
    }

    if (response.stop_reason !== "tool_use") break;

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[idea-agent] → ${block.name}`, JSON.stringify(block.input).substring(0, 80));
      const result = await executeIdeaTool(block.name, block.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  // Mémoriser qu'on a traité cette idée
  appendToMemory(`idea_${Date.now()}`, idea.substring(0, 100));
}
