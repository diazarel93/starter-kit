/**
 * index.js — Entry point du cerveau autonome
 * Mode --once : un seul cycle (cron)
 * Mode normal : boucle infinie toutes les 30 min
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { runAgentCycle } from "./agent.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger .env
function loadEnv() {
  try {
    const env = readFileSync(resolve(__dirname, "../telegram-bot/.env"), "utf-8");
    for (const line of env.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key?.trim()) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {}
}

loadEnv();

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const isOnce = process.argv.includes("--once");

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[brain-agent] ANTHROPIC_API_KEY manquante");
    process.exit(1);
  }

  console.log(`[brain-agent] Démarrage — ${new Date().toLocaleString("fr-FR")}`);
  console.log(`[brain-agent] Mode : ${isOnce ? "one-shot" : "boucle 30min"}`);

  // Premier cycle immédiat
  try {
    await runAgentCycle();
  } catch (e) {
    console.error("[brain-agent] Erreur cycle :", e.message);
  }

  if (isOnce) {
    process.exit(0);
  }

  // Boucle
  setInterval(async () => {
    console.log(`\n[brain-agent] Nouveau cycle — ${new Date().toLocaleString("fr-FR")}`);
    try {
      await runAgentCycle();
    } catch (e) {
      console.error("[brain-agent] Erreur cycle :", e.message);
    }
  }, INTERVAL_MS);
}

main();
