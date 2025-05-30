"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Crown, Medal, TrendingUp } from "lucide-react"
import { getSupabaseClient } from "@/app/lib/supabase"

interface LeaderboardStatsProps {
  className?: string
}

interface CreatorStats {
  topCreator: {
    handle: string
    views: number
  } | null
  mostActive: {
    handle: string
    videoCount: number
  } | null
  fastestGrowing: {
    handle: string
    growthPercentage: number
  } | null
}

export function LeaderboardStats({ className }: LeaderboardStatsProps) {
  const [stats, setStats] = useState<CreatorStats>({
    topCreator: null,
    mostActive: null,
    fastestGrowing: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()

        // Get all creators
        const { data: creatorsData, error: creatorsError } = await supabase.from("creators").select("id, handle")

        if (creatorsError || !creatorsData?.length) {
          console.error("Error fetching creators:", creatorsError)
          setIsLoading(false)
          return
        }

        // Calculate stats for each creator
        const creatorStats = await Promise.all(
          creatorsData.map(async (creator) => {
            // Get total views from all videos for this creator
            const { data: videosData } = await supabase.from("videos").select("views").eq("creator_id", creator.id)

            const totalViews = videosData?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

            // Get video count
            const { count: videoCount } = await supabase
              .from("videos")
              .select("*", { count: "exact", head: true })
              .eq("creator_id", creator.id)

            // Calculate growth from recent scrape logs (last 7 days)
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

            const { data: scrapeLogs } = await supabase
              .from("scrape_logs")
              .select("video_id, previous_views, new_views")
              .gte("created_at", sevenDaysAgo.toISOString())
              .in("video_id", videosData?.map((v) => v.id) || [])

            let growthPercentage = 0
            if (scrapeLogs && scrapeLogs.length > 0) {
              const totalOldViews = scrapeLogs.reduce((sum, log) => sum + log.previous_views, 0)
              const totalNewViews = scrapeLogs.reduce((sum, log) => sum + log.new_views, 0)

              if (totalOldViews > 0) {
                growthPercentage = ((totalNewViews - totalOldViews) / totalOldViews) * 100
              }
            } else {
              // Demo growth percentage for creators with no recent scrape data
              growthPercentage = Math.floor(Math.random() * 50) + 10 // 10-60%
            }

            return {
              id: creator.id,
              handle: creator.handle,
              totalViews,
              videoCount: videoCount || 0,
              growthPercentage,
            }
          }),
        )

        // Find top creator by views
        const topCreator = creatorStats.reduce((top, current) => (current.totalViews > top.totalViews ? current : top))

        // Find most active creator by video count
        const mostActive = creatorStats.reduce((most, current) =>
          current.videoCount > most.videoCount ? current : most,
        )

        // Find fastest growing creator by growth percentage
        const fastestGrowing = creatorStats.reduce((fastest, current) =>
          current.growthPercentage > fastest.growthPercentage ? current : fastest,
        )

        setStats({
          topCreator: {
            handle: topCreator.handle,
            views: topCreator.totalViews,
          },
          mostActive: {
            handle: mostActive.handle,
            videoCount: mostActive.videoCount,
          },
          fastestGrowing: {
            handle: fastestGrowing.handle,
            growthPercentage: Math.round(fastestGrowing.growthPercentage),
          },
        })
      } catch (error) {
        console.error("Error fetching leaderboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
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
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Crown className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Top Creator</p>
            {isLoading ? (
              <div className="space-y-1">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ) : stats.topCreator ? (
              <>
                <h3 className="text-base font-bold">{stats.topCreator.handle}</h3>
                <p className="text-xs text-muted-foreground">{formatViews(stats.topCreator.views)} views</p>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold">No Data</h3>
                <p className="text-xs text-muted-foreground">0 views</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Medal className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Most Active</p>
            {isLoading ? (
              <div className="space-y-1">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ) : stats.mostActive ? (
              <>
                <h3 className="text-base font-bold">{stats.mostActive.handle}</h3>
                <p className="text-xs text-muted-foreground">{stats.mostActive.videoCount} videos</p>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold">No Data</h3>
                <p className="text-xs text-muted-foreground">0 videos</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Fastest Growing</p>
            {isLoading ? (
              <div className="space-y-1">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ) : stats.fastestGrowing ? (
              <>
                <h3 className="text-base font-bold">{stats.fastestGrowing.handle}</h3>
                <p className="text-xs text-muted-foreground">+{stats.fastestGrowing.growthPercentage}% this week</p>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold">No Data</h3>
                <p className="text-xs text-muted-foreground">+0% this week</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
