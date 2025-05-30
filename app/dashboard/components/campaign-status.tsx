"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { getSupabaseClient } from "@/app/lib/supabase"

interface Campaign {
  id: string
  name: string
  description: string
  created_at: string
  creator_count: number
  total_views: number
  status: "active" | "draft" | "completed"
  progress: number
}

export function CampaignStatus() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const supabase = getSupabaseClient()

        // Get campaigns
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

        // Get creator counts and total views for each campaign
        const campaignsWithStats = await Promise.all(
          campaignsData.map(async (campaign) => {
            // Get creator count
            const { count } = await supabase
              .from("creators")
              .select("*", { count: "exact", head: true })
              .eq("league_id", campaign.id)

            // Get total views for this campaign
            const { data: creators } = await supabase.from("creators").select("views").eq("league_id", campaign.id)

            const totalViews = creators?.reduce((sum, creator) => sum + (creator.views || 0), 0) || 0

            // Calculate progress based on views (assuming 100K views = 100% for demo)
            const progress = Math.min(100, Math.floor((totalViews / 100000) * 100))

            // Calculate days since creation
            const createdDate = new Date(campaign.created_at)
            const now = new Date()
            const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
            const daysLeft = Math.max(0, 30 - daysSinceCreation) // Assuming 30-day campaigns

            return {
              ...campaign,
              creator_count: count || 0,
              total_views: totalViews,
              status: count && count > 0 ? ("active" as const) : ("draft" as const),
              progress,
              daysLeft,
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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Track your campaign performance</CardDescription>
        </div>
        <Link href="/dashboard/campaigns">
          <Button size="sm" variant="outline">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">
              No campaigns found. Create your first campaign to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href="/dashboard/campaigns"
                className="block hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{campaign.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.creator_count} creators • {formatViews(campaign.total_views)} views
                        </div>
                      </div>
                    </div>
                    <Badge variant={campaign.status === "active" ? "default" : "outline"}>
                      {campaign.status === "active" ? "Active" : "Draft"}
                    </Badge>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{campaign.progress}% complete</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
          <Link href="/dashboard/campaigns">
            <Button variant="ghost" className="w-full justify-center">
              View All Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
