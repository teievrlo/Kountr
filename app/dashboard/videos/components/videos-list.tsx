"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ExternalLink, RefreshCw, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/app/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface Video {
  id: string
  url: string
  title: string
  views: number
  creator_id: string
  created_at: string
  last_checked: string
  creator_handle?: string
}

export function VideosList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)

      // Get videos
      const { data: videosData, error } = await supabase
        .from("videos")
        .select("id, url, title, views, creator_id, created_at, last_checked")
        .order("views", { ascending: false })

      if (error) {
        console.error("Error fetching videos:", error)
        setLoading(false)
        return
      }

      // Get creator handles for each video
      const videosWithCreators = await Promise.all(
        videosData.map(async (video) => {
          const { data: creatorData } = await supabase
            .from("creators")
            .select("handle")
            .eq("id", video.creator_id)
            .single()

          return {
            ...video,
            creator_handle: creatorData?.handle || "Unknown",
          }
        }),
      )

      setVideos(videosWithCreators)
      setLoading(false)
    }

    fetchVideos()
  }, [supabase])

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) => {
    const query = searchQuery.toLowerCase()
    return (
      video.title.toLowerCase().includes(query) ||
      video.creator_handle?.toLowerCase().includes(query) ||
      video.url.toLowerCase().includes(query)
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>All Videos</CardTitle>
            <CardDescription>Track and manage your TikTok videos</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
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
        ) : filteredVideos.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "No videos found matching your search." : "No videos found. Add videos to get started."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="font-medium truncate max-w-[200px]" title={video.url}>
                        {video.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{video.url}</div>
                    </TableCell>
                    <TableCell>{video.creator_handle}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {video.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                      {formatDistanceToNow(new Date(video.last_checked), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Refresh views">
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Refresh views</span>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={video.url} target="_blank" rel="noopener noreferrer" title="Open video">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open video</span>
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
