import { FirebaseError } from "firebase/app"
import { enableNetwork, type Firestore } from "firebase/firestore"

import { getFirebaseFirestore } from "@/lib/firebase/client"

export function isOfflineError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false
  return (
    error.code === "unavailable" ||
    error.code === "failed-precondition" ||
    error.message.toLowerCase().includes("offline")
  )
}

// Track whether we've already enabled the network for this session
let _networkEnabled = false

export async function getFirestoreClient(): Promise<Firestore | null> {
  // Block all Firestore calls when the browser is offline
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    console.log("[Firestore] navigator.onLine=false — skipping Firestore call.")
    return null
  }

  const firestore = getFirebaseFirestore()
  if (!firestore) return null

  // Only call enableNetwork once per session to avoid repeated errors
  if (!_networkEnabled) {
    try {
      await enableNetwork(firestore)
      _networkEnabled = true
    } catch {
      // Already online or network unavailable — proceed anyway
    }
  }

  return firestore
}

export async function safeFirestore<T>(
  operation: (firestore: Firestore) => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const firestore = await getFirestoreClient()
    if (!firestore) return fallback
    return await operation(firestore)
  } catch (error) {
    // Suppress offline errors silently — they are expected when the client is offline
    if (isOfflineError(error)) {
      console.log("[Firestore] Offline error suppressed:", (error as FirebaseError).code)
      return fallback
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("[Firestore]", error)
    }
    return fallback
  }
}

export async function safeFirestoreVoid(
  operation: (firestore: Firestore) => Promise<void>
): Promise<void> {
  try {
    const firestore = await getFirestoreClient()
    if (!firestore) return
    await operation(firestore)
  } catch (error) {
    // Suppress offline errors silently — they are expected when the client is offline
    if (isOfflineError(error)) {
      console.log("[Firestore] Offline error suppressed:", (error as FirebaseError).code)
      return
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("[Firestore]", error)
    }
  }
}
