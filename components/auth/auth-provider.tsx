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
    // Track the last synced uid to prevent repeated Firestore calls on token refresh
    let lastSyncedUid: string | null = null

    async function initAuth() {
      try {
        await configureAuthPersistence(auth!, "session")
      } catch {
        // Persistence may already be set — continue
      }

      const unsubscribe = onAuthStateChanged(auth!, (nextUser) => {
        if (cancelled) return
        setUser(nextUser)

        // Only sync profile when the user identity actually changes (not on token refresh)
        if (nextUser && nextUser.uid !== lastSyncedUid) {
          lastSyncedUid = nextUser.uid
          console.log("[Auth] User ready, uid:", nextUser.uid, "— syncing profile")
          syncUserProfile(nextUser).catch(() => {
            // Profile sync is non-blocking
          })
        } else if (!nextUser) {
          lastSyncedUid = null
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
