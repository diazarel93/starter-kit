/**
 * interactive.js — Bot Telegram interactif avec quiz, commandes et contrôle
 * Tourne en continu (polling) via launchd au démarrage du Mac
 *
 * Commandes disponibles :
 * /quiz         — Quiz du jour (FR + EN) sur la leçon en cours
 * /kura         — Leçon Kura du jour (antidopage)
 * /tech         — Leçon tech du jour (dev AI / Claude Code)
 * /veille       — Rapport de veille tech immédiat
 * /status       — État du système (crons actifs, dernière session)
 * /help         — Liste des commandes
 */
import TelegramBot from "node-telegram-bot-api";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = resolve(__dirname, ".bot-state.json");

// ─── ENV ────────────────────────────────────────────────────────────────────

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
const hasAI = Boolean(process.env.ANTHROPIC_API_KEY);

if (!token || !chatId) {
  console.error("TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID requis");
  process.exit(1);
}

// ─── STATE ──────────────────────────────────────────────────────────────────

function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─── CURRICULUM ─────────────────────────────────────────────────────────────

function getTodayLesson(type = "tech") {
  try {
    const startDate = new Date(2026, 2, 30);
    const daysSinceStart = Math.floor(
      (Date.now() - startDate.getTime()) / 86400000
    );
    const week = Math.max(1, Math.min(Math.ceil((daysSinceStart + 1) / 7), 4));

    const prefix = type === "kura" ? "kura-" : "";
    const file = resolve(
      __dirname,
      `../../docs/curriculum/${prefix}semaine-0${week}.json`
    );
    const curriculum = JSON.parse(readFileSync(file, "utf-8"));

    const dayOfWeek = new Date().getDay();
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return curriculum[dayIndex] ?? null;
  } catch {
    return null;
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

async function sendMsg(bot, chatId, text) {
  const maxLen = 4000;
  if (text.length <= maxLen) {
    return bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
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

async function generateQuiz(lesson, type) {
  if (!hasAI) {
    return `*Quiz sur :* ${lesson.titre}\n\n_Claude API non configurée — ajoute ANTHROPIC_API_KEY dans .env pour les quiz IA_\n\n*Exercice manuel :* ${lesson.exercice}`;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const domain =
    type === "kura" ? "antidopage / compliance sportive" : "dev AI / Claude Code";

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Génère un QCM à 3 choix basé sur cette leçon de ${domain}.

LEÇON: ${lesson.titre}
CONTENU: ${lesson.cours.slice(0, 800)}

Format EXACT :
❓ *[Question courte et précise en français]*
_[English translation of the question]_

A) [réponse]
B) [réponse]
C) [réponse]

||Bonne réponse : [A/B/C] — [Explication courte 1 phrase FR]
_[English: Short explanation]_||

Règles : 1 seule bonne réponse, autres plausibles mais fausses, basé EXACTEMENT sur la leçon.`,
      },
    ],
  });

  return response.content[0].text;
}

// ─── COMMANDES ──────────────────────────────────────────────────────────────

async function handleHelp(bot, chatId) {
  const msg = `*🎬 Bot Romain — Commandes*

*Formation :*
/quiz — Quiz du jour (Kura ou Tech alternés)
/quizkura — Quiz antidopage Kura
/quiztech — Quiz dev AI / Claude Code
/kura — Leçon Kura du jour
/tech — Leçon tech du jour

*Veille & Info :*
/veille — Rapport veille tech maintenant
/agents — Quel agent utiliser selon ta situation
/patterns — Patterns & bugs récurrents détectés
/status — État du système

*Cerveau Autonome :*
/dispatch [problème] — Router vers le bon agent
/idea [idée] — Générer un plan complet depuis une idée

*Contrôle :*
/help — Ce menu

_Le coaching arrive automatiquement en cours + fin de session Claude Code._
_Chaque tip de fin de session inclut l'agent recommandé pour la suite._`;

  await sendMsg(bot, chatId, msg);
}

async function handleAgents(bot, chatId) {
  const msg = `*🤖 Agents Claude Code — Quand les invoquer*

*Tu veux coder une feature :*
→ \`feature-planner\` d'abord (plan avant de coder)
→ Puis code avec Sonnet
→ \`code-reviewer\` avant de push

*Tu as un bug difficile :*
→ \`/debug\` (5 phases de debug)
→ Si 3 tentatives échouées → Opus

*Tu touches à la DB (SQL, migrations, RLS) :*
→ \`db-architect\` obligatoire

*Tu fais du design / UI :*
→ \`design-director\` (5 phases : brief → DA → composition → code → critique)

*Tu veux pusher :*
→ \`/check\` puis \`/ship\`

*Décision d'architecture / long terme :*
→ \`cto-advisor\`

*Tes prompts AI sont mauvais ou trop chers :*
→ \`prompt-engineer\`

*Deps outdatées / CVE :*
→ \`dependency-sentinel\`

*Tu veux adapter ta formation à ce que tu codes :*
→ \`formation-generator\`

*Tu veux une vue globale de tous tes projets :*
→ \`brain\`

*Veille tech (quoi de neuf ?) :*
→ \`tech-watcher\`

_→ Dans Claude Code, tape le nom de l'agent ou utilise /[nom-agent]_`;

  const buttons = {
    inline_keyboard: [
      [
        { text: "📚 Leçon du jour", callback_data: "lesson_tech" },
        { text: "🎯 Quiz", callback_data: "quiz" },
      ],
    ],
  };

  await bot.sendMessage(chatId, msg, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: buttons,
  });
}

async function handleLesson(bot, chatId, type) {
  const lesson = getTodayLesson(type);
  if (!lesson) {
    await sendMsg(bot, chatId, `_Pas de leçon ${type} disponible aujourd'hui._`);
    return;
  }

  const icon = type === "kura" ? "📋" : "🧠";
  const label = type === "kura" ? "KURA — ANTIDOPAGE" : "TECH — DEV AI";
  const links = lesson.ressources?.length
    ? "\n*📚 Ressources :* " + lesson.ressources.map((r) => `[Lire](${r})`).join(" | ")
    : "";

  const msg = `*${icon} ${label}*
*${lesson.titre}*

${lesson.cours}

*🎯 Exercice :* ${lesson.exercice}${links}`;

  // Si message court, envoie avec boutons. Sinon envoie en plusieurs parties puis boutons séparés.
  const buttons = {
    inline_keyboard: [
      [
        { text: "🎯 Quiz sur cette leçon", callback_data: `quiz_${type}` },
        { text: "🔭 Veille tech", callback_data: "veille" },
      ],
      [
        { text: type === "kura" ? "🧠 Leçon Tech" : "📋 Leçon Kura", callback_data: type === "kura" ? "lesson_tech" : "lesson_kura" },
        { text: "📖 Aide", callback_data: "help" },
      ],
    ],
  };

  if (msg.length <= 4000) {
    await bot.sendMessage(chatId, msg, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: buttons,
    });
  } else {
    await sendMsg(bot, chatId, msg);
    await bot.sendMessage(chatId, "↑ _Que veux-tu faire ?_", {
      parse_mode: "Markdown",
      reply_markup: buttons,
    });
  }
}

