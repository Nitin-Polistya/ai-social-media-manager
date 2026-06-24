
import { generatePost } from "@/lib/services/gemini"
import {
  GeneratePostRequest,
  GeneratePostResponse,
} from "@/lib/types/post-generator"

export async function generateSocialMediaPost(
  request: GeneratePostRequest
): Promise<GeneratePostResponse> {
  // Here we can add any pre-processing or post-processing logic specific to the Content Engine
  // For now, it directly calls the Gemini service.
  return generatePost(request)
}
