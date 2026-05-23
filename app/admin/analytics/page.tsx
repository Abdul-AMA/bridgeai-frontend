"use client";

import { useState } from "react";
import { AdminChart } from "@/components/admin/AdminChart";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import type { AdminAnalyticsMetric } from "@/dto/admin.dto";

const METRICS: { value: AdminAnalyticsMetric; label: string }[] = [
  { value: "tokens", label: "AI tokens" },
  { value: "crs_generations", label: "CRS generations" },
  { value: "active_users", label: "Active users" },
  { value: "new_teams", label: "New teams" },
  { value: "ai_errors", label: "AI errors" },
];

function defaultRange() {
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
  return { from, to };
}

export default function AdminAnalyticsPage() {
  const { from, to } = defaultRange();
  const [metric, setMetric] = useState<AdminAnalyticsMetric>("tokens");
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [groupBy, setGroupBy] = useState("");

  const { data, loading, error } = useAdminAnalytics({
    metric,
    from_date: fromDate,
    to_date: toDate,
    group_by: groupBy || undefined,
  });

  const showGroupBy = metric === "tokens" || metric === "crs_generations";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Analytics</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Metric</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as AdminAnalyticsMetric)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {METRICS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {showGroupBy && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Group by</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None</option>
              {metric === "tokens" && <option value="team">Team</option>}
              {metric === "crs_generations" && <option value="pattern">Pattern</option>}
            </select>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="h-60 flex items-center justify-center">
          <p className="text-sm text-gray-400 animate-pulse">Loading chart…</p>
        </div>
      ) : data ? (
        <AdminChart
          data={data}
          title={METRICS.find((m) => m.value === metric)?.label}
          height={320}
        />
      ) : null}
    </div>
  );
}
