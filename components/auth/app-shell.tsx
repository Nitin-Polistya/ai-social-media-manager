"use client"

import { usePathname } from "next/navigation"

import { AuthGate } from "@/components/auth/auth-gate"
import { SiteHeader } from "@/components/layout/site-header"

/** Pages where the top navigation bar should be hidden */
const HEADERLESS_PATHS = ["/login"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeader = !HEADERLESS_PATHS.includes(pathname)

  return (
    <AuthGate>
      {showHeader ? <SiteHeader /> : null}
      <main className="flex-1">{children}</main>
    </AuthGate>
  )
}
