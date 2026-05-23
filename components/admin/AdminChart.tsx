"use client";

import dynamic from "next/dynamic";
import type { AdminTimeSeriesDTO } from "@/dto/admin.dto";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
);

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface AdminChartProps {
  data: AdminTimeSeriesDTO;
  title?: string;
  height?: number;
}

export function AdminChart({ data, title, height = 240 }: AdminChartProps) {
  if (!data.labels.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        style={{ height }}
      >
        <p className="text-sm text-gray-400">No data for this period</p>
      </div>
    );
  }

  const chartData = data.labels.map((label, i) => {
    const point: Record<string, number | string> = { date: label };
    data.datasets.forEach((ds) => {
      point[ds.label] = ds.data[i] ?? 0;
    });
    return point;
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {title && (
        <p className="text-sm font-semibold text-gray-700 mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 11 }} width={40} />
          <Tooltip />
          {data.datasets.length > 1 && <Legend />}
          {data.datasets.map((ds, i) => (
            <Line
              key={ds.label}
              type="monotone"
              dataKey={ds.label}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
