import { signOut } from "firebase/auth"

import { getFirebaseAuthErrorMessage } from "@/lib/firebase/auth-errors"
import { getFirebaseAuth } from "@/lib/firebase/client"

export async function logoutUser(): Promise<{ error: string | null }> {
  const auth = getFirebaseAuth()
  if (!auth) return { error: "Authentication is not configured." }

  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: getFirebaseAuthErrorMessage(error) }
  }
}
