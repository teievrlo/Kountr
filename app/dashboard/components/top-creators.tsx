"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/app/lib/supabase"

interface Creator {
  id: string
  handle: string
  views: number
  league_id: string
  league_name?: string
}

export function TopCreators() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopCreators() {
      setLoading(true)
      const supabase = getSupabaseClient()

      try {
        // Get top creators by views
        const { data: creatorsData, error } = await supabase
          .from("creators")
          .select("id, handle, views, league_id")
          .order("views", { ascending: false })
          .limit(5)

        if (error) {
          console.error("Error fetching creators:", error)
          setLoading(false)
          return
        }

        // Get league names for each creator
        const creatorsWithLeagues = await Promise.all(
          creatorsData.map(async (creator) => {
            const { data: leagueData } = await supabase
              .from("leagues")
              .select("name")
              .eq("id", creator.league_id)
              .single()

            return {
              ...creator,
              league_name: leagueData?.name || "Unknown Campaign",
            }
          }),
        )

        setCreators(creatorsWithLeagues)
      } catch (error) {
        console.error("Error fetching top creators:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopCreators()
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
      <CardHeader>
        <CardTitle>Top Creators</CardTitle>
        <CardDescription>Your best performing creators by views</CardDescription>
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
        ) : creators.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">
              No creators found. Add creators to your campaigns to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {creators.map((creator, index) => (
              <div key={creator.id} className="flex items-center justify-between">
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
                    <p className="text-xs text-muted-foreground">{creator.league_name}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{formatViews(creator.views)} views</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
