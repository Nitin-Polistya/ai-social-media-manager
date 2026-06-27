import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore"
import type { User } from "firebase/auth"

import { safeFirestore, safeFirestoreVoid } from "@/lib/firebase/firestore-safe"

export interface UserProfile {
  uid: string
  name: string
  email: string
  createdAt: Timestamp | null
}

export async function syncUserProfile(user: User): Promise<void> {
  await safeFirestoreVoid(async (firestore) => {
    const ref = doc(firestore, "users", user.uid)
    const existing = await getDoc(ref)
    const existingData = existing.exists() ? existing.data() : null

    await setDoc(
      ref,
      {
        email: user.email ?? "",
        ...(existingData?.name
          ? {}
          : {
              name:
                user.displayName ||
                user.email?.split("@")[0] ||
                "",
            }),
        ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
      },
      { merge: true }
    )
  })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return safeFirestore(async (firestore) => {
    const snap = await getDoc(doc(firestore, "users", uid))

    if (!snap.exists()) {
      return {
        uid,
        name: "",
        email: "",
        createdAt: null,
      }
    }

    const data = snap.data()
    return {
      uid,
      name: (data.name as string) ?? "",
      email: (data.email as string) ?? "",
      createdAt: (data.createdAt as Timestamp) ?? null,
    }
  }, null)
}

export async function updateUserName(
  uid: string,
  name: string
): Promise<{ error: string | null }> {
  try {
    await safeFirestoreVoid(async (firestore) => {
      await setDoc(
        doc(firestore, "users", uid),
        { name: name.trim() },
        { merge: true }
      )
    })
    return { error: null }
  } catch {
    return { error: "Could not save your name. Please try again." }
  }
}
