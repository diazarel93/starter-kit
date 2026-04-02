// AlertsPanel — Alertes critiques business + tech

interface Alert {
  type: "danger" | "warn" | "info";
  message: string;
  source: string;
  time?: string;
}

// TODO: fetch from real sources (Stripe webhook events, GitHub CI, Supabase quotas)
const MOCK_ALERTS: Alert[] = [
  { type: "info", message: "Dashboard initialisé — connecter les APIs pour des données réelles", source: "Brain", time: "maintenant" },
];

export function AlertsPanel() {
  if (MOCK_ALERTS.length === 0) return null;

  return (
    <div className="space-y-2">
      {MOCK_ALERTS.map((alert, i) => (
        <AlertBadge key={i} {...alert} />
      ))}
    </div>
  );
}

function AlertBadge({ type, message, source, time }: Alert) {
  const styles = {
    danger: "bg-red-500/10 border-red-500/30 text-red-300",
    warn: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
  }[type];

  const icon = { danger: "🔴", warn: "🟡", info: "🔵" }[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${styles} text-sm`}>
      <span>{icon}</span>
      <span className="flex-1">{message}</span>
      <span className="text-xs opacity-50">{source}</span>
      {time && <span className="text-xs opacity-40">{time}</span>}
    </div>
  );
}
