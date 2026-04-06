/**
 * design-scout.js — Sous-agent design autonome
 * Appelé par brain-agent chaque matin à ~9h
 * Utilise Haiku + WebFetch pour scruter le web et alimenter la knowledge-base
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../../");
const SCOUT_DIR = resolve(ROOT, "tools/design-scout");
const KB_PATH = resolve(SCOUT_DIR, "knowledge-base.json");
const STYLE_MAP_PATH = resolve(SCOUT_DIR, "style-map.md");
const REPORTS_DIR = resolve(SCOUT_DIR, "reports");
const AGENT_PATH = resolve(ROOT, ".claude/agents/design-scout.md");

// ─── Chargement du system prompt de l'agent ──────────────────────────────────

function loadAgentPrompt() {
  if (!existsSync(AGENT_PATH)) {
    return "Tu es design-scout, un agent de veille créative mondiale. Tu analyses des sites web et extrais des patterns de design réutilisables.";
  }
  const raw = readFileSync(AGENT_PATH, "utf-8");
  // Retirer le frontmatter YAML (entre --- et ---)
  return raw.replace(/^---[\s\S]*?---\n/, "").trim();
}

// ─── Chargement de la knowledge-base ─────────────────────────────────────────

function loadKB() {
  if (!existsSync(KB_PATH)) {
    return { version: "1.0", last_updated: new Date().toISOString().split("T")[0], total_sites: 0, sites: [] };
  }
  return JSON.parse(readFileSync(KB_PATH, "utf-8"));
}

function saveKB(kb) {
  kb.total_sites = kb.sites.length;
  kb.last_updated = new Date().toISOString().split("T")[0];
  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
}

// ─── Outils disponibles pour le sous-agent ───────────────────────────────────

const SCOUT_TOOLS = [
  {
    name: "fetch_url",
    description: "Fetch le contenu HTML/texte d'une URL pour analyser un site de design",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL à fetcher" },
        purpose: { type: "string", description: "Pourquoi tu fetches ce site" },
      },
      required: ["url"],
    },
  },
  {
    name: "add_to_knowledge_base",
    description: "Ajouter un site analysé à la knowledge-base design",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Slug unique ex: a24-films-2026" },
        url: { type: "string" },
        title: { type: "string" },
        source: { type: "string", description: "awwwards | lapa | manual | awwwards-sotd" },
        sector: { type: "string", description: "cinema | saas | edtech | luxury | festival | music | portfolio | branding | autre" },
        style_tags: { type: "array", items: { type: "string" }, description: "ex: cinema-dark, editorial-bold, type-forward" },
        palette: {
          type: "object",
          properties: {
            bg: { type: "string" },
            text_primary: { type: "string" },
            accent_primary: { type: "string" },
            mood: { type: "string", enum: ["chaud", "froid", "neutre"] },
          },
        },
        typography: {
          type: "object",
          properties: {
            heading_family: { type: "string" },
            heading_case: { type: "string" },
            notable: { type: "string" },
          },
        },
        layout: {
          type: "object",
          properties: {
            grid: { type: "string", enum: ["symmetric", "asymmetric", "bento", "full-bleed", "editorial"] },
            density: { type: "string", enum: ["airy", "standard", "dense"] },
            hero: { type: "string" },
          },
        },
        what_makes_it_exceptional: { type: "string", description: "2-3 phrases précises sur ce qui distingue ce site" },
        reusable_patterns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              when_to_use: { type: "string" },
            },
          },
        },
        level: { type: "string", enum: ["world-reference", "excellent", "good"] },
        best_for: { type: "array", items: { type: "string" } },
      },
      required: ["id", "url", "title", "sector", "style_tags", "what_makes_it_exceptional", "level"],
    },
  },
  {
    name: "get_kb_stats",
    description: "Obtenir les stats actuelles de la knowledge-base",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "save_report",
    description: "Sauvegarder le rapport de veille du jour",
    input_schema: {
      type: "object",
      properties: {
        content: { type: "string", description: "Contenu markdown du rapport" },
      },
      required: ["content"],
    },
  },
  {
    name: "done",
    description: "Terminer la session de veille",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Résumé de ce qui a été fait" },
        sites_added: { type: "number" },
        top_finding: { type: "string", description: "La découverte la plus intéressante du jour" },
      },
      required: ["summary", "sites_added"],
    },
  },
];

// ─── Exécution des outils ─────────────────────────────────────────────────────

async function executeScoutTool(name, input) {
  switch (name) {
    case "fetch_url": {
      try {
        const res = await fetch(input.url, {
          headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
          signal: AbortSignal.timeout(15000),
        });
        const text = await res.text();
        // Limiter à 8K chars pour ne pas exploser les tokens
        const truncated = text.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
        return { ok: true, url: input.url, content: truncated, status: res.status };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }

    case "add_to_knowledge_base": {
      const kb = loadKB();
      const exists = kb.sites.find((s) => s.id === input.id || s.url === input.url);
      if (exists) return { ok: false, message: "Site déjà dans la base" };
      kb.sites.push({ ...input, date_observed: new Date().toISOString().split("T")[0] });
      saveKB(kb);
      return { ok: true, message: `✓ Ajouté: ${input.title}`, total: kb.sites.length };
    }

    case "get_kb_stats": {
      const kb = loadKB();
      const bySector = kb.sites.reduce((acc, s) => { acc[s.sector] = (acc[s.sector] ?? 0) + 1; return acc; }, {});
      const byStyle = kb.sites.flatMap((s) => s.style_tags).reduce((acc, t) => { acc[t] = (acc[t] ?? 0) + 1; return acc; }, {});
      return { total: kb.total_sites, last_updated: kb.last_updated, by_sector: bySector, top_styles: Object.entries(byStyle).sort((a, b) => b[1] - a[1]).slice(0, 5) };
    }

    case "save_report": {
      mkdirSync(REPORTS_DIR, { recursive: true });
      const date = new Date().toISOString().split("T")[0];
      const path = resolve(REPORTS_DIR, `${date}.md`);
      writeFileSync(path, input.content);
      return { ok: true, path };
    }

    case "done": {
      return { ok: true, ...input };
    }

    default:
      return { error: `Outil inconnu: ${name}` };
  }
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

export async function runDesignScout(anthropicKey) {
  const client = new Anthropic({ apiKey: anthropicKey });
  const systemPrompt = loadAgentPrompt();
  const kb = loadKB();
  const today = new Date().toISOString().split("T")[0];

  console.log(`[design-scout] Démarrage veille — ${today}`);
  console.log(`[design-scout] Base actuelle : ${kb.total_sites} sites`);

  const userPrompt = `Lance la veille design quotidienne.

Contexte :
- Date : ${today}
- Sites déjà dans la base : ${kb.total_sites}
- Secteurs couverts : ${JSON.stringify(Object.keys(kb.sites.reduce((acc, s) => { acc[s.sector] = 1; return acc; }, {})))}

Mission du jour :
1. Fetch Awwwards (awwwards.com/websites/sites_awarded/) → identifier 2-3 sites exceptionnels
2. Fetch Lapa Ninja (lapa.ninja) → identifier 2 landing pages remarquables
3. Pour chaque site identifié : analyser le design (palette, typo, layout, ce qui le rend exceptionnel)
4. Ajouter les meilleurs à la knowledge-base (uniquement si vraiment remarquable, pas du générique)
5. Sauvegarder un rapport du jour
6. Terminer avec done()

Critères de sélection : SEULEMENT ce qui est vraiment exceptionnel. Pas de sites génériques ou templates.`;

  const messages = [{ role: "user", content: userPrompt }];

  let result = null;
  let sitesAdded = 0;

  for (let turn = 0; turn < 20; turn++) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      tools: SCOUT_TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      console.log(`[design-scout] Terminé (end_turn) — ${turn + 1} tours`);
      break;
    }

    if (response.stop_reason !== "tool_use") break;

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[design-scout] → ${block.name}`);
      const toolResult = await executeScoutTool(block.name, block.input);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(toolResult) });

      if (block.name === "add_to_knowledge_base" && toolResult.ok) sitesAdded++;
      if (block.name === "done") {
        result = block.input;
        console.log(`[design-scout] ✓ ${result.summary}`);
        console.log(`[design-scout] Sites ajoutés : ${result.sites_added}`);
        if (result.top_finding) console.log(`[design-scout] Top finding : ${result.top_finding}`);
      }
    }

    messages.push({ role: "user", content: toolResults });
    if (result) break;
  }

  return {
    ok: true,
    sites_added: sitesAdded,
    total_sites: loadKB().total_sites,
    summary: result?.summary ?? "Veille terminée",
    top_finding: result?.top_finding,
  };
}
