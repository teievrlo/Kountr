"use client"

import { useAppContext } from "@/app/context/app-provider"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Crown, Medal, TrendingUp } from "lucide-react"

interface LeaderboardStatsProps {
  className?: string
}

export function LeaderboardStats({ className }: LeaderboardStatsProps) {
  const { creators } = useAppContext()

  // Get top creator by views
  const topCreator = [...creators].sort((a, b) => b.totalViews - a.totalViews)[0]

  // Get most active creator (most videos)
  const mostActiveCreator = [...creators].sort((a, b) => b.videoCount - a.videoCount)[0]

  // Get fastest growing creator (placeholder logic - in a real app this would be based on view growth)
  const fastestGrowingCreator = [...creators].sort(() => Math.random() - 0.5)[0]

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Crown className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Top Creator</p>
            <h3 className="text-base font-bold">{topCreator?.handle || "N/A"}</h3>
            <p className="text-xs text-muted-foreground">{topCreator?.totalViews.toLocaleString() || "0"} views</p>
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
            <h3 className="text-base font-bold">{mostActiveCreator?.handle || "N/A"}</h3>
            <p className="text-xs text-muted-foreground">{mostActiveCreator?.videoCount || "0"} videos</p>
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
            <h3 className="text-base font-bold">{fastestGrowingCreator?.handle || "N/A"}</h3>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 200) + 50}% this week</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
