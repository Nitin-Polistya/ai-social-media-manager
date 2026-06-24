
import { generateImage } from "@/lib/services/stability"
import {
  GenerateImageRequest,
  GenerateImageResponse,
} from "@/lib/types/post-generator"

export async function generateCreativeImage(
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  // Here we can add any pre-processing or post-processing logic specific to the Creative Engine
  // For now, it directly calls the Stability AI service.
  return generateImage(request.prompt)
}
