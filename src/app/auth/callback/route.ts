import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Verifier si l'email est dans la whitelist
      const { data: authorized } = await supabase
        .from("authorized_users")
        .select("id, is_active")
        .eq("email", data.user.email)
        .single();

      if (!authorized || !authorized.is_active) {
        // Non autorise → deconnecter et rediriger
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/unauthorized`);
      }

      // Mettre a jour last_seen_at
      await supabase
        .from("authorized_users")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("email", data.user.email);

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
