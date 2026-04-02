import { SectionShell } from "@/components/brain/SectionShell";

export default async function ProduitsPage() {

  return (
    <SectionShell
      title="Produits & Utilisateurs"
      description="DAU/WAU/MAU, funnel activation, beta testeurs, comptes en attente"
      icon="📦"
      phase={2}
      items={[
        { label: "Utilisateurs Kura", value: "—", sub: "DAU / MAU" },
        { label: "Utilisateurs Lokivo", value: "—", sub: "DAU / MAU" },
        { label: "Beta testeurs actifs", value: "—", sub: "Tous projets" },
        { label: "Taux activation", value: "—", sub: "Inscription → 1ère action" },
        { label: "Rétention D7", value: "—" },
        { label: "Comptes en attente", value: "—", sub: "Invitations à envoyer" },
      ]}
    />
  );
}
