import { getBrainAlerts } from "@/lib/brain-data";

export async function AlertsPanel() {
  const alerts = getBrainAlerts();

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-green-500/20 bg-green-500/5 text-sm text-green-400">
        <span>✓</span>
        <span className="flex-1">Aucune alerte active — tout est nominal</span>
        <span className="text-xs opacity-40">brain-agent</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const styles = {
          danger: "bg-red-500/10 border-red-500/30 text-red-300",
          warn: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
          info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        }[alert.type];
        const icon = { danger: "🔴", warn: "🟡", info: "🔵" }[alert.type];
        const age = formatAge(alert.date);

        return (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${styles} text-sm`}
          >
            <span>{icon}</span>
            <span className="flex-1">{alert.message}</span>
            {alert.project && (
              <span className="text-xs opacity-50">{alert.project}</span>
            )}
            <span className="text-xs opacity-40">{age}</span>
          </div>
        );
      })}
    </div>
  );
}

function formatAge(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "<1h";
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}j`;
  } catch {
    return "—";
  }
}
