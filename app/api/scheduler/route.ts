
import { NextResponse } from "next/server"
import { schedulePost, getScheduledPosts } from "@/lib/engines/scheduler/scheduler"
import { SchedulePostRequest } from "@/lib/types/scheduler"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { platform, caption, hashtags, cta, imageUrl, scheduledDate } = body as SchedulePostRequest

  if (!platform || !caption || !hashtags || !cta || !scheduledDate) {
    return NextResponse.json(
      { error: "Missing required fields to schedule a post." },
      { status: 400 }
    )
  }

  try {
    const newPost = await schedulePost({ platform, caption, hashtags, cta, imageUrl, scheduledDate })
    return NextResponse.json(newPost)
  } catch (error) {
    console.error("Schedule post error:", error)
    return NextResponse.json(
      { error: "Something went wrong while scheduling your post." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await getScheduledPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Get scheduled posts error:", error)
    return NextResponse.json(
      { error: "Something went wrong while fetching scheduled posts." },
      { status: 500 }
    )
  }
}
