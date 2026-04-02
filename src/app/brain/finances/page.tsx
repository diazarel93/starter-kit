import { requireAuth } from "@/lib/auth";
import { SectionShell } from "@/components/brain/SectionShell";

export default async function FinancesPage() {
  await requireAuth();

  return (
    <SectionShell
      title="Finances & Abonnements"
      description="MRR Stripe, coûts APIs, P&L mensuel, alertes budget"
      icon="💰"
      phase={3}
      items={[
        { label: "MRR", value: "$0", sub: "Stripe — tous plans" },
        { label: "Anthropic Claude", value: "—", sub: "Ce mois (pay-as-you-go)" },
        { label: "Supabase", value: "—", sub: "Pro plan" },
        { label: "Vercel", value: "—", sub: "Pro plan" },
        { label: "Resend", value: "—", sub: "Emails envoyés" },
        { label: "Total coûts APIs", value: "—", sub: "∑ toutes APIs" },
        { label: "Marge mensuelle", value: "—", sub: "MRR - Coûts" },
        { label: "Runway", value: "∞", sub: "Mois restants" },
      ]}
    />
  );
}
