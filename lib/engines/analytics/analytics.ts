
import { db } from "@/lib/services/database"
import { AnalyticsEntry, PostPerformance } from "@/lib/types/analytics"

export async function recordAnalytics(entry: Omit<AnalyticsEntry, "id" | "timestamp">): Promise<AnalyticsEntry> {
  const newEntry: AnalyticsEntry = {
    id: Math.random().toString(36).substring(2, 15), // Simple ID generation for mock
    timestamp: new Date().toISOString(),
    ...entry,
  }
  await db.addAnalyticsEntry(newEntry)
  return newEntry
}

export async function getPostPerformance(postId: string): Promise<PostPerformance | null> {
  const allAnalytics = await db.getAnalytics()
  const postAnalytics = allAnalytics.filter((entry) => entry.postId === postId)

  if (postAnalytics.length === 0) {
    return null
  }

  const totalLikes = postAnalytics.reduce((sum, entry) => sum + entry.likes, 0)
  const totalComments = postAnalytics.reduce((sum, entry) => sum + entry.comments, 0)
  const totalShares = postAnalytics.reduce((sum, entry) => sum + entry.shares, 0)
  const totalViews = postAnalytics.reduce((sum, entry) => sum + (entry.views || 0), 0)
  const totalClicks = postAnalytics.reduce((sum, entry) => sum + (entry.clicks || 0), 0)

  const platform = postAnalytics[0].platform // Assuming platform is consistent for a post

  // Simple engagement rate calculation (can be more sophisticated)
  const engagementRate = (totalLikes + totalComments + totalShares) / (totalViews || 1) * 100

  const recommendations: string[] = []
  if (engagementRate < 5) {
    recommendations.push("Consider experimenting with different content formats or CTAs to boost engagement.")
  } else if (engagementRate > 15) {
    recommendations.push("Great engagement! Analyze what worked well and replicate it.")
  }

  return {
    postId,
    platform,
    totalLikes,
    totalComments,
    totalShares,
    totalViews: totalViews > 0 ? totalViews : undefined,
    totalClicks: totalClicks > 0 ? totalClicks : undefined,
    engagementRate: parseFloat(engagementRate.toFixed(2)),
    recommendations,
  }
}

export async function getAllPostsPerformance(): Promise<PostPerformance[]> {
  const allAnalytics = await db.getAnalytics()
  const postIds = [...new Set(allAnalytics.map(entry => entry.postId))]

  const allPerformance: PostPerformance[] = []
  for (const postId of postIds) {
    const performance = await getPostPerformance(postId)
    if (performance) {
      allPerformance.push(performance)
    }
  }
  return allPerformance
}
