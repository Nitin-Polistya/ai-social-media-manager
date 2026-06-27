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
import { syncUserProfile } from "@/lib/firebase/user-profile"

interface AuthContextValue {
  user: User | null
  /** true while Firebase is resolving the initial auth state */
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
    // getFirebaseAuth() is safe to call here — we are guaranteed to be on the
    // client inside useEffect.
    const auth = getFirebaseAuth()

    if (!auth) {
      // Firebase is not configured (missing env vars) — treat as logged-out
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      if (nextUser) void syncUserProfile(nextUser)
      setLoading(false)
    })

    return unsubscribe
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
