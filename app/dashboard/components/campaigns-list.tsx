"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getSupabaseClient } from "@/app/lib/supabase"
import { AddCampaignDialog } from "./add-campaign-dialog"

interface Campaign {
  id: string
  name: string
  description: string
  created_at: string
  creator_count?: number
}

interface CampaignsListProps {
  className?: string
}

export function CampaignsList({ className }: CampaignsListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true)
      const supabase = getSupabaseClient()

      try {
        // Get campaigns
        const { data: campaignsData, error } = await supabase
          .from("leagues")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching campaigns:", error)
          setLoading(false)
          return
        }

        // Get creator counts for each campaign
        const campaignsWithCounts = await Promise.all(
          campaignsData.map(async (campaign) => {
            const { count } = await supabase
              .from("creators")
              .select("*", { count: "exact", head: true })
              .eq("league_id", campaign.id)

            return {
              ...campaign,
              creator_count: count || 0,
            }
          }),
        )

        setCampaigns(campaignsWithCounts)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Manage your UGC campaigns and track their performance.</CardDescription>
        </div>
        <AddCampaignDialog
          onCampaignAdded={() => {
            // Refresh campaigns after adding a new one
            setCampaigns([])
            setLoading(true)
          }}
        >
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Campaign
          </Button>
        </AddCampaignDialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <svg
              className="animate-spin h-6 w-6 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No campaigns found. Create your first campaign to get started.
            </p>
            <AddCampaignDialog
              onCampaignAdded={() => {
                // Refresh campaigns after adding a new one
                setCampaigns([])
                setLoading(true)
              }}
            >
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </AddCampaignDialog>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.description || "No description"}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">{campaign.creator_count} creators</span>
                    <span className="mx-2 text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/dashboard/campaigns/${campaign.id}`}>View</a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
