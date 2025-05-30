import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { CreatorsView } from "./components/creators-view"

export default function CreatorsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <DashboardHeader
          heading="Creators"
          text="Manage your content creators and track their performance across campaigns."
        />
        <CreatorsView />
      </div>
    </DashboardShell>
  )
}
