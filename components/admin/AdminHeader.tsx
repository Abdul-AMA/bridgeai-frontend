"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { COLORS } from "@/constants";
import { geistSans } from "@/fonts";

export function AdminHeader() {
  function handleSignOut() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  }

  return (
    <header className="fixed top-0 left-0 w-full h-12 px-4 bg-white border-b z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/admin/overview" className="flex items-center h-full">
          <span
            className={`font-bold text-lg ${geistSans.variable}`}
            style={{ color: COLORS.primary, lineHeight: 1 }}
          >
            BridgeAI
          </span>
        </Link>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wide">
          Admin
        </span>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </header>
  );
}
