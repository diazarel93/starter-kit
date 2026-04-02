/**
 * vocab.js — Mot du jour technique (10h)
 * 3 mots : 1 dev AI / 1 Kura/RegTech / 1 anglais business
 * Court, mémorisable, ancré dans les projets de Romain
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

// Vocabulaire rotatif — index basé sur le jour de l'année
const VOCAB = [
  // Dev AI / Architecture
  { cat: "🧠 DEV AI", fr: "RAG (Retrieval-Augmented Generation)", en: "RAG", def: "Technique qui connecte un LLM à une base de données pour répondre sur des données réelles sans halluciner.", ex: "Kura utilise RAG pour chercher les substances avant d'appeler Claude." },
  { cat: "🧠 DEV AI", fr: "Guardrail", en: "Guardrail", def: "Couche de sécurité déterministe qui vérifie la sortie du LLM APRÈS sa génération.", ex: "GR1 dans Kura : jamais labeler RED comme autorisé." },
  { cat: "🧠 DEV AI", fr: "Embedding", en: "Embedding", def: "Représentation numérique d'un texte dans un espace vectoriel — base du RAG et de la recherche sémantique.", ex: "Chaque substance dans Kura est convertie en embedding pour la recherche." },
  { cat: "🧠 DEV AI", fr: "Prompt Engineering", en: "Prompt Engineering", def: "Art de formuler des instructions précises pour obtenir des sorties LLM reproductibles.", ex: "Dans ask_service.py : system prompt + few-shot examples + output format." },
  { cat: "🧠 DEV AI", fr: "Context Window", en: "Context window", def: "Nombre maximum de tokens que le LLM peut 'voir' en une fois. Sonnet 4.6 = 1M tokens.", ex: "Si le context est plein → /compact dans Claude Code." },
  { cat: "🧠 DEV AI", fr: "Fine-tuning", en: "Fine-tuning", def: "Ré-entraîner un modèle sur tes propres données pour le spécialiser.", ex: "Pas encore dans Kura — RAG suffit pour l'instant." },
  { cat: "🧠 DEV AI", fr: "LLM Router", en: "LLM Router", def: "Système qui choisit automatiquement le bon modèle selon la complexité de la tâche.", ex: "Haiku pour classification, Sonnet pour raisonnement, Opus pour complexe." },
  { cat: "🧠 DEV AI", fr: "Hallucination", en: "Hallucination", def: "Le LLM invente des informations qui semblent vraies mais sont fausses.", ex: "GR3 Kura : si substance inconnue → 'à vérifier', jamais d'invention." },
  { cat: "🧠 DEV AI", fr: "Token", en: "Token", def: "Unité de texte traitée par le LLM (~4 chars en anglais, ~3 en français).", ex: "1000 tokens ≈ 750 mots. Haiku = $0.80/M tokens input." },
  { cat: "🧠 DEV AI", fr: "Streaming", en: "Streaming", def: "Envoyer la réponse du LLM mot par mot au lieu d'attendre la fin.", ex: "Dans lib/ai.ts : stream() vs complete() selon le besoin." },
  { cat: "🧠 DEV AI", fr: "Webhook", en: "Webhook", def: "Endpoint HTTP qui reçoit des événements en temps réel depuis un service externe.", ex: "Stripe envoie payment_succeeded à /api/webhooks/stripe." },
  { cat: "🧠 DEV AI", fr: "RLS (Row Level Security)", en: "Row Level Security", def: "Sécurité Supabase qui filtre les données au niveau DB selon l'utilisateur connecté.", ex: "users ne peut lire que sa propre ligne — jamais les données des autres." },
  { cat: "🧠 DEV AI", fr: "Edge Function", en: "Edge Function", def: "Code serverless qui tourne au plus proche de l'utilisateur (dans les CDN Vercel).", ex: "Middleware auth, géolocalisation, rate limiting." },
  { cat: "🧠 DEV AI", fr: "Idempotence", en: "Idempotency", def: "Une opération qui produit le même résultat peu importe le nombre d'exécutions.", ex: "IF NOT EXISTS dans les migrations SQL = idempotent." },
  { cat: "🧠 DEV AI", fr: "Monorepo", en: "Monorepo", def: "Repo unique qui contient plusieurs projets/packages (ex: Turborepo, NX).", ex: "Le starter-kit est la base, chaque projet est un repo séparé pour l'instant." },

  // Kura / RegTech / Antidopage
  { cat: "📋 KURA/REGTECH", fr: "WADA (AMA)", en: "WADA (World Anti-Doping Agency)", def: "Agence Mondiale Antidopage basée à Montréal. Définit le Code et la Liste des Interdictions.", ex: "WADA met à jour la liste chaque 1er janvier. Kura se base dessus." },
  { cat: "📋 KURA/REGTECH", fr: "ADRV", en: "ADRV (Anti-Doping Rule Violation)", def: "Violation des règles antidopage. 11 types possibles — le positif n'est que l'une des 11.", ex: "Article 2.1 = présence substance. Article 2.4 = whereabouts manquants." },
  { cat: "📋 KURA/REGTECH", fr: "TUE (AUT)", en: "TUE (Therapeutic Use Exemption)", def: "Autorisation d'utiliser une substance interdite pour raisons médicales légitimes.", ex: "Statut YELLOW dans Kura = interdit mais AUT possible." },
  { cat: "📋 KURA/REGTECH", fr: "Responsabilité stricte", en: "Strict Liability", def: "L'athlète est responsable de TOUT ce qui entre dans son corps, même sans intention.", ex: "Supplément contaminé = ADRV même si l'athlète ne savait pas." },
  { cat: "📋 KURA/REGTECH", fr: "Whereabouts", en: "Whereabouts", def: "Obligation de communiquer sa localisation quotidienne pour les contrôles inopinés.", ex: "3 manquements en 12 mois = suspension 1 an (ADRV 2.4)." },
  { cat: "📋 KURA/REGTECH", fr: "Substance seuil", en: "Threshold substance", def: "Substance autorisée en-dessous d'une concentration, interdite au-dessus.", ex: "Salbutamol inhalé : autorisé si < 1000 ng/mL dans l'urine." },
  { cat: "📋 KURA/REGTECH", fr: "Fenêtre de détection", en: "Detection window", def: "Durée pendant laquelle une substance reste détectable après la dernière prise.", ex: "EPO standard : 1-3 jours. Nandrolone injectée : jusqu'à 18 mois." },
  { cat: "📋 KURA/REGTECH", fr: "Passeport Biologique", en: "Athlete Biological Passport (ABP)", def: "Surveillance longitudinale des paramètres biologiques pour détecter les anomalies.", ex: "Module hématologique : surveille EPO indirectement via les globules rouges." },
  { cat: "📋 KURA/REGTECH", fr: "Conformité (Compliance)", en: "Compliance", def: "Respect des règles réglementaires par une organisation ou un individu.", ex: "Kura aide les professionnels à rester en conformité avec la liste WADA." },
  { cat: "📋 KURA/REGTECH", fr: "RegTech", en: "RegTech (Regulatory Technology)", def: "Technologie qui aide à gérer la conformité réglementaire — secteur en pleine croissance.", ex: "Kura EST un produit RegTech : il automatise la vérification des règles WADA." },
  { cat: "📋 KURA/REGTECH", fr: "DCI (Dénomination Commune Internationale)", en: "INN (International Nonproprietary Name)", def: "Nom générique d'une molécule active, indépendant de la marque commerciale.", ex: "Ibuprofène = DCI. Advil = nom de marque. Kura cherche par DCI." },
  { cat: "📋 KURA/REGTECH", fr: "NADO", en: "NADO (National Anti-Doping Organization)", def: "Organisation nationale antidopage. Applique le Code WADA dans son pays.", ex: "CCES = NADO canadienne. USADA = USA. AFLD = France." },
  { cat: "📋 KURA/REGTECH", fr: "Substance spécifiée", en: "Specified substance", def: "Substance avec sanction réduite possible si l'athlète prouve qu'il n'avait pas l'intention de doper.", ex: "Cannabis (S8) = substance spécifiée → max 2 ans vs 4 ans." },
  { cat: "📋 KURA/REGTECH", fr: "AAF", en: "AAF (Adverse Analytical Finding)", def: "Résultat initial positif d'un laboratoire — déclenche une procédure mais pas encore une sanction.", ex: "AAF → notification athlète → analyse échantillon B → décision." },

  // Anglais business / startup
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Traction", en: "Traction", def: "Preuve que le produit trouve son marché — utilisateurs actifs, revenus, croissance.", ex: "'We have traction' = on a des vrais clients qui paient." },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Pivott", en: "Pivot", def: "Changement significatif de direction stratégique tout en conservant les apprentissages.", ex: "'We pivoted from B2C to B2B' = changé de cible client." },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Roadmap", en: "Roadmap", def: "Plan des fonctionnalités futures avec priorités et timing approximatif.", ex: "'What's on your roadmap for Q3?' = qu'est-ce que tu livres ce trimestre ?" },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Scalable", en: "Scalable", def: "Qui peut croître sans coût proportionnel — le rêve de tout SaaS.", ex: "'Is the architecture scalable?' = tient-elle à 100K users ?" },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Due diligence", en: "Due diligence", def: "Audit approfondi avant un investissement ou une acquisition.", ex: "'Investors are doing due diligence on Kura' = ils vérifient tout." },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Churn", en: "Churn", def: "Taux d'abandon des clients sur une période donnée.", ex: "'Our monthly churn is 2%' = on perd 2% des clients par mois." },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "ARR / MRR", en: "ARR (Annual Recurring Revenue) / MRR (Monthly)", def: "Revenu récurrent annuel/mensuel — métrique clé d'un SaaS.", ex: "'We're at $50K ARR' = 50K$ de revenu annuel contractualisé." },
  { cat: "🇬🇧 ANGLAIS PRO", fr: "Product-Market Fit", en: "Product-Market Fit (PMF)", def: "Moment où le produit répond parfaitement à un besoin de marché identifié.", ex: "'Do we have PMF?' = est-ce que les clients nous auraient si on fermait ?" },
];

loadEnv();

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) process.exit(0);

  const bot = new TelegramBot(token);

  // 3 mots du jour : 1 dev AI + 1 Kura/RegTech + 1 anglais — rotation selon le jour de l'année
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  const devAI = VOCAB.filter(v => v.cat.includes("DEV AI"));
  const kura = VOCAB.filter(v => v.cat.includes("KURA"));
  const anglais = VOCAB.filter(v => v.cat.includes("ANGLAIS"));

  const w1 = devAI[dayOfYear % devAI.length];
  const w2 = kura[dayOfYear % kura.length];
  const w3 = anglais[dayOfYear % anglais.length];

  const format = (w) =>
    `${w.cat}\n*${w.fr}* — _${w.en}_\n${w.def}\n💡 _Ex : ${w.ex}_`;

  const msg = `*📖 MOTS DU JOUR*\n\n${format(w1)}\n\n${format(w2)}\n\n${format(w3)}`;

  await bot.sendMessage(chatId, msg, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[
        { text: "🎯 Quiz sur ces mots", callback_data: "quiz" },
        { text: "📚 Leçon complète", callback_data: "lesson_tech" },
      ]],
    },
  });

  console.log("Mots du jour envoyés !");
  process.exit(0);
}

main().catch(() => process.exit(0));
