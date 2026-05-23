"use client";

import { AdminChart } from "@/components/admin/AdminChart";
import { StatCard } from "@/components/admin/StatCard";
import { useAdminAnalytics, useAdminOverview } from "@/hooks/useAdmin";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const TODAY = new Date().toISOString().slice(0, 10);
const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);

export default function AdminOverviewPage() {
  const overview = useAdminOverview();
  const tokenTrend = useAdminAnalytics({
    metric: "tokens",
    from_date: THIRTY_DAYS_AGO,
    to_date: TODAY,
  });

  if (overview.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm animate-pulse">Loading overview…</p>
      </div>
    );
  }

  if (overview.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Failed to load overview: {overview.error}
      </div>
    );
  }

  const stats = overview.data!;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.total_users} />
        <StatCard
          label="Active users"
          value={stats.active_users}
          sub={`${stats.total_users - stats.active_users} suspended`}
        />
        <StatCard label="Total teams" value={stats.total_teams} />
        <StatCard
          label="Suspended teams"
          value={stats.suspended_teams}
          highlight={stats.suspended_teams > 0 ? "yellow" : "default"}
        />
        <StatCard label="CRS generated" value={stats.total_crs_generated} />
        <StatCard
          label="AI tokens used"
          value={formatTokens(stats.total_ai_tokens)}
        />
        <StatCard
          label="AI errors (7d)"
          value={stats.ai_error_count_7d}
          highlight={stats.ai_error_count_7d > 0 ? "red" : "green"}
        />
      </div>

      {/* Token trend chart */}
      {tokenTrend.data && (
        <AdminChart
          data={tokenTrend.data}
          title="AI token usage — last 30 days"
          height={220}
        />
      )}

      {/* Feed rows */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent errors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent errors</h2>
          {stats.recent_errors.length === 0 ? (
            <p className="text-xs text-gray-400">No errors recorded.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-xs">
              {stats.recent_errors.map((e) => (
                <li key={e.id} className="py-2 flex flex-col gap-0.5">
                  <span className="font-medium text-red-600">{e.error_code}</span>
                  <span className="text-gray-700 truncate">{e.path}</span>
                  <span className="text-gray-400 truncate">{e.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent admin activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent admin activity</h2>
          {stats.recent_activity.length === 0 ? (
            <p className="text-xs text-gray-400">No admin actions recorded.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-xs">
              {stats.recent_activity.map((a) => (
                <li key={a.id} className="py-2 flex flex-col gap-0.5">
                  <span className="font-medium text-gray-800">{a.action}</span>
                  <span className="text-gray-500">
                    {a.target_type} #{a.target_id} · by {a.actor_email}
                  </span>
                  {a.reason && (
                    <span className="text-gray-400 truncate">{a.reason}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
