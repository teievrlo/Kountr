"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/app/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface ScrapeLog {
  id: string
  video_id: string
  previous_views: number
  new_views: number
  status: string
  created_at: string
  video_url?: string
  creator_handle?: string
}

export function RecentScrapes() {
  const [scrapes, setScrapes] = useState<ScrapeLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentScrapes() {
      setLoading(true)
      const supabase = getSupabaseClient()

      try {
        // Get recent scrape logs
        const { data: scrapeData, error } = await supabase
          .from("scrape_logs")
          .select("id, video_id, previous_views, new_views, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("Error fetching scrape logs:", error)
          setLoading(false)
          return
        }

        // Get video details for each scrape log
        const scrapesWithDetails = await Promise.all(
          scrapeData.map(async (scrape) => {
            const { data: videoData } = await supabase
              .from("videos")
              .select("url, creator_id")
              .eq("id", scrape.video_id)
              .single()

            let creatorHandle = "Unknown"

            if (videoData?.creator_id) {
              const { data: creatorData } = await supabase
                .from("creators")
                .select("handle")
                .eq("id", videoData.creator_id)
                .single()

              creatorHandle = creatorData?.handle || "Unknown"
            }

            return {
              ...scrape,
              video_url: videoData?.url || "Unknown URL",
              creator_handle: creatorHandle,
            }
          }),
        )

        setScrapes(scrapesWithDetails)
      } catch (error) {
        console.error("Error fetching recent scrapes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentScrapes()
  }, [])

  // Format views difference
  const formatViewsDiff = (previous: number, current: number) => {
    const diff = current - previous
    if (diff > 0) {
      return `+${diff.toLocaleString()}`
    }
    return diff.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Scrapes</CardTitle>
        <CardDescription>Latest data collection activities</CardDescription>
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
        ) : scrapes.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No scrape logs found. Run the scraper to collect data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scrapes.map((scrape) => (
              <div key={scrape.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{scrape.creator_handle}</p>
                    <Badge variant={scrape.status === "success" ? "default" : "destructive"}>{scrape.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{scrape.video_url}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(scrape.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  <span className={scrape.new_views > scrape.previous_views ? "text-green-600" : "text-red-600"}>
                    {formatViewsDiff(scrape.previous_views, scrape.new_views)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
