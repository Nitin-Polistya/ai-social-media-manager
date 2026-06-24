
import { getAllPostsPerformance, getPostPerformance } from "@/lib/engines/analytics/analytics"
import { getScheduledPosts } from "@/lib/engines/scheduler/scheduler"
import { ScheduledPost } from "@/lib/types/scheduler"
import { PostPerformance } from "@/lib/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function DashboardPage() {
  const scheduledPosts = await getScheduledPosts()
  const allPostsPerformance = await getAllPostsPerformance()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Scheduled Posts</h2>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length === 0 ? (
              <p>No posts scheduled yet.</p>
            ) : (
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
                  {scheduledPosts.map((post: ScheduledPost) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.platform}</TableCell>
                      <TableCell>{post.caption.substring(0, 50)}...</TableCell>
                      <TableCell>{new Date(post.scheduledDate).toLocaleString()}</TableCell>
                      <TableCell>{post.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Post Performance Analytics</h2>
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {allPostsPerformance.length === 0 ? (
              <p>No analytics data available yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Engagement Rate</TableHead>
                    <TableHead>Recommendations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPostsPerformance.map((performance: PostPerformance) => (
                    <TableRow key={performance.postId}>
                      <TableCell>{performance.postId.substring(0, 8)}...</TableCell>
                      <TableCell>{performance.platform}</TableCell>
                      <TableCell>{performance.totalLikes}</TableCell>
                      <TableCell>{performance.totalComments}</TableCell>
                      <TableCell>{performance.totalShares}</TableCell>
                      <TableCell>{performance.engagementRate}%</TableCell>
                      <TableCell>{performance.recommendations.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
