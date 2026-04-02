interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  status?: "ok" | "warn" | "danger" | "dim" | "unknown";
  trend?: "up" | "down" | "flat";
  highlight?: boolean;
}

export function MetricCard({ label, value, sub, status, trend, highlight }: MetricCardProps) {
  const isDash = value === "—";

  const borderClass = highlight
    ? "border-green-500/20"
    : {
        ok: "border-green-500/20",
        warn: "border-yellow-500/30",
        danger: "border-red-500/30",
        dim: "border-white/5",
        unknown: "border-white/5",
      }[status ?? "unknown"];

  const bgClass = highlight ? "bg-green-500/5" : "bg-white/3";

  const valueClass = highlight
    ? "text-green-400"
    : isDash || status === "dim"
      ? "text-white/20"
      : {
          ok: "text-green-400",
          warn: "text-yellow-400",
          danger: "text-red-400",
          dim: "text-white/20",
          unknown: "text-white",
        }[status ?? "unknown"];

  const trendIcon = trend ? { up: "↑", down: "↓", flat: "—" }[trend] : null;
  const trendColor =
    trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/20";

  return (
    <div className={`${bgClass} border ${borderClass} rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <p className="text-xs tracking-widest text-white/30 uppercase">{label}</p>
        {trendIcon !== null && <span className={`text-xs ${trendColor}`}>{trendIcon}</span>}
      </div>
      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}
