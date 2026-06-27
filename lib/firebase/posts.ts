import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore"

import { safeFirestore, safeFirestoreVoid } from "@/lib/firebase/firestore-safe"

export type AnalyticsPostType = "caption" | "hashtag" | "post" | "image"

export interface UserStats {
  postsToday: number
  postsThisWeek: number
  postsThisMonth: number
  totalCaptions: number
  totalHashtags: number
  totalImages: number
}

export interface TrackGenerationInput {
  uid: string
  mode: "text" | "image"
  caption: string
  hashtags: string[]
  imageUrl?: string | null
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toDate(value: Timestamp | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  return value.toDate()
}

async function addPost(
  uid: string,
  type: AnalyticsPostType,
  content: string
): Promise<void> {
  await safeFirestoreVoid(async (firestore) => {
    await addDoc(collection(firestore, "posts"), {
      uid,
      type,
      content,
      createdAt: serverTimestamp(),
    })
  })
}

export async function trackGeneration(input: TrackGenerationInput): Promise<void> {
  const { uid, mode, caption, hashtags, imageUrl } = input

  try {
    await addPost(uid, "caption", caption)
    await addPost(uid, "hashtag", hashtags.join(" "))

    if (mode === "text") {
      await addPost(
        uid,
        "post",
        JSON.stringify({ caption, hashtags, mode: "text" })
      )
      if (imageUrl) await addPost(uid, "image", imageUrl)
    } else {
      await addPost(
        uid,
        "post",
        JSON.stringify({ caption, hashtags, mode: "image" })
      )
    }
  } catch {
    // Analytics must never block generation
  }
}

export async function getUserStats(uid: string): Promise<UserStats> {
  const empty: UserStats = {
    postsToday: 0,
    postsThisWeek: 0,
    postsThisMonth: 0,
    totalCaptions: 0,
    totalHashtags: 0,
    totalImages: 0,
  }

  return safeFirestore(async (firestore) => {
    const snap = await getDocs(
      query(collection(firestore, "posts"), where("uid", "==", uid))
    )

  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)

  const stats = { ...empty }

  snap.docs.forEach((docSnap) => {
    const data = docSnap.data()
    const type = data.type as AnalyticsPostType
    const created = toDate(data.createdAt as Timestamp)

    if (type === "caption") stats.totalCaptions++
    if (type === "hashtag") stats.totalHashtags++
    if (type === "image") stats.totalImages++

    if (type === "post" && created) {
      if (created >= todayStart) stats.postsToday++
      if (created >= weekStart) stats.postsThisWeek++
      if (created >= monthStart) stats.postsThisMonth++
    }
  })

  return stats
  }, empty)
}
