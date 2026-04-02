import { Suspense } from "react";
import { BrainNav } from "@/components/brain/BrainNav";
import { ProjectSwitcher } from "@/components/brain/ProjectSwitcher";

export const metadata = {
  title: "Brain Dashboard",
  description: "Cockpit CEO — tous les projets, toutes les métriques",
};

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A12] text-white overflow-hidden">
      <Suspense fallback={<div className="w-56 flex-shrink-0 bg-[#080810] border-r border-white/5" />}>
        <BrainNav role="admin" />
      </Suspense>
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b border-white/5 bg-[#0A0A12] px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/30">Live</span>
            </div>
            <Suspense>
              <ProjectSwitcher />
            </Suspense>
          </div>
          <span className="text-xs text-white/20">Romain · Brain OS</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
