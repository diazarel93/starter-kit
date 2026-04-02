import { BrainNav } from "@/components/brain/BrainNav";

export const metadata = {
  title: "Brain Dashboard",
  description: "Cockpit CEO — tous les projets, toutes les métriques",
};

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A12] text-white overflow-hidden">
      <BrainNav role="admin" />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b border-white/5 bg-[#0A0A12] px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/30">Live</span>
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
