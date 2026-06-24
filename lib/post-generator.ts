export {
  BRAND_TONES,
  PLATFORMS,
  POST_TYPES,
  isGenerateImageRequest,
  isGeneratePostRequest,
  isImageToCaptionHashtagsRequest,
  type BrandTone,
  type GenerateImageRequest,
  type GenerateImageResponse,
  type GeneratePostRequest,
  type GeneratePostResponse,
  type ImageToCaptionHashtagsRequest,
  type ImageToCaptionHashtagsResponse,
  type Platform,
  type PostType,
} from "@/lib/types/post-generator"

export function formatHashtags(hashtags: string[]): string {
  return hashtags.join(" ")
}
