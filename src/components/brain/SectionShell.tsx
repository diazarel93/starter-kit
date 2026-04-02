// SectionShell — Layout générique pour les sections

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
  items: SectionItem[];
  phase?: number;
}

const STATUS_BORDER = {
  ok: "border-green-500/20",
  warn: "border-yellow-500/30",
  danger: "border-red-500/30",
};

const STATUS_TEXT = {
  ok: "text-green-400",
  warn: "text-yellow-400",
  danger: "text-red-400",
};

export function SectionShell({ title, description, icon, items }: SectionShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">{icon} {title.toUpperCase()}</h1>
        <p className="text-white/40 text-sm mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const borderClass = item.status ? STATUS_BORDER[item.status] : "border-white/5";
          const valueClass = item.status ? STATUS_TEXT[item.status] : "text-white";
          const isDash = item.value === "—";
          return (
            <div
              key={item.label}
              className={`bg-white/3 border ${borderClass} rounded-lg p-4`}
            >
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{item.label}</p>
              <p className={`text-2xl font-bold ${isDash ? "text-white/20" : valueClass}`}>
                {item.value}
              </p>
              {item.sub && <p className="text-xs text-white/30 mt-1">{item.sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
