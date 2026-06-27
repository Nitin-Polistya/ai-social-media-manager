import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore"
import type { User } from "firebase/auth"

import { getFirebaseFirestore } from "@/lib/firebase/client"

export interface UserProfile {
  uid: string
  name: string
  email: string
  createdAt: Timestamp | null
}

export async function syncUserProfile(user: User): Promise<void> {
  const firestore = getFirebaseFirestore()
  if (!firestore) return

  const ref = doc(firestore, "users", user.uid)
  const existing = await getDoc(ref)

  await setDoc(
    ref,
    {
      name: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email ?? "",
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  )
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const firestore = getFirebaseFirestore()
  if (!firestore) return null

  const snap = await getDoc(doc(firestore, "users", uid))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    uid,
    name: (data.name as string) ?? "User",
    email: (data.email as string) ?? "",
    createdAt: (data.createdAt as Timestamp) ?? null,
  }
}
