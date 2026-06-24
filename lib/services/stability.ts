
import { NextResponse } from "next/server"

import {
  type GenerateImageResponse,
  isGenerateImageRequest,
} from "@/lib/types/post-generator"

const STABILITY_API_URL =
  "https://api.stability.ai/v2beta/stable-image/generate/core"

const DEMO_IMAGE_URL =
  "https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=800&auto=format&fit=crop&q=80"

function buildMockResponse(): GenerateImageResponse {
  return {
    image_url: DEMO_IMAGE_URL,
  }
}

async function callStability(
  apiKey: string,
  prompt: string
): Promise<GenerateImageResponse> {
  const formData = new FormData()
  formData.append("prompt", prompt)
  formData.append("output_format", "png")
  formData.append("aspect_ratio", "1:1")

  const response = await fetch(STABILITY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Stability AI API error:", errorBody)
    throw new Error("Stability AI request failed")
  }

  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as { image?: string }

    if (!data.image) {
      throw new Error("Missing image data from Stability AI")
    }

    return {
      image_url: `data:image/png;base64,${data.image}`,
    }
  }

  const imageBuffer = await response.arrayBuffer()
  const base64 = Buffer.from(imageBuffer).toString("base64")

  return {
    image_url: `data:image/png;base64,${base64}`,
  }
}

export async function generateImage(prompt: string): Promise<GenerateImageResponse> {
  const apiKey = process.env.STABILITY_API_KEY

  if (!apiKey || apiKey === "your-stability-api-key-here") {
    return buildMockResponse()
  }

  try {
    const result = await callStability(apiKey, prompt.trim())
    return result
  } catch (error) {
    console.error("Generate image error:", error)
    throw new Error("Something went wrong while generating your image.")
  }
}
