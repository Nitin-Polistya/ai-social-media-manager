import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import { firestore } from "@/lib/firebase/client"

export interface SaveGenerationInput {
  userId: string
  caption: string
  hashtags: string[]
  imageUrl?: string | null
  mode: "text" | "image"
}

export async function saveGeneration(input: SaveGenerationInput): Promise<void> {
  if (!firestore) return

  await addDoc(collection(firestore, "generations"), {
    userId: input.userId,
    caption: input.caption,
    hashtags: input.hashtags,
    imageUrl: input.imageUrl ?? null,
    mode: input.mode,
    createdAt: serverTimestamp(),
  })
}
