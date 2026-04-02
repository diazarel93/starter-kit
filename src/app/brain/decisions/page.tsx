import { readFileSync } from "fs";
import { resolve } from "path";

function loadDecisions() {
  try {
    return readFileSync(resolve(process.cwd(), "decisions.md"), "utf-8");
  } catch {
    return null;
  }
}

function renderMarkdown(content: string) {
  const lines = content.substring(0, 3000).split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("### "))
      return (
        <h3 key={i} className="text-sm font-bold text-white/70 mt-4 mb-1">
          {line.slice(4)}
        </h3>
      );
    if (line.startsWith("## "))
      return (
        <h2 key={i} className="text-base font-bold text-white mt-5 mb-1">
          {line.slice(3)}
        </h2>
      );
    if (line.startsWith("# "))
      return (
        <h1 key={i} className="text-lg font-bold text-white mt-5 mb-2">
          {line.slice(2)}
        </h1>
      );
    if (line.startsWith("- ") || line.startsWith("* "))
      return (
        <p key={i} className="text-xs text-white/50 pl-3 py-0.5">
          · {line.slice(2)}
        </p>
      );
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-xs text-white/50 py-0.5">
        {line}
      </p>
    );
  });
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const content = loadDecisions();

  const roadmap = [
    {
      horizon: "Maintenant",
      item: "Kura V4 production + Brain Dashboard Phase 1",
      status: "active",
    },
    {
      horizon: "30 jours",
      item: "Brain Dashboard live + données réelles connectées",
      status: "planned",
    },
    { horizon: "90 jours", item: "Lokivo 1000 users", status: "planned" },
    { horizon: "180 jours", item: "Kura première conférence WADA", status: "planned" },
    { horizon: "1 an", item: "Lever de fonds ou rentabilité", status: "planned" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">DÉCISIONS & STRATÉGIE</h1>
        <p className="text-white/40 text-sm mt-1">decisions.md live, roadmap, leçons apprises</p>
      </div>

      {p && p !== "all" && (
        <p className="text-xs text-white/20 bg-white/3 border border-white/5 rounded px-3 py-2">
          Vue globale — cette section n&apos;est pas filtrée par projet
        </p>
      )}

      {/* Roadmap */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
          Roadmap
        </h3>
        <div className="space-y-3">
          {roadmap.map((r) => (
            <div key={r.horizon} className="flex items-start gap-4">
              <span
                className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                  r.status === "active"
                    ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {r.horizon}
              </span>
              <span className="text-sm text-white/60 pt-0.5">{r.item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* decisions.md */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
          decisions.md
        </h3>
        {content ? (
          <div className="max-h-96 overflow-auto">{renderMarkdown(content)}</div>
        ) : (
          <p className="text-sm text-white/30">
            decisions.md introuvable — créer{" "}
            <code className="text-white/20">decisions.md</code> à la racine du projet
          </p>
        )}
      </div>
    </div>
  );
}
