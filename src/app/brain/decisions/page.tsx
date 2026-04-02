import { requireAuth } from "@/lib/auth";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadDecisions() {
  try {
    const content = readFileSync(resolve(process.cwd(), "decisions.md"), "utf-8");
    return content;
  } catch {
    return null;
  }
}

export default async function DecisionsPage() {
  await requireAuth();
  const content = loadDecisions();

  const roadmap = [
    { horizon: "Maintenant", item: "Kura V4 production + Brain Dashboard Phase 1", status: "active" },
    { horizon: "30 jours", item: "Brain Dashboard live + données réelles connectées", status: "planned" },
    { horizon: "90 jours", item: "Lokivo 1000 users", status: "planned" },
    { horizon: "180 jours", item: "Kura première conférence WADA", status: "planned" },
    { horizon: "1 an", item: "Lever de fonds ou rentabilité", status: "planned" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">🧭 Décisions & Stratégie</h1>
        <p className="text-white/40 text-sm mt-1">decisions.md live, roadmap, leçons apprises</p>
      </div>

      {/* Roadmap */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Roadmap</h3>
        <div className="space-y-3">
          {roadmap.map((r) => (
            <div key={r.horizon} className="flex items-start gap-4">
              <span className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                r.status === "active"
                  ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                  : "bg-white/5 text-white/30"
              }`}>
                {r.horizon}
              </span>
              <span className="text-sm text-white/60 pt-0.5">{r.item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* decisions.md */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">decisions.md</h3>
        {content ? (
          <pre className="text-xs text-white/50 overflow-auto max-h-96 whitespace-pre-wrap font-mono">
            {content.substring(0, 3000)}{content.length > 3000 ? "\n\n[...]" : ""}
          </pre>
        ) : (
          <p className="text-sm text-white/30">decisions.md introuvable</p>
        )}
      </div>
    </div>
  );
}
