"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { fetchTopCreators } from "@/app/actions/dashboard-actions"

interface Creator {
  id: string
  handle: string
  views: number // Changed from total_views
  campaign_name: string
}

export function TopCreators() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTopCreators() {
      try {
        const result = await fetchTopCreators(5)
        if (result.success && result.data) {
          setCreators(result.data)
        } else {
          console.error("Failed to load top creators:", result.error)
        }
      } catch (error) {
        console.error("Error loading top creators:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTopCreators()
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Creators</CardTitle>
          <CardDescription>Your best performing creators by views</CardDescription>
        </div>
        <Link href="/dashboard/leaderboards">
          <Button size="sm" variant="outline">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">
              No creators found. Add creators to your campaigns to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {creators.map((creator, index) => (
              <Link
                key={creator.id}
                href="/dashboard/leaderboards"
                className="flex items-center justify-between hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={index === 0 ? "default" : "outline"}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{creator.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{creator.handle}</p>
                    <p className="text-xs text-muted-foreground">{creator.campaign_name}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{formatViews(creator.views)} views</div>
              </Link>
            ))}
          </div>
        )}
        {creators.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/dashboard/leaderboards">
              <Button variant="ghost" className="w-full justify-center">
                View Full Leaderboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