async function handleQuiz(bot, chatId, type = null) {
  // Alterne entre kura et tech si pas spécifié
  const state = loadState();
  const resolvedType = type ?? (state.lastQuizType === "tech" ? "kura" : "tech");

  const lesson = getTodayLesson(resolvedType);
  if (!lesson) {
    await sendMsg(bot, chatId, `_Pas de leçon disponible pour le quiz._`);
    return;
  }

  await sendMsg(bot, chatId, `_Génération du quiz... ⏳_`);

  try {
    const quiz = await generateQuiz(lesson, resolvedType);
    const icon = resolvedType === "kura" ? "📋" : "🧠";
    const label = resolvedType === "kura" ? "Antidopage" : "Dev AI";

    const afterQuiz = {
      inline_keyboard: [
        [
          { text: "🔄 Autre quiz", callback_data: `quiz_${resolvedType === "kura" ? "tech" : "kura"}` },
          { text: "📖 Revoir la leçon", callback_data: `lesson_${resolvedType}` },
        ],
        [
          { text: "🔭 Veille tech", callback_data: "veille" },
          { text: "📊 Statut", callback_data: "status" },
        ],
      ],
    };

    await bot.sendMessage(chatId, `${icon} *Quiz ${label}*\n\n${quiz}`, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: afterQuiz,
    });

    saveState({ ...state, lastQuizType: resolvedType, lastQuizDate: new Date().toISOString() });
  } catch (err) {
    await sendMsg(bot, chatId, `_Erreur quiz : ${err.message}_`);
  }
}

