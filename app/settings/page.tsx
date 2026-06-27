"use client"

import { useEffect, useState } from "react"
import { Loader2, LogOut, User } from "lucide-react"

import { RequireAuth } from "@/components/auth/require-auth"
import { useAuth } from "@/hooks/use-auth"
import { useUserData } from "@/hooks/use-user-data"
import { logoutUser } from "@/lib/firebase/auth-actions"
import {
  getSocialConnections,
  setSocialConnection,
  SOCIAL_PLATFORMS,
  type SocialConnections,
} from "@/lib/firebase/connections"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function getProviderLabel(user: ReturnType<typeof useAuth>["user"]): string {
  if (!user) return "—"
  const provider = user.providerData[0]?.providerId
  if (provider === "google.com") return "Google"
  if (provider === "password") return "Email"
  return provider ?? "Unknown"
}

function SettingsContent() {
  const { user } = useAuth()
  const { profile, loading, error, saveName } = useUserData()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [connections, setConnections] = useState<SocialConnections | null>(null)
  const [connectionsLoading, setConnectionsLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (profile) setName(profile.name)
  }, [profile])

  useEffect(() => {
    if (!user) return

    setConnectionsLoading(true)
    getSocialConnections(user.uid)
      .then(setConnections)
      .catch(() => setConnections(null))
      .finally(() => setConnectionsLoading(false))
  }, [user])

  async function handleSaveName() {
    setSaving(true)
    setSaveMessage(null)
    const result = await saveName(name)
    setSaving(false)
    setSaveMessage(result.error ?? "Name saved successfully.")
  }

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
    } catch {
      // Toggle failed silently — connection state unchanged
    } finally {
      setConnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading settings" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Settings</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Account</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Manage your profile and connected social accounts.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add your name"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium break-all">{user?.email ?? "—"}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Login provider</p>
              <p className="font-medium">{getProviderLabel(user)}</p>
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {saveMessage ? (
              <p className="text-sm text-muted-foreground" role="status">
                {saveMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="rounded-xl"
                disabled={saving || !name.trim()}
                onClick={handleSaveName}
              >
                {saving ? (
                  <>
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save name"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => void logoutUser()}
              >
                <LogOut data-icon="inline-start" />
                Logout
              </Button>
            </div>
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
            {connectionsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              SOCIAL_PLATFORMS.map((platform) => (
                <div
                  key={platform.key}
                  className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  )
}
