import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";

const PROJECTS = {
  "starter-kit": resolve(process.env.HOME, "starter-kit"),
  "banlieuwood": resolve(process.env.HOME, "atelier-banlieuwood"),
  "lokivo": resolve(process.env.HOME, "lokivo-app"),
  "kura-v4": resolve(process.env.HOME, "kura-v4"),
  "kura-player": resolve(process.env.HOME, "kura-player"),
};

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: "utf-8", timeout: 5000 }).trim();
  } catch {
    return null;
  }
}

export function getProjectStatus({ project }) {
  const path = PROJECTS[project];
  if (!path || !existsSync(path)) return { error: `Projet ${project} introuvable` };

  const branch = run("git rev-parse --abbrev-ref HEAD", path);
  const lastCommit = run("git log -1 --format='%s (%ar)'", path);
  const status = run("git status --short", path);
  const unpushed = run("git log @{u}.. --oneline 2>/dev/null | wc -l | tr -d ' '", path);

  return {
    project,
    branch,
    lastCommit,
    hasUncommitted: status ? status.split("\n").filter(Boolean).length : 0,
    unpushedCommits: unpushed ? parseInt(unpushed) : 0,
  };
}

export function getAllProjectsStatus() {
  return Object.keys(PROJECTS).map((p) => getProjectStatus({ project: p }));
}
