import { SectionShell } from "@/components/brain/SectionShell";

export default async function AIPage() {

  return (
    <SectionShell
      title="AI & Kura Compliance"
      description="Coûts par modèle, guardrails stats, pipeline RAG, evals qualité"
      icon="🧠"
      phase={4}
      items={[
        { label: "Haiku usage", value: "—", sub: "% des requêtes Kura" },
        { label: "Sonnet usage", value: "—", sub: "% des requêtes" },
        { label: "Coût moyen / user", value: "—", sub: "Par mois" },
        { label: "GR1 déclenchés", value: "—", sub: "RED jamais autorisé" },
        { label: "GR2 déclenchés", value: "—", sub: "Disclaimer Canada" },
        { label: "GR3 — Inconnus", value: "—", sub: "Substances inconnues" },
        { label: "Score evals", value: "—", sub: "Substances correctes /100" },
        { label: "Fraîcheur DB WADA", value: "—", sub: "Dernière mise à jour" },
        { label: "Temps réponse moyen", value: "—", sub: "Kura /ask endpoint" },
      ]}
    />
  );
}
