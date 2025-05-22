import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { VideosList } from "@/app/dashboard/videos/components/videos-list"

export default function VideosPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Videos" text="Manage and track all your UGC videos." />
      <div className="mt-8">
        <VideosList />
      </div>
    </DashboardShell>
  )
}
