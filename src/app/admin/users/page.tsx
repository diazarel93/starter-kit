import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UserTable } from "./user-table";

export default async function UsersPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: users } = await supabase
    .from("authorized_users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Utilisateurs autorises</h1>
        <p className="text-foreground/60 mt-1 text-sm">
          Gere qui peut acceder a l&apos;application.
        </p>
      </div>
      <UserTable users={users ?? []} />
    </main>
  );
}
