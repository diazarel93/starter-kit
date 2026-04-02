import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(process.env.HOME, "starter-kit");

export function readDecisions() {
  try {
    return readFileSync(resolve(ROOT, "decisions.md"), "utf-8");
  } catch {
    return "decisions.md introuvable";
  }
}

export function readGoals() {
  try {
    return readFileSync(resolve(import.meta.dirname, "../goals.md"), "utf-8");
  } catch {
    return "";
  }
}

export function readMemory() {
  const path = resolve(import.meta.dirname, ".agent-memory.json");
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

export function writeMemory(data) {
  const path = resolve(import.meta.dirname, ".agent-memory.json");
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function appendToMemory(key, value) {
  const mem = readMemory();
  mem[key] = value;
  mem[`${key}_at`] = new Date().toISOString();
  writeMemory(mem);
  return { ok: true, key, value };
}
