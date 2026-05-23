"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminTeams } from "@/hooks/useAdmin";

export default function AdminTeamsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useAdminTeams({
    page,
    page_size: 25,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Teams</h1>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or creator…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
          <option value="suspended">Suspended</option>
        </select>
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
                  {["Name", "Creator", "Status", "Members", "Projects", "Created", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <div>{t.creator_name}</div>
                      <div className="text-gray-400">{t.creator_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.status === "active"
                          ? "bg-green-100 text-green-700"
                          : t.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.member_count}</td>
                    <td className="px-4 py-3 text-gray-600">{t.project_count}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/teams/${t.id}`}
                        className="text-indigo-600 hover:underline text-xs font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {!data?.items.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      No teams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.pages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {data.page} of {data.pages} ({data.total} teams)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
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
