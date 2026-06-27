"use client"

import { useState } from "react"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { Loader2, Sparkles } from "lucide-react"

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
import { getFirebaseAuth } from "@/lib/firebase/client"
import { isFirebaseConfigured } from "@/lib/firebase/config"
import {
  getFirebaseAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "@/lib/firebase/auth-errors"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isFirebaseConfigured()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle>Firebase not configured</CardTitle>
            <CardDescription>
              Add Firebase env vars to <code>.env.local</code>.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  async function handleGoogleSignIn() {
    if (loading) return
    const auth = getFirebaseAuth()
    if (!auth) return
    setError(null)
    setLoading(true)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSignIn(event: React.FormEvent) {
    event.preventDefault()
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr || passErr) {
      setError(emailErr ?? passErr)
      return
    }
    if (loading) return
    const auth = getFirebaseAuth()
    if (!auth) return
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSignUp() {
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr || passErr) {
      setError(emailErr ?? passErr)
      return
    }
    if (loading) return
    const auth = getFirebaseAuth()
    if (!auth) return
    setError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <CardTitle className="text-2xl">Sign in to SocialAI</CardTitle>
          <CardDescription>
            Continue to generate captions, hashtags, and images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={loading}
            onClick={handleGoogleSignIn}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue with Google"
            )}
          </Button>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="bg-card px-2">or use email</span>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 rounded-xl" disabled={loading}>
                Sign in
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={loading}
                onClick={handleEmailSignUp}
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
