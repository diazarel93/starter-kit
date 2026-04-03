#!/usr/bin/env node
/**
 * design-scout capture.js — Screenshots automatiques des sites analysés
 *
 * Usage :
 *   node tools/design-scout/capture.js <url> <style> <id>
 *   node tools/design-scout/capture.js --batch     ← capture toute la knowledge-base
 *   node tools/design-scout/capture.js --sources   ← capture les pages d'accueil des sources
 *
 * Output : tools/design-scout/captures/<style>/<id>-full.png
 *                                                   <id>-viewport.png
 *                                                   <id>-mobile.png
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";

const ROOT = resolve(import.meta.dirname);
const CAPTURES_DIR = resolve(ROOT, "captures");
const KB_PATH = resolve(ROOT, "knowledge-base.json");

// ─── Styles → dossiers ────────────────────────────────────────────────────────

const STYLE_DIRS = {
  "cinema-dark": "cinema-dark",
  "saas-minimal": "saas-minimal",
  "editorial-bold": "editorial-bold",
  "luxury-white": "luxury-white",
  "playful-color": "playful-color",
  "neo-brutal": "neo-brutal",
  "glassmorphism": "glassmorphism",
  "bento-grid": "bento-grid",
  "ai-generative": "ai-generative",
  "japonais-minimal": "japonais-minimal",
  "sources": "sources",
  "reference": "reference",
};

// ─── Sources de référence à capturer ─────────────────────────────────────────

const REFERENCE_SOURCES = [
  // Cinema Dark
  { url: "https://a24films.com", style: "cinema-dark", id: "a24-films" },
  { url: "https://mubi.com", style: "cinema-dark", id: "mubi" },
  { url: "https://letterboxd.com", style: "cinema-dark", id: "letterboxd" },
  // SaaS Minimal
  { url: "https://linear.app", style: "saas-minimal", id: "linear" },
  { url: "https://vercel.com", style: "saas-minimal", id: "vercel" },
  { url: "https://raycast.com", style: "saas-minimal", id: "raycast" },
  // Editorial Bold
  { url: "https://www.pentagram.com", style: "editorial-bold", id: "pentagram" },
  { url: "https://www.wearecollins.com", style: "editorial-bold", id: "collins" },
  { url: "https://itsnicethat.com", style: "editorial-bold", id: "itsnicethat" },
  // Luxury White
  { url: "https://www.aesop.com", style: "luxury-white", id: "aesop" },
  { url: "https://www.byredo.com", style: "luxury-white", id: "byredo" },
  // Playful Color
  { url: "https://www.duolingo.com", style: "playful-color", id: "duolingo" },
  // Neo-Brutal
  { url: "https://gumroad.com", style: "neo-brutal", id: "gumroad" },
  { url: "https://beehiiv.com", style: "neo-brutal", id: "beehiiv" },
  // Sources de veille
  { url: "https://www.awwwards.com/websites/sites_awarded/", style: "sources", id: "awwwards" },
  { url: "https://www.lapa.ninja", style: "sources", id: "lapa-ninja" },
  { url: "https://land-book.com", style: "sources", id: "land-book" },
];

// ─── Fonction capture ─────────────────────────────────────────────────────────

async function captureUrl(browser, { url, style, id }) {
  const styleDir = STYLE_DIRS[style] ?? "other";
  const outDir = resolve(CAPTURES_DIR, styleDir);
  mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage();

  try {
    console.log(`[capture] → ${id} (${url})`);

    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000); // laisse le JS/animations se charger

    // Screenshot viewport (above the fold)
    await page.screenshot({
      path: resolve(outDir, `${id}-viewport.png`),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    console.log(`  ✓ viewport: ${id}-viewport.png`);

    // Screenshot full page
    await page.screenshot({
      path: resolve(outDir, `${id}-full.png`),
      fullPage: true,
    });
    console.log(`  ✓ full: ${id}-full.png`);

    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: resolve(outDir, `${id}-mobile.png`),
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
    console.log(`  ✓ mobile: ${id}-mobile.png`);

    // Mettre à jour la knowledge-base avec le chemin des captures
    updateKBCaptures(id, {
      viewport: `captures/${styleDir}/${id}-viewport.png`,
      full: `captures/${styleDir}/${id}-full.png`,
      mobile: `captures/${styleDir}/${id}-mobile.png`,
      captured_at: new Date().toISOString().split("T")[0],
    });

  } catch (err) {
    console.error(`  ✗ Erreur sur ${url}: ${err.message}`);
  } finally {
    await page.close();
  }
}

// ─── Mettre à jour les captures dans la KB ────────────────────────────────────

function updateKBCaptures(id, captures) {
  if (!existsSync(KB_PATH)) return;
  const kb = JSON.parse(readFileSync(KB_PATH, "utf-8"));
  const site = kb.sites.find((s) => s.id === id);
  if (site) {
    site.captures = captures;
    writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
  }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const browser = await chromium.launch({ headless: true });

  try {
    if (args[0] === "--sources") {
      // Capture toutes les sources de référence
      console.log(`[design-scout] Capture de ${REFERENCE_SOURCES.length} sources de référence...`);
      for (const source of REFERENCE_SOURCES) {
        await captureUrl(browser, source);
      }
    } else if (args[0] === "--batch") {
      // Capture tous les sites de la knowledge-base
      if (!existsSync(KB_PATH)) {
        console.log("[design-scout] Knowledge base vide — rien à capturer");
        return;
      }
      const kb = JSON.parse(readFileSync(KB_PATH, "utf-8"));
      const toCapture = kb.sites.filter((s) => s.url !== "internal" && !s.captures);
      console.log(`[design-scout] ${toCapture.length} sites sans capture...`);
      for (const site of toCapture) {
        const style = site.style_tags[0] ?? "reference";
        await captureUrl(browser, { url: site.url, style, id: site.id });
      }
    } else if (args[0] && args[1] && args[2]) {
      // Capture URL spécifique
      const [url, style, id] = args;
      await captureUrl(browser, { url, style, id });
    } else {
      console.log(`
Design Scout — Capture automatique

Usage :
  node capture.js <url> <style> <id>
    → Capture un site spécifique

  node capture.js --sources
    → Capture toutes les sources de référence (~20 sites)

  node capture.js --batch
    → Capture les sites non encore capturés de la knowledge-base

Styles disponibles :
  cinema-dark | saas-minimal | editorial-bold | luxury-white
  playful-color | neo-brutal | glassmorphism | bento-grid
  ai-generative | japonais-minimal | sources | reference

Exemple :
  node capture.js https://a24films.com cinema-dark a24-films
      `);
    }
  } finally {
    await browser.close();
    console.log("[design-scout] Capture terminée.");
  }
}

main().catch(console.error);
