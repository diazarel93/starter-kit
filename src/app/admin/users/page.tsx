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
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Utilisateurs autorises</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Gere qui peut acceder a l&apos;application.
        </p>
      </div>
      <UserTable users={users ?? []} />
    </main>
  );
}
