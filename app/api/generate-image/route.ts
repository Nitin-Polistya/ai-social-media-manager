import { NextResponse } from "next/server"

import { generateImage } from "@/lib/services/stability"
import { isGenerateImageRequest } from "@/lib/types/post-generator"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isGenerateImageRequest(body)) {
    return NextResponse.json(
      { error: "Invalid request. Provide a non-empty prompt." },
      { status: 400 }
    )
  }

  try {
    const result = await generateImage(body.prompt.trim())
    return NextResponse.json(result)
  } catch (error) {
    console.error("Generate image error:", error)
    return NextResponse.json(
      { error: "Something went wrong while generating your image." },
      { status: 500 }
    )
  }
}
