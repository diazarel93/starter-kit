/**
 * kura.js — Leçon Kura quotidienne
 * Lancé par cron à midi pour la formation antidopage
 */
import TelegramBot from "node-telegram-bot-api";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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
    console.error("Fichier .env manquant");
    process.exit(1);
  }
}

loadEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID requis dans .env");
  process.exit(1);
}

const bot = new TelegramBot(token);

function buildKuraLesson(weekOverride = null, dayOverride = null) {
  try {
    // Kura commence aussi le 30 mars 2026
    const startDate = new Date(2026, 2, 30);
    const daysSinceStart = Math.floor(
      (Date.now() - startDate.getTime()) / 86400000
    );
    const week =
      weekOverride ??
      Math.max(1, Math.min(Math.ceil((daysSinceStart + 1) / 7), 4));

    const file = resolve(
      __dirname,
      `../../docs/curriculum/kura-semaine-0${week}.json`
    );
    const curriculum = JSON.parse(readFileSync(file, "utf-8"));

    const dayOfWeek = new Date().getDay();
    const dayIndex = dayOverride ?? (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    if (!curriculum[dayIndex]) return null;

    const lesson = curriculum[dayIndex];
    const links =
      lesson.ressources?.length > 0
        ? lesson.ressources.map((r) => `[Lire](${r})`).join(" | ")
        : "";

    return `*📋 KURA — FORMATION ANTIDOPAGE*
*${lesson.titre}*

${lesson.cours}

*🎯 Exercice :* ${lesson.exercice}
${links ? `\n*📚 Ressources :* ${links}` : ""}

_Semaine ${week} — Jour ${dayIndex + 1}/7 | Programme Kura_`;
  } catch (err) {
    console.error("Erreur curriculum Kura:", err.message);
    return null;
  }
}

async function sendLongMessage(chatId, text) {
  const maxLen = 4000;
  if (text.length <= maxLen) {
    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
    return;
  }
  const parts = [];
  let current = "";
  for (const line of text.split("\n")) {
    if ((current + "\n" + line).length > maxLen) {
      parts.push(current);
      current = line;
    } else {
      current += (current ? "\n" : "") + line;
    }
  }
  if (current) parts.push(current);
  for (const part of parts) {
    await bot.sendMessage(chatId, part, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }
}

// Accepte des args CLI: node kura.js [week] [day]
const weekArg = process.argv[2] ? parseInt(process.argv[2]) : null;
const dayArg = process.argv[3] ? parseInt(process.argv[3]) : null;

async function main() {
  const lesson = buildKuraLesson(weekArg, dayArg);

  if (!lesson) {
    console.log("Pas de leçon Kura aujourd'hui");
    process.exit(0);
  }

  await sendLongMessage(chatId, lesson);
  console.log("Leçon Kura envoyée !");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erreur:", err.message);
  process.exit(1);
});
