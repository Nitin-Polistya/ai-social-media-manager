"use client"

import { useEffect, useState } from "react"
import { signOut } from "firebase/auth"
import { Loader2, LogOut, User } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { getFirebaseAuth } from "@/lib/firebase/client"
import {
  getSocialConnections,
  setSocialConnection,
  SOCIAL_PLATFORMS,
  type SocialConnections,
} from "@/lib/firebase/connections"
import { getUserProfile, type UserProfile } from "@/lib/firebase/user-profile"

function getProviderLabel(user: ReturnType<typeof useAuth>["user"]): string {
  if (!user) return "—"
  const provider = user.providerData[0]?.providerId
  if (provider === "google.com") return "Google"
  if (provider === "password") return "Email"
  return provider ?? "Unknown"
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [connections, setConnections] = useState<SocialConnections | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([getUserProfile(user.uid), getSocialConnections(user.uid)])
      .then(([p, c]) => {
        setProfile(p)
        setConnections(c)
      })
      .finally(() => setLoading(false))
  }, [user])

  async function handleToggle(
    platform: keyof SocialConnections,
    connected: boolean
  ) {
    if (!user) return
    setConnecting(platform)
    try {
      await setSocialConnection(user.uid, platform, connected)
      setConnections((prev) =>
        prev ? { ...prev, [platform]: connected } : null
      )
    } finally {
      setConnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and connected social accounts.
        </p>
      </header>

      <div className="space-y-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">
                {profile?.name ?? user?.displayName ?? "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Login provider</span>
              <span className="font-medium">{getProviderLabel(user)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-muted-foreground">Firebase UID</span>
              <span className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                {user?.uid}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2 rounded-xl"
              onClick={() => {
                const auth = getFirebaseAuth()
                if (auth) void signOut(auth)
              }}
            >
              <LogOut data-icon="inline-start" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Link social platforms for future automated posting. OAuth flows coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div
                key={platform.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/70 p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{platform.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {platform.description}
                  </p>
                  <p className="text-xs text-primary/80">{platform.apiNote}</p>
                </div>
                <Switch
                  checked={connections?.[platform.key] ?? false}
                  disabled={connecting === platform.key}
                  onCheckedChange={(checked) =>
                    handleToggle(platform.key, checked)
                  }
                  aria-label={`Connect ${platform.label}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
