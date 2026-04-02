/**
 * idea.js — CLI pour lancer l'agent Idée
 * Usage : node idea.js "Mon idée ici" "contexte optionnel"
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { processIdea } from "./tools/idea.js";

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

const idea = process.argv[2];
const context = process.argv[3] ?? "";

if (!idea) {
  console.error('Usage: node idea.js "Mon idée" "contexte optionnel"');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("[idea] ANTHROPIC_API_KEY manquante");
  process.exit(1);
}

console.log(`\n💡 Agent Idée démarré\n   Idée : "${idea}"\n`);
processIdea(idea, context)
  .then(() => { console.log("\n✅ Plan généré — voir docs/ideas/"); process.exit(0); })
  .catch((e) => { console.error("[idea]", e.message); process.exit(1); });
