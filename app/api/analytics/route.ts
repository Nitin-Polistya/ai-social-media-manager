
import { NextResponse } from "next/server"
import { getAllPostsPerformance, getPostPerformance, recordAnalytics } from "@/lib/engines/analytics/analytics"
import { AnalyticsEntry } from "@/lib/types/analytics"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { postId, platform, likes, comments, shares, views, clicks } = body as Omit<AnalyticsEntry, "id" | "timestamp">

  if (!postId || !platform || likes === undefined || comments === undefined || shares === undefined) {
    return NextResponse.json(
      { error: "Missing required fields to record analytics." },
      { status: 400 }
    )
  }

  try {
    const newEntry = await recordAnalytics({ postId, platform, likes, comments, shares, views, clicks })
    return NextResponse.json(newEntry)
  } catch (error) {
    console.error("Record analytics error:", error)
    return NextResponse.json(
      { error: "Something went wrong while recording analytics." },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")

  try {
    if (postId) {
      const performance = await getPostPerformance(postId)
      if (performance) {
        return NextResponse.json(performance)
      } else {
        return NextResponse.json({ error: "Post not found." }, { status: 404 })
      }
    } else {
      const allPerformance = await getAllPostsPerformance()
      return NextResponse.json(allPerformance)
    }
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { error: "Something went wrong while fetching analytics." },
      { status: 500 }
    )
  }
}
