"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  Hash,
  ImageIcon,
  Loader2,
  MessageSquare,
  Rocket,
  TrendingUp,
} from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUserStats, type UserStats } from "@/lib/firebase/posts"
import type { ScheduledPost } from "@/lib/types/scheduler"
import type { PostPerformance } from "@/lib/types/analytics"

const EMPTY_STATS: UserStats = {
  postsToday: 0,
  postsThisWeek: 0,
  postsThisMonth: 0,
  totalCaptions: 0,
  totalHashtags: 0,
  totalImages: 0,
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<UserStats>(EMPTY_STATS)
  const [loadingStats, setLoadingStats] = useState(true)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [performance, setPerformance] = useState<PostPerformance[]>([])

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoadingStats(false)
      return
    }
    setLoadingStats(true)
    getUserStats(user.uid)
      .then(setStats)
      .catch(() => setStats(EMPTY_STATS))
      .finally(() => setLoadingStats(false))
  }, [authLoading, user])

  useEffect(() => {
    fetch("/api/scheduler")
      .then((r) => r.json())
      .then(setScheduledPosts)
      .catch(() => setScheduledPosts([]))
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setPerformance)
      .catch(() => setPerformance([]))
  }, [])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          Your content at a glance
        </h1>
        <p className="text-muted-foreground">
          Track AI generations, scheduled posts, and performance — all in one place.
        </p>
      </header>

      {authLoading || loadingStats ? (
        <div className="mb-8 flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Posts today" value={stats.postsToday} icon={TrendingUp} />
          <StatCard title="Posts this week" value={stats.postsThisWeek} icon={BarChart3} />
          <StatCard title="Posts this month" value={stats.postsThisMonth} icon={Calendar} />
          <StatCard title="Total captions" value={stats.totalCaptions} icon={MessageSquare} />
          <StatCard title="Total hashtags" value={stats.totalHashtags} icon={Hash} />
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Scheduled Posts</h2>
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>Posts queued for publishing</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Rocket className="size-10 text-muted-foreground/50" />
                <p className="font-medium">Start creating your first scheduled post 🚀</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Generate content in the AI studio, then schedule it for the perfect time.
                </p>
                <Button asChild size="sm" className="mt-2 rounded-xl">
                  <Link href="/generator">Open Generator</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Caption</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.platform}</TableCell>
                      <TableCell>{post.caption.substring(0, 50)}...</TableCell>
                      <TableCell>{new Date(post.scheduledDate).toLocaleString()}</TableCell>
                      <TableCell>{post.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Post Performance</h2>
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Engagement metrics across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            {performance.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <ImageIcon className="size-10 text-muted-foreground/50" />
                <p className="font-medium">
                  Your analytics will appear here once you generate posts
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Create your first AI post to start tracking captions, hashtags, and engagement.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2 rounded-xl">
                  <Link href="/generator">Generate your first post</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map((row) => (
                    <TableRow key={row.postId}>
                      <TableCell>{row.postId.substring(0, 8)}...</TableCell>
                      <TableCell>{row.platform}</TableCell>
                      <TableCell>{row.totalLikes}</TableCell>
                      <TableCell>{row.totalComments}</TableCell>
                      <TableCell>{row.totalShares}</TableCell>
                      <TableCell>{row.engagementRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
