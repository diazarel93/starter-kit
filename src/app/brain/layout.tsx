import { Suspense } from "react";
import { BrainNav } from "@/components/brain/BrainNav";
import { ProjectSwitcher } from "@/components/brain/ProjectSwitcher";

export const metadata = {
  title: "Brain Dashboard",
  description: "Cockpit CEO — tous les projets, toutes les métriques",
};

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] text-white">
      <Suspense
        fallback={<div className="w-56 flex-shrink-0 border-r border-white/5 bg-[#080810]" />}
      >
        <BrainNav role="admin" />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#0A0A12] px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-xs text-white/30">Live</span>
            </div>
            <Suspense>
              <ProjectSwitcher />
            </Suspense>
          </div>
          <span className="text-xs text-white/20">Romain · Brain OS</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
