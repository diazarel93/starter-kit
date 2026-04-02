/**
 * dispatcher.js — Meta-agent : analyse un problème et route vers le bon agent
 * Entrée : description du problème (texte libre)
 * Sortie : agent recommandé + instructions précises + alerte Telegram
 */
import Anthropic from "@anthropic-ai/sdk";
import { sendTelegram } from "./telegram.js";
import { detectAgentFromText, logEvent, addPattern, EVENT_TYPES } from "./patterns.js";
import { readGoals } from "./files.js";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

let client = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// Table complète de tous les agents disponibles
const ALL_AGENTS = {
  "db-architect":        "Schema Supabase, RLS, migrations, index, requêtes lentes",
  "code-reviewer":       "Sécurité, patterns TypeScript, bugs, qualité avant push",
  "design-director":     "UI/UX Banlieuwood, design cinéma, iPad-first, composants",
  "feature-planner":     "Planification feature, découpage tâches, estimation",
  "stripe-expert":       "Billing, abonnements, webhooks, pricing, portail client",
  "i18n-manager":        "Internationalisation, next-intl, traductions, hreflang",
  "seo-specialist":      "SEO technique, metadata, Lighthouse, Core Web Vitals",
  "growth-architect":    "Acquisition, rétention, onboarding, churn, referral",
  "cto-advisor":         "Architecture scalable, dette technique, décisions stratégiques",
  "agent-guardian":      "Surveille que les agents sont invoqués au bon moment",
  "brain":               "Vision globale multi-projets, connexions entre projets",
  "formation-generator": "Génère du contenu formation adapté à ce que tu codes",
  "prompt-engineer":     "Optimiser les prompts Claude pour Kura et autres",
  "tech-watcher":        "Veille technologique, dépréciations, nouveautés stack",
  "project-auditor":     "Audit complet d'un projet (sécurité, perf, dette)",
};

const DISPATCH_TOOLS = [
  {
    name: "route_to_agent",
    description: "Router le problème vers l'agent le plus adapté avec des instructions précises",
    input_schema: {
      type: "object",
      properties: {
        agent: { type: "string", description: "Nom de l'agent (ex: db-architect)" },
        instructions: { type: "string", description: "Instructions précises pour l'agent (ce qu'il doit faire, contexte)" },
        urgency: { type: "string", enum: ["critical", "high", "normal", "low"] },
        why: { type: "string", description: "Pourquoi cet agent et pas un autre" },
      },
      required: ["agent", "instructions", "urgency", "why"],
    },
  },
  {
    name: "detect_pattern",
    description: "Enregistrer un pattern/bug récurrent détecté pour le suivre dans le temps",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Nom court du pattern (ex: 'RLS manquante sur nouvelles tables')" },
        description: { type: "string", description: "Description détaillée du pattern" },
        suggestedAction: { type: "string", description: "Action recommandée pour régler le problème à la racine" },
        agent: { type: "string", description: "Agent qui devrait traiter ça" },
        project: { type: "string" },
      },
      required: ["title", "description", "suggestedAction"],
    },
  },
  {
    name: "create_rule",
    description: "Créer une règle dans RULES.md pour éviter que le problème se reproduise",
    input_schema: {
      type: "object",
      properties: {
        rule: { type: "string", description: "La règle à ajouter (phrase courte, actionnable)" },
        why: { type: "string", description: "Pourquoi cette règle existe" },
        category: { type: "string", description: "Catégorie (sécurité, TypeScript, architecture, git, etc.)" },
      },
      required: ["rule", "why", "category"],
    },
  },
  {
    name: "send_dispatch",
    description: "Envoyer le routing et les instructions via Telegram",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
      required: ["message"],
    },
  },
];

async function executeDispatchTool(name, input) {
  switch (name) {
    case "route_to_agent": {
      const urgencyEmoji = { critical: "🔴", high: "🟠", normal: "🟡", low: "⚪" }[input.urgency];
      logEvent({
        type: EVENT_TYPES.MISUNDERSTANDING,
        description: `Routing vers ${input.agent}`,
        meta: { agent: input.agent, urgency: input.urgency },
      });
      return { ok: true, ...input };
    }
    case "detect_pattern":
      return addPattern(input);
    case "create_rule": {
      const rulesPath = resolve(process.env.HOME, "starter-kit/RULES.md");
      const date = new Date().toLocaleDateString("fr-FR");
      const rule = `\n## [${date}] ${input.category}\n**Règle** : ${input.rule}\n**Pourquoi** : ${input.why}\n`;
      if (existsSync(rulesPath)) {
        const { appendFileSync } = await import("fs");
        appendFileSync(rulesPath, rule);
      }
      return { ok: true, rule: input.rule };
    }
    case "send_dispatch":
      return await sendTelegram({ message: input.message });
    default:
      return { error: `Outil inconnu : ${name}` };
  }
}

/**
 * dispatch — Analyse un problème et route vers le bon agent
 * @param {string} problem - Description du problème (texte libre de Romain)
 * @param {string} context - Contexte additionnel (projet, fichier, erreur...)
 */
export async function dispatch(problem, context = "") {
  const goals = readGoals();

  // Détection rapide sans LLM
  const quickAgent = detectAgentFromText(problem);

  const systemPrompt = `Tu es le dispatcher intelligent du cerveau de Romain.

Quand Romain décrit un problème, une incompréhension, ou un bug récurrent :
1. Tu identifies l'agent le plus adapté
2. Tu prépares des instructions précises pour cet agent
3. Tu détectes si c'est un pattern récurrent → l'enregistrer
4. Si c'est une incompréhension récurrente → créer une règle dans RULES.md
5. Tu envoies le routing via Telegram

## Agents disponibles
${Object.entries(ALL_AGENTS).map(([k, v]) => `- \`${k}\` : ${v}`).join("\n")}

## Contexte Romain
${goals}

## Détection rapide
Mot-clé détecté → agent probable : ${quickAgent ?? "à déterminer"}

## Format du message Telegram (send_dispatch)
🎯 *Agent recommandé* : \`nom-agent\`
📋 *Problème* : [résumé en 1 phrase]
📌 *Instructions* : [ce que l'agent doit faire]
💡 *Comment l'invoquer* : "dans Claude Code, tape @nom-agent [contexte]"
`;

  const messages = [
    {
      role: "user",
      content: `Problème : "${problem}"${context ? `\n\nContexte : ${context}` : ""}`,
    },
  ];

  console.log(`[dispatcher] Analyse : "${problem.substring(0, 80)}..."`);

  for (let turn = 0; turn < 6; turn++) {
    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      tools: DISPATCH_TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      console.log(`[dispatcher] Terminé (${turn + 1} tours)`);
      break;
    }

    if (response.stop_reason !== "tool_use") break;

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[dispatcher] → ${block.name}`, JSON.stringify(block.input).substring(0, 80));
      const result = await executeDispatchTool(block.name, block.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }
}
