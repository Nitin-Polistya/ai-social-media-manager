"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { onAuthStateChanged, type User } from "firebase/auth"

import { getFirebaseAuth } from "@/lib/firebase/client"
import { configureAuthPersistence } from "@/lib/firebase/persistence"
import { syncUserProfile } from "@/lib/firebase/user-profile"

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function initAuth() {
      try {
        await configureAuthPersistence(auth!, "local")
      } catch {
        // Persistence may already be set — continue
      }

      const unsubscribe = onAuthStateChanged(auth!, (nextUser) => {
        if (cancelled) return
        setUser(nextUser)

        if (nextUser) {
          syncUserProfile(nextUser).catch(() => {
            // Profile sync is non-blocking
          })
        }

        setLoading(false)
      })

      return unsubscribe
    }

    let unsubscribe: (() => void) | undefined

    initAuth()
      .then((unsub) => {
        unsubscribe = unsub
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event.reason
      if (
        reason &&
        typeof reason === "object" &&
        "code" in reason &&
        String((reason as { code: string }).code).startsWith("auth/")
      ) {
        event.preventDefault()
      }
      if (
        reason instanceof Error &&
        reason.message.toLowerCase().includes("offline")
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () =>
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
