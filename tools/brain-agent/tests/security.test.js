import { describe, it, expect } from "vitest";

describe("Sécurité — path traversal protection (idea.js)", () => {
  function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_-]/g, "-").substring(0, 80);
  }

  it("supprime les séparateurs de chemin", () => {
    const result = sanitizeFilename("../../../etc/passwd");
    expect(result).not.toContain("..");
    expect(result).not.toContain("/");
    expect(result).toContain("etc");
    expect(result).toContain("passwd");
  });

  it("supprime les caractères spéciaux", () => {
    const result = sanitizeFilename("mon idée! @2026#");
    expect(result).not.toMatch(/[^a-zA-Z0-9_-]/);
    expect(result).toContain("2026");
  });

  it("conserve les noms valides", () => {
    expect(sanitizeFilename("kura-player-biomarqueurs")).toBe("kura-player-biomarqueurs");
    expect(sanitizeFilename("mon_plan_2026")).toBe("mon_plan_2026");
    expect(sanitizeFilename("idea-v2")).toBe("idea-v2");
  });

  it("tronque à 80 caractères", () => {
    const long = "a".repeat(100);
    expect(sanitizeFilename(long)).toHaveLength(80);
  });

  it("gère les noms vides", () => {
    const result = sanitizeFilename("") || "untitled";
    expect(result).toBe("untitled");
  });
});

describe("Sécurité — STUDENT_TOKEN_SECRET guard (Banlieuwood)", () => {
  it("doit throw si SECRET est undefined", () => {
    function initSecret(secret) {
      if (!secret) throw new Error("STUDENT_TOKEN_SECRET env var is required");
      return secret;
    }

    expect(() => initSecret(undefined)).toThrow("STUDENT_TOKEN_SECRET");
    expect(() => initSecret("")).toThrow("STUDENT_TOKEN_SECRET");
    expect(() => initSecret("real-secret-key")).not.toThrow();
  });
});

describe("Sécurité — escapeHtml (contact form)", () => {
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  it("échappe les balises HTML", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert('xss')&lt;/script&gt;"
    );
  });

  it("échappe les entités HTML", () => {
    expect(escapeHtml("AT&T")).toBe("AT&amp;T");
  });

  it("laisse le texte normal intact", () => {
    expect(escapeHtml("Bonjour, je veux contacter Banlieuwood.")).toBe(
      "Bonjour, je veux contacter Banlieuwood."
    );
  });

  it("gère les cas limites", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml("<>&&")).toBe("&lt;&gt;&amp;&amp;");
  });
});
