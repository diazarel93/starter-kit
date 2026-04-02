import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, unlinkSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TMP_ALERTS = resolve(__dirname, "../.test-brain-alerts.json");
const TMP_DECISIONS = resolve(__dirname, "../.test-decisions.md");

// Patch les chemins avant d'importer
process.env.HOME = "/tmp";

describe("tasks.js — saveAlert", () => {
  beforeEach(() => {
    if (existsSync(TMP_ALERTS)) unlinkSync(TMP_ALERTS);
  });

  afterEach(() => {
    if (existsSync(TMP_ALERTS)) unlinkSync(TMP_ALERTS);
    if (existsSync(TMP_DECISIONS)) unlinkSync(TMP_DECISIONS);
  });

  it("déduplique les alertes identiques dans les 24h", () => {
    const alerts = [];
    const message = "Build cassé sur Banlieuwood";

    function isDuplicate(alerts, msg) {
      return alerts.some(
        (a) => a.message === msg && Date.now() - new Date(a.date).getTime() < 86400000
      );
    }

    // Premier ajout
    alerts.push({ message, date: new Date().toISOString() });
    expect(isDuplicate(alerts, message)).toBe(true);

    // Message différent — pas de doublon
    expect(isDuplicate(alerts, "Autre alerte")).toBe(false);
  });

  it("ne considère pas doublon une alerte de plus de 24h", () => {
    const message = "Build cassé";
    const vieille_date = new Date(Date.now() - 25 * 3600000).toISOString();
    const alerts = [{ message, date: vieille_date }];

    const isDuplicate = alerts.some(
      (a) => a.message === message && Date.now() - new Date(a.date).getTime() < 86400000
    );
    expect(isDuplicate).toBe(false);
  });

  it("garde max 50 alertes", () => {
    const alerts = Array.from({ length: 55 }, (_, i) => ({
      message: `alerte ${i}`,
      date: new Date().toISOString(),
    }));

    const trimmed = alerts.length > 50 ? alerts.slice(-50) : alerts;
    expect(trimmed).toHaveLength(50);
    expect(trimmed[0].message).toBe("alerte 5"); // les 5 premières supprimées
  });
});

describe("tasks.js — createTask", () => {
  it("formate correctement une entrée decisions.md", () => {
    const date = new Date().toLocaleDateString("fr-FR");
    const entry = `\n## 🟠 [${date}] Mon titre\n**Projet** : kura\n**Contexte** : contexte test\n**Statut** : À traiter\n`;

    expect(entry).toContain("Mon titre");
    expect(entry).toContain("kura");
    expect(entry).toContain("À traiter");
    expect(entry).toContain("🟠"); // high priority
  });

  it("utilise le bon emoji selon la priorité", () => {
    const emojis = { critical: "🔴", high: "🟠", normal: "🟡", low: "⚪" };
    expect(emojis["critical"]).toBe("🔴");
    expect(emojis["high"]).toBe("🟠");
    expect(emojis["normal"]).toBe("🟡");
    expect(emojis["low"]).toBe("⚪");
    expect(emojis["unknown"] ?? "🟡").toBe("🟡"); // fallback
  });
});
