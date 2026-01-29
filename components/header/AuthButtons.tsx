"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/auth/register") {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={() => router.push("/auth/login")}
        className="flex items-center gap-2"
      >
        Login
      </Button>
    );
  }

  if (pathname === "/auth/login") {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={() => router.push("/auth/register")}
        className="flex items-center gap-2"
      >
        Register
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/auth/login")}
        className="flex items-center gap-2"
      >
        Login
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={() => router.push("/auth/register")}
        className="flex items-center gap-2"
      >
        Register
      </Button>
    </>
  );
}
