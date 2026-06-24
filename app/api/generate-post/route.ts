import { NextResponse } from "next/server"

import { generatePost } from "@/lib/services/gemini"
import {
  isGeneratePostRequest,
} from "@/lib/types/post-generator"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isGeneratePostRequest(body)) {
    return NextResponse.json(
      {
        error:
          "Invalid request. Provide platform, postType, brandTone, and a non-empty topic.",
      },
      { status: 400 }
    )
  }

  try {
    const result = await generatePost(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Generate post error:", error)
    return NextResponse.json(
      { error: "Something went wrong while generating your post." },
      { status: 500 }
    )
  }
}
