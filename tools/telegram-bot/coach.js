/**
 * coach.js — Coaching post-session IA
 * Appelé par le hook Stop de Claude Code
 * Usage: node coach.js <project_dir> <project_name>
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import TelegramBot from "node-telegram-bot-api";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envFile = readFileSync(resolve(__dirname, ".env"), "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key?.trim()) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    // .env optionnel si les vars sont déjà dans l'env
  }
}

loadEnv();

const projectDir = process.argv[2] || process.cwd();
const projectName = process.argv[3] || "projet";

function getGitContext(dir) {
  try {
    // Derniers fichiers modifiés dans cette session
    const diffStat = execSync(
      "git diff HEAD~1..HEAD --stat --no-color 2>/dev/null || git diff --cached --stat --no-color 2>/dev/null || echo 'Pas de commit recent'",
      { cwd: dir, encoding: "utf-8", timeout: 5000 }
    ).slice(0, 1500);

    const lastCommits = execSync(
      "git log --oneline -5 --no-color 2>/dev/null || echo 'Pas de commits'",
      { cwd: dir, encoding: "utf-8", timeout: 5000 }
    ).trim();

    // Fichiers récemment touchés (même non-commités)
    const recentFiles = execSync(
      "git status --short 2>/dev/null | head -10 || echo ''",
      { cwd: dir, encoding: "utf-8", timeout: 5000 }
    ).trim();

    return { diffStat, lastCommits, recentFiles };
  } catch {
    return { diffStat: "", lastCommits: "", recentFiles: "" };
  }
}

async function generateCoachingTip(context) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Détecte le type de projet pour adapter le coaching
  const isKura = projectName.toLowerCase().includes("kura");
  const isBanlieuwood =
    projectName.toLowerCase().includes("banlieuwood") ||
    projectName.toLowerCase().includes("atelier");
  const isLokivo = projectName.toLowerCase().includes("lokivo");

  const projectContext = isKura
    ? "Kura (compliance antidopage, Python/FastAPI, RAG, guardrails critiques)"
    : isBanlieuwood
    ? "Banlieuwood (plateforme éducative cinéma, Next.js/Supabase)"
    : isLokivo
    ? "Lokivo (app locale, Next.js/Supabase/Stripe)"
    : "projet Next.js/TypeScript";

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 350,
    messages: [
      {
        role: "user",
        content: `Tu es le coach dev AI de Romain. Il est fondateur-CTO solo qui apprend.

Projet: ${projectName} (${projectContext})
Derniers commits:
${context.lastCommits || "Aucun"}

Fichiers modifiés:
${context.diffStat || context.recentFiles || "Aucun diff disponible"}

Donne 1 conseil de coaching court et actionnable adapté à ce qui vient d'être codé.
Puis recommande l'agent Claude Code le plus pertinent pour la prochaine action.

Format EXACT (respecte le format Markdown Telegram) :
💡 *[DOMAINE EN MAJUSCULES]*
[1-2 phrases max — observation + conseil concret]

🇬🇧 _[Même conseil en anglais — 1 phrase]_

🤖 *Agent à invoquer :* \`[nom-agent]\` — [pourquoi maintenant, 1 phrase]

---
Agents disponibles et quand les utiliser :
- \`code-reviewer\` → avant de push, après une grosse feature
- \`db-architect\` → si tu as touché à la DB, SQL, migrations, Supabase
- \`feature-planner\` → avant de commencer une nouvelle feature
- \`cto-advisor\` → décision d'architecture importante, scaling, dette technique
- \`design-director\` → tout travail UI/composants/design
- \`prompt-engineer\` → si tu as modifié des prompts AI ou ask_service.py dans Kura
- \`dependency-sentinel\` → si tu as mis à jour des packages
- \`formation-generator\` → si tu veux adapter ton curriculum à ce que tu viens de faire
- Aucun → si c'est un petit fix qui ne nécessite pas d'agent

Focus sur : architecture, sécu, patterns pro, qualité TypeScript/Python, méthodo dev AI.
Si pas assez de contexte : conseil général + agent le plus souvent utile pour ce projet.`,
      },
    ],
  });

  return message.content[0].text;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      "ANTHROPIC_API_KEY manquant — ajoute-la dans tools/telegram-bot/.env"
    );
    process.exit(0);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials manquants dans .env");
    process.exit(0);
  }

  const context = getGitContext(projectDir);

  let tip;
  try {
    tip = await generateCoachingTip(context);
  } catch (err) {
    console.error("Claude error:", err.message);
    process.exit(0);
  }

  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `*🎬 Session terminée — ${time}*\n*${projectName}*\n\n${tip}`;

  const bot = new TelegramBot(token);
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
    console.log("Coaching tip envoyé !");
  } catch (err) {
    console.error("Telegram error:", err.message);
  }

  process.exit(0);
}

main().catch(() => process.exit(0)); // exit 0 pour ne jamais bloquer le hook
