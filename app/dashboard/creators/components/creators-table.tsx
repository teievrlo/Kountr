"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, RefreshCw, Trash2, Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface Campaign {
  id: string
  name: string
}

export function CreatorsTable() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const fetchCreators = async () => {
    setLoading(true)

    try {
      // Get creators
      const { data: creatorsData, error } = await supabase
        .from("creators")
        .select("id, handle, views, league_id, last_checked")
        .order("views", { ascending: false })

      if (error) {
        console.error("Error fetching creators:", error)
        setLoading(false)
        return
      }

      // Get campaigns
      const { data: campaignsData } = await supabase.from("leagues").select("id, name").order("name")

      setCampaigns(campaignsData || [])

      // Get league names and video counts for each creator
      const creatorsWithDetails = await Promise.all(
        creatorsData.map(async (creator) => {
          // Get league name
          const { data: leagueData } = await supabase
            .from("leagues")
            .select("name")
            .eq("id", creator.league_id)
            .single()

          // Get video count
          const { count } = await supabase
            .from("videos")
            .select("*", { count: "exact", head: true })
            .eq("creator_id", creator.id)

          return {
            ...creator,
            league_name: leagueData?.name || "Unknown Campaign",
            video_count: count || 0,
          }
        }),
      )

      setCreators(creatorsWithDetails)
      setFilteredCreators(creatorsWithDetails)
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

  // Filter creators based on search and campaign
  useEffect(() => {
    let filtered = creators

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (creator) =>
          creator.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          creator.league_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by campaign
    if (selectedCampaign !== "all") {
      filtered = filtered.filter((creator) => creator.league_id === selectedCampaign)
    }

    setFilteredCreators(filtered)
  }, [creators, searchTerm, selectedCampaign])

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
        <CardTitle>Creators Table</CardTitle>
        <CardDescription>Detailed view of all creators with filtering and search</CardDescription>

        {/* Filters */}
        <div className="flex gap-4 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators or campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
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
        ) : filteredCreators.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-sm text-muted-foreground mb-4">
              {creators.length === 0
                ? "No creators found. Add creators to get started."
                : "No creators match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Videos</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((creator) => {
                  const isRefreshing = refreshing[creator.id] || false

                  return (
                    <TableRow key={creator.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {creator.handle.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{creator.handle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{creator.league_name}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatViews(creator.views)}</TableCell>
                      <TableCell className="text-right">{creator.video_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(creator.last_checked).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefreshCreator(creator.id)}
                            disabled={isRefreshing}
                          >
                            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                          </Button>
                          <AddVideoDialog
                            creatorId={creator.id}
                            creatorHandle={creator.handle}
                            onComplete={fetchCreators}
                          >
                            <Button variant="outline" size="sm">
                              Add Video
                            </Button>
                          </AddVideoDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Results summary */}
        {!loading && (
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <span>
              Showing {filteredCreators.length} of {creators.length} creators
            </span>
            {(searchTerm || selectedCampaign !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCampaign("all")
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
