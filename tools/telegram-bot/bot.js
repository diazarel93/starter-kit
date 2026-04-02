import TelegramBot from "node-telegram-bot-api";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charge .env manuellement (pas de dotenv dependency)
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(__dirname, ".env"), "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.error("Cree un fichier .env (copie .env.example)");
    process.exit(1);
  }
}

loadEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN manquant dans .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Au premier message, affiche le chat ID
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(`Chat ID: ${chatId} — ajoute-le dans .env`);

  bot.sendMessage(
    chatId,
    `Salut! Ton Chat ID est: \`${chatId}\`\n\nAjoute-le dans ton fichier .env puis lance \`npm run veille\` pour recevoir ta veille quotidienne.`,
    { parse_mode: "Markdown" }
  );
});

console.log("Bot demarre. Envoie un message a ton bot sur Telegram pour obtenir ton Chat ID.");
