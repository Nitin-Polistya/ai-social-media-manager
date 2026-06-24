"use client"

import { signOut } from "firebase/auth"
import { LogOut } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase/client"

export function LogoutButton() {
  const { user } = useAuth()

  if (!user || !auth) return null

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="hidden sm:inline-flex"
      onClick={() => signOut(auth!)}
    >
      <LogOut data-icon="inline-start" />
      Logout
    </Button>
  )
}
