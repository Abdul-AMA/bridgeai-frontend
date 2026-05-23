"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminAudit, fetchAdminErrors, fetchAdminLogs } from "@/services/admin.service";
import type {
  AdminAuditLogDTO,
  AdminErrorLogDTO,
  AdminLogCategory,
  AdminLogEntryDTO,
  PaginatedResponseDTO,
} from "@/dto/admin.dto";

const CATEGORIES: { value: AdminLogCategory | "audit" | "errors"; label: string }[] = [
  { value: "user_activity", label: "User Activity" },
  { value: "ai_generation", label: "AI Generation" },
  { value: "auth", label: "Auth" },
  { value: "api_errors", label: "API Errors" },
  { value: "audit_trail", label: "Audit Trail" },
  { value: "token_usage", label: "Token Usage" },
  { value: "system", label: "System" },
  { value: "audit", label: "CRS Audit" },
  { value: "errors", label: "Error Log" },
];

export default function AdminLogsPage() {
  const [category, setCategory] = useState<string>("audit_trail");
  const [keyword, setKeyword] = useState("");
  const [actor, setActor] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    items: (AdminLogEntryDTO | AdminAuditLogDTO | AdminErrorLogDTO)[];
    total: number;
    pages: number;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (category === "audit") {
        const data = await fetchAdminAudit({ page, page_size: 25, actor: actor || undefined });
        setResult(data);
      } else if (category === "errors") {
        const data = await fetchAdminErrors({ page, page_size: 25, keyword: keyword || undefined });
        setResult(data);
      } else {
        const data = await fetchAdminLogs({
          category,
          page,
          page_size: 25,
          actor: actor || undefined,
          keyword: keyword || undefined,
        });
        setResult({ items: data.items, total: data.total, pages: data.pages });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [category, page, keyword, actor]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Logs</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {category !== "errors" && (
          <input
            type="text"
            placeholder="Filter by actor email…"
            value={actor}
            onChange={(e) => { setActor(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
          />
        )}
        <input
          type="text"
          placeholder="Keyword filter…"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Timestamp", "Actor / Email", "Event / Action", "Detail"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result?.items.map((row) => {
                  // Normalise across log entry types
                  const isAudit = "crs_id" in row;
                  const isError = "error_code" in row;
                  const id = row.id;
                  const ts = isAudit
                    ? (row as AdminAuditLogDTO).changed_at
                    : isError
                    ? (row as AdminErrorLogDTO).created_at
                    : (row as AdminLogEntryDTO).timestamp;
                  const actor2 = isAudit
                    ? (row as AdminAuditLogDTO).changed_by_email
                    : isError
                    ? String((row as AdminErrorLogDTO).user_id ?? "—")
                    : ((row as AdminLogEntryDTO).actor ?? "—");
                  const event = isAudit
                    ? (row as AdminAuditLogDTO).action
                    : isError
                    ? `${(row as AdminErrorLogDTO).method} ${(row as AdminErrorLogDTO).path}`
                    : (row as AdminLogEntryDTO).event;
                  const detail = isAudit
                    ? `CRS #${(row as AdminAuditLogDTO).crs_id} · ${(row as AdminAuditLogDTO).old_status} → ${(row as AdminAuditLogDTO).new_status}`
                    : isError
                    ? (row as AdminErrorLogDTO).message
                    : ((row as AdminLogEntryDTO).detail ?? "—");

                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{id}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(ts).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{actor2}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{event}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{detail}</td>
                    </tr>
                  );
                })}
                {!result?.items.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      No log entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {result && result.pages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {result.pages} ({result.total} entries)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(result.pages, p + 1))}
                disabled={page === result.pages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
