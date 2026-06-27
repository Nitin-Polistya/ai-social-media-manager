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

export async function getFirestoreClient(): Promise<Firestore | null> {
  const firestore = getFirebaseFirestore()
  if (!firestore) return null

  try {
    await enableNetwork(firestore)
  } catch {
    // Already online or network unavailable — proceed anyway
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
    if (process.env.NODE_ENV === "development") {
      console.warn("[Firestore]", error)
    }
  }
}
