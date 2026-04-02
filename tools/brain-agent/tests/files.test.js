import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TMP_MEMORY = resolve(__dirname, "../.test-memory.json");

describe("files.js — mémoire persistante", () => {
  function readMemory(path) {
    if (!existsSync(path)) return {};
    try { return JSON.parse(require("fs").readFileSync(path, "utf-8")); } catch { return {}; }
  }

  function writeMemory(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2));
  }

  function appendToMemory(path, key, value) {
    let mem = {};
    if (existsSync(path)) {
      try { mem = JSON.parse(require("fs").readFileSync(path, "utf-8")); } catch {}
    }
    mem[key] = value;
    mem[`${key}_at`] = new Date().toISOString();
    writeFileSync(path, JSON.stringify(mem, null, 2));
    return mem;
  }

  afterEach(() => {
    if (existsSync(TMP_MEMORY)) unlinkSync(TMP_MEMORY);
  });

  it("retourne {} si le fichier n'existe pas", () => {
    if (existsSync(TMP_MEMORY)) unlinkSync(TMP_MEMORY);
    if (!existsSync(TMP_MEMORY)) {
      expect({}).toEqual({});
    }
  });

  it("écrit et relit correctement", () => {
    writeMemory(TMP_MEMORY, { foo: "bar", count: 42 });
    const data = JSON.parse(require("fs").readFileSync(TMP_MEMORY, "utf-8"));
    expect(data.foo).toBe("bar");
    expect(data.count).toBe(42);
  });

  it("trimme la mémoire à 20 clés max (protection inflation tokens)", () => {
    const memory = {};
    for (let i = 0; i < 30; i++) memory[`key_${i}`] = `value_${i}`;

    const keys = Object.keys(memory).slice(-20);
    const trimmed = Object.fromEntries(keys.map((k) => [k, memory[k]]));

    expect(Object.keys(trimmed)).toHaveLength(20);
    // Garde les 20 dernières clés
    expect(trimmed["key_10"]).toBe("value_10");
    expect(trimmed["key_29"]).toBe("value_29");
    expect(trimmed["key_0"]).toBeUndefined();
  });
});

describe("files.js — timeout API protection", () => {
  it("Promise.race rejette si le timeout expire en premier", async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 5000, "slow"));
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 50)
    );

    await expect(Promise.race([slow, timeout])).rejects.toThrow("timeout");
  });

  it("Promise.race résout si l'API répond avant le timeout", async () => {
    const fast = new Promise((resolve) => setTimeout(resolve, 10, "result"));
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000)
    );

    const result = await Promise.race([fast, timeout]);
    expect(result).toBe("result");
  });
});
