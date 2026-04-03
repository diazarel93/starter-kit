/**
 * visual-analyzer.mjs — Capture Playwright complète pour analyse DA
 *
 * Captures par site :
 *   - hero desktop (1440×900)
 *   - full page scrollée desktop
 *   - sections 25% / 50% / 75% / footer
 *   - mobile hero (390×844)
 *   - mobile full page
 *   - sous-pages prioritaires (About, Work, Studio...) avec hero + mobile
 *
 * Gestion des blocages :
 *   - Cookie banners (5 stratégies combinées)
 *   - Age gates (YES / OUI / Enter)
 *   - Modales newsletters
 *   - Overlays JS custom
 *
 * Usage :
 *   node visual-analyzer.mjs <url>
 *   echo '["url1","url2"]' | node visual-analyzer.mjs --batch
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "captures/visual-analysis");
mkdirSync(OUT_DIR, { recursive: true });

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 390,  height: 844 };
const DESKTOP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MOBILE_UA  = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slug(url) {
  return url.replace(/https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]/gi, "-").slice(0, 50).replace(/-+$/, "");
}

async function newPage(browser, mobile = false) {
  const page = await browser.newPage();
  await page.setViewportSize(mobile ? MOBILE : DESKTOP);
  await page.setExtraHTTPHeaders({
    "User-Agent": mobile ? MOBILE_UA : DESKTOP_UA,
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8",
  });
  return page;
}

async function goto(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 35000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 }); } catch {}
  }
  // Attendre que JS + fonts soient chargés
  await page.waitForTimeout(3500);
}

async function scrollFull(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(h, 10000); y += 400) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
}

async function shot(page, path, opts = {}) {
  try {
    await page.screenshot({ type: "jpeg", quality: 85, ...opts, path });
    return true;
  } catch { return false; }
}

// ─── KILL POPUPS — 5 stratégies dans l'ordre ─────────────────────────────────

async function killPopups(page) {

  // 1. Playwright locator text (le plus fiable — cherche dans tout le DOM rendu)
  const clickTexts = [
    // Cookies — priorité absolue
    "Accept All", "Accept all", "Accept All Cookies", "Accept all cookies",
    "Accept selected cookies", "Accepter tout", "Tout accepter",
    "Alle akzeptieren", "Alle Cookies akzeptieren",
    "Allow all", "Allow All", "Allow cookies", "Allow Cookies", "Allow all cookies",
    "I agree", "Got it", "OK", "Okay", "Sure",
    "J'accepte", "Accepter", "Accepter les cookies", "Accepter tous les cookies",
    "Alle akzeptieren", "Zustimmen",
    // Age gate — après cookie
    "YES", "Yes", "OUI", "Oui",
    "Yes, I am", "Yes, I'm", "I'm 18+", "I am 18",
    "Enter", "Enter Site", "Enter the site",
    "I am of legal age", "Confirm my age",
    // Fermetures
    "No thanks", "Non merci", "Close", "Fermer", "Dismiss",
    "Not now", "Maybe later", "×", "✕", "✖",
  ];

  for (const txt of clickTexts) {
    try {
      // getByText est plus précis que text= (correspondance exacte)
      const el = page.getByRole("button", { name: txt, exact: true }).first();
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ force: true });
        await page.waitForTimeout(700);
        continue;
      }
    } catch {}
    try {
      // Fallback : locator text
      const el = page.locator(`text="${txt}"`).first();
      if (await el.isVisible({ timeout: 300 })) {
        await el.click({ force: true });
        await page.waitForTimeout(700);
      }
    } catch {}
  }

  // 2. Sélecteurs CSS connus (onetrust, cc-cookie, Shopify age-gate...)
  const cssSelectors = [
    "#onetrust-accept-btn-handler",
    ".cc-dismiss", ".cc-allow", ".cc-btn.cc-allow",
    "[data-testid='cookie-accept']",
    "button[class*='AcceptAll']", "button[class*='accept-all']",
    "button[class*='acceptAll']", "button[class*='accept_all']",
    "[id*='accept'][id*='cookie']",
    // Fermetures modales (✕, ×, close button)
    "button[aria-label='Close']", "button[aria-label='close']",
    "button[aria-label='Dismiss']", "button[aria-label='dismiss']",
    "button[aria-label='×']", "button[aria-label='✕']",
    "[data-dismiss='modal']", ".modal__close", ".popup__close",
    "button[class*='close']", "button[class*='Close']",
    "button[class*='modal-close']", "button[class*='popup-close']",
    "button[class*='newsletter-close']", "button[class*='dialog-close']",
    // Shopify age verifier
    ".age-verifier__yes", "button[data-age-verify='yes']",
  ];
  for (const sel of cssSelectors) {
    try {
      const el = await page.$(sel);
      if (el && await el.isVisible()) {
        await el.click({ force: true });
        await page.waitForTimeout(600);
      }
    } catch {}
  }

  // 3. Scan JS : chercher tous boutons/liens visibles avec texte correspondant
  try {
    const clicked = await page.evaluate(() => {
      const hits = [];
      const patterns = [
        /^(accept all|accept cookies|tout accepter|allow all|i agree|got it|okay)$/i,
        /^(yes|oui|enter|enter site|yes[,\s]+i am|i'?m 18|confirm age)$/i,
        /^(close|fermer|dismiss|no thanks|non merci)$/i,
      ];
      const els = document.querySelectorAll('button, a[role="button"], input[type="submit"], [role="button"]');
      for (const el of els) {
        const txt = (el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
        if (patterns.some(p => p.test(txt))) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            el.click();
            hits.push(txt);
          }
        }
      }
      return hits;
    });
    if (clicked.length) await page.waitForTimeout(700);
  } catch {}

  // 4. Supprimer les overlays résiduels via JS
  try {
    await page.evaluate(() => {
      const selectors = [
        "[class*='age-gate']", "[id*='age-gate']",
        "[class*='age-verification']", "[id*='age-verification']",
        "[class*='ageVerif']", "[class*='AgeVerif']",
        "[class*='cookie-banner']", "[id*='cookie-banner']",
        "[class*='CookieBanner']", "[class*='consent-overlay']",
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const s = window.getComputedStyle(el);
          if (s.position === "fixed" || s.position === "absolute") el.remove();
        });
      });
      // Dégeler le scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
    });
    await page.waitForTimeout(300);
  } catch {}

  // 5. ESC de secours
  try { await page.keyboard.press("Escape"); } catch {}
  await page.waitForTimeout(300);
}

// ─── CAPTURE D'UNE PAGE ───────────────────────────────────────────────────────

async function capturePage(browser, url, prefix, dir) {
  const captures = {};

  // ── Desktop ────────────────────────────────────────────────────────────────
  const dp = await newPage(browser, false);
  try {
    await goto(dp, url);

    // 2 passes de killPopups : avant scroll + après scroll
    await killPopups(dp);
    await dp.waitForTimeout(500);
    await killPopups(dp); // 2ème passe — age gate peut apparaître après cookie accept

    await scrollFull(dp); // déclenche lazy loads

    // Hero
    const heroPath = resolve(dir, `${prefix}-hero.jpg`);
    await shot(dp, heroPath, { clip: { x: 0, y: 0, width: DESKTOP.width, height: DESKTOP.height } });
    captures.hero = heroPath;

    // Full page
    const fullPath = resolve(dir, `${prefix}-full.jpg`);
    await shot(dp, fullPath, { fullPage: true, quality: 72 });
    captures.full = fullPath;

    // Sections intermédiaires
    const pageH = await dp.evaluate(() => document.documentElement.scrollHeight);
    for (const [i, r] of [[2, 0.25], [3, 0.5], [4, 0.75]]) {
      await dp.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), Math.floor(pageH * r));
      await dp.waitForTimeout(350);
      const sp = resolve(dir, `${prefix}-s${i}.jpg`);
      await shot(dp, sp, { clip: { x: 0, y: 0, width: DESKTOP.width, height: DESKTOP.height } });
      captures[`section${i}`] = sp;
    }

    // Footer
    await dp.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await dp.waitForTimeout(350);
    const footerPath = resolve(dir, `${prefix}-footer.jpg`);
    await shot(dp, footerPath, { clip: { x: 0, y: 0, width: DESKTOP.width, height: DESKTOP.height } });
    captures.footer = footerPath;

  } finally { await dp.close(); }

  // ── Mobile ─────────────────────────────────────────────────────────────────
  const mp = await newPage(browser, true);
  try {
    await goto(mp, url);
    await killPopups(mp);
    await mp.waitForTimeout(400);
    await killPopups(mp);

    // Mobile hero
    const mhPath = resolve(dir, `${prefix}-mobile.jpg`);
    await shot(mp, mhPath, { clip: { x: 0, y: 0, width: MOBILE.width, height: MOBILE.height } });
    captures.mobile = mhPath;

    // Mobile full
    await scrollFull(mp);
    const mfPath = resolve(dir, `${prefix}-mobile-full.jpg`);
    await shot(mp, mfPath, { fullPage: true, quality: 70 });
    captures.mobile_full = mfPath;

  } finally { await mp.close(); }

  return captures;
}

// ─── SOUS-PAGES ───────────────────────────────────────────────────────────────

async function getSubPages(browser, url, max = 3) {
  const base = new URL(url).origin;
  const p = await newPage(browser, false);
  try {
    await goto(p, url);
    const links = await p.evaluate(base => [...new Set(
      Array.from(document.querySelectorAll("a[href]"))
        .map(a => a.href)
        .filter(h => h.startsWith(base) && h !== base && !h.includes("#") && !/\.(pdf|zip|jpg|png|gif)$/i.test(h))
    )], base);
    const priority = links.filter(l => /about|work|studio|collection|shop|project|service|portfolio|case/i.test(l));
    return [...priority, ...links.filter(l => !priority.includes(l))].slice(0, max);
  } finally { await p.close(); }
}

// ─── CAPTURE COMPLÈTE D'UN SITE ──────────────────────────────────────────────

async function captureWebsite(url) {
  const s = slug(url);
  const dir = resolve(OUT_DIR, s);

  // Skip si déjà capturé avec assez d'images (> 5)
  if (existsSync(dir)) {
    const imgs = readdirSync(dir).filter(f => f.endsWith(".jpg")).length;
    if (imgs > 5) {
      console.log(`  ⏭  Déjà capturé (${imgs} imgs) : ${s}`);
      return;
    }
  }
  mkdirSync(dir, { recursive: true });

  console.log(`\n📸 ${url}`);
  const browser = await chromium.launch({ headless: true });
  const manifest = { url, slug: s, captured_at: new Date().toISOString(), pages: {} };

  try {
    // Page principale
    console.log("  → main page...");
    manifest.pages.main = await capturePage(browser, url, "00-main", dir);

    // Sous-pages
    const subs = await getSubPages(browser, url);
    console.log(`  → ${subs.length} sous-pages`);
    for (let i = 0; i < subs.length; i++) {
      const su = subs[i];
      const sp = su.replace(new URL(url).origin, "").replace(/[^a-z0-9]/gi, "-").slice(1, 20) || `p${i+1}`;
      try {
        console.log(`  → ${su}`);
        manifest.pages[`sub${i+1}`] = await capturePage(browser, su, `0${i+1}-${sp}`, dir);
        manifest.pages[`sub${i+1}`]._url = su;
      } catch (e) { console.log(`    ✗ ${e.message}`); }
    }

    const imgTotal = readdirSync(dir).filter(f => f.endsWith(".jpg")).length;
    console.log(`  ✅ ${imgTotal} captures → ${s}`);
    writeFileSync(resolve(dir, "manifest.json"), JSON.stringify(manifest, null, 2));

  } finally { await browser.close(); }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const url = args.find(a => a.startsWith("http"));
const batchMode = args.includes("--batch");

if (batchMode) {
  let raw = "";
  process.stdin.on("data", c => raw += c);
  process.stdin.on("end", async () => {
    const urls = JSON.parse(raw);
    let done = 0;
    for (const u of urls) {
      try { await captureWebsite(u); done++; }
      catch (e) { console.error(`  ✗ ${u} : ${e.message}`); }
    }
    console.log(`\n✅ ${done}/${urls.length} sites capturés`);
  });
} else if (url) {
  await captureWebsite(url);
} else {
  console.log("Usage :\n  node visual-analyzer.mjs <url>\n  echo '[\"url1\"]' | node visual-analyzer.mjs --batch");
}
