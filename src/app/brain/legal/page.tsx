export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  const checklist = [
    {
      category: "RGPD",
      items: [
        { label: "Politique de confidentialité", status: null },
        { label: "CGU à jour", status: null },
        { label: "Mentions légales", status: null },
        { label: "Consentement cookies", status: null },
        { label: "Registre des traitements", status: null },
        { label: "Droit à l&apos;effacement (delete account)", status: null },
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
        <h1 className="font-display text-4xl text-white">LÉGAL & RGPD</h1>
        <p className="mt-1 text-sm text-white/40">Obligations réglementaires, compliance, fiscal</p>
      </div>

      {p && p !== "all" && (
        <p className="rounded border border-white/5 bg-white/3 px-3 py-2 text-xs text-white/20">
          Vue globale — cette section n&apos;est pas filtrée par projet
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {checklist.map((cat) => (
          <div key={cat.category} className="rounded-lg border border-white/5 bg-white/3 p-4">
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
              {cat.category}
            </h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-xs ${
                      item.status === "ok"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "danger"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/5 text-white/20"
                    }`}
                  >
                    {item.status === "ok" ? "✓" : item.status === "danger" ? "✗" : "?"}
                  </span>
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
