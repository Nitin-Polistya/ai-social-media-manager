export const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "Facebook",
  "X",
] as const

export const POST_TYPES = [
  "Promotion",
  "Educational",
  "Announcement",
  "Engagement",
  "Story",
] as const

export const BRAND_TONES = [
  "Professional",
  "Friendly",
  "Luxury",
  "Funny",
] as const

export type Platform = (typeof PLATFORMS)[number]
export type PostType = (typeof POST_TYPES)[number]
export type BrandTone = (typeof BRAND_TONES)[number]

export interface GeneratePostRequest {
  platform: Platform
  postType: PostType
  topic: string
  brandTone: BrandTone
  customPrompt?: string
}

export interface GeneratePostResponse {
  caption: string
  hashtags: string[]
  cta: string
  image_prompt: string
  expanded_prompt: string
}

export function isGeneratePostRequest(
  value: unknown
): value is GeneratePostRequest {
  if (!value || typeof value !== "object") return false

  const body = value as Record<string, unknown>

  return (
    typeof body.topic === "string" &&
    body.topic.trim().length > 0 &&
    PLATFORMS.includes(body.platform as Platform) &&
    POST_TYPES.includes(body.postType as PostType) &&
    BRAND_TONES.includes(body.brandTone as BrandTone)
  )
}

export interface GenerateImageRequest {
  prompt: string
}

export interface GenerateImageResponse {
  image_url: string
}

export function isGenerateImageRequest(
  obj: unknown
): obj is GenerateImageRequest {
  if (typeof obj !== "object" || obj === null) {
    return false
  }

  const castObj = obj as Partial<GenerateImageRequest>

  return (
    typeof castObj.prompt === "string" && castObj.prompt.trim().length > 0
  )
}

export interface ImageToCaptionHashtagsRequest {
  image: string
  mimeType?: string
}

export interface ImageToCaptionHashtagsResponse {
  caption: string;
  hashtags: string[];
}

export function isImageToCaptionHashtagsRequest(
  value: unknown
): value is ImageToCaptionHashtagsRequest {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return typeof body.image === "string" && body.image.trim().length > 0;
}