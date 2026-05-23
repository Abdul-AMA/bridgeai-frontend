"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, BarChart3, ScrollText } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Teams", href: "/admin/teams", icon: Building2 },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Logs", href: "/admin/logs", icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-12 left-0 h-[calc(100vh-3rem)] w-56 flex flex-col py-5 text-white z-40"
      style={{ backgroundColor: "#341BAB" }}
    >
      <nav className="flex-1 flex flex-col space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              style={{ backgroundColor: active ? "#6C63FF" : "transparent" }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
