"use client"

import { usePathname } from "next/navigation"

import { AuthGate } from "@/components/auth/auth-gate"
import { SiteHeader } from "@/components/layout/site-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <AuthGate>
      {!isLoginPage ? <SiteHeader /> : null}
      <main className="flex-1">{children}</main>
    </AuthGate>
  )
}
