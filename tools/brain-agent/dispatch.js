/**
 * dispatch.js — CLI du dispatcher
 * Usage : node dispatch.js "description du problème" "contexte"
 *
 * Exemples :
 *   node dispatch.js "j'ai encore une erreur RLS sur ma nouvelle table"
 *   node dispatch.js "le build Vercel échoue depuis hier" "lokivo"
 *   node dispatch.js "je comprends pas pourquoi mon webhook Stripe ne se déclenche pas"
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { dispatch } from "./tools/dispatcher.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const env = readFileSync(resolve(__dirname, "../telegram-bot/.env"), "utf-8");
    for (const line of env.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const [k, ...r] = t.split("=");
      if (k?.trim()) process.env[k.trim()] = r.join("=").trim();
    }
  } catch {}
}

loadEnv();

const problem = process.argv[2];
const context = process.argv[3] ?? "";

if (!problem) {
  console.log(`
dispatcher — Route un problème vers le bon agent

Usage:
  node dispatch.js "description du problème" "contexte optionnel"

Exemples:
  node dispatch.js "j'ai encore une erreur RLS"
  node dispatch.js "le build Vercel échoue" "lokivo"
  node dispatch.js "je comprends pas les embeddings"
`);
  process.exit(0);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("[dispatch] ANTHROPIC_API_KEY manquante");
  process.exit(1);
}

dispatch(problem, context)
  .then(() => process.exit(0))
  .catch((e) => { console.error("[dispatch]", e.message); process.exit(1); });
