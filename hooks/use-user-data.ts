"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/hooks/use-auth"
import {
  getUserProfile,
  updateUserName,
  type UserProfile,
} from "@/lib/firebase/user-profile"

interface UseUserDataResult {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  saveName: (name: string) => Promise<{ error: string | null }>
}

export function useUserData(): UseUserDataResult {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const result = await getUserProfile(user.uid)
    setProfile(result)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    void refresh()
  }, [authLoading, refresh])

  const saveName = useCallback(
    async (name: string) => {
      if (!user) return { error: "You must be signed in." }

      const trimmed = name.trim()
      if (!trimmed) return { error: "Name cannot be empty." }

      setError(null)
      const result = await updateUserName(user.uid, trimmed)

      if (result.error) {
        setError(result.error)
        return result
      }

      setProfile((prev) =>
        prev
          ? { ...prev, name: trimmed }
          : {
              uid: user.uid,
              name: trimmed,
              email: user.email ?? "",
              createdAt: null,
            }
      )

      return { error: null }
    },
    [user]
  )

  return {
    profile,
    loading: authLoading || loading,
    error,
    refresh,
    saveName,
  }
}
