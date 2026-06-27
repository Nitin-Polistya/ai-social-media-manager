import { doc, getDoc, setDoc } from "firebase/firestore"

import { safeFirestore, safeFirestoreVoid } from "@/lib/firebase/firestore-safe"

export interface SocialConnections {
  instagramConnected: boolean
  facebookConnected: boolean
  twitterConnected: boolean
  linkedinConnected: boolean
}

export type SocialPlatform = keyof SocialConnections

const DEFAULT_CONNECTIONS: SocialConnections = {
  instagramConnected: false,
  facebookConnected: false,
  twitterConnected: false,
  linkedinConnected: false,
}

export async function getSocialConnections(
  uid: string
): Promise<SocialConnections> {
  return safeFirestore(async (firestore) => {
    const snap = await getDoc(doc(firestore, "connections", uid))
    if (!snap.exists()) return DEFAULT_CONNECTIONS
    return { ...DEFAULT_CONNECTIONS, ...snap.data() } as SocialConnections
  }, DEFAULT_CONNECTIONS)
}

export async function setSocialConnection(
  uid: string,
  platform: SocialPlatform,
  connected: boolean
): Promise<void> {
  await safeFirestoreVoid(async (firestore) => {
    await setDoc(
      doc(firestore, "connections", uid),
      { [platform]: connected },
      { merge: true }
    )
  })
}

export const SOCIAL_PLATFORMS: {
  key: SocialPlatform
  label: string
  description: string
  apiNote: string
}[] = [
  {
    key: "instagramConnected",
    label: "Instagram",
    description: "Connect via Meta Graph API for publishing and insights.",
    apiNote: "Meta Graph API",
  },
  {
    key: "facebookConnected",
    label: "Facebook Pages",
    description: "Manage and schedule posts to your Facebook Pages.",
    apiNote: "Meta Graph API",
  },
  {
    key: "twitterConnected",
    label: "X (Twitter)",
    description: "Post and track performance on X.",
    apiNote: "X API v2 (placeholder)",
  },
  {
    key: "linkedinConnected",
    label: "LinkedIn",
    description: "Share professional content to your LinkedIn profile or page.",
    apiNote: "LinkedIn API (placeholder)",
  },
]
