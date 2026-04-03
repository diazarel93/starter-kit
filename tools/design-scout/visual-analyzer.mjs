/**
 * visual-analyzer.mjs — Capture complète + analyse DA via Claude Code vision
 *
 * Pipeline :
 *   1. Playwright → hero + sections + footer + mobile + sous-pages (screenshot.js logic)
 *   2. Claude Code lit les images → analyse DA (abonnement Max, pas API)
 *
 * Usage :
 *   node visual-analyzer.mjs <url>              → capture + manifest
 *   node visual-analyzer.mjs <url> --quick      → hero + mobile seulement (rapide)
 *   echo '["url1","url2"]' | node visual-analyzer.mjs --batch
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURES_DIR = resolve(__dirname, "captures/visual-analysis");
const KB_PATH = resolve(__dirname, "knowledge-base.json");

mkdirSync(CAPTURES_DIR, { recursive: true });

// ─── POPUP KILLING — agressif (cookie gates, age gates, modales, newsletters) ──

async function killAllPopups(page) {
  // ÉTAPE 1 — Cookie consent (sélecteurs CSS connus)
  const cookieSelectors = [
    '#onetrust-accept-btn-handler',
    '.cc-dismiss', '.cc-allow',
    '[data-testid="cookie-accept"]',
    'button[class*="cookie-accept"]',
    'button[class*="accept-all"]',
    'button[class*="acceptAll"]',
    '[data-action="accept-cookies"]',
    '[id*="accept"][id*="cookie"]',
    '[class*="consent"] button[class*="primary"]',
  ];
  for (const sel of cookieSelectors) {
    try {
      const el = await page.$(sel);
      if (el && await el.isVisible()) { await el.click(); await page.waitForTimeout(500); }
    } catch {}
  }

  // ÉTAPE 2 — Recherche par texte (cookie + age gate en 2 passes)
  // Passe 1 : cookies (Accept All, Tout accepter, J'accepte...)
  const cookieTexts = /^(accept all|accept cookies|tout accepter|j'accepte|ok|got it|i agree|alle akzeptieren|alle cookies akzeptieren|accepter tout)$/i;
  // Passe 2 : age gates (YES, Oui, Enter, I am 18+...)
  const ageGateTexts = /^(yes|oui|yes,? i am|i'?m 18|enter|enter site|j'ai \d+|i am of legal age|confirm age|yes,? i'?m)$/i;
  // Passe 3 : fermetures génériques
  const closeTexts = /^(close|fermer|dismiss|no thanks|non merci|×|✕)$/i;

  for (const pattern of [cookieTexts, ageGateTexts, closeTexts]) {
    try {
      const buttons = await page.$$('button, a[role="button"], input[type="button"], input[type="submit"]');
      for (const btn of buttons) {
        try {
          const text = (await btn.textContent() || "").trim();
          if (pattern.test(text) && await btn.isVisible()) {
            await btn.click();
            await page.waitForTimeout(600); // laisser le temps à l'age gate d'apparaître
          }
        } catch {}
      }
    } catch {}
  }

  // ÉTAPE 3 — Sélecteurs génériques fermeture modales
  const closeSelectors = [
    'button[aria-label="Close"]', 'button[aria-label="close"]',
    'button[aria-label="Dismiss"]', '[aria-label="Close dialog"]',
    '[data-dismiss="modal"]', '.modal-close', '.popup-close',
    'button[class*="close-btn"]', 'button[class*="closeBtn"]',
    'button[class*="newsletter-close"]',
  ];
  for (const sel of closeSelectors) {
    try {
      const el = await page.$(sel);
      if (el && await el.isVisible()) { await el.click(); await page.waitForTimeout(300); }
    } catch {}
  }

  // ÉTAPE 4 — Supprimer les overlays résiduels via JS (age gates Shopify, overlays custom)
  try {
    await page.evaluate(() => {
      // Supprimer les overlays fixes qui bloquent le contenu
      document.querySelectorAll('[class*="age-gate"], [id*="age-gate"], [class*="age-verification"], [class*="overlay"], [class*="modal"][style*="display: block"]').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') el.remove();
      });
      // Restaurer le scroll si bloqué par les popups
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    });
  } catch {}

  // ESC pour fermer ce qui reste
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
}

// ─── SETUP PAGE ─────────────────────────────────────────────────────────────────

async function setupPage(browser, mobile = false) {
  const page = await browser.newPage();
  if (mobile) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    });
  } else {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    });
  }
  return page;
}

// ─── GOTO avec fallback ───────────────────────────────────────────────────────

async function gotoSafe(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 }); } catch {}
  }
  await page.waitForTimeout(2500);
}

// ─── SCROLL PROGRESSIF (déclenche lazy loads) ────────────────────────────────

async function triggerLazyLoads(page) {
  const totalH = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 500;
  for (let y = 0; y < Math.min(totalH, 8000); y += step) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
}

// ─── CAPTURE UNE PAGE COMPLÈTE ───────────────────────────────────────────────

async function capturePage(browser, url, prefix, dir, quickMode = false) {
  const captures = {};
  const W = 1440, H = 900;

  // ── Desktop ────────────────────────────────────────────────────────────────
  const page = await setupPage(browser, false);
  await gotoSafe(page, url);
  await killAllPopups(page);
  await page.waitForTimeout(500);
  await killAllPopups(page); // 2ème passe
  await triggerLazyLoads(page);

  // Hero (above the fold)
  const heroPath = resolve(dir, `${prefix}-hero.jpg`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: heroPath, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: W, height: H } });
  captures.hero = heroPath;

  if (!quickMode) {
    // Full page (scroll + fullPage)
    const fullPath = resolve(dir, `${prefix}-full.jpg`);
    try {
      await page.screenshot({ path: fullPath, type: "jpeg", quality: 72, fullPage: true });
      captures.full = fullPath;
    } catch {}

    // Sections intermédiaires (25% / 50% / 75% / footer)
    const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
    for (const [i, ratio] of [[2, 0.25], [3, 0.5], [4, 0.75]]) {
      const y = Math.floor(pageH * ratio);
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
      await page.waitForTimeout(400);
      const sPath = resolve(dir, `${prefix}-s${i}.jpg`);
      await page.screenshot({ path: sPath, type: "jpeg", quality: 80, clip: { x: 0, y: 0, width: W, height: H } });
      captures[`section_${i}`] = sPath;
    }

    // Footer
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(400);
    const footerPath = resolve(dir, `${prefix}-footer.jpg`);
    await page.screenshot({ path: footerPath, type: "jpeg", quality: 80, clip: { x: 0, y: 0, width: W, height: H } });
    captures.footer = footerPath;
  }

  await page.close();

  // ── Mobile ─────────────────────────────────────────────────────────────────
  const mobilePage = await setupPage(browser, true);
  await gotoSafe(mobilePage, url);
  await killAllPopups(mobilePage);
  await mobilePage.waitForTimeout(500);
  const mobilePath = resolve(dir, `${prefix}-mobile.jpg`);
  await mobilePage.screenshot({ path: mobilePath, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: 390, height: 844 } });
  captures.mobile = mobilePath;

  if (!quickMode) {
    // Mobile full
    const mobileFullPath = resolve(dir, `${prefix}-mobile-full.jpg`);
    try {
      await triggerLazyLoads(mobilePage);
      await mobilePage.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await mobilePage.screenshot({ path: mobileFullPath, type: "jpeg", quality: 70, fullPage: true });
      captures.mobile_full = mobileFullPath;
    } catch {}
  }

  await mobilePage.close();
  return captures;
}

// ─── DISCOVER SOUS-PAGES ──────────────────────────────────────────────────────

async function discoverSubPages(browser, url, maxPages = 3) {
  const page = await setupPage(browser, false);
  await gotoSafe(page, url);
  const baseUrl = new URL(url).origin;

  const links = await page.evaluate((base) => {
    return [...new Set(
      Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.href)
        .filter(h => h.startsWith(base) && h !== base && !h.includes('#') && !h.match(/\.(pdf|png|jpg|zip|gif)$/i))
    )].slice(0, 10);
  }, baseUrl);

  await page.close();

  // Priorité : pages qui ressemblent à About, Work, Studio, Products, Collection
  const priority = links.filter(l => /about|work|studio|collection|products|shop|services|projects/i.test(l));
  const rest = links.filter(l => !priority.includes(l));
  return [...priority, ...rest].slice(0, maxPages);
}

// ─── CAPTURE COMPLÈTE D'UN SITE ──────────────────────────────────────────────

async function captureWebsite(url, quickMode = false) {
  const slug = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "-").slice(0, 50);
  const dir = resolve(CAPTURES_DIR, slug);
  mkdirSync(dir, { recursive: true });

  console.log(`\n📸 Capture : ${url}`);
  const browser = await chromium.launch({ headless: true });

  const allCaptures = {};

  try {
    // Page principale
    console.log("  → Page principale...");
    allCaptures.main = await capturePage(browser, url, "00-main", dir, quickMode);

    if (!quickMode) {
      // Sous-pages
      const subPages = await discoverSubPages(browser, url);
      console.log(`  → ${subPages.length} sous-pages trouvées`);

      for (let i = 0; i < subPages.length; i++) {
        const subUrl = subPages[i];
        const subSlug = subUrl.replace(new URL(url).origin, "").replace(/[^a-z0-9]/gi, "-").slice(1, 25) || `page-${i + 1}`;
        console.log(`  → Sous-page : ${subUrl}`);
        try {
          allCaptures[`sub_${i + 1}`] = await capturePage(browser, subUrl, `0${i + 1}-${subSlug}`, dir, true);
          allCaptures[`sub_${i + 1}`]._url = subUrl;
        } catch (e) {
          console.log(`    ✗ Erreur : ${e.message}`);
        }
      }
    }

    // Manifest pour l'agent Claude Code
    const manifest = {
      url,
      slug,
      captured_at: new Date().toISOString(),
      quick_mode: quickMode,
      captures_dir: dir,
      pages: allCaptures,
      analysis_prompt: `Tu es un directeur artistique senior. Analyse visuellement ce site (${url}).

Pour chaque image :
- hero : impression globale, palette dominante, typo visible, layout
- full : structure complète, répétitions, système de grid
- sections : cohérence entre blocs, qualité des transitions
- footer : informations présentes, typographie secondaire
- mobile : adaptation responsive, UX mobile, différences desktop/mobile
- sous-pages : cohérence du design system, variations autorisées

Réponds en JSON avec ces champs :
{
  "visual_impression": "1-2 phrases DA — impression immédiate",
  "palette_real": { "dominant": "#HEX", "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX", "background": "#HEX", "palette_mood": "..." },
  "typography_real": { "heading_style": "...", "body_style": "...", "type_hierarchy": "forte/moyenne/faible", "type_quality": "basique/professionnel/exceptionnel" },
  "composition": { "layout": "...", "whitespace": "généreux/équilibré/dense", "hero_type": "...", "scroll_pattern": "..." },
  "visual_quality": { "photography": "absente/générique/lifestyle/editorial/product", "illustration": "absente/icons/custom/editorial/3D", "animation_visible": "aucune/subtile/présente/dominante", "overall_craft": "basique/correct/soigné/exceptionnel" },
  "mobile_experience": { "adaptation": "excellente/correcte/basique/cassée", "key_differences": "..." },
  "da_verdict": { "score_visuel": 0-10, "forces": ["..."], "faiblesses": ["..."], "positionnement_reel": "...", "comparable_a": "..." },
  "what_makes_it_exceptional": "...",
  "design_lessons": ["...", "...", "..."]
}`
    };
    writeFileSync(resolve(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log(`  ✅ ${Object.keys(allCaptures).length} pages capturées → ${dir}`);

    return manifest;
  } finally {
    await browser.close();
  }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const quickMode = args.includes("--quick");
const batchMode = args.includes("--batch");
const url = args.find(a => a.startsWith("http"));

if (batchMode) {
  let input = "";
  process.stdin.on("data", chunk => input += chunk);
  process.stdin.on("end", async () => {
    const urls = JSON.parse(input);
    for (const u of urls) {
      try { await captureWebsite(u, quickMode); }
      catch (e) { console.error(`  ✗ ${u}: ${e.message}`); }
    }
    console.log("\n✅ Batch terminé. Demande à Claude Code d'analyser les images dans captures/visual-analysis/");
  });
} else if (url) {
  const manifest = await captureWebsite(url, quickMode);
  console.log(`\n→ Pour analyser, dis à Claude Code :`);
  console.log(`  "Analyse visuellement ${manifest.slug} — lis les images dans ${manifest.captures_dir}"`);
} else {
  console.log(`
visual-analyzer.mjs — Capture complète + analyse vision Max

Usage :
  node visual-analyzer.mjs <url>           # Capture complète (hero, sections, footer, mobile, sous-pages)
  node visual-analyzer.mjs <url> --quick   # Capture rapide (hero + mobile seulement)
  echo '["url1","url2"]' | node visual-analyzer.mjs --batch

Exemples :
  node visual-analyzer.mjs https://arcteryx.com
  node visual-analyzer.mjs https://linear.app --quick
  echo '["https://mikkeller.com","https://stumptowncoffee.com"]' | node visual-analyzer.mjs --batch

Étape 2 (Claude Code lit les images) :
  "Analyse visuellement arcteryx-com — lis les JPG dans captures/visual-analysis/arcteryx-com/"
`);
}
