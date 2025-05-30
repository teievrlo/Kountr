"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/app/lib/supabase"

interface Campaign {
  id: string
  name: string
  creator_count: number
  total_views: number
  progress: number
}

export function CampaignProgressCard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const supabase = getSupabaseClient()

        // Get top 3 campaigns by creator count
        const { data: campaignsData, error } = await supabase
          .from("leagues")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching campaigns:", error)
          setIsLoading(false)
          return
        }

        // Get stats for each campaign
        const campaignsWithStats = await Promise.all(
          campaignsData.map(async (campaign) => {
            // Get creator count
            const { count } = await supabase
              .from("creators")
              .select("*", { count: "exact", head: true })
              .eq("league_id", campaign.id)

            // Get total views
            const { data: creators } = await supabase.from("creators").select("id").eq("league_id", campaign.id)

            let totalViews = 0
            if (creators && creators.length > 0) {
              const creatorIds = creators.map((c) => c.id)
              const { data: videos } = await supabase.from("videos").select("views").in("creator_id", creatorIds)
              totalViews = videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0
            }

            // Calculate progress (demo: based on views, assuming 100K views = 100%)
            const progress = Math.min(100, Math.floor((totalViews / 100000) * 100))

            return {
              id: campaign.id,
              name: campaign.name,
              creator_count: count || 0,
              total_views: totalViews,
              progress,
            }
          }),
        )

        setCampaigns(campaignsWithStats)
      } catch (error) {
        console.error("Error loading campaigns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaigns()
  }, [])

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
    <Card className="h-full border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Campaign Progress</CardTitle>
            <CardDescription>Active campaign performance</CardDescription>
          </div>
          <Link href="/dashboard/campaigns">
            <Button size="sm" variant="ghost" className="text-xs">
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No campaigns found</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{campaign.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {campaign.progress}%
                  </Badge>
                </div>
                <Progress value={campaign.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{campaign.creator_count} creators</span>
                  <span>{formatViews(campaign.total_views)} views</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
