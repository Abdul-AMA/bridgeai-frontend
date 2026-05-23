"use client";

import { use, useState } from "react";
import { useAdminTeam } from "@/hooks/useAdmin";
import { adminSuspendTeam, adminReactivateTeam } from "@/services/admin.service";

export default function AdminTeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: team, loading, error, refetch } = useAdminTeam(Number(id));

  const [suspendReason, setSuspendReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSuspend() {
    if (!suspendReason.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await adminSuspendTeam(Number(id), { action: "suspend", reason: suspendReason });
      setSuspendReason("");
      refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivate() {
    setActionLoading(true);
    setActionError(null);
    try {
      await adminReactivateTeam(Number(id));
      refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400 animate-pulse">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!team) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{team.name}</h1>
          {team.description && <p className="text-sm text-gray-500 mt-0.5">{team.description}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          team.status === "active"
            ? "bg-green-100 text-green-700"
            : team.status === "suspended"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {team.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-sm">
        <div><span className="text-gray-500">Creator</span><p className="font-medium">{team.creator_name}</p><p className="text-xs text-gray-400">{team.creator_email}</p></div>
        <div><span className="text-gray-500">Members</span><p className="font-medium">{team.member_count}</p></div>
        <div><span className="text-gray-500">Active projects</span><p className="font-medium">{team.active_project_count}</p></div>
        <div><span className="text-gray-500">CRS generated</span><p className="font-medium">{team.total_crs_count}</p></div>
        {team.status === "suspended" && (
          <div className="col-span-2"><span className="text-gray-500">Suspension reason</span><p className="font-medium">{team.suspension_reason ?? "—"}</p></div>
        )}
      </div>

      {/* Members */}
      {team.members.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Members</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {team.members.map((m) => (
              <li key={m.user_id} className="flex justify-between py-2">
                <div>
                  <span className="font-medium text-gray-800">{m.full_name}</span>
                  <span className="ml-2 text-gray-400 text-xs">{m.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{m.role}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {m.is_active ? "Active" : "Suspended"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Admin actions */}
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3 max-w-sm">
        <h2 className="text-sm font-semibold text-gray-700">Team status</h2>
        {team.status !== "suspended" ? (
          <>
            <input
              type="text"
              placeholder="Reason for suspension (required)"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleSuspend}
              disabled={actionLoading || !suspendReason.trim()}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Suspend team
            </button>
          </>
        ) : (
          <button
            onClick={handleReactivate}
            disabled={actionLoading}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Reactivate team
          </button>
        )}
      </div>
    </div>
  );
}
