"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"

/**
 * Routes that require the user to be authenticated.
 * Any path that starts with one of these prefixes is protected.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/generator"]

/**
 * Routes that authenticated users should NOT see.
 * If a logged-in user lands here they are redirected to /dashboard.
 */
const AUTH_ONLY_PATHS = ["/login"]

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )
}

function isAuthOnly(pathname: string): boolean {
  return AUTH_ONLY_PATHS.includes(pathname)
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const needsAuth = isProtected(pathname)
  const authOnlyPage = isAuthOnly(pathname)

  useEffect(() => {
    if (loading) return

    // Unauthenticated user trying to access a protected page → send to /login
    if (!user && needsAuth) {
      router.replace("/login")
      return
    }

    // Authenticated user on the login page → send to /dashboard
    if (user && authOnlyPage) {
      router.replace("/dashboard")
    }
  }, [user, loading, needsAuth, authOnlyPage, router])

  // While Firebase is resolving auth state, show a full-screen spinner so
  // there is zero flash of the wrong page.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // Unauthenticated user on a protected page — render nothing while the
  // router.replace("/login") above takes effect.
  if (!user && needsAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // Authenticated user on the login page — render nothing while redirect fires.
  if (user && authOnlyPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
