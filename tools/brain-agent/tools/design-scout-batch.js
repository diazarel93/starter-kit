/**
 * design-scout-batch.js — Session intensive 100 sites
 * Lance plusieurs sous-agents Haiku en parallèle (4 batches de 25)
 * Usage : node tools/brain-agent/tools/design-scout-batch.js
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { chromium } from "playwright";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../../");
const KB_PATH = resolve(ROOT, "tools/design-scout/knowledge-base.json");
const REPORTS_DIR = resolve(ROOT, "tools/design-scout/reports");
const AGENT_PATH = resolve(ROOT, ".claude/agents/design-scout.md");

// ─── 100 sites curatés — les meilleurs du monde par style ────────────────────

const SITES_TO_ANALYZE = [
  // CINEMA DARK (20 sites)
  { url: "https://a24films.com", style: "cinema-dark", sector: "cinema", priority: "world-reference" },
  { url: "https://mubi.com", style: "cinema-dark", sector: "cinema", priority: "world-reference" },
  { url: "https://www.criterion.com", style: "cinema-dark", sector: "cinema", priority: "world-reference" },
  { url: "https://www.sundance.org", style: "cinema-dark", sector: "festival", priority: "excellent" },
  { url: "https://www.berlinale.de/en", style: "cinema-dark", sector: "festival", priority: "excellent" },
  { url: "https://www.canneslions.com", style: "cinema-dark", sector: "festival", priority: "excellent" },
  { url: "https://www.pitchfork.com", style: "cinema-dark", sector: "music", priority: "world-reference" },
  { url: "https://www.boilerroom.tv", style: "cinema-dark", sector: "music", priority: "excellent" },
  { url: "https://www.xlrecordings.com", style: "cinema-dark", sector: "music", priority: "excellent" },
  { url: "https://www.saintlaurent.com", style: "cinema-dark", sector: "luxury", priority: "world-reference" },
  { url: "https://www.givenchy.com", style: "cinema-dark", sector: "luxury", priority: "excellent" },
  { url: "https://www.balenciaga.com", style: "cinema-dark", sector: "luxury", priority: "world-reference" },
  { url: "https://letterboxd.com", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://www.apple.com/tv-pr", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://www.hbo.com", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://www.netflixawards.com", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://www.24frames.io", style: "cinema-dark", sector: "cinema", priority: "good" },
  { url: "https://www.magnoliafilms.com", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://neonrated.com", style: "cinema-dark", sector: "cinema", priority: "excellent" },
  { url: "https://www.ifcfilms.com", style: "cinema-dark", sector: "cinema", priority: "good" },

  // SAAS MINIMAL (20 sites)
  { url: "https://linear.app", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://vercel.com", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://raycast.com", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://cal.com", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://resend.com", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://clerk.com", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://www.framer.com", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://www.notion.so", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://arc.net", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://stripe.com", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://www.figma.com", style: "saas-minimal", sector: "saas", priority: "world-reference" },
  { url: "https://liveblocks.io", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://supabase.com", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://planetscale.com", style: "saas-minimal", sector: "saas", priority: "excellent" },
  { url: "https://www.anthropic.com", style: "saas-minimal", sector: "ai", priority: "excellent" },
  { url: "https://openai.com", style: "saas-minimal", sector: "ai", priority: "world-reference" },
  { url: "https://www.cursor.com", style: "saas-minimal", sector: "ai", priority: "excellent" },
  { url: "https://turso.tech", style: "saas-minimal", sector: "saas", priority: "good" },
  { url: "https://neon.tech", style: "saas-minimal", sector: "saas", priority: "good" },
  { url: "https://upstash.com", style: "saas-minimal", sector: "saas", priority: "good" },

  // EDITORIAL BOLD (15 sites)
  { url: "https://www.pentagram.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://www.wearecollins.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://itsnicethat.com", style: "editorial-bold", sector: "media", priority: "world-reference" },
  { url: "https://eyemagazine.com", style: "editorial-bold", sector: "media", priority: "excellent" },
  { url: "https://www.dezeen.com", style: "editorial-bold", sector: "media", priority: "excellent" },
  { url: "https://wearebuild.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://www.base-design.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://www.wolff-olins.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://www.sagmeisterwalsh.com", style: "editorial-bold", sector: "branding", priority: "world-reference" },
  { url: "https://order.design", style: "editorial-bold", sector: "branding", priority: "excellent" },
  { url: "https://www.bibliothequedesign.com", style: "editorial-bold", sector: "branding", priority: "excellent" },
  { url: "https://franklyn.co", style: "editorial-bold", sector: "branding", priority: "excellent" },
  { url: "https://mucho.ws", style: "editorial-bold", sector: "branding", priority: "excellent" },
  { url: "https://ragged-edge.com", style: "editorial-bold", sector: "branding", priority: "excellent" },
  { url: "https://www.koto.studio", style: "editorial-bold", sector: "branding", priority: "excellent" },

  // LUXURY WHITE (10 sites)
  { url: "https://www.aesop.com", style: "luxury-white", sector: "luxury", priority: "world-reference" },
  { url: "https://www.byredo.com", style: "luxury-white", sector: "luxury", priority: "world-reference" },
  { url: "https://www.loropiana.com", style: "luxury-white", sector: "luxury", priority: "world-reference" },
  { url: "https://www.therow.com", style: "luxury-white", sector: "luxury", priority: "world-reference" },
  { url: "https://www.muji.com/eu", style: "luxury-white", sector: "retail", priority: "world-reference" },
  { url: "https://www.acnestudios.com", style: "luxury-white", sector: "luxury", priority: "excellent" },
  { url: "https://www.bottegaveneta.com", style: "luxury-white", sector: "luxury", priority: "world-reference" },
  { url: "https://www.lemaire.fr", style: "luxury-white", sector: "luxury", priority: "excellent" },
  { url: "https://www.arket.com", style: "luxury-white", sector: "retail", priority: "good" },
  { url: "https://www.cos.com", style: "luxury-white", sector: "retail", priority: "good" },

  // PLAYFUL COLOR (10 sites)
  { url: "https://www.duolingo.com", style: "playful-color", sector: "edtech", priority: "world-reference" },
  { url: "https://www.headspace.com", style: "playful-color", sector: "health", priority: "excellent" },
  { url: "https://monzo.com", style: "playful-color", sector: "fintech", priority: "world-reference" },
  { url: "https://www.revolut.com", style: "playful-color", sector: "fintech", priority: "excellent" },
  { url: "https://www.notion.so/product", style: "playful-color", sector: "saas", priority: "excellent" },
  { url: "https://www.figma.com/community", style: "playful-color", sector: "design", priority: "excellent" },
  { url: "https://www.loom.com", style: "playful-color", sector: "saas", priority: "excellent" },
  { url: "https://www.miro.com", style: "playful-color", sector: "saas", priority: "excellent" },
  { url: "https://www.canva.com", style: "playful-color", sector: "design", priority: "excellent" },
  { url: "https://www.kahoot.com", style: "playful-color", sector: "edtech", priority: "excellent" },

  // NEO-BRUTAL (5 sites)
  { url: "https://gumroad.com", style: "neo-brutal", sector: "marketplace", priority: "world-reference" },
  { url: "https://beehiiv.com", style: "neo-brutal", sector: "saas", priority: "excellent" },
  { url: "https://www.are.na", style: "neo-brutal", sector: "social", priority: "excellent" },
  { url: "https://pika.art", style: "neo-brutal", sector: "ai", priority: "excellent" },
  { url: "https://www.perplexity.ai", style: "neo-brutal", sector: "ai", priority: "excellent" },

  // STUDIOS CRÉATIFS TIER 1 (10 sites)
  { url: "https://activetheory.net", style: "ai-generative", sector: "studio", priority: "world-reference" },
  { url: "https://www.resn.co.nz", style: "editorial-bold", sector: "studio", priority: "world-reference" },
  { url: "https://www.instrument.com", style: "saas-minimal", sector: "studio", priority: "excellent" },
  { url: "https://www.dogstudio.co", style: "ai-generative", sector: "studio", priority: "excellent" },
  { url: "https://locomotive.ca", style: "editorial-bold", sector: "studio", priority: "excellent" },
  { url: "https://www.basic.agency", style: "saas-minimal", sector: "studio", priority: "excellent" },
  { url: "https://www.heco.io", style: "editorial-bold", sector: "studio", priority: "excellent" },
  { url: "https://www.unfold.co", style: "luxury-white", sector: "studio", priority: "excellent" },
  { url: "https://www.superflux.in", style: "ai-generative", sector: "studio", priority: "world-reference" },
  { url: "https://semplice.com", style: "editorial-bold", sector: "studio", priority: "excellent" },

  // SOURCES VEILLE (10 sites)
  { url: "https://www.awwwards.com", style: "saas-minimal", sector: "design-media", priority: "world-reference" },
  { url: "https://www.lapa.ninja", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://land-book.com", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://screenlane.com", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://mobbin.com", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://pageflows.net", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://saaspages.xyz", style: "saas-minimal", sector: "design-media", priority: "excellent" },
  { url: "https://www.siteinspire.com", style: "editorial-bold", sector: "design-media", priority: "excellent" },
  { url: "https://www.typewolf.com", style: "editorial-bold", sector: "design-media", priority: "excellent" },
  { url: "https://the-brandidentity.com", style: "editorial-bold", sector: "design-media", priority: "excellent" },

  // JAPON — design minimaliste & culture (10 sites)
  { url: "https://www.muji.com/jp", style: "japonais-minimal", sector: "retail", priority: "world-reference", country: "JP" },
  { url: "https://www.isseymiyake.com", style: "japonais-minimal", sector: "luxury", priority: "world-reference", country: "JP" },
  { url: "https://www.sonydesign.com", style: "saas-minimal", sector: "tech", priority: "world-reference", country: "JP" },
  { url: "https://www.uniqlo.com/jp", style: "japonais-minimal", sector: "retail", priority: "excellent", country: "JP" },
  { url: "https://www.nendo.jp", style: "japonais-minimal", sector: "studio", priority: "world-reference", country: "JP" },
  { url: "https://www.tokyotypes.com", style: "editorial-bold", sector: "design-media", priority: "excellent", country: "JP" },
  { url: "https://minimalissimo.com", style: "japonais-minimal", sector: "design-media", priority: "excellent", country: "JP" },
  { url: "https://nosigner.com", style: "japonais-minimal", sector: "studio", priority: "world-reference", country: "JP" },
  { url: "https://www.nakamuradesign.jp", style: "japonais-minimal", sector: "studio", priority: "excellent", country: "JP" },
  { url: "https://takram.com", style: "saas-minimal", sector: "studio", priority: "excellent", country: "JP" },

  // ALLEMAGNE / EUROPE NORD — Bauhaus, fonctionnalisme (8 sites)
  { url: "https://www.bauhaus.de", style: "editorial-bold", sector: "culture", priority: "world-reference", country: "DE" },
  { url: "https://www.erco.com", style: "saas-minimal", sector: "design", priority: "excellent", country: "DE" },
  { url: "https://www.ueno.co", style: "saas-minimal", sector: "studio", priority: "world-reference", country: "US" },
  { url: "https://www.edenspiekermann.com", style: "saas-minimal", sector: "studio", priority: "world-reference", country: "DE" },
  { url: "https://www.jung-von-matt.com", style: "editorial-bold", sector: "studio", priority: "excellent", country: "DE" },
  { url: "https://www.ideo.com", style: "saas-minimal", sector: "studio", priority: "world-reference", country: "US" },
  { url: "https://www.designit.com", style: "saas-minimal", sector: "studio", priority: "excellent", country: "DK" },
  { url: "https://www.kontrapunkt.com", style: "editorial-bold", sector: "studio", priority: "excellent", country: "DK" },

  // AMÉRIQUE LATINE — design vibrant (5 sites)
  { url: "https://www.anagrama.com", style: "editorial-bold", sector: "branding", priority: "world-reference", country: "MX" },
  { url: "https://www.cuker.com", style: "saas-minimal", sector: "studio", priority: "good", country: "MX" },
  { url: "https://www.folio.co", style: "editorial-bold", sector: "studio", priority: "excellent", country: "BR" },
  { url: "https://www.manifiesto.co", style: "editorial-bold", sector: "branding", priority: "excellent", country: "CO" },
  { url: "https://www.madre.mx", style: "editorial-bold", sector: "studio", priority: "excellent", country: "MX" },

  // ASIE DU SUD-EST & CHINE (5 sites)
  { url: "https://www.foreignpolicy.design", style: "editorial-bold", sector: "studio", priority: "world-reference", country: "SG" },
  { url: "https://www.landor.com", style: "saas-minimal", sector: "branding", priority: "world-reference", country: "SG" },
  { url: "https://www.boundless.id", style: "editorial-bold", sector: "studio", priority: "excellent", country: "ID" },
  { url: "https://www.yijia.co", style: "saas-minimal", sector: "studio", priority: "excellent", country: "CN" },
  { url: "https://www.studioboek.com", style: "editorial-bold", sector: "studio", priority: "excellent", country: "SG" },

  // MÉDIAS MONDIAUX — meilleurs sites éditoriaux (12 sites)
  { url: "https://www.theguardian.com", style: "editorial-bold", sector: "media", priority: "world-reference", country: "UK" },
  { url: "https://www.nytimes.com", style: "editorial-bold", sector: "media", priority: "world-reference", country: "US" },
  { url: "https://www.bloomberg.com", style: "saas-minimal", sector: "media", priority: "world-reference", country: "US" },
  { url: "https://www.theatlantic.com", style: "editorial-bold", sector: "media", priority: "world-reference", country: "US" },
  { url: "https://www.wired.com", style: "editorial-bold", sector: "media", priority: "world-reference", country: "US" },
  { url: "https://www.monocle.com", style: "luxury-white", sector: "media", priority: "world-reference", country: "UK" },
  { url: "https://www.wallpaper.com", style: "luxury-white", sector: "media", priority: "excellent", country: "UK" },
  { url: "https://www.artnews.com", style: "editorial-bold", sector: "media", priority: "excellent", country: "US" },
  { url: "https://www.frieze.com", style: "luxury-white", sector: "media", priority: "world-reference", country: "UK" },
  { url: "https://www.dazeddigital.com", style: "cinema-dark", sector: "media", priority: "world-reference", country: "UK" },
  { url: "https://www.i-d.co", style: "editorial-bold", sector: "media", priority: "world-reference", country: "UK" },
  { url: "https://www.documentjournal.com", style: "luxury-white", sector: "media", priority: "excellent", country: "US" },

  // CLASSEMENTS AWWWARDS PAR PAYS (via leur filtre géo)
  { url: "https://www.awwwards.com/websites/sites_awarded/?country=fr", style: "editorial-bold", sector: "design-media", priority: "excellent", country: "FR" },
  { url: "https://www.awwwards.com/websites/sites_awarded/?country=jp", style: "japonais-minimal", sector: "design-media", priority: "excellent", country: "JP" },
  { url: "https://www.awwwards.com/websites/sites_awarded/?country=br", style: "playful-color", sector: "design-media", priority: "excellent", country: "BR" },
  { url: "https://www.awwwards.com/websites/sites_awarded/?country=kr", style: "saas-minimal", sector: "design-media", priority: "excellent", country: "KR" },
  { url: "https://www.awwwards.com/websites/sites_awarded/?country=de", style: "editorial-bold", sector: "design-media", priority: "excellent", country: "DE" },

  // CORÉE DU SUD — K-design montant (5 sites)
  { url: "https://www.naver.com", style: "playful-color", sector: "tech", priority: "excellent", country: "KR" },
  { url: "https://www.kakao.com", style: "playful-color", sector: "tech", priority: "excellent", country: "KR" },
  { url: "https://www.hyundai.com/worldwide", style: "saas-minimal", sector: "automotive", priority: "excellent", country: "KR" },
  { url: "https://www.samsungdesign.net", style: "saas-minimal", sector: "tech", priority: "world-reference", country: "KR" },
  { url: "https://www.twoplusones.com", style: "editorial-bold", sector: "studio", priority: "excellent", country: "KR" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadKB() {
  if (!existsSync(KB_PATH)) return { version: "1.0", last_updated: new Date().toISOString().split("T")[0], total_sites: 0, sites: [] };
  return JSON.parse(readFileSync(KB_PATH, "utf-8"));
}

function saveKB(kb) {
  kb.total_sites = kb.sites.length;
  kb.last_updated = new Date().toISOString().split("T")[0];
  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
}

function loadAgentPrompt() {
  // Prompt compact pour batch — évite les 20KB du fichier complet
  return `Tu es design-scout, expert mondial en design visuel et branding.

Pour chaque site analysé :
1. fetch_url → lit le contenu HTML
2. Si le site a un design distinctif → add_to_knowledge_base avec :
   - Palette couleurs (bg, text, accent)
   - Typographie notable (famille, usage)
   - Ce qui le rend exceptionnel (1-2 phrases)
   - 1-2 patterns réutilisables
3. Sinon → skip_site (site générique, inaccessible, ou pas distinctif)

Niveau : world-reference = top 1% mondial | excellent = top 10% | good = au-dessus de la moyenne
Analyse vite, sois précis, ne t'attarde pas sur les sites génériques.`;
}

const SCOUT_TOOLS = [
  {
    name: "fetch_url",
    description: "Fetch le contenu texte d'une URL",
    input_schema: { type: "object", properties: { url: { type: "string" } }, required: ["url"] },
  },
  {
    name: "add_to_knowledge_base",
    description: "Ajouter un site analysé à la knowledge-base",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        url: { type: "string" },
        title: { type: "string" },
        source: { type: "string" },
        sector: { type: "string" },
        style_tags: { type: "array", items: { type: "string" } },
        palette: { type: "object", properties: { bg: { type: "string" }, text_primary: { type: "string" }, accent_primary: { type: "string" }, mood: { type: "string" } } },
        typography: { type: "object", properties: { heading_family: { type: "string" }, notable: { type: "string" } } },
        layout: { type: "object", properties: { grid: { type: "string" }, density: { type: "string" }, hero: { type: "string" } } },
        what_makes_it_exceptional: { type: "string" },
        reusable_patterns: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, when_to_use: { type: "string" } } } },
        level: { type: "string", enum: ["world-reference", "excellent", "good"] },
        best_for: { type: "array", items: { type: "string" } },
      },
      required: ["id", "url", "title", "sector", "style_tags", "what_makes_it_exceptional", "level"],
    },
  },
  {
    name: "skip_site",
    description: "Passer un site — trop lent, inaccessible, ou pas assez distinctif",
    input_schema: { type: "object", properties: { url: { type: "string" }, reason: { type: "string" } }, required: ["url", "reason"] },
  },
];

// ─── Retry avec exponential backoff ──────────────────────────────────────────

async function withRetry(fn, maxRetries = 5) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (e.status === 429 && attempt < maxRetries) {
        // Lire le retry-after depuis les headers si disponible
        const retryAfter = parseInt(e.headers?.get?.("retry-after") ?? "30", 10);
        const delay = Math.max(retryAfter * 1000, Math.min(1000 * 2 ** attempt, 120000));
        console.log(`  [rate-limit] 429 → retry dans ${Math.round(delay / 1000)}s (tentative ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Screenshot Playwright ────────────────────────────────────────────────────

let _browser = null;
async function getBrowser() {
  if (!_browser) _browser = await chromium.launch({ headless: true });
  return _browser;
}

async function screenshotSite(url) {
  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);
    const buffer = await page.screenshot({ type: "jpeg", quality: 70, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    return buffer.toString("base64");
  } catch (e) {
    return null;
  } finally {
    if (page) await page.close().catch(() => {});
  }
}

// ─── Agent pour un batch de sites (vision) ───────────────────────────────────

async function analyzeSiteWithVision(client, site, batchId, systemPrompt) {
  console.log(`  [batch-${batchId}] → ${site.url}`);
  const imgBase64 = await screenshotSite(site.url);

  if (!imgBase64) {
    console.log(`  [batch-${batchId}] ✗ inaccessible: ${site.url}`);
    return null;
  }

  const response = await withRetry(() =>
    client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: imgBase64 },
          },
          {
            type: "text",
            text: `Analyse ce screenshot de ${site.url} (style attendu: ${site.style}, secteur: ${site.sector}, priorité: ${site.priority}).

Réponds en JSON strict (pas de markdown) :
{
  "add": true/false,
  "title": "...",
  "style_tags": ["..."],
  "palette": { "bg": "#...", "text_primary": "#...", "accent_primary": "#...", "mood": "chaud|froid|neutre" },
  "typography": { "heading_family": "...", "notable": "..." },
  "layout": { "grid": "symmetric|asymmetric", "density": "airy|standard|dense", "hero": "..." },
  "what_makes_it_exceptional": "...",
  "reusable_patterns": [{ "name": "...", "description": "...", "when_to_use": "..." }],
  "level": "world-reference|excellent|good",
  "best_for": ["..."],
  "skip_reason": "..."
}

Si le design n'est pas distinctif ou si la page est un écran de chargement/cookie → add: false + skip_reason.`,
          },
        ],
      }],
    })
  );

  const text = response.content[0]?.text ?? "";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const data = JSON.parse(jsonMatch[0]);
    return data;
  } catch {
    return null;
  }
}

async function analyzeBatch(client, sites, batchId, systemPrompt) {
  let added = 0;
  let skipped = 0;

  for (const site of sites) {
    const data = await analyzeSiteWithVision(client, site, batchId, systemPrompt);
    await sleep(3000); // 3s entre chaque appel vision

    if (!data) { skipped++; continue; }

    if (!data.add) {
      skipped++;
      console.log(`  [batch-${batchId}] ⟶ skip: ${site.url} — ${data.skip_reason ?? "non distinctif"}`);
      continue;
    }

    const kb = loadKB();
    const exists = kb.sites.find((s) => s.url === site.url);
    if (exists) { skipped++; continue; }

    const id = `${site.url.replace(/https?:\/\//,"").replace(/[^a-z0-9]/gi,"-").slice(0,40)}-${new Date().toISOString().split("T")[0]}`;
    kb.sites.push({
      id,
      url: site.url,
      title: data.title ?? site.url,
      source: "batch-vision",
      sector: site.sector,
      country: site.country,
      style_tags: data.style_tags ?? [site.style],
      palette: data.palette,
      typography: data.typography,
      layout: data.layout,
      what_makes_it_exceptional: data.what_makes_it_exceptional,
      reusable_patterns: data.reusable_patterns ?? [],
      level: data.level ?? "good",
      best_for: data.best_for ?? [],
      date_observed: new Date().toISOString().split("T")[0],
    });
    saveKB(kb);
    added++;
    console.log(`  [batch-${batchId}] ✓ ${data.title} [${data.level}] (${kb.sites.length} total)`);
  }

  return { added, skipped };
}

// ─── Run principal — 4 batches en parallèle ──────────────────────────────────

export async function runBatchScout(apiKey) {
  const client = new Anthropic({ apiKey });
  const systemPrompt = loadAgentPrompt();
  const total = SITES_TO_ANALYZE.length;

  // Filtrer les sites déjà dans la base
  const kb = loadKB();
  const existingUrls = new Set(kb.sites.map((s) => s.url));
  const toAnalyze = SITES_TO_ANALYZE.filter((s) => !existingUrls.has(s.url));

  console.log(`[design-scout-batch] ${total} sites curatés`);
  console.log(`[design-scout-batch] ${kb.total_sites} déjà dans la base`);
  console.log(`[design-scout-batch] ${toAnalyze.length} à analyser`);
  // 10 sites à la fois, séquentiellement — safe sur rate limit
  const CHUNK = 10;
  const batches = [];
  for (let i = 0; i < toAnalyze.length; i += CHUNK) {
    batches.push(toAnalyze.slice(i, i + CHUNK));
  }

  console.log(`[design-scout-batch] ${batches.length} groupes de ${CHUNK} sites — séquentiel`);
  const start = Date.now();

  const results = [];
  for (let i = 0; i < batches.length; i++) {
    console.log(`\n[design-scout-batch] Groupe ${i + 1}/${batches.length} — ${batches[i].length} sites`);
    const r = await analyzeBatch(client, batches[i], i + 1, systemPrompt);
    results.push(r);
    if (i < batches.length - 1) {
      console.log(`[design-scout-batch] ⏸  Pause 30s avant groupe ${i + 2}...`);
      await sleep(30000);
    }
  }

  const totalAdded = results.reduce((sum, r) => sum + r.added, 0);
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
  const duration = Math.round((Date.now() - start) / 1000);
  const finalKb = loadKB();

  console.log(`\n[design-scout-batch] ═══════════════════════`);
  console.log(`[design-scout-batch] ✓ Session intensive terminée`);
  console.log(`[design-scout-batch] Durée : ${duration}s`);
  console.log(`[design-scout-batch] Ajoutés : ${totalAdded}`);
  console.log(`[design-scout-batch] Skippés : ${totalSkipped}`);
  console.log(`[design-scout-batch] Base totale : ${finalKb.total_sites} sites`);

  // Sauvegarder rapport
  mkdirSync(REPORTS_DIR, { recursive: true });
  const report = `# Session Intensive Design Scout — ${new Date().toISOString().split("T")[0]}

## Résultats
- Sites analysés : ${toAnalyze.length}
- Ajoutés à la base : ${totalAdded}
- Skippés (inaccessibles/génériques) : ${totalSkipped}
- Durée : ${duration}s
- Base totale : ${finalKb.total_sites} sites

## Distribution par secteur
${JSON.stringify(finalKb.sites.reduce((acc, s) => { acc[s.sector] = (acc[s.sector] ?? 0) + 1; return acc; }, {}), null, 2)}

## Distribution par style
${JSON.stringify(finalKb.sites.flatMap((s) => s.style_tags).reduce((acc, t) => { acc[t] = (acc[t] ?? 0) + 1; return acc; }, {}), null, 2)}
`;
  writeFileSync(resolve(REPORTS_DIR, `batch-${new Date().toISOString().split("T")[0]}.md`), report);

  if (_browser) await _browser.close().catch(() => {});

  return { total_added: totalAdded, total_sites: finalKb.total_sites, duration };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1].includes("design-scout-batch")) {
  // Charger env
  try {
    const env = readFileSync(resolve(__dirname, "../../telegram-bot/.env"), "utf-8");
    for (const line of env.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const [k, ...r] = t.split("=");
      if (k?.trim()) process.env[k.trim()] = r.join("=").trim();
    }
  } catch {}

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY manquante");
    process.exit(1);
  }

  runBatchScout(process.env.ANTHROPIC_API_KEY)
    .then((r) => { console.log("DONE", r); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
