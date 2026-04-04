#!/usr/bin/env node
/**
 * design-scout — Veille créative automatique
 * Lance manuellement : node tools/design-scout/scout.js
 * Ou via cron : 0 9 * * 1 (chaque lundi 9h)
 *
 * Ce script prépare le contexte pour l'agent design-scout
 * et peut être invoqué par brain-agent ou Claude Code directement.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const KB_PATH = resolve(import.meta.dirname, "knowledge-base.json");
const REPORTS_DIR = resolve(import.meta.dirname, "reports");

// ─── Sources de veille ────────────────────────────────────────────────────────

export const SOURCES = {
  tier1: [
    { name: "Awwwards SOTD", url: "https://www.awwwards.com/websites/sites_awarded/", focus: "excellence créative" },
    { name: "Lapa Ninja", url: "https://www.lapa.ninja/", focus: "landing pages" },
    { name: "Land-book", url: "https://land-book.com/", focus: "landings premium" },
    { name: "Fonts In Use", url: "https://fontsinuse.com/", focus: "typographie réelle" },
  ],
  tier2: [
    { name: "SaaS Pages", url: "https://saaspages.xyz/", focus: "SaaS landing" },
    { name: "Screenlane", url: "https://screenlane.com/", focus: "UI mobile" },
  ],
  tier3: [
    { name: "Pentagram", url: "https://www.pentagram.com/work", focus: "identité visuelle" },
    { name: "Collins", url: "https://www.wearecollins.com/work", focus: "branding premium" },
    { name: "Active Theory", url: "https://activetheory.net/", focus: "web interactif" },
  ],
  cinema: [
    { name: "A24", url: "https://a24films.com/", focus: "cinema premium" },
    { name: "MUBI", url: "https://mubi.com/", focus: "streaming art-house" },
    { name: "Criterion", url: "https://www.criterion.com/", focus: "cinema classique premium" },
  ],
};

// ─── Lecture base de connaissance ─────────────────────────────────────────────

export function loadKnowledgeBase() {
  if (!existsSync(KB_PATH)) return { version: "1.0", last_updated: new Date().toISOString().split("T")[0], total_sites: 0, sites: [] };
  return JSON.parse(readFileSync(KB_PATH, "utf-8"));
}

// ─── Stats rapides ─────────────────────────────────────────────────────────────

export function getStats() {
  const kb = loadKnowledgeBase();
  const bySector = kb.sites.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] ?? 0) + 1;
    return acc;
  }, {});
  const byStyle = kb.sites.flatMap((s) => s.style_tags).reduce((acc, tag) => {
    acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: kb.total_sites,
    last_updated: kb.last_updated,
    by_sector: bySector,
    top_styles: Object.entries(byStyle).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

// ─── Query pour design-generator ──────────────────────────────────────────────

export function query({ sector, style, component, limit = 5 }) {
  const kb = loadKnowledgeBase();
  return kb.sites
    .filter((s) => {
      const matchSector = !sector || s.sector === sector || s.best_for?.some((b) => b.includes(sector));
      const matchStyle = !style || s.style_tags.some((t) => t.includes(style));
      return matchSector && matchStyle;
    })
    .sort((a, b) => {
      const levelScore = { "world-reference": 3, excellent: 2, good: 1 };
      return (levelScore[b.level] ?? 0) - (levelScore[a.level] ?? 0);
    })
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      palette: s.palette,
      typography: s.typography,
      layout: s.layout,
      patterns: s.reusable_patterns,
      what_makes_it_exceptional: s.what_makes_it_exceptional,
      level: s.level,
    }));
}

// ─── Ajout d'un site analysé ──────────────────────────────────────────────────

export function addSite(siteData) {
  const kb = loadKnowledgeBase();
  const exists = kb.sites.find((s) => s.url === siteData.url);
  if (exists) {
    console.log(`[scout] Site déjà dans la base : ${siteData.url}`);
    return false;
  }
  kb.sites.push(siteData);
  kb.total_sites = kb.sites.length;
  kb.last_updated = new Date().toISOString().split("T")[0];
  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
  console.log(`[scout] ✓ Site ajouté : ${siteData.title}`);
  return true;
}

// ─── Rapport hebdomadaire ──────────────────────────────────────────────────────

export function generateWeeklyReport() {
  const now = new Date();
  const week = `${now.getFullYear()}-W${String(Math.ceil(now.getDate() / 7)).padStart(2, "0")}`;
  const stats = getStats();
  const kb = loadKnowledgeBase();
  const recentSites = kb.sites
    .filter((s) => s.date_observed >= new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0])
    .slice(0, 5);

  const report = `# Veille Design — ${week}

## Stats base de connaissance
- Total sites analysés : ${stats.total}
- Dernière mise à jour : ${stats.last_updated}
- Top secteurs : ${Object.entries(stats.by_sector).map(([k, v]) => `${k} (${v})`).join(", ")}
- Top styles : ${stats.top_styles.map(([k, v]) => `${k} (${v})`).join(", ")}

## Sites ajoutés cette semaine
${recentSites.length === 0 ? "_Aucun — lancer une session de veille_" : recentSites.map((s) => `- **${s.title}** (${s.sector}) — ${s.what_makes_it_exceptional?.slice(0, 100)}...`).join("\n")}

## Sources à scruter cette semaine
${SOURCES.tier1.map((s) => `- [${s.name}](${s.url}) — ${s.focus}`).join("\n")}

## Instructions pour l'agent design-scout
Invoquer : \`/agent design-scout\` puis dire "lance la veille hebdomadaire"
`;

  const reportPath = resolve(REPORTS_DIR, `${week}.md`);
  writeFileSync(reportPath, report);
  console.log(`[scout] Rapport généré : ${reportPath}`);
  return report;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1] === import.meta.filename) {
  const cmd = process.argv[2];
  if (cmd === "stats") {
    console.log(JSON.stringify(getStats(), null, 2));
  } else if (cmd === "report") {
    generateWeeklyReport();
  } else if (cmd === "query") {
    const sector = process.argv[3];
    const style = process.argv[4];
    console.log(JSON.stringify(query({ sector, style }), null, 2));
  } else {
    console.log(`
Design Scout CLI
  node scout.js stats              — stats base de connaissance
  node scout.js report             — générer rapport hebdomadaire
  node scout.js query [secteur] [style]  — interroger la base
    `);
  }
}
