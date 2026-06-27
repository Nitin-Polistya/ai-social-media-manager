import { trackGeneration } from "@/lib/firebase/posts"

export interface SaveGenerationInput {
  userId: string
  mode: "text" | "image"
  caption: string
  hashtags: string[]
  imageUrl?: string | null
}

export async function saveGeneration(input: SaveGenerationInput): Promise<void> {
  await trackGeneration({
    uid: input.userId,
    mode: input.mode,
    caption: input.caption,
    hashtags: input.hashtags,
    imageUrl: input.imageUrl,
  })
}