async function handleVeille(bot, chatId) {
  await sendMsg(bot, chatId, "_Génération de la veille tech... ⏳_");
  try {
    execSync(
      `/Users/diazarel/.nvm/versions/node/v20.19.5/bin/node /Users/diazarel/starter-kit/tools/telegram-bot/veille.js`,
      { timeout: 30000 }
    );
    // veille.js envoie lui-même le message
  } catch (err) {
    await sendMsg(bot, chatId, `_Erreur veille : ${err.message}_`);
  }
}

async function handleStatus(bot, chatId) {
  const state = loadState();

  let cronStatus = "❓ Inconnu";
  try {
    const crons = execSync("crontab -l 2>/dev/null", { encoding: "utf-8" });
    const hasVeille = crons.includes("run-veille.sh");
    const hasKura = crons.includes("run-kura.sh");
    cronStatus = [
      hasVeille ? "✅ Veille (8h)" : "❌ Veille manquante",
      hasKura ? "✅ Kura (12h)" : "❌ Kura manquant",
    ].join("\n  ");
  } catch {
    cronStatus = "❌ Pas de crontab";
  }

  const lastQuiz = state.lastQuizDate
    ? new Date(state.lastQuizDate).toLocaleString("fr-FR")
    : "Jamais";
  const aiStatus = hasAI ? "✅ Configurée" : "❌ Manquante (quiz et coaching désactivés)";

  const msg = `*📊 Statut système*

*Crons :*
  ${cronStatus}

*Claude API :* ${aiStatus}
*Dernier quiz :* ${lastQuiz}
*Type suivant :* ${state.lastQuizType === "tech" ? "Kura" : "Tech"}`;

  await sendMsg(bot, chatId, msg);
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

const bot = new TelegramBot(token, { polling: true });

console.log("Bot interactif démarré — en attente de commandes...");

bot.onText(/\/start|\/hello/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await sendMsg(
    bot,
    chatId,
    `*Salut Romain !* 👋\n\nTon bot de formation et coaching est actif.\n\nTape /help pour voir toutes les commandes.`
  );
});

bot.onText(/\/help/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleHelp(bot, chatId);
});

bot.onText(/\/kura/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleLesson(bot, chatId, "kura");
});

bot.onText(/\/tech/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleLesson(bot, chatId, "tech");
});

bot.onText(/\/quiz$/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleQuiz(bot, chatId);
});

bot.onText(/\/quizkura/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleQuiz(bot, chatId, "kura");
});

bot.onText(/\/quiztech/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleQuiz(bot, chatId, "tech");
});

bot.onText(/\/agents/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleAgents(bot, chatId);
});

bot.onText(/\/veille/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleVeille(bot, chatId);
});

bot.onText(/\/status/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  await handleStatus(bot, chatId);
});

