"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (loading) return
    if (!user && !isLoginPage) router.replace("/login")
    if (user && isLoginPage) router.replace("/")
  }, [user, loading, isLoginPage, router])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user && !isLoginPage) return null
  return children
}
