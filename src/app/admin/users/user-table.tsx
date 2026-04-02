"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthorizedUser } from "@/lib/auth";

export function UserTable({ users }: { users: AuthorizedUser[] }) {
  const [list, setList] = useState(users);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const addUser = async () => {
    if (!email) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("authorized_users")
      .insert({ email, name: name || null, role: "user" })
      .select()
      .single();

    if (!error && data) {
      setList([data as AuthorizedUser, ...list]);
      setEmail("");
      setName("");
    }
    setLoading(false);
  };

  const toggleUser = async (id: string, is_active: boolean) => {
    await supabase.from("authorized_users").update({ is_active: !is_active }).eq("id", id);
    setList(list.map((u) => u.id === id ? { ...u, is_active: !is_active } : u));
  };

  const removeUser = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    await supabase.from("authorized_users").delete().eq("id", id);
    setList(list.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Ajouter un utilisateur */}
      <div className="flex gap-3">
        <input
          type="email"
          placeholder="email@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Nom (optionnel)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={addUser}
          disabled={loading || !email}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Nom</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-left font-medium">Derniere connexion</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((user) => (
              <tr key={user.id} className={!user.is_active ? "opacity-40" : ""}>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/10 text-foreground/70"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleUser(user.id, user.is_active)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                      user.is_active
                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                        : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    {user.is_active ? "Actif" : "Revoque"}
                  </button>
                </td>
                <td className="px-4 py-3 text-foreground/50">
                  {user.last_seen_at
                    ? new Date(user.last_seen_at).toLocaleDateString("fr-FR")
                    : "Jamais"}
                </td>
                <td className="px-4 py-3">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-foreground/30 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
