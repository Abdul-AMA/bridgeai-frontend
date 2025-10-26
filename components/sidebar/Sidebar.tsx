"use client";

import { usePathname } from "next/navigation";
import { Home, FolderGit2Icon, Settings } from "lucide-react";
import { NavItem } from "./NavItem";
import { COLORS } from "@/constants";

interface SidebarProps {
  currentTeamId: string;
}

export function Sidebar({ currentTeamId }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: `/teams/${currentTeamId}/dashboard`, label: "Dashboard", icon: Home },
    { href: `/teams/${currentTeamId}/projects`, label: "Projects", icon: FolderGit2Icon },
    { href: `/teams/${currentTeamId}/settings`, label: "Team Settings", icon: Settings },
  ];

  return (
    <aside className="fixed top-12 left-0 h-[calc(100vh-3rem)] w-13 flex flex-col items-center py-5 space-y-4 text-white" style={{ backgroundColor: "#341BAB" }}>
      {navItems.map(item => (
        <NavItem key={item.href} {...item} isActive={pathname.startsWith(item.href)} />
      ))}
    </aside>
  );
}
