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
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../captures/visual-analysis");
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

async function newPage(browser, mobile = false, stealth = false) {
  const page = await browser.newPage();
  await page.setViewportSize(mobile ? MOBILE : DESKTOP);
  const headers = {
    "User-Agent": mobile ? MOBILE_UA : DESKTOP_UA,
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8",
  };
  if (stealth) {
    Object.assign(headers, {
      "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": mobile ? "?1" : "?0",
      "sec-ch-ua-platform": mobile ? '"iOS"' : '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    });
  }
  await page.setExtraHTTPHeaders(headers);
  return page;
}

async function goto(page, url, slow = false) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: slow ? 50000 : 35000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: slow ? 35000 : 25000 }); } catch {}
  }
  // Attendre que JS + fonts soient chargés
  try { await page.waitForTimeout(slow ? 7000 : 3500); } catch {}
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
    "Allow All Cookies", "Allow all cookies",
    "I agree", "I Accept", "I accept", "Agree", "Accept", "Got it", "OK", "Okay", "Sure",
    "J'accepte", "Accepter", "Accepter les cookies", "Accepter tous les cookies",
    "Accepter et continuer", "Accepter et fermer",
    "Consent and continue", "Accept and continue",
    "Autoriser tous les cookies", "Autoriser", "Tout autoriser",
    "OK pour moi", "C'est OK pour moi", "C'est ok", "Tout accepter",
    "Akkoord", "Accepteer alle cookies",
    "Alle akzeptieren", "Zustimmen", "Einverstanden",
    // Cookiebot spécifique (Harry's, fintech...)
    "Allow all cookies", "Tillad alle cookies",
    // Shiseido / modales pays
    "Access the website", "ACCESS THE WEBSITE", "Continue to site",
    // Country redirect — continuer sans changer
    "Continue to IT", "Continue to FR", "Continue to DE", "Continue to US",
    "Continue to GB", "Stay on this site", "Continue anyway",
    // Age gate — après cookie
    "YES", "Yes", "OUI", "Oui",
    "Yes, I am", "Yes, I'm", "I'm 18+", "I am 18",
    "Enter", "Enter Site", "Enter the site",
    "I am of legal age", "Confirm my age",
    // Fermetures newsletter / promo
    "No thanks", "No, thanks", "Non merci", "Close", "Fermer", "Dismiss",
    "Not now", "Maybe later", "I'll Pass", "I'll pass", "Skip",
    "×", "✕", "✖", "✗",
    // Coréen (Innisfree, etc.)
    "오늘 그만 보기", "닫기",
  ];

  for (const txt of clickTexts) {
    try {
      const el = page.getByRole("button", { name: txt, exact: true }).first();
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ force: true });
        await page.waitForTimeout(700);
        continue;
      }
    } catch {}
    try {
      const el = page.locator(`text="${txt}"`).first();
      if (await el.isVisible({ timeout: 300 })) {
        await el.click({ force: true });
        await page.waitForTimeout(700);
      }
    } catch {}
  }

  // 2. Sélecteurs CSS connus (onetrust, cc-cookie, Cookiebot, Shopify...)
  const cssSelectors = [
    // OneTrust
    "#onetrust-accept-btn-handler",
    // cc-cookie
    ".cc-dismiss", ".cc-allow", ".cc-btn.cc-allow",
    // Cookiebot (Harry's, etc.)
    "#CybotCookiebotDialogBodyButtonAccept",
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
    ".CybotCookiebotDialogBodyButton[id*='Allow']",
    // Axeptio
    "#axeptio_btn_acceptAll", ".axeptio_btn_accept",
    // Didomi
    "#didomi-notice-agree-button",
    // TrustArc
    ".truste_popframe button[id*='accept']",
    // Usercentrics
    "[data-testid='uc-accept-all-button']",
    // Data attr génériques
    "[data-testid='cookie-accept']",
    "[data-action='accept-all']",
    "button[class*='AcceptAll']", "button[class*='accept-all']",
    "button[class*='acceptAll']", "button[class*='accept_all']",
    "[id*='accept'][id*='cookie']",
    // Ketch consent (Olaplex, etc.)
    "[data-tid='banner-accept']", "[data-tid='accept']",
    "button[class*='ketch']", "[class*='ketch'] button[class*='accept']",
    // Fermetures génériques (aria-label)
    "button[aria-label='Close']", "button[aria-label='close']",
    "button[aria-label='Dismiss']", "button[aria-label='dismiss']",
    "button[aria-label='×']", "button[aria-label='✕']",
    "button[aria-label*='close' i]", "button[aria-label*='fermer' i]",
    "button[aria-label*='dismiss' i]",
    // Modales / popups
    "[data-dismiss='modal']", ".modal__close", ".popup__close",
    "button[class*='close']", "button[class*='Close']",
    "button[class*='modal-close']", "button[class*='popup-close']",
    "button[class*='newsletter-close']", "button[class*='dialog-close']",
    // Drawers / side panels (Laneige, etc.)
    "[class*='drawer'] button[class*='close']",
    "[class*='panel'] button[class*='close']",
    "[class*='slideout'] button[class*='close']",
    "button[class*='drawer-close']", "button[class*='panel-close']",
    // Newsletter/SMS popup (Klaviyo, Attentive, Postscript)
    "[data-attentive='close']", ".attentive-creative__close",
    "#attentive_close", "#attentive_overlay",
    "[class*='klaviyo'] [class*='close']", ".klaviyo-close-form",
    "[id*='popup'] button[class*='close']", "[class*='popup'] button[class*='close']",
    // Shopify age verifier
    ".age-verifier__yes", "button[data-age-verify='yes']",
    // Fenty Beauty "I'll Pass" type
    "button[class*='decline']", "button[class*='skip']", "button[class*='no-thanks']",
    // Dialogues natifs HTML
    "dialog button[class*='close']", "dialog button[aria-label*='close' i]",
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
        /^(accept all|accept all cookies|accepter tous|autoriser tous|tout accepter|allow all|allow all cookies|i agree|got it|okay|j'accepte|akkoord)$/i,
        /^(yes|oui|enter|enter site|yes[,\s]+i am|i'?m 18|confirm age|access the website)$/i,
        /^(close|fermer|dismiss|no thanks|no, thanks|non merci|i'll pass|skip|닫기|오늘 그만 보기)$/i,
        /^(×|✕|✖|✗)$/,
      ];
      const els = document.querySelectorAll('button, a[role="button"], input[type="submit"], [role="button"], [class*="close-btn"]');
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

  // 4. Supprimer les overlays résiduels via JS (force brute si tout le reste échoue)
  try {
    await page.evaluate(() => {
      const selectors = [
        "[class*='age-gate']", "[id*='age-gate']",
        "[class*='age-verification']", "[id*='age-verification']",
        "[class*='ageVerif']", "[class*='AgeVerif']",
        "[class*='cookie-banner']", "[id*='cookie-banner']",
        "[class*='CookieBanner']", "[class*='consent-overlay']",
        "[class*='cookie-consent']", "[id*='cookie-consent']",
        "[class*='gdpr']", "[id*='gdpr']",
        "[class*='newsletter-popup']", "[id*='newsletter-popup']",
        "[class*='email-popup']", "[class*='promo-popup']",
        // Cookiebot wrapper
        "#CybotCookiebotDialog", "#cookiebanner",
        // Country redirect modals
        "[class*='country-redirect']", "[class*='CountryRedirect']",
        "[class*='geolocation-modal']", "[class*='region-selector']",
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const s = window.getComputedStyle(el);
          if (s.position === "fixed" || s.position === "absolute" || s.zIndex > 100) el.remove();
        });
      });
      // Supprimer backdrop / overlay générique
      document.querySelectorAll('[class*="overlay"], [class*="backdrop"], [class*="mask"]').forEach(el => {
        const s = window.getComputedStyle(el);
        if (s.position === "fixed" && parseFloat(s.opacity) > 0) el.remove();
      });
      // Dégeler le scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.documentElement.style.position = "";
    });
    await page.waitForTimeout(300);
  } catch {}

  // 5. ESC de secours
  try { await page.keyboard.press("Escape"); } catch {}
  await page.waitForTimeout(300);
}

