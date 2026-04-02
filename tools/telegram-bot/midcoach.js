/**
 * midcoach.js — Coaching pendant la session Claude Code
 * Appelé par le hook PostToolUse (après chaque Edit/Write)
 * Rate limit : 1 tip max toutes les 25 minutes
 *
 * Usage: node midcoach.js <file_path> <project_name>
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import TelegramBot from "node-telegram-bot-api";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RATE_LIMIT_FILE = "/tmp/midcoach-last.json";
const RATE_LIMIT_MS = 25 * 60 * 1000; // 25 minutes

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
    // optionnel
  }
}

loadEnv();

const filePath = process.argv[2] || "";
const projectName = process.argv[3] || "projet";

// ─── Rate limiting ───────────────────────────────────────────────────────────

function canSend() {
  if (!existsSync(RATE_LIMIT_FILE)) return true;
  try {
    const { lastSent, lastProject } = JSON.parse(
      readFileSync(RATE_LIMIT_FILE, "utf-8")
    );
    const elapsed = Date.now() - new Date(lastSent).getTime();
    // Pas de limit si changement de projet
    if (lastProject !== projectName) return true;
    return elapsed > RATE_LIMIT_MS;
  } catch {
    return true;
  }
}

function markSent() {
  writeFileSync(
    RATE_LIMIT_FILE,
    JSON.stringify({ lastSent: new Date().toISOString(), lastProject: projectName })
  );
}

// ─── Filtres fichiers ────────────────────────────────────────────────────────

function isInteresting(path) {
  // Ignore les fichiers de config, lock, node_modules
  const ignore = [
    "node_modules",
    ".lock",
    "package-lock",
    "yarn.lock",
    ".tsbuildinfo",
    ".next/",
    ".cache/",
    "dist/",
    "build/",
    ".env",
  ];
  if (ignore.some((p) => path.includes(p))) return false;

  // Intéressant : fichiers de code substantiels
  const interesting = [
    ".ts",
    ".tsx",
    ".py",
    ".js",
    ".sql",
    ".md",
  ];
  return interesting.some((ext) => path.endsWith(ext));
}

// ─── Coaching ────────────────────────────────────────────────────────────────

async function generateTip(filePath, projectName) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  let fileContent = "";
  try {
    fileContent = readFileSync(filePath, "utf-8").slice(0, 1200);
  } catch {
    return null; // fichier inaccessible
  }

  const isKura = projectName.toLowerCase().includes("kura");
  const isSql = filePath.endsWith(".sql");
  const isPython = filePath.endsWith(".py");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Tu es le coach dev AI de Romain. Il vient d'éditer ce fichier :

Fichier: ${filePath.split("/").slice(-3).join("/")}
Projet: ${projectName}${isKura ? " (compliance antidopage CRITIQUE)" : ""}

Extrait du fichier:
\`\`\`
${fileContent}
\`\`\`

Si tu vois quelque chose d'INTÉRESSANT (pattern utile, opportunité d'amélioration, risque sécu, bonne pratique), donne 1 tip ULTRA court. Sinon réponds juste: SKIP

Format si tip :
⚡ *[DOMAINE]* [1 phrase max]
_[EN: Same tip in English]_`,
      },
    ],
  });

  const text = response.content[0].text.trim();
  if (text === "SKIP" || text.startsWith("SKIP")) return null;
  return text;
}

async function main() {
  if (!filePath || !isInteresting(filePath)) process.exit(0);
  if (!canSend()) process.exit(0);
  if (!process.env.ANTHROPIC_API_KEY) process.exit(0);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) process.exit(0);

  let tip;
  try {
    tip = await generateTip(filePath, projectName);
  } catch {
    process.exit(0);
  }

  if (!tip) process.exit(0);

  markSent();

  try {
    const bot = new TelegramBot(token);
    await bot.sendMessage(chatId, tip, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  } catch {
    // ignore
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
