"use client";

import { use, useState } from "react";
import { useAdminUser } from "@/hooks/useAdmin";
import { adminSuspendUser, adminReactivateUser, adminChangeUserRole } from "@/services/admin.service";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, loading, error, refetch } = useAdminUser(Number(id));

  const [suspendReason, setSuspendReason] = useState("");
  const [newRole, setNewRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSuspend() {
    if (!suspendReason.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await adminSuspendUser(Number(id), { action: "suspend", reason: suspendReason });
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
      await adminReactivateUser(Number(id));
      refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRoleChange() {
    if (!newRole) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await adminChangeUserRole(Number(id), { role: newRole as "client" | "ba" });
      setNewRole("");
      refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400 animate-pulse">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.full_name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {user.is_active ? "Active" : "Suspended"}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-sm">
        <div><span className="text-gray-500">Role</span><p className="font-medium">{user.role ?? "—"}</p></div>
        <div><span className="text-gray-500">Joined</span><p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p></div>
        <div><span className="text-gray-500">CRS generated</span><p className="font-medium">{user.total_crs_count}</p></div>
        <div><span className="text-gray-500">AI tokens used</span><p className="font-medium">{user.total_ai_tokens.toLocaleString()}</p></div>
        {!user.is_active && (
          <>
            <div><span className="text-gray-500">Suspended at</span><p className="font-medium">{user.suspended_at ? new Date(user.suspended_at).toLocaleString() : "—"}</p></div>
            <div className="col-span-2"><span className="text-gray-500">Reason</span><p className="font-medium">{user.suspension_reason ?? "—"}</p></div>
          </>
        )}
      </div>

      {/* Team memberships */}
      {user.team_memberships.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Teams</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {user.team_memberships.map((tm) => (
              <li key={tm.team_id} className="flex justify-between py-2">
                <span className="font-medium text-gray-800">{tm.team_name}</span>
                <span className="text-gray-500 text-xs">{tm.role} · joined {new Date(tm.joined_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Admin actions */}
      {actionError && (
        <p className="text-sm text-red-600">{actionError}</p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Suspend / Reactivate */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Account status</h2>
          {user.is_active ? (
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
                Suspend user
              </button>
            </>
          ) : (
            <button
              onClick={handleReactivate}
              disabled={actionLoading}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Reactivate user
            </button>
          )}
        </div>

        {/* Change role */}
        {user.role !== "super_admin" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Change role</h2>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select new role…</option>
              {user.role !== "client" && <option value="client">Client</option>}
              {user.role !== "ba" && <option value="ba">BA</option>}
            </select>
            <button
              onClick={handleRoleChange}
              disabled={actionLoading || !newRole}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Update role
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
