import { Suspense } from "react";
import { VitalsGrid } from "@/components/brain/VitalsGrid";
import { AlertsPanel } from "@/components/brain/AlertsPanel";
import { QuickStats } from "@/components/brain/QuickStats";
import type { ProjectKey } from "@/components/brain/ProjectSwitcher";

export const revalidate = 60;

const PROJECT_LABELS: Record<ProjectKey, string> = {
  all: "Tous projets",
  kura: "Kura",
  banlieuwood: "Banlieuwood",
  lokivo: "Lokivo",
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-white/3 rounded-lg animate-pulse ${className}`} />;
}

export default async function BrainPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const project = (p ?? "all") as ProjectKey;
  const label = PROJECT_LABELS[project] ?? "Tous projets";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">BRAIN</h1>
        <p className="text-white/40 text-sm mt-1">
          Cockpit CEO · {label} —{" "}
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-10" />}>
        <AlertsPanel project={project} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-14" />}>
        <QuickStats project={project} />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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
