import TelegramBot from "node-telegram-bot-api";

let bot = null;

function getBot() {
  if (!bot) bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  return bot;
}

export async function sendTelegram({ message, silent = false }) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return { ok: false, error: "TELEGRAM_CHAT_ID manquant" };
  try {
    await getBot().sendMessage(chatId, message, {
      parse_mode: "Markdown",
      disable_notification: silent,
      disable_web_page_preview: true,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
