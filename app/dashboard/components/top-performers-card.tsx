"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { fetchTopCreators } from "@/app/actions/dashboard-actions"

interface Creator {
  id: string
  handle: string
  views: number
  campaign_name: string
}

export function TopPerformersCard() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTopCreators() {
      try {
        const result = await fetchTopCreators(3)
        if (result.success && result.data) {
          setCreators(result.data)
        }
      } catch (error) {
        console.error("Error loading top creators:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTopCreators()
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Top Performers</CardTitle>
            <CardDescription>Leading creators by views</CardDescription>
          </div>
          <Link href="/dashboard/leaderboards">
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
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded mt-1" />
                </div>
                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : creators.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No creators found</p>
        ) : (
          <div className="space-y-4">
            {creators.map((creator, index) => (
              <div
                key={creator.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{creator.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1">{getRankIcon(index)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{creator.handle}</p>
                  <p className="text-xs text-muted-foreground truncate">{creator.campaign_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatViews(creator.views)}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
