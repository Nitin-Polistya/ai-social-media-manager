"use client"

import { logoutUser } from "@/lib/firebase/auth-actions"
import { LogOut } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="hidden sm:inline-flex"
      onClick={() => void logoutUser()}
    >
      <LogOut data-icon="inline-start" />
      Logout
    </Button>
  )
}
