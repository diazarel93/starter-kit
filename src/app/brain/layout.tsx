import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrainNav } from "@/components/brain/BrainNav";
import { BrainHeader } from "@/components/brain/BrainHeader";

export const metadata = {
  title: "Brain Dashboard",
  description: "Cockpit CEO — tous les projets, toutes les métriques",
};

export default async function BrainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-[#0A0A12] text-white overflow-hidden">
      <BrainNav role={user.role} />
      <div className="flex flex-col flex-1 min-w-0">
        <BrainHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
