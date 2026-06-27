"use client"

import { signOut } from "firebase/auth"
import { LogOut } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { getFirebaseAuth } from "@/lib/firebase/client"

export function LogoutButton() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="hidden sm:inline-flex"
      onClick={() => {
        const auth = getFirebaseAuth()
        if (auth) void signOut(auth)
      }}
    >
      <LogOut data-icon="inline-start" />
      Logout
    </Button>
  )
}
