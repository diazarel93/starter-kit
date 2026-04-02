import { requireAuth } from "@/lib/auth";

export default async function LegalPage() {
  await requireAuth();

  const checklist = [
    {
      category: "RGPD",
      items: [
        { label: "Politique de confidentialité", status: null },
        { label: "CGU à jour", status: null },
        { label: "Mentions légales", status: null },
        { label: "Consentement cookies", status: null },
        { label: "Registre des traitements", status: null },
        { label: "Droit à l'effacement (delete account)", status: null },
        { label: "Export données utilisateur", status: null },
      ],
    },
    {
      category: "Kura Compliance",
      items: [
        { label: "Disclaimer Canada actif", status: null },
        { label: "GR1 — RED jamais autorisé", status: "ok" },
        { label: "GR2 — Canada disclaimer", status: "ok" },
        { label: "GR3 — Inconnu → À vérifier", status: "ok" },
        { label: "GR4 — S3 en compétition", status: "ok" },
        { label: "Liste WADA à jour", status: null },
      ],
    },
    {
      category: "Obligations fiscales",
      items: [
        { label: "Statut juridique défini", status: null },
        { label: "Système de facturation", status: null },
        { label: "TVA configurée", status: null },
        { label: "Kbis / statuts déposés", status: null },
      ],
    },
    {
      category: "Propriété intellectuelle",
      items: [
        { label: "Marques déposées", status: null },
        { label: "Domaines sécurisés", status: null },
        { label: "Licences open source vérifiées", status: null },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">⚖️ Légal & RGPD</h1>
        <p className="text-white/40 text-sm mt-1">Obligations réglementaires, compliance, fiscal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {checklist.map((cat) => (
          <div key={cat.category} className="bg-white/3 border border-white/5 rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
              {cat.category}
            </h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                    item.status === "ok"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "danger"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/5 text-white/20"
                  }`}>
                    {item.status === "ok" ? "✓" : item.status === "danger" ? "✗" : "?"}
                  </span>
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/70">
          Phase 7 — Les données légales seront remplies manuellement. Connecter un service juridique en V2.
        </p>
      </div>
    </div>
  );
}
