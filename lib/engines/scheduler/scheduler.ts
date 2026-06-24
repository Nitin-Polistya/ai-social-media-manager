
import { db } from "@/lib/services/database"
import { ScheduledPost, SchedulePostRequest } from "@/lib/types/scheduler"
import { v4 as uuidv4 } from "uuid"

export async function schedulePost(
  request: SchedulePostRequest
): Promise<ScheduledPost> {
  const newPost: ScheduledPost = {
    id: uuidv4(),
    ...request,
    status: "scheduled",
  }
  await db.addScheduledPost(newPost)
  return newPost
}

export async function getScheduledPosts(): Promise<ScheduledPost[]> {
  return db.getScheduledPosts()
}

export async function updatePostStatus(
  id: string,
  status: "scheduled" | "posted" | "failed"
): Promise<void> {
  await db.updateScheduledPost(id, { status })
}
