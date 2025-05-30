"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronDown, Eye, RefreshCw, Video } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/app/lib/supabase"

interface Creator {
  id: string
  handle: string
  views: number
  campaign_name: string
  video_count?: number
}

interface LeaderboardTableProps {
  campaign: string
}

export function LeaderboardTable({ campaign }: LeaderboardTableProps) {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<"views" | "videos">("views")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  useEffect(() => {
    async function loadCreators() {
      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()

        if (campaign === "all") {
          // Get all creators with their total views from videos
          const { data: creatorsData, error: creatorsError } = await supabase
            .from("creators")
            .select("id, handle, league_id")
            .order("created_at", { ascending: false })

          if (creatorsError) {
            console.error("Error fetching creators:", creatorsError)
            return
          }

          // Calculate total views for each creator from their videos
          const creatorsWithViews = await Promise.all(
            creatorsData.map(async (creator) => {
              // Get total views from all videos for this creator
              const { data: videosData, error: videosError } = await supabase
                .from("videos")
                .select("views")
                .eq("creator_id", creator.id)

              const totalViews = videosData?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

              // Get video count
              const { count: videoCount } = await supabase
                .from("videos")
                .select("*", { count: "exact", head: true })
                .eq("creator_id", creator.id)

              // Get campaign name
              let campaignName = "No Campaign"
              if (creator.league_id) {
                const { data: campaignData } = await supabase
                  .from("leagues")
                  .select("name")
                  .eq("id", creator.league_id)
                  .single()
                campaignName = campaignData?.name || "Unknown Campaign"
              }

              return {
                id: creator.id,
                handle: creator.handle,
                views: totalViews,
                campaign_name: campaignName,
                video_count: videoCount || 0,
              }
            }),
          )

          // Sort by views descending
          creatorsWithViews.sort((a, b) => b.views - a.views)
          setCreators(creatorsWithViews)
        } else {
          // Get creators for specific campaign
          const { data: campaignData } = await supabase.from("leagues").select("id").eq("name", campaign).single()

          if (campaignData) {
            const { data: creatorsData, error } = await supabase
              .from("creators")
              .select("id, handle, league_id")
              .eq("league_id", campaignData.id)

            if (error) {
              console.error("Error fetching campaign creators:", error)
            } else {
              // Calculate total views for each creator from their videos
              const creatorsWithViews = await Promise.all(
                creatorsData.map(async (creator) => {
                  // Get total views from all videos for this creator
                  const { data: videosData, error: videosError } = await supabase
                    .from("videos")
                    .select("views")
                    .eq("creator_id", creator.id)

                  const totalViews = videosData?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

                  // Get video count
                  const { count: videoCount } = await supabase
                    .from("videos")
                    .select("*", { count: "exact", head: true })
                    .eq("creator_id", creator.id)

                  return {
                    id: creator.id,
                    handle: creator.handle,
                    views: totalViews,
                    campaign_name: campaign,
                    video_count: videoCount || 0,
                  }
                }),
              )

              // Sort by views descending
              creatorsWithViews.sort((a, b) => b.views - a.views)
              setCreators(creatorsWithViews)
            }
          }
        }
      } catch (error) {
        console.error("Error loading creators:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCreators()
  }, [campaign])

  // Sort creators
  const sortedCreators = [...creators].sort((a, b) => {
    const factor = sortOrder === "desc" ? -1 : 1
    if (sortBy === "views") {
      return (a.views - b.views) * factor
    } else {
      return ((a.video_count || 0) - (b.video_count || 0)) * factor
    }
  })

  // Refresh creator data
  const handleRefreshCreator = async (creatorId: string) => {
    setRefreshing((prev) => ({ ...prev, [creatorId]: true }))

    try {
      const supabase = getSupabaseClient()

      // Get updated total views from all videos for this creator
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("views")
        .eq("creator_id", creatorId)

      if (!videosError && videosData) {
        const totalViews = videosData.reduce((sum, video) => sum + (video.views || 0), 0)

        // Update the creator's views in our local state
        setCreators((prev) =>
          prev.map((creator) => (creator.id === creatorId ? { ...creator, views: totalViews } : creator)),
        )
      }

      // Update last_checked timestamp
      await supabase.from("creators").update({ last_checked: new Date().toISOString() }).eq("id", creatorId)

      toast({
        title: "Data Refreshed",
        description: "Creator data has been updated successfully.",
      })
    } catch (error) {
      console.error("Error refreshing creator data:", error)
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the creator data.",
        variant: "destructive",
      })
    } finally {
      setRefreshing((prev) => ({ ...prev, [creatorId]: false }))
    }
  }

  // Toggle sort
  const toggleSort = (column: "views" | "videos") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-base">{campaign === "all" ? "All Creators" : `${campaign} Creators`}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto w-full">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-6 w-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="min-w-full w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 -ml-3 font-medium h-7 px-2"
                      onClick={() => toggleSort("videos")}
                    >
                      Videos
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 -ml-3 font-medium h-7 px-2"
                      onClick={() => toggleSort("views")}
                    >
                      Views
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCreators.length > 0 ? (
                  sortedCreators.map((creator, index) => {
                    const isRefreshing = refreshing[creator.id] || false

                    return (
                      <TableRow key={creator.id}>
                        <TableCell className="font-medium">
                          <Badge
                            variant={index < 3 ? "default" : "outline"}
                            className={
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-amber-600"
                                    : ""
                            }
                          >
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src="/diverse-avatars.png" alt={creator.handle} />
                              <AvatarFallback>{creator.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{creator.handle}</div>
                              {campaign === "all" && (
                                <div className="text-xs text-muted-foreground">{creator.campaign_name}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Video className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{creator.video_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <div className="text-right">
                              <div className="font-medium text-sm">
                                {creator.views >= 1000000
                                  ? `${(creator.views / 1000000).toFixed(1)}M`
                                  : creator.views >= 1000
                                    ? `${(creator.views / 1000).toFixed(1)}K`
                                    : creator.views.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {creator.views.toLocaleString()} total
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRefreshCreator(creator.id)}
                              disabled={isRefreshing}
                              className="h-7 w-7"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                              <span className="sr-only">Refresh</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <ChevronDown className="h-3.5 w-3.5" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>View Videos</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No creators found for this campaign.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  )
}
