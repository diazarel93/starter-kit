import { Suspense } from "react";
import { VitalsGrid } from "@/components/brain/VitalsGrid";
import { AlertsPanel } from "@/components/brain/AlertsPanel";
import { QuickStats } from "@/components/brain/QuickStats";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 60;

const PROJECT_CONFIG: Record<ProjectKey, { label: string; color: string; desc: string }> = {
  all: { label: "BRAIN", color: "#FF6B35", desc: "Vue globale — tous projets" },
  kura: { label: "KURA", color: "#4ECDC4", desc: "Compliance antidopage · RegTech AI" },
  banlieuwood: {
    label: "BANLIEUWOOD",
    color: "#FF6B35",
    desc: "École cinéma · Pédagogie numérique",
  },
  lokivo: { label: "LOKIVO", color: "#8B5CF6", desc: "SaaS · Localisation & communauté" },
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/3 ${className}`} />;
}

export default async function BrainPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;
  const config = PROJECT_CONFIG[project];

  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs tracking-widest text-white/30 uppercase">{greeting}, Romain</p>
          <h1 className="font-display text-5xl leading-none" style={{ color: config.color }}>
            {config.label}
          </h1>
          <p className="mt-1 text-sm text-white/30">{config.desc}</p>
        </div>
        <p className="hidden text-right text-xs text-white/20 lg:block">{dateStr}</p>
      </div>

      {/* Alertes */}
      <Suspense fallback={<Skeleton className="h-10" />}>
        <AlertsPanel project={project} />
      </Suspense>

      {/* Projets */}
      <Suspense fallback={<Skeleton className="h-14" />}>
        <QuickStats project={project} />
      </Suspense>

      {/* Métriques */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        }
      >
        <VitalsGrid project={project} />
      </Suspense>
    </div>
  );
}
