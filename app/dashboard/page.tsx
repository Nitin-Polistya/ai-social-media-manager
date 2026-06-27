import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { RequireAuth } from "@/components/auth/require-auth"

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  )
}
