import { requireAuth } from "@/lib/auth";
import { VitalsGrid } from "@/components/brain/VitalsGrid";
import { AlertsPanel } from "@/components/brain/AlertsPanel";
import { QuickStats } from "@/components/brain/QuickStats";

export default async function BrainPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">BRAIN</h1>
        <p className="text-white/40 text-sm mt-1">
          Cockpit CEO — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <AlertsPanel />
      <QuickStats />
      <VitalsGrid />
    </div>
  );
}
