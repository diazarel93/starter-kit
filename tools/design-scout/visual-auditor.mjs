/**
 * visual-auditor.mjs — Audit qualité visuel + élagage KB
 *
 * Usage :
 *   node visual-auditor.mjs                    # Audite tous les sites capturés
 *   node visual-auditor.mjs --prune 6          # Supprime les sites < 6/10 de la KB
 *   node visual-auditor.mjs --report           # Rapport des scores sans modifier la KB
 *   node visual-auditor.mjs --slug arcteryx-com # Auditer un seul site
 *
 * Workflow complet :
 *   1. node visual-analyzer.mjs <url>       → captures
 *   2. node visual-auditor.mjs              → scores + mise à jour KB
 *   3. node visual-auditor.mjs --prune 6    → élagage des faibles
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURES_DIR = resolve(__dirname, "captures/visual-analysis");
const KB_PATH = resolve(__dirname, "knowledge-base.json");

// ─── PROMPT D'AUDIT DA ───────────────────────────────────────────────────────

function buildAuditPrompt(url) {
  return `Tu es un directeur artistique senior avec 15 ans d'expérience. Tu audites des sites web pour une knowledge base de référence design.

Site : ${url}

Tu vois plusieurs captures : hero, sections intermédiaires, footer, mobile, et éventuellement des sous-pages.

Évalue ce site comme référence design en répondant UNIQUEMENT en JSON strict :

{
  "url": "${url}",
  "visual_score": 0-10,
  "is_reference_worthy": true/false,
  "visual_impression": "1 phrase — ce qu'un DA voit en 3 secondes",
  "palette_real": {
    "dominant": "#HEX",
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "background": "#HEX",
    "mood": "sombre/clair/coloré/neutre/contrasté"
  },
  "typography_real": {
    "heading": "description précise — serif élégant / sans condensé bold / custom display / etc",
    "body": "description",
    "quality": "générique/professionnel/exceptionnel/custom"
  },
  "layout_pattern": "pleine largeur / centré / asymétrique / grille / éditorial / magazine",
  "whitespace": "trop chargé/équilibré/généreux/très généreux",
  "photography_quality": "absente/stock/lifestyle/editorial/exceptionnelle",
  "animation_level": "aucune/subtile/présente/dominante",
  "mobile_quality": "cassée/basique/correcte/excellente",
  "overall_craft": "basique/correct/soigné/exceptionnel/world-class",
  "strengths": ["force 1", "force 2"],
  "weaknesses": ["faiblesse 1"],
  "remove_reason": null ou "raison de supprimer de la KB si is_reference_worthy = false",
  "what_makes_it_exceptional": "ce qui rend ce site unique — pour la KB",
  "design_lessons": ["leçon 1", "leçon 2"]
}

Barème :
- 9-10 : world-class, top 1% mondial → garder absolument
- 7-8  : excellent, vraie référence → garder
- 5-6  : correct, sans intérêt pédagogique → borderline
- 3-4  : générique, rien à apprendre → supprimer
- 0-2  : mauvais design, contre-exemple → supprimer

is_reference_worthy = true si score >= 7
is_reference_worthy = false si site indisponible, erreur, ou score < 6`;
}

// ─── LIRE LES IMAGES D'UN SLUG ───────────────────────────────────────────────

function getImagesForSlug(slug) {
  const dir = resolve(CAPTURES_DIR, slug);
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir)
    .filter(f => f.endsWith(".jpg") || f.endsWith(".png"))
    .sort(); // hero avant sections avant footer

  // Priorité : hero, full, mobile, sections — max 6 images pour contrôler les tokens
  const priority = ["hero", "full", "mobile", "s2", "s3", "footer"];
  const sorted = [];

  for (const p of priority) {
    const match = files.find(f => f.includes(p) && f.startsWith("00-"));
    if (match) sorted.push(resolve(dir, match));
  }

  // Ajouter les sous-pages hero (01-, 02-)
  const subHeros = files.filter(f => (f.startsWith("01-") || f.startsWith("02-")) && f.includes("hero"));
  subHeros.forEach(f => sorted.push(resolve(dir, f)));

  // Max 8 images total
  return [...new Set(sorted)].slice(0, 8);
}

// ─── AUDIT D'UN SITE ─────────────────────────────────────────────────────────
// NOTE : Cette fonction doit être appelée depuis Claude Code (qui lit les images)
// Elle génère le prompt + liste les images à lire

function generateAuditInstructions(slug) {
  const dir = resolve(CAPTURES_DIR, slug);
  const manifestPath = resolve(dir, "manifest.json");

  if (!existsSync(manifestPath)) {
    return null;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const images = getImagesForSlug(slug);

  return {
    slug,
    url: manifest.url,
    images,
    prompt: buildAuditPrompt(manifest.url),
    already_audited: manifest.visual_score !== undefined,
  };
}

// ─── MISE À JOUR KB ──────────────────────────────────────────────────────────

function updateKBWithAudit(auditResult) {
  if (!existsSync(KB_PATH)) return;
  const kb = JSON.parse(readFileSync(KB_PATH, "utf-8"));

  const idx = kb.sites.findIndex(s => s.url === auditResult.url);
  if (idx >= 0) {
    kb.sites[idx] = {
      ...kb.sites[idx],
      visual_score: auditResult.visual_score,
      is_reference_worthy: auditResult.is_reference_worthy,
      visual_impression: auditResult.visual_impression,
      palette_real: auditResult.palette_real,
      typography_real: auditResult.typography_real,
      layout_pattern: auditResult.layout_pattern,
      mobile_quality: auditResult.mobile_quality,
      overall_craft: auditResult.overall_craft,
      visual_analyzed: true,
      visual_analyzed_at: new Date().toISOString().split("T")[0],
    };
    if (auditResult.what_makes_it_exceptional) {
      kb.sites[idx].what_makes_it_exceptional = auditResult.what_makes_it_exceptional;
    }
    if (auditResult.design_lessons?.length) {
      kb.sites[idx].design_lessons = auditResult.design_lessons;
    }
    console.log(`✓ KB updated: ${auditResult.url} → ${auditResult.visual_score}/10`);
  }

  kb.last_updated = new Date().toISOString().split("T")[0];
  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
}

// ─── ÉLAGAGE KB ──────────────────────────────────────────────────────────────

function pruneKB(threshold = 6) {
  const kb = JSON.parse(readFileSync(KB_PATH, "utf-8"));
  const before = kb.sites.length;

  const kept = [];
  const removed = [];

  for (const site of kb.sites) {
    // Garder si : pas encore audité OU score >= threshold ET is_reference_worthy
    if (site.visual_score === undefined) {
      kept.push(site); // pas encore audité → garder pour l'instant
    } else if (site.visual_score >= threshold && site.is_reference_worthy !== false) {
      kept.push(site);
    } else {
      removed.push({ url: site.url, score: site.visual_score, reason: site.remove_reason });
    }
  }

  kb.sites = kept;
  kb.total_sites = kept.length;
  kb.last_updated = new Date().toISOString().split("T")[0];
  kb.last_pruned = new Date().toISOString().split("T")[0];
  kb.prune_threshold = threshold;

  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));

  console.log(`\n🔪 Élagage KB (seuil ${threshold}/10)`);
  console.log(`  Avant : ${before} sites`);
  console.log(`  Supprimés : ${removed.length} sites`);
  console.log(`  Restants : ${kept.length} sites`);

  if (removed.length > 0) {
    console.log("\n  Sites supprimés :");
    removed.forEach(r => console.log(`    ✗ ${r.url} (${r.score}/10)${r.reason ? ` — ${r.reason}` : ''}`));
  }

  return { before, removed: removed.length, after: kept.length };
}

// ─── RAPPORT ─────────────────────────────────────────────────────────────────

function generateReport() {
  const kb = JSON.parse(readFileSync(KB_PATH, "utf-8"));
  const audited = kb.sites.filter(s => s.visual_score !== undefined);
  const notAudited = kb.sites.filter(s => s.visual_score === undefined);

  const byScore = audited.reduce((acc, s) => {
    const bucket = s.visual_score >= 9 ? "9-10 world-class"
      : s.visual_score >= 7 ? "7-8 excellent"
      : s.visual_score >= 5 ? "5-6 correct"
      : "< 5 à supprimer";
    acc[bucket] = (acc[bucket] || []);
    acc[bucket].push(s);
    return acc;
  }, {});

  console.log(`\n📊 Rapport KB visuel`);
  console.log(`  Total : ${kb.sites.length} sites`);
  console.log(`  Audités : ${audited.length} | Non audités : ${notAudited.length}`);
  console.log(`\n  Distribution des scores :`);
  for (const [bucket, sites] of Object.entries(byScore).sort()) {
    console.log(`    ${bucket} → ${sites.length} sites`);
    if (bucket.startsWith("9")) {
      sites.forEach(s => console.log(`      ★ ${s.url}`));
    }
  }

  const toRemove = audited.filter(s => s.visual_score < 6);
  if (toRemove.length > 0) {
    console.log(`\n  ⚠️  ${toRemove.length} sites à supprimer (score < 6) :`);
    toRemove.forEach(s => console.log(`    ✗ ${s.url} (${s.visual_score}/10)`));
    console.log(`\n  → Lance : node visual-auditor.mjs --prune 6`);
  }
}

// ─── LISTER LES SITES À AUDITER ──────────────────────────────────────────────

function listPendingAudits() {
  if (!existsSync(CAPTURES_DIR)) {
    console.log("Aucune capture trouvée. Lance d'abord visual-analyzer.mjs");
    return [];
  }

  const slugs = readdirSync(CAPTURES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const pending = [];
  for (const slug of slugs) {
    const info = generateAuditInstructions(slug);
    if (info && !info.already_audited) {
      pending.push(info);
    }
  }

  return pending;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const pruneMode = args.includes("--prune");
const reportMode = args.includes("--report");
const slugArg = args[args.indexOf("--slug") + 1];
const threshold = parseInt(args[args.indexOf("--prune") + 1]) || 6;

if (pruneMode) {
  pruneKB(threshold);
} else if (reportMode) {
  generateReport();
} else if (slugArg) {
  const info = generateAuditInstructions(slugArg);
  if (info) {
    console.log(`\nPour auditer ${slugArg}, dis à Claude Code :`);
    console.log(`\nLis ces images dans l'ordre :`);
    info.images.forEach(img => console.log(`  ${img}`));
    console.log(`\nPuis applique ce prompt :\n${info.prompt}`);
  }
} else {
  // Lister les sites à auditer
  const pending = listPendingAudits();
  console.log(`\n📋 Sites capturés à auditer : ${pending.length}`);
  pending.slice(0, 20).forEach(p => console.log(`  • ${p.url}`));
  if (pending.length > 20) console.log(`  ... et ${pending.length - 20} autres`);
  console.log(`\nCommandes :`);
  console.log(`  node visual-auditor.mjs --report          → rapport des scores`);
  console.log(`  node visual-auditor.mjs --prune 6         → supprimer les < 6/10`);
  console.log(`  node visual-auditor.mjs --slug <slug>     → instructions pour auditer un site`);
}

export { updateKBWithAudit, pruneKB, generateReport, listPendingAudits, generateAuditInstructions };
