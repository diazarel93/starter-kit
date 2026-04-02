import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { VitalsGrid } from "@/components/brain/VitalsGrid";
import { AlertsPanel } from "@/components/brain/AlertsPanel";
import { QuickStats } from "@/components/brain/QuickStats";

export const revalidate = 60;

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-white/3 rounded-lg animate-pulse ${className}`} />;
}

export default async function BrainPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">BRAIN</h1>
        <p className="text-white/40 text-sm mt-1">
          Cockpit CEO —{" "}
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-10" />}>
        <AlertsPanel />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-14" />}>
        <QuickStats />
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
        <VitalsGrid />
      </Suspense>
    </div>
  );
}
