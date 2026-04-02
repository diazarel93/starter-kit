"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const PROJECTS = [
  { key: "all", label: "Tout", color: "#ffffff" },
  { key: "kura", label: "Kura", color: "#4ECDC4" },
  { key: "banlieuwood", label: "Banlieuwood", color: "#FF6B35" },
  { key: "lokivo", label: "Lokivo", color: "#8B5CF6" },
] as const;

export type ProjectKey = (typeof PROJECTS)[number]["key"];

export function ProjectSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("p") ?? "all") as ProjectKey;

  function switchProject(key: ProjectKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("p");
    else params.set("p", key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
      {PROJECTS.map((p) => (
        <button
          key={p.key}
          onClick={() => switchProject(p.key)}
          className={`rounded px-3 py-1 text-xs font-medium transition-all ${
            current === p.key ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
          }`}
          style={current === p.key ? { color: p.color } : {}}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
