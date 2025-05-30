"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseClient } from "@/app/lib/supabase"
import { AddVideoDialog } from "./add-video-dialog"
import { DeleteCreatorDialog } from "./delete-creator-dialog"
import { useToast } from "@/components/ui/use-toast"

interface Creator {
  id: string
  handle: string
  views: number
  league_id: string
  league_name?: string
  last_checked: string
  video_count?: number
}

export function CreatorsList() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const fetchCreators = async () => {
    setLoading(true)

    try {
      // Get creators
      const { data: creatorsData, error } = await supabase
        .from("creators")
        .select("id, handle, league_id, last_checked")
        .order("handle")

      if (error) {
        console.error("Error fetching creators:", error)
        setLoading(false)
        return
      }

      // Get league names and video counts for each creator
      const creatorsWithDetails = await Promise.all(
        creatorsData.map(async (creator) => {
          // Get league name
          const { data: leagueData } = await supabase
            .from("leagues")
            .select("name")
            .eq("id", creator.league_id)
            .single()

          // Get video count and total views
          const { data: videosData } = await supabase.from("videos").select("views").eq("creator_id", creator.id)

          const totalViews = videosData?.reduce((sum, video) => sum + (video.views || 0), 0) || 0
          const videoCount = videosData?.length || 0

          return {
            ...creator,
            views: totalViews,
            league_name: leagueData?.name || "Unknown Campaign",
            video_count: videoCount,
          }
        }),
      )

      // Sort by views descending
      creatorsWithDetails.sort((a, b) => b.views - a.views)
      setCreators(creatorsWithDetails)
    } catch (error) {
      console.error("Error fetching creators:", error)
      toast({
        title: "Error",
        description: "Failed to load creators. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [supabase])

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

  // Refresh creator data
  const handleRefreshCreator = async (creatorId: string) => {
    setRefreshing((prev) => ({ ...prev, [creatorId]: true }))

    try {
      // Update last_checked timestamp
      await supabase.from("creators").update({ last_checked: new Date().toISOString() }).eq("id", creatorId)

      // In a real app, this would trigger a scrape of the creator's videos
      // For now, we'll just refresh the data
      await fetchCreators()

      toast({
        title: "Creator refreshed",
        description: "Creator data has been refreshed successfully.",
      })
    } catch (error) {
      console.error("Error refreshing creator:", error)
      toast({
        title: "Error",
        description: "Failed to refresh creator data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing((prev) => ({ ...prev, [creatorId]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Creators</CardTitle>
        <CardDescription>Manage your content creators and their videos</CardDescription>
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
          <div className="text-center p-8">
            <p className="text-sm text-muted-foreground mb-4">No creators found. Add creators to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => {
              const isRefreshing = refreshing[creator.id] || false

              return (
                <div key={creator.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{creator.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{creator.handle}</h3>
                        <Badge variant="outline">{creator.league_name}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Creator</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteCreatorDialog
                          creatorId={creator.id}
                          creatorHandle={creator.handle}
                          onCreatorDeleted={fetchCreators}
                        >
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Creator
                          </DropdownMenuItem>
                        </DeleteCreatorDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatViews(creator.views)}</p>
                        <p className="text-xs text-muted-foreground">Total Views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="m9 9 6 6" />
                        <path d="m15 9-6 6" />
                      </svg>
                      <div>
                        <p className="font-medium">{creator.video_count}</p>
                        <p className="text-xs text-muted-foreground">Videos</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(creator.last_checked).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshCreator(creator.id)}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`mr-2 h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                      </Button>
                      <AddVideoDialog creatorId={creator.id} creatorHandle={creator.handle} onComplete={fetchCreators}>
                        <Button size="sm">Add Video</Button>
                      </AddVideoDialog>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
