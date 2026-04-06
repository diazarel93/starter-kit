/**
 * audit-agent.mjs — Agent d'audit visuel automatique
 *
 * Pipeline complet :
 *   1. Liste tous les sites capturés non audités
 *   2. Lit les images (base64) via filesystem
 *   3. Envoie à Claude Vision avec prompt DA senior
 *   4. Parse le JSON de réponse
 *   5. Met à jour knowledge-base.json automatiquement
 *   6. Checkpoint — reprend où on s'est arrêté
 *
 * Usage :
 *   node audit-agent.mjs                     # Tout auditer
 *   node audit-agent.mjs --limit 20          # 20 sites max
 *   node audit-agent.mjs --slug a24films-com # Un seul site
 *   node audit-agent.mjs --model haiku       # Haiku (rapide, ~1€/150 sites)
 *   node audit-agent.mjs --model sonnet      # Sonnet (meilleur, ~5€/150 sites)
 *   node audit-agent.mjs --report            # Stats sans modifier
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KB_PATH       = resolve(__dirname, "../knowledge/knowledge-base.json");
const CAPTURES_DIR  = resolve(__dirname, "../captures/visual-analysis");
const CHECKPOINT    = resolve(__dirname, "../.audit-checkpoint.json");

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const MODELS = {
  haiku:  "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
};

const args       = process.argv.slice(2);
const limitArg   = parseInt(args[args.indexOf("--limit") + 1])  || Infinity;
const slugArg    = args[args.indexOf("--slug")  + 1];
const modelKey   = args[args.indexOf("--model") + 1] || "haiku";
const reportMode = args.includes("--report");
const MODEL      = MODELS[modelKey] || MODELS.haiku;

// ─── PROMPT DA SENIOR ─────────────────────────────────────────────────────────

function buildPrompt(url) {
  return `Tu es un directeur artistique senior avec 15 ans d'expérience dans les meilleures agences mondiales. Tu audites des sites web pour une knowledge base de référence design.

Site audité : ${url}

Tu vois plusieurs captures du site (hero, sections, footer, mobile, sous-pages).

Réponds UNIQUEMENT en JSON valide, sans markdown ni commentaires :

{
  "url": "${url}",
  "visual_score": 7,
  "is_reference_worthy": true,
  "visual_impression": "1 phrase — ce qu'un DA voit en 3 secondes",
  "palette_real": {
    "dominant": "#111111",
    "primary": "#FFFFFF",
    "secondary": "#F5F5F5",
    "accent": "#FF0000",
    "background": "#111111",
    "mood": "sombre"
  },
  "typography_real": {
    "heading": "description précise — serif élégant / sans condensé bold / custom display",
    "body": "description",
    "quality": "générique"
  },
  "layout_pattern": "pleine largeur",
  "whitespace": "équilibré",
  "photography_quality": "absente",
  "animation_level": "aucune",
  "mobile_quality": "correcte",
  "overall_craft": "correct",
  "strengths": ["force 1", "force 2"],
  "weaknesses": ["faiblesse 1"],
  "remove_reason": null,
  "what_makes_it_exceptional": "ce qui rend ce site unique — ou null si rien",
  "design_lessons": ["leçon 1 applicable à d'autres projets"]
}

Barème strict (sois honnête et exigeant) :
- 9-10 : world-class, top 1% mondial → garder absolument
- 7-8  : excellent, vraie référence → garder
- 5-6  : correct, sans valeur pédagogique → borderline
- 3-4  : générique, rien à apprendre → supprimer
- 0-2  : mauvais design, bloqué (Cloudflare/VPN), ou page vide → supprimer

Règles :
- is_reference_worthy = true SEULEMENT si score >= 7
- Si site bloqué (page vide, "security check", "VPN required") → score 1, remove_reason explique
- Sois précis sur les couleurs HEX réelles vues dans les captures
- Les design_lessons doivent être applicables à d'autres projets`;
}

// ─── IMAGES ───────────────────────────────────────────────────────────────────

function getImages(slug) {
  const dir = resolve(CAPTURES_DIR, slug);
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir).filter(f => f.endsWith(".jpg")).sort();

  // Priorité : main hero, full, mobile, sections — max 7 images
  const priority = ["00-main-hero", "00-main-s2", "00-main-s3", "00-main-mobile", "00-main-footer"];
  const sorted = [];

  for (const p of priority) {
    const match = files.find(f => f.startsWith(p));
    if (match) sorted.push(resolve(dir, match));
  }

  // Ajouter sous-pages hero (01-, 02-)
  files
    .filter(f => (f.startsWith("01-") || f.startsWith("02-")) && f.includes("hero"))
    .forEach(f => sorted.push(resolve(dir, f)));

  return [...new Set(sorted)].slice(0, 7);
}

function toBase64(path) {
  try { return readFileSync(path).toString("base64"); }
  catch { return null; }
}

// ─── KB ──────────────────────────────────────────────────────────────────────

function loadKB() {
  return JSON.parse(readFileSync(KB_PATH, "utf-8"));
}

function updateKB(audit) {
  const kb = loadKB();
  const idx = kb.sites.findIndex(s =>
    s.url?.rstrip?.("/") === audit.url?.rstrip?.("/") ||
    s.url === audit.url
  );

  const data = {
    ...audit,
    visual_analyzed: true,
    visual_analyzed_at: new Date().toISOString().split("T")[0],
  };

  if (idx >= 0) {
    kb.sites[idx] = { ...kb.sites[idx], ...data };
  } else {
    // Site capturé mais pas dans KB — on l'ajoute
    kb.sites.push(data);
    kb.total_sites = kb.sites.length;
  }

  kb.last_updated = new Date().toISOString().split("T")[0];
  writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
  return idx >= 0 ? "updated" : "added";
}

// ─── PENDING ─────────────────────────────────────────────────────────────────

function listPending(doneSet) {
  if (!existsSync(CAPTURES_DIR)) return [];

  const kb = loadKB();
  const analyzedUrls = new Set(
    kb.sites.filter(s => s.visual_analyzed).map(s => s.url)
  );

  return readdirSync(CAPTURES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const slug = d.name;
      const manifestPath = resolve(CAPTURES_DIR, slug, "manifest.json");
      if (!existsSync(manifestPath)) return null;

      const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      const url = manifest.url;
      if (!url) return null;

      // Skip si déjà audité dans KB ou checkpoint
      if (analyzedUrls.has(url) || doneSet.has(slug)) return null;

      const images = getImages(slug);
      if (images.length === 0) return null;

      return { slug, url, images };
    })
    .filter(Boolean);
}

// ─── CHECKPOINT ───────────────────────────────────────────────────────────────

function loadCheckpoint() {
  if (existsSync(CHECKPOINT)) {
    return new Set(JSON.parse(readFileSync(CHECKPOINT, "utf-8")).done || []);
  }
  return new Set();
}

function saveCheckpoint(done) {
  writeFileSync(CHECKPOINT, JSON.stringify({ done: [...done], updated: new Date().toISOString() }, null, 2));
}

// ─── AUDIT ────────────────────────────────────────────────────────────────────

async function auditSite(client, { slug, url, images }) {
  const content = [];

  let loaded = 0;
  for (const imgPath of images) {
    const b64 = toBase64(imgPath);
    if (!b64) continue;
    const label = imgPath.split("/").pop();
    content.push({ type: "text", text: `[${label}]` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } });
    loaded++;
  }

  if (loaded === 0) return null;

  content.push({ type: "text", text: buildPrompt(url) });

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [{ role: "user", content }],
  });

  const text = resp.content[0]?.text?.trim() || "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("JSON introuvable dans la réponse");

  const audit = JSON.parse(match[0]);
  if (typeof audit.visual_score !== "number") throw new Error("visual_score manquant");

  return { ...audit, url, images_seen: loaded };
}

// ─── REPORT ───────────────────────────────────────────────────────────────────

function printReport() {
  const kb = loadKB();
  const audited = kb.sites.filter(s => s.visual_analyzed);
  const pending = listPending(new Set());

  console.log(`\n📊 Rapport audit visuel`);
  console.log(`   KB total         : ${kb.sites.length} sites`);
  console.log(`   Audités          : ${audited.length}`);
  console.log(`   Captures pending : ${pending.length}`);
  console.log(`   Non capturés     : ${kb.sites.length - audited.length - pending.length}`);

  const byScore = {
    "★ 9-10 world-class" : audited.filter(s => s.visual_score >= 9),
    "✓ 7-8  excellent"   : audited.filter(s => s.visual_score >= 7 && s.visual_score < 9),
    "· 5-6  correct"     : audited.filter(s => s.visual_score >= 5 && s.visual_score < 7),
    "✗ <5   à supprimer" : audited.filter(s => s.visual_score < 5),
  };

  console.log(`\n   Distribution :`);
  for (const [label, sites] of Object.entries(byScore)) {
    console.log(`   ${label} → ${sites.length}`);
    if (label.startsWith("★")) {
      sites.forEach(s => console.log(`     ${s.url}`));
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

if (reportMode) {
  printReport();
  process.exit(0);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("\n❌ ANTHROPIC_API_KEY manquante");
  console.error("   export ANTHROPIC_API_KEY=sk-ant-...\n");
  process.exit(1);
}

const client    = new Anthropic({ apiKey });
const checkpoint = loadCheckpoint();

// Construire la liste
let pending;
if (slugArg) {
  const manifestPath = resolve(CAPTURES_DIR, slugArg, "manifest.json");
  if (!existsSync(manifestPath)) { console.error(`Slug inconnu : ${slugArg}`); process.exit(1); }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const images = getImages(slugArg);
  pending = [{ slug: slugArg, url: manifest.url, images }];
} else {
  pending = listPending(checkpoint);
}

const queue = pending.slice(0, limitArg);

console.log(`\n🤖 Audit Agent — ${modelKey.toUpperCase()}`);
console.log(`   Modèle   : ${MODEL}`);
console.log(`   Queue    : ${queue.length} sites`);
console.log(`   Checkpoint: ${checkpoint.size} déjà faits\n`);

if (queue.length === 0) {
  console.log("✅ Tout est audité — lance --report pour voir les stats");
  process.exit(0);
}

const results = { worldClass: [], excellent: [], correct: [], remove: [], errors: [] };
let done = 0;

for (const site of queue) {
  const label = site.url.replace("https://", "").replace("www.", "").slice(0, 48).padEnd(50);
  process.stdout.write(`  ${label} `);

  try {
    const audit = await auditSite(client, site);

    if (!audit) {
      process.stdout.write("⚠️  skip (images vides)\n");
      results.errors.push(site.url);
      continue;
    }

    const action = updateKB(audit);
    checkpoint.add(site.slug);
    saveCheckpoint(checkpoint);

    const s = audit.visual_score;
    const emoji = s >= 9 ? "★" : s >= 7 ? "✓" : s >= 5 ? "·" : "✗";
    process.stdout.write(`${emoji} ${s}/10  [${action}]\n`);

    if (s >= 9) results.worldClass.push(audit.url);
    else if (s >= 7) results.excellent.push(audit.url);
    else if (s >= 5) results.correct.push(audit.url);
    else results.remove.push(audit.url);

    done++;

  } catch (e) {
    process.stdout.write(`✗ ${e.message.slice(0, 40)}\n`);
    results.errors.push(site.url);
  }

  // Anti rate-limit
  await new Promise(r => setTimeout(r, 1000));
}

// ─── RÉSUMÉ ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`✅ Audit terminé : ${done}/${queue.length} sites`);
console.log(`   ★ World-class (≥9) : ${results.worldClass.length}`);
console.log(`   ✓ Excellent (7-8)  : ${results.excellent.length}`);
console.log(`   · Correct (5-6)    : ${results.correct.length}`);
console.log(`   ✗ À supprimer (<5) : ${results.remove.length}`);
if (results.errors.length) console.log(`   ⚠️  Erreurs         : ${results.errors.length}`);

if (results.worldClass.length > 0) {
  console.log(`\n   Nouveaux world-class :`);
  results.worldClass.forEach(u => console.log(`     ★ ${u}`));
}

console.log(`\n   Prochaine étape :`);
console.log(`   node audit-agent.mjs --report`);
console.log(`   node visual-auditor.mjs --prune 6\n`);
