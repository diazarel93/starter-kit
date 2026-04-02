"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV_SECTIONS = [
  { href: "/brain", label: "Vue CEO", icon: "⚡", short: "VITALS" },
  { href: "/brain/produits", label: "Produits & Users", icon: "📦", short: "PRODUITS" },
  { href: "/brain/finances", label: "Finances", icon: "💰", short: "FINANCES" },
  { href: "/brain/legal", label: "Légal & RGPD", icon: "⚖️", short: "LEGAL" },
  { href: "/brain/tech", label: "Santé Technique", icon: "🔧", short: "TECH" },
  { href: "/brain/ai", label: "AI & Kura", icon: "🧠", short: "AI" },
  { href: "/brain/marche", label: "Marché & Veille", icon: "📡", short: "MARCHE" },
  { href: "/brain/equipe", label: "Équipe & Accès", icon: "👥", short: "EQUIPE" },
  { href: "/brain/formation", label: "Formation", icon: "🎯", short: "FORM" },
  { href: "/brain/decisions", label: "Décisions", icon: "🧭", short: "DECS" },
];

interface BrainNavProps {
  role: string;
}

export function BrainNav({ role }: BrainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="w-56 flex-shrink-0 bg-[#080810] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <span className="font-display text-2xl text-[#FF6B35]">BRAIN</span>
        <span className="ml-2 text-xs text-white/20 uppercase tracking-widest">CEO</span>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => {
          const isActive = pathname === section.href || (section.href !== "/brain" && pathname.startsWith(section.href));
          return (
            <Link
              key={section.href}
              href={section.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-white border-l-2 border-[#FF6B35]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"
              )}
            >
              <span className="text-base leading-none">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-t border-white/5">
        <span className="text-xs text-white/20 uppercase tracking-wider">{role}</span>
      </div>
    </nav>
  );
}
