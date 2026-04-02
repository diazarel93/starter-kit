"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

const NAV_SECTIONS = [
  { href: "/brain", label: "Vue CEO", icon: "⚡" },
  { href: "/brain/produits", label: "Produits & Users", icon: "📦" },
  { href: "/brain/finances", label: "Finances", icon: "💰" },
  { href: "/brain/legal", label: "Légal & RGPD", icon: "⚖️" },
  { href: "/brain/tech", label: "Santé Technique", icon: "🔧" },
  { href: "/brain/ai", label: "AI & Kura", icon: "🧠" },
  { href: "/brain/marche", label: "Marché & Veille", icon: "📡" },
  { href: "/brain/equipe", label: "Équipe & Accès", icon: "👥" },
  { href: "/brain/formation", label: "Formation", icon: "🎯" },
  { href: "/brain/decisions", label: "Décisions", icon: "🧭" },
];

const PROJECT_COLORS: Record<string, string> = {
  kura: "#4ECDC4",
  banlieuwood: "#FF6B35",
  lokivo: "#8B5CF6",
};

interface BrainNavProps {
  role: string;
}

export function BrainNav({ role }: BrainNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const project = searchParams.get("p") ?? "all";
  const accentColor = PROJECT_COLORS[project] ?? "#FF6B35";

  function navHref(href: string) {
    if (project === "all") return href;
    return `${href}?p=${project}`;
  }

  return (
    <nav className="w-56 flex-shrink-0 bg-[#080810] border-r border-white/5 flex flex-col">
      <div className="px-4 py-5 border-b border-white/5">
        <span className="font-display text-2xl" style={{ color: accentColor }}>BRAIN</span>
        <span className="ml-2 text-xs text-white/20 uppercase tracking-widest">CEO</span>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => {
          const isActive = pathname === section.href || (section.href !== "/brain" && pathname.startsWith(section.href));
          return (
            <Link
              key={section.href}
              href={navHref(section.href)}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-white border-l-2"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"
              )}
              style={isActive ? { borderColor: accentColor } : {}}
            >
              <span className="text-base leading-none">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2">
        {project !== "all" && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        <span className="text-xs text-white/20 uppercase tracking-wider">{role}</span>
      </div>
    </nav>
  );
}
