"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Activity,
  Cpu,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { useAIUsage } from "@/hooks/aiusage/useAIUsage";
import { getCookie } from "@/lib/utils";

const PIE_COLORS = [
  "#341BAB",
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
];

const NODE_LABELS: Record<string, string> = {
  clarification_analyze: "Clarification (Analyze)",
  clarification_questions: "Clarification (Questions)",
  template_filler_extract: "CRS Extraction",
  template_filler_summary: "CRS Summary",
  suggestions: "Suggestions",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-start gap-4">
      <div className="p-3 rounded-xl bg-indigo-50">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function AIUsagePage() {
  const router = useRouter();
  const token = getCookie("token");

  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  const { summary, history, historyPage, totalHistoryPages, isLoading, error, goToPage, refresh } =
    useAIUsage(30);

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Pie chart data
  const pieData = summary
    ? Object.entries(summary.by_node_type).map(([key, val]) => ({
        name: NODE_LABELS[key] ?? key,
        value: val.tokens,
      }))
    : [];

  // Bar chart data — last 30 days
  const barData = summary
    ? summary.daily_breakdown.map((d) => ({
        date: d.date.slice(5), // MM-DD
        tokens: d.input_tokens + d.output_tokens,
        calls: d.calls,
      }))
    : [];

  return (
    <div className="pt-12 pb-14 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              AI Usage
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your personal token consumption for the last 30 days
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Activity}
            label="Total API Calls"
            value={summary ? fmt(summary.total_calls) : "—"}
            sub="across all AI nodes"
          />
          <StatCard
            icon={Cpu}
            label="Total Tokens"
            value={summary ? fmt(summary.total_tokens) : "—"}
            sub={
              summary
                ? `${fmt(summary.total_input_tokens)} in · ${fmt(summary.total_output_tokens)} out`
                : undefined
            }
          />
          <StatCard
            icon={DollarSign}
            label="Estimated Cost"
            value={summary ? `$${summary.estimated_cost_usd.toFixed(4)}` : "—"}
            sub="approximate, based on public pricing"
          />
        </div>

        {/* Charts row */}
        {summary && (barData.length > 0 || pieData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily token bar chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Tokens per Day
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
                  <Tooltip
                    formatter={(v: unknown) => [fmt(Number(v)), "tokens"]}
                    labelFormatter={(l) => `Date: ${l}`}
                  />
                  <Bar dataKey="tokens" fill="#341BAB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Node type pie chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Token Usage by Node Type
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [fmt(Number(v)), "tokens"]} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-700">
              Recent AI Calls
            </h2>
          </div>

          {!history || history.items.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              No AI calls recorded yet. Start a chat to generate usage data.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Node Type</th>
                      <th className="px-6 py-3">Model</th>
                      <th className="px-6 py-3">Provider</th>
                      <th className="px-6 py-3 text-right">Input</th>
                      <th className="px-6 py-3 text-right">Output</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.items.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {NODE_LABELS[log.node_type] ?? log.node_type}
                        </td>
                        <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                          {log.model_name}
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 capitalize">
                            {log.provider}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-gray-600">
                          {fmt(log.input_tokens)}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-600">
                          {fmt(log.output_tokens)}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-gray-900">
                          {fmt(log.total_tokens)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalHistoryPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Page {historyPage} of {totalHistoryPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(historyPage - 1)}
                      disabled={historyPage <= 1}
                      className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => goToPage(historyPage + 1)}
                      disabled={historyPage >= totalHistoryPages}
                      className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
  );
}
