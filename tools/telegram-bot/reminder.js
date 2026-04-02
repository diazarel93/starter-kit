/**
 * reminder.js — Rappel quiz 17h
 * Envoie un rappel avec boutons pour faire le quiz du soir
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
  } catch {}
}

loadEnv();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

const messages = [
  "🎯 *17h — Quiz du jour ?*\n_Consolide ce que tu as appris ce matin._",
  "🧠 *Il est 17h.* Tu as fait ton quiz ?\n_5 minutes = 10x plus de rétention._",
  "⚡ *Rappel formation* — Un quiz rapide avant de finir la journée ?",
  "📋 *17h — Kura ou Tech ?*\n_Choisis ton quiz et c'est parti._",
];

const msg = messages[new Date().getDay() % messages.length];

async function main() {
  await bot.sendMessage(chatId, msg, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📋 Quiz Kura", callback_data: "quiz_kura" },
          { text: "🧠 Quiz Tech", callback_data: "quiz_tech" },
        ],
        [{ text: "⏭ Passer", callback_data: "status" }],
      ],
    },
  });
  console.log("Rappel 17h envoyé !");
  process.exit(0);
}

main().catch(() => process.exit(0));
