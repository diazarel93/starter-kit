/**
 * evening-quiz.js — Quiz automatique du soir (20h)
 * Génère et envoie un quiz sans intervention — alterne Kura/Tech selon le jour
 * Lun/Mer/Ven = Kura | Mar/Jeu = Tech | Week-end = les deux
 */
import TelegramBot from "node-telegram-bot-api";
import Anthropic from "@anthropic-ai/sdk";
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

function getQuizType() {
  const day = new Date().getDay(); // 0=dim, 1=lun...6=sam
  // Lun(1), Mer(3), Ven(5) = Kura | Mar(2), Jeu(4) = Tech | Sam(6)/Dim(0) = Kura + Tech
  if (day === 0 || day === 6) return "both";
  return [1, 3, 5].includes(day) ? "kura" : "tech";
}

function getLesson(type) {
  try {
    const startDate = new Date(2026, 2, 30);
    const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    const week = Math.max(1, Math.min(Math.ceil((daysSinceStart + 1) / 7), 4));
    const prefix = type === "kura" ? "kura-" : "";
    const file = resolve(__dirname, `../../docs/curriculum/${prefix}semaine-0${week}.json`);
    const curriculum = JSON.parse(readFileSync(file, "utf-8"));
    const dayOfWeek = new Date().getDay();
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return curriculum[dayIndex] ?? null;
  } catch {
    return null;
  }
}

async function generateQuiz(lesson, type) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const domain = type === "kura" ? "antidopage / compliance" : "dev AI / Claude Code";

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{
      role: "user",
      content: `Génère un QCM 3 choix basé sur cette leçon de ${domain}.

LEÇON: ${lesson.titre}
CONTENU: ${lesson.cours.slice(0, 800)}

Format EXACT :
❓ *[Question précise en français]*
_[English translation]_

A) [réponse]
B) [réponse]
C) [réponse]

||✅ Bonne réponse : [A/B/C] — [Explication 1 phrase FR]
_[English: Short explanation]_||

1 seule bonne réponse, les autres plausibles.`,
    }],
  });
  return response.content[0].text;
}

async function sendQuiz(bot, chatId, type) {
  const lesson = getLesson(type);
  if (!lesson) return;

  const quiz = await generateQuiz(lesson, type);
  const icon = type === "kura" ? "📋" : "🧠";
  const label = type === "kura" ? "Kura Antidopage" : "Dev AI";

  await bot.sendMessage(chatId, `${icon} *Quiz du soir — ${label}*\n\n${quiz}`, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[
        { text: "🔄 Encore un quiz", callback_data: type === "kura" ? "quiz_tech" : "quiz_kura" },
        { text: "📖 Revoir la leçon", callback_data: `lesson_${type}` },
      ]],
    },
  });
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) { process.exit(0); }

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const quizType = getQuizType();

  await bot.sendMessage(chatId, `🌙 *Quiz du soir — 20h*\n_Recap de ta journée._`, {
    parse_mode: "Markdown",
  });

  if (quizType === "both") {
    await sendQuiz(bot, chatId, "kura");
    await new Promise(r => setTimeout(r, 2000));
    await sendQuiz(bot, chatId, "tech");
  } else {
    await sendQuiz(bot, chatId, quizType);
  }

  console.log("Quiz du soir envoyé !");
  process.exit(0);
}

main().catch(() => process.exit(0));