// /dispatch — Router un problème vers le bon agent
bot.onText(/\/dispatch (.+)/, async (msg, match) => {
  if (String(msg.chat.id) !== chatId) return;
  const problem = match[1];
  await bot.sendMessage(chatId, `🔍 _Analyse du problème en cours..._`, { parse_mode: "Markdown" });
  try {
    const { execSync } = await import("child_process");
    execSync(
      `node ${resolve(__dirname, "../brain-agent/dispatch.js")} "${problem.replace(/"/g, '\\"')}"`,
      { env: { ...process.env, HOME: process.env.HOME } }
    );
  } catch (e) {
    await bot.sendMessage(chatId, `⚠️ Erreur dispatcher : ${e.message.substring(0, 200)}`);
  }
});

// /idea — Lancer l'agent Idée sur une nouvelle idée
bot.onText(/\/idea (.+)/, async (msg, match) => {
  if (String(msg.chat.id) !== chatId) return;
  const idea = match[1];
  await bot.sendMessage(chatId, `💡 _Analyse de ton idée en cours... (Sonnet, ~2min)_`, { parse_mode: "Markdown" });
  try {
    const { execSync } = await import("child_process");
    execSync(
      `node ${resolve(__dirname, "../brain-agent/idea.js")} "${idea.replace(/"/g, '\\"')}"`,
      { env: { ...process.env, HOME: process.env.HOME }, timeout: 120000 }
    );
  } catch (e) {
    await bot.sendMessage(chatId, `⚠️ Erreur idea agent : ${e.message.substring(0, 200)}`);
  }
});

// /patterns — Voir les patterns détectés
bot.onText(/\/patterns/, async (msg) => {
  if (String(msg.chat.id) !== chatId) return;
  try {
    const { readFileSync, existsSync } = await import("fs");
    const path = resolve(__dirname, "../brain-agent/.detected-patterns.json");
    if (!existsSync(path)) {
      await bot.sendMessage(chatId, "Aucun pattern détecté pour l'instant.");
      return;
    }
    const patterns = JSON.parse(readFileSync(path, "utf-8")).filter((p) => !p.resolved).slice(-5);
    if (!patterns.length) {
      await bot.sendMessage(chatId, "✅ Aucun pattern non résolu.");
      return;
    }
    const msg2 = `*🔍 Patterns détectés*\n\n${patterns
      .map((p) => `*${p.title}* (×${p.frequency})\n_${p.description.substring(0, 100)}_\n→ ${p.suggestedAction ?? ""}`)
      .join("\n\n")}`;
    await bot.sendMessage(chatId, msg2, { parse_mode: "Markdown" });
  } catch (e) {
    await bot.sendMessage(chatId, `Erreur : ${e.message}`);
  }
});

// ─── BOUTONS (callback_query) ───────────────────────────────────────────────

bot.on("callback_query", async (query) => {
  if (String(query.message.chat.id) !== chatId) return;

  const data = query.data;

  // Accusé de réception immédiat (sinon le bouton reste en "loading")
  await bot.answerCallbackQuery(query.id);

  if (data === "help") {
    await handleHelp(bot, chatId);
  } else if (data === "agents") {
    await handleAgents(bot, chatId);
  } else if (data === "lesson_kura") {
    await handleLesson(bot, chatId, "kura");
  } else if (data === "lesson_tech") {
    await handleLesson(bot, chatId, "tech");
  } else if (data === "quiz_kura") {
    await handleQuiz(bot, chatId, "kura");
  } else if (data === "quiz_tech") {
    await handleQuiz(bot, chatId, "tech");
  } else if (data === "quiz") {
    await handleQuiz(bot, chatId);
  } else if (data === "veille") {
    await handleVeille(bot, chatId);
  } else if (data === "status") {
    await handleStatus(bot, chatId);
  }
});

// Sécurité : ignore tous les messages d'autres chats
bot.on("message", (msg) => {
  if (String(msg.chat.id) !== chatId) {
    console.log(`Message ignoré du chat ${msg.chat.id}`);
  }
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

process.on("SIGTERM", () => {
  console.log("Bot arrêté proprement");
  process.exit(0);
});
