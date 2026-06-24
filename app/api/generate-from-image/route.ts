import { NextResponse } from "next/server"

import { imageToCaptionHashtags } from "@/lib/services/gemini"
import { isImageToCaptionHashtagsRequest } from "@/lib/types/post-generator"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isImageToCaptionHashtagsRequest(body)) {
    return NextResponse.json(
      { error: "Invalid request. Provide a base64 encoded image." },
      { status: 400 }
    )
  }

  try {
    const result = await imageToCaptionHashtags(body.image, body.mimeType)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Generate from image error:", error)
    return NextResponse.json(
      { error: "Something went wrong while processing your image." },
      { status: 500 }
    )
  }
}
