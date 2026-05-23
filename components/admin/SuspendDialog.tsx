"use client";

import { useState } from "react";

interface SuspendDialogProps {
  entityName: string;
  entityType: "user" | "team";
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SuspendDialog({
  entityName,
  entityType,
  onConfirm,
  onCancel,
  loading = false,
}: SuspendDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Suspend {entityType}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          You are about to suspend{" "}
          <span className="font-medium text-gray-800">{entityName}</span>. This
          action is logged and reversible.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Describe why this account is being suspended…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading || !reason.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Suspending…" : "Confirm Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}
