import Link from "next/link";
import { COLORS } from "@/constants";
import { geistSans } from "@/fonts";

export function HeaderLogo() {
  return (
    <Link href="/teams" className="flex items-center h-full">
      <span
        className={`font-bold ${geistSans.variable} text-lg sm:text-xl`}
        style={{ color: COLORS.primary, lineHeight: 1 }}
      >
        BridgeAI
      </span>
    </Link>
  );
}
