import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthorizedUser = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  invited_by: string | null;
  created_at: string;
  last_seen_at: string | null;
  is_active: boolean;
};

// Verifie si l'utilisateur connecte est dans la whitelist
// Redirige vers /login si non connecte, /unauthorized si non autorise
export async function requireAuth(): Promise<AuthorizedUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const { data: authorized } = await supabase
    .from("authorized_users")
    .select("*")
    .eq("email", user.email)
    .eq("is_active", true)
    .single();

  if (!authorized) {
    redirect("/unauthorized");
  }

  // Mettre a jour last_seen_at
  await supabase
    .from("authorized_users")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("email", user.email);

  return authorized as AuthorizedUser;
}

// Verifie si l'utilisateur est admin
export async function requireAdmin(): Promise<AuthorizedUser> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}

// Recupere l'utilisateur sans rediriger (pour les layouts)
export async function getCurrentUser(): Promise<AuthorizedUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return null;

    const { data } = await supabase
      .from("authorized_users")
      .select("*")
      .eq("email", user.email)
      .eq("is_active", true)
      .single();

    return data as AuthorizedUser | null;
  } catch {
    return null;
  }
}
