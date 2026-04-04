/**
 * capture-3-pages.mjs — Capture les 3 variantes A/B/C de design-choices.html
 * Usage : node capture-3-pages.mjs
 */
import { chromium } from '/Users/diazarel/starter-kit/node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(__dirname, 'screenshots');
mkdirSync(DIR, { recursive: true });

const FILE = `file://${resolve(__dirname, 'design-choices.html')}`;

const browser = await chromium.launch({ headless: true });

async function captureVariant(letter, label) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(FILE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Click the right variant button
  await page.click(`button[onclick*="show('${letter.toLowerCase()}"]`);
  await page.waitForTimeout(600);

  const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 500;

  // Scroll through to trigger IntersectionObserver animations
  for (let y = 0; y < pageH; y += step) {
    await page.evaluate(s => window.scrollTo({ top: s, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);

  // Full page
  const fullPath = resolve(DIR, `${letter.toLowerCase()}-full.jpg`);
  await page.screenshot({ path: fullPath, type: 'jpeg', quality: 85, fullPage: true });
  console.log(`✓ ${label} full page → ${fullPath}`);

  // Hero
  const heroPath = resolve(DIR, `${letter.toLowerCase()}-hero.jpg`);
  await page.screenshot({ path: heroPath, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`✓ ${label} hero`);

  // Mid sections
  for (let i = 1; i <= 3; i++) {
    const y = Math.floor(pageH * (i / 4));
    await page.evaluate(s => window.scrollTo({ top: s, behavior: 'instant' }), y);
    await page.waitForTimeout(300);
    const sPath = resolve(DIR, `${letter.toLowerCase()}-section${i}.jpg`);
    await page.screenshot({ path: sPath, type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log(`✓ ${label} section ${i}`);
  }

  // Footer
  await page.evaluate(h => window.scrollTo({ top: h, behavior: 'instant' }), pageH);
  await page.waitForTimeout(300);
  const footerPath = resolve(DIR, `${letter.toLowerCase()}-footer.jpg`);
  await page.screenshot({ path: footerPath, type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`✓ ${label} footer`);

  await page.close();
}

try {
  await captureVariant('A', 'Béton Brut');
  await captureVariant('B', 'Pellicule Vivante');
  await captureVariant('C', 'Cockpit Cinéma');
  console.log(`\n✅ Toutes les captures dans : ${DIR}`);
} finally {
  await browser.close();
}
