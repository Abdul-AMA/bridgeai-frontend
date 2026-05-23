interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  highlight?: "red" | "yellow" | "green" | "default";
}

export function StatCard({ label, value, sub, highlight = "default" }: StatCardProps) {
  const accent: Record<string, string> = {
    red: "border-red-400 bg-red-50",
    yellow: "border-yellow-400 bg-yellow-50",
    green: "border-green-400 bg-green-50",
    default: "border-gray-200 bg-white",
  };

  return (
    <div
      className={`rounded-xl border ${accent[highlight]} p-5 shadow-sm flex flex-col gap-1`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-3xl font-bold text-gray-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}
