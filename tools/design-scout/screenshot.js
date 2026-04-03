/**
 * screenshot.js — Capture Playwright : full page + sections + pages secondaires
 * Usage : node screenshot.js <url> [slug]
 * Output : JSON avec chemins vers toutes les captures
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURES_DIR = resolve(__dirname, "captures/scout-temp");

const url = process.argv[2];
if (!url) { console.error("Usage: node screenshot.js <url> [slug]"); process.exit(1); }

const slug = process.argv[3] ?? url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "-").slice(0, 40);
const dir = resolve(CAPTURES_DIR, slug);
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const captures = [];

async function setupPage(browser) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setExtraHTTPHeaders({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });
  return page;
}

async function closePopups(page) {
  const selectors = [
    'button[aria-label="Close"]', 'button[aria-label="close"]',
    'button[aria-label="Dismiss"]', '[aria-label="Close dialog"]',
    'button[class*="close"]', 'button[class*="dismiss"]',
    '#onetrust-accept-btn-handler', '.cc-dismiss',
    '[data-testid="cookie-accept"]', 'button[class*="cookie"]',
  ];
  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el && await el.isVisible()) { await el.click(); await page.waitForTimeout(300); }
    } catch {}
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}

async function capturePage(page, url, label, filename) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); } catch {}
  }
  await page.waitForTimeout(3000);
  await closePopups(page);
  await page.waitForTimeout(500);

  // 1. Full page — d'abord scroll toute la page pour déclencher les lazy loads / intersection observers
  const fullPath = resolve(dir, `${filename}-full.jpg`);
  try {
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = 600;
    for (let scrollY = 0; scrollY < totalHeight; scrollY += step) {
      await page.evaluate((y) => {
        document.documentElement.scrollTop = y;
        document.body.scrollTop = y;
        window.scrollTo({ top: y, behavior: "instant" });
      }, scrollY);
      await page.waitForTimeout(150);
    }
    // Remonter en haut avant la capture fullPage
    await page.evaluate(() => {
      document.documentElement.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: fullPath, type: "jpeg", quality: 80, fullPage: true });
    captures.push({ label: `${label} — full page`, path: fullPath });
  } catch (e) {
    console.error(`fullPage error: ${e.message}`);
  }

  // 2. Hero (viewport haut)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const heroPath = resolve(dir, `${filename}-hero.jpg`);
  await page.screenshot({ path: heroPath, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  captures.push({ label: `${label} — hero`, path: heroPath });

  // 3. Sections intermédiaires via JS scroll (bypass fixed/sticky)
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewH = 900;
  const scrollPoints = [0.25, 0.5, 0.75].map(r => Math.floor(pageHeight * r));

  for (let i = 0; i < scrollPoints.length; i++) {
    const y = scrollPoints[i];
    await page.evaluate((scrollY) => {
      // Force scroll même si overflow hidden sur body/html
      document.documentElement.scrollTop = scrollY;
      document.body.scrollTop = scrollY;
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }, y);
    await page.waitForTimeout(600);
    const sPath = resolve(dir, `${filename}-s${i + 2}.jpg`);
    await page.screenshot({ path: sPath, type: "jpeg", quality: 80, clip: { x: 0, y: 0, width: 1440, height: viewH } });
    captures.push({ label: `${label} — section ${i + 2} (scroll ${Math.round(y)}px)`, path: sPath });
  }

  // 4. Footer
  await page.evaluate(() => {
    const h = document.documentElement.scrollHeight;
    window.scrollTo({ top: h, behavior: "instant" });
    document.documentElement.scrollTop = h;
  });
  await page.waitForTimeout(500);
  const footerPath = resolve(dir, `${filename}-footer.jpg`);
  await page.screenshot({ path: footerPath, type: "jpeg", quality: 80, clip: { x: 0, y: 0, width: 1440, height: viewH } });
  captures.push({ label: `${label} — footer`, path: footerPath });

  // 5. Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await closePopups(page);
  const mobilePath = resolve(dir, `${filename}-mobile.jpg`);
  await page.screenshot({ path: mobilePath, type: "jpeg", quality: 80, clip: { x: 0, y: 0, width: 390, height: 844 } });
  captures.push({ label: `${label} — mobile`, path: mobilePath });

  return { pageHeight };
}

// ─── Pages secondaires à capturer automatiquement ────────────────────────────

async function discoverInternalLinks(page, baseUrl) {
  return await page.evaluate((base) => {
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.href)
      .filter(href => href.startsWith(base) && href !== base && !href.includes('#'))
      .filter(href => !href.match(/\.(pdf|png|jpg|zip)$/i));
    return [...new Set(links)].slice(0, 5); // max 5 pages secondaires
  }, baseUrl);
}

// ─── Exécution principale ─────────────────────────────────────────────────────

try {
  // Page principale
  const mainPage = await setupPage(browser);
  const { pageHeight } = await capturePage(mainPage, url, "Landing", "00-landing");

  // Découvrir les liens internes
  await mainPage.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  const baseUrl = new URL(url).origin;
  const internalLinks = await discoverInternalLinks(mainPage, baseUrl);
  await mainPage.close();

  console.error(`[screenshot] Pages secondaires trouvées : ${internalLinks.length}`);

  // Capturer jusqu'à 3 pages secondaires
  for (let i = 0; i < Math.min(internalLinks.length, 3); i++) {
    const subUrl = internalLinks[i];
    const subSlug = subUrl.replace(baseUrl, "").replace(/[^a-z0-9]/gi, "-").slice(0, 30) || `page-${i + 1}`;
    console.error(`[screenshot] → ${subUrl}`);
    const subPage = await setupPage(browser);
    try {
      await capturePage(subPage, subUrl, `Page: ${subSlug}`, `${String(i + 1).padStart(2, "0")}-${subSlug}`);
    } catch (e) {
      console.error(`[screenshot] Erreur sur ${subUrl}: ${e.message}`);
    }
    await subPage.close();
  }

  const result = { ok: true, url, slug, captures, pageHeight, secondary_pages: internalLinks };
  console.log(JSON.stringify(result));

} catch (e) {
  console.error(JSON.stringify({ ok: false, url, error: e.message }));
  process.exit(1);
} finally {
  await browser.close();
}
