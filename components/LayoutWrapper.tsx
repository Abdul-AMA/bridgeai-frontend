"use client";

import { usePathname } from "next/navigation";
import { ClientLayout } from "./ClientLayout";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't use ClientLayout for landing page
    if (pathname === "/") {
        return <>{children}</>;
    }

    return <ClientLayout>{children}</ClientLayout>;
}