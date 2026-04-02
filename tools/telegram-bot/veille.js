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
      process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.error("Cree un fichier .env (copie .env.example)");
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

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "veille-bot/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Veille tech (sans API key) ─────────────────────────────────────────────

async function getClaudeCodeVersion() {
  const data = await fetchJson(
    "https://registry.npmjs.org/@anthropic-ai/claude-code/latest"
  );
  return data?.version ?? null;
}

async function getClaudeCodeChangelog() {
  const data = await fetchJson(
    "https://api.github.com/repos/anthropics/claude-code/releases/latest"
  );
  if (!data) return null;
  return {
    version: data.tag_name,
    name: data.name,
    body: data.body?.slice(0, 300) ?? "",
    url: data.html_url,
  };
}

async function getSupabaseRelease() {
  const data = await fetchJson(
    "https://api.github.com/repos/supabase/supabase/releases/latest"
  );
  if (!data) return null;
  return { version: data.tag_name, url: data.html_url };
}

async function getNextjsRelease() {
  const data = await fetchJson(
    "https://registry.npmjs.org/next/latest"
  );
  return data?.version ?? null;
}

async function buildVeilleSection() {
  const [claudeCodeVersion, claudeCodeRelease, supabase, nextVersion] =
    await Promise.all([
      getClaudeCodeVersion(),
      getClaudeCodeChangelog(),
      getSupabaseRelease(),
      getNextjsRelease(),
    ]);

  const lines = ["*🔭 VEILLE TECH DU JOUR*\n"];

  // Claude Code
  if (claudeCodeVersion) {
    const releaseNote = claudeCodeRelease?.name
      ? ` — ${claudeCodeRelease.name}`
      : "";
    lines.push(`*Claude Code* : v${claudeCodeVersion}${releaseNote}`);
    if (claudeCodeRelease?.body?.trim()) {
      const preview = claudeCodeRelease.body
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 3)
        .join(" • ");
      lines.push(`_${preview}_`);
    }
  }

  // Next.js
  if (nextVersion) {
    lines.push(`*Next.js* : v${nextVersion}`);
  }

  // Supabase
  if (supabase) {
    lines.push(`*Supabase* : ${supabase.version}`);
  }

  // Rappels fixes
  lines.push("");
  lines.push("⚠️ *Haiku 3 retraité le 19/04/2026* → migrer vers Haiku 4\\.5");

  return lines.join("\n");
}

// ─── Curriculum ──────────────────────────────────────────────────────────────

function buildCurriculumSection() {
  try {
    const startDate = new Date(2026, 2, 30); // 30 mars 2026
    const daysSinceStart = Math.floor(
      (Date.now() - startDate.getTime()) / 86400000
    );
    const week = Math.max(1, Math.min(Math.ceil((daysSinceStart + 1) / 7), 4));
    const file = resolve(
      __dirname,
      `../../docs/curriculum/semaine-0${week}.json`
    );
    const curriculum = JSON.parse(readFileSync(file, "utf-8"));

    const dayOfWeek = new Date().getDay();
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (!curriculum[dayIndex]) return null;

    const lesson = curriculum[dayIndex];
    const links =
      lesson.ressources.length > 0
        ? lesson.ressources.map((r) => `[Lire](${r})`).join(" | ")
        : "";

    return `*📚 COURS DU JOUR*
*${lesson.titre}*

${lesson.cours}

*Exercice :* ${lesson.exercice}
${links ? `\n*Ressources :* ${links}` : ""}
_Semaine ${week} — Jour ${dayIndex + 1}/7_`;
  } catch {
    return null;
  }
}

// ─── Envoi ───────────────────────────────────────────────────────────────────

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

async function main() {
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const header = `*${date.charAt(0).toUpperCase() + date.slice(1)}* 🎬`;

  // Veille tech en parallèle avec curriculum
  const [veilleSection, curriculumSection] = await Promise.all([
    buildVeilleSection(),
    Promise.resolve(buildCurriculumSection()),
  ]);

  const separator = "\n━━━━━━━━━━━━━━━━━━━━\n";

  let message = header + "\n\n";
  message += veilleSection;

  if (curriculumSection) {
    message += separator + curriculumSection;
  }

  message += separator + `_Tape "quoi de neuf ?" dans Claude Code pour plus de détails_`;

  await sendLongMessage(chatId, message);
  console.log("Message envoyé !");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erreur:", err.message);
  process.exit(1);
});
