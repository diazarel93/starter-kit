import type { AuthorizedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface BrainHeaderProps {
  user: AuthorizedUser;
}

export async function BrainHeader({ user }: BrainHeaderProps) {
  return (
    <header className="h-14 border-b border-white/5 bg-[#0A0A12] px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/30">Live</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/40">{user.email}</span>
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <button type="submit" className="text-xs text-white/20 hover:text-white/50 transition-colors px-2 py-1">
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