// ─── CAPTURE D'UNE PAGE ───────────────────────────────────────────────────────

async function capturePage(browser, url, prefix, dir, stealth = false) {
  const captures = {};

  // ── Desktop ────────────────────────────────────────────────────────────────
  const dp = await newPage(browser, false, stealth);
  try {
    await goto(dp, url, stealth);

    // 3 passes de killPopups : cookie → newsletter → résidus
    await killPopups(dp);
    await dp.waitForTimeout(800);
    await killPopups(dp); // 2ème passe — newsletter peut apparaître après cookie accept
    await dp.waitForTimeout(500);
    await killPopups(dp); // 3ème passe — résidus

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
  const mp = await newPage(browser, true, stealth);
  try {
    await goto(mp, url, stealth);
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

function isBlankHero(dir) {
  const hero = resolve(dir, "00-main-hero.jpg");
  if (!existsSync(hero)) return true;
  return statSync(hero).size < 30000; // < 30KB = page blanche
}

async function captureWebsite(url) {
  const s = slug(url);
  const dir = resolve(OUT_DIR, s);

  // Skip si déjà capturé avec assez d'images (> 5) et hero non blanc
  if (existsSync(dir)) {
    const imgs = readdirSync(dir).filter(f => f.endsWith(".jpg")).length;
    if (imgs > 5 && !isBlankHero(dir)) {
      console.log(`  ⏭  Déjà capturé (${imgs} imgs) : ${s}`);
      return;
    }
  }
  mkdirSync(dir, { recursive: true });

  console.log(`\n📸 ${url}`);

  // ── Tentative 1 : headless standard ───────────────────────────────────────
  const browser = await chromium.launch({ headless: true });
  const manifest = { url, slug: s, captured_at: new Date().toISOString(), pages: {} };

  try {
    console.log("  → main page...");
    manifest.pages.main = await capturePage(browser, url, "00-main", dir);

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
  } finally { await browser.close(); }

  // ── Tentative 2 : headed + stealth si hero blanc ───────────────────────────
  if (isBlankHero(dir)) {
    console.log(`  ⚠️  Hero blanc — fallback headed+stealth...`);
    const browser2 = await chromium.launch({
      headless: false,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-web-security",
      ],
    });
    try {
      manifest.fallback = true;
      manifest.pages.main = await capturePage(browser2, url, "00-main", dir, true);
    } catch (e) {
      console.log(`    ✗ Fallback erreur : ${e.message}`);
    } finally {
      try { await browser2.close(); } catch {}
    }
    if (!isBlankHero(dir)) {
      console.log(`  ✅ Fallback OK`);
    } else {
      console.log(`  ✗ Toujours blanc (Cloudflare dur — site ignoré)`);
      manifest.blocked = true;
    }
  }

  const imgTotal = readdirSync(dir).filter(f => f.endsWith(".jpg")).length;
  console.log(`  ✅ ${imgTotal} captures → ${s}`);
  writeFileSync(resolve(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
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
