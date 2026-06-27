"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"

const PUBLIC_PATHS = ["/login"]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname)
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = isPublicRoute(pathname)
  const requiresAuth = !isPublic
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (loading) return

    if (!user && requiresAuth) {
      router.replace("/login")
      return
    }

    if (user && isLoginPage) {
      router.replace("/dashboard")
    }
  }, [user, loading, requiresAuth, isLoginPage, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    )
  }

  if (!user && requiresAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Redirecting" />
      </div>
    )
  }

  if (user && isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Redirecting" />
      </div>
    )
  }

  return <>{children}</>
}
