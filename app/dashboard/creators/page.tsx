import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { CreatorsList } from "@/app/dashboard/creators/components/creators-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddCreatorDialog } from "./components/add-creator-dialog"

export default function CreatorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Creators" text="Manage your content creators and their videos.">
        <AddCreatorDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Creator
          </Button>
        </AddCreatorDialog>
      </DashboardHeader>
      <div className="mt-8">
        <CreatorsList />
      </div>
    </DashboardShell>
  )
}
