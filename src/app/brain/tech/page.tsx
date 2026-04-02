import { requireAuth } from "@/lib/auth";
import { SectionShell } from "@/components/brain/SectionShell";

export default async function TechPage() {
  await requireAuth();

  return (
    <SectionShell
      title="Santé Technique"
      description="Builds CI/CD, TypeScript errors, Lighthouse, uptime, sécurité"
      icon="🔧"
      phase={2}
      items={[
        { label: "Kura V4 — dernier build", value: "—", sub: "GitHub Actions" },
        { label: "Banlieuwood — build", value: "—", sub: "Vercel" },
        { label: "Lokivo — build", value: "—", sub: "Vercel" },
        { label: "Starter-kit — CI", value: "—", sub: "TypeScript + Tests" },
        { label: "Uptime global", value: "—", sub: "30 derniers jours" },
        { label: "CVEs critiques", value: "—", sub: "npm audit" },
        { label: "Secrets exposés", value: "0", sub: "Aucun détecté ✓" },
      ]}
    />
  );
}
