import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import { CampaignsList } from "./components/campaigns-list"
import { AddCampaignDialog } from "./components/add-campaign-dialog"

export default function CampaignsPage() {
  return (
    <DashboardShell className="max-w-full">
      <div className="px-4 py-4">
        <DashboardHeader heading="Campaigns" text="Manage your UGC campaigns and track their performance.">
          <AddCampaignDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Campaign
            </Button>
          </AddCampaignDialog>
        </DashboardHeader>
        <div className="mt-8">
          <CampaignsList />
        </div>
      </div>
    </DashboardShell>
  )
}
