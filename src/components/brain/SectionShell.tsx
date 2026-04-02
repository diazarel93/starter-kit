// SectionShell — Layout générique pour les sections en construction

interface SectionItem {
  label: string;
  value: string;
  sub?: string;
  status?: "ok" | "warn" | "danger";
}

interface SectionShellProps {
  title: string;
  description: string;
  icon: string;
  phase: number;
  items: SectionItem[];
}

export function SectionShell({ title, description, icon, phase, items }: SectionShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">{icon} {title}</h1>
        <p className="text-white/40 text-sm mt-1">{description}</p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-white/3 border border-white/5 rounded-lg p-4"
          >
            <p className="text-xs text-white/30 uppercase tracking-wide">{item.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
            {item.sub && <p className="text-xs text-white/30 mt-1">{item.sub}</p>}
          </div>
        ))}
      </div>

      {/* Phase indicator */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4 flex items-center gap-3">
        <span className="text-xs bg-[#FF6B35]/20 text-[#FF6B35] px-2 py-1 rounded">
          Phase {phase}
        </span>
        <p className="text-xs text-white/30">
          Données réelles disponibles à la Phase {phase} du plan de build.
          Voir <code className="text-white/40">docs/BRAIN_DASHBOARD_SPEC.md</code> pour le roadmap complet.
        </p>
      </div>
    </div>
  );
}
