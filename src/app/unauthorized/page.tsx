"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-sm text-center space-y-4">
        <div className="text-5xl">🚫</div>
        <h1 className="text-2xl font-bold">Acces refuse</h1>
        <p className="text-foreground/60 text-sm">
          Ton compte n&apos;est pas autorise a acceder a cette application.
          Contacte l&apos;administrateur pour demander l&apos;acces.
        </p>
        <button
          onClick={logout}
          className="text-sm underline text-foreground/40 hover:text-foreground"
        >
          Se deconnecter
        </button>
      </div>
    </main>
  );
}
