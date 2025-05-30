"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Trash2, Users, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseClient } from "@/app/lib/supabase"
import { AddCampaignDialog } from "./add-campaign-dialog"
import { DeleteCampaignDialog } from "./delete-campaign-dialog"

interface Campaign {
  id: string
  name: string
  description: string
  created_at: string
  creator_count?: number
  total_views?: number
}

interface CampaignsListProps {
  className?: string
}

export function CampaignsList({ className }: CampaignsListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCampaigns = async () => {
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

      // Get creator counts and total views for each campaign
      const campaignsWithStats = await Promise.all(
        campaignsData.map(async (campaign) => {
          // Get creator count
          const { count } = await supabase
            .from("creators")
            .select("*", { count: "exact", head: true })
            .eq("league_id", campaign.id)

          // Get total views for this campaign by summing all video views for creators in this campaign
          const { data: creators } = await supabase.from("creators").select("id").eq("league_id", campaign.id)

          let totalViews = 0
          if (creators && creators.length > 0) {
            const creatorIds = creators.map((c) => c.id)

            const { data: videos } = await supabase.from("videos").select("views").in("creator_id", creatorIds)

            totalViews = videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0
          }

          return {
            ...campaign,
            creator_count: count || 0,
            total_views: totalViews,
          }
        }),
      )

      setCampaigns(campaignsWithStats)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // Format views for display
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Manage your UGC campaigns and track their performance.</CardDescription>
        </div>
        <AddCampaignDialog onCampaignAdded={fetchCampaigns}>
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
            <AddCampaignDialog onCampaignAdded={fetchCampaigns}>
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
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {campaign.description || "No description provided"}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {campaign.creator_count} creator{campaign.creator_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatViews(campaign.total_views || 0)} views
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/campaigns/${campaign.id}`}>View Details</a>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem>View Creators</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteCampaignDialog
                        campaignId={campaign.id}
                        campaignName={campaign.name}
                        onCampaignDeleted={fetchCampaigns}
                      >
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DeleteCampaignDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
