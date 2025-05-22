"use client"

import { useAppContext } from "@/app/context/app-provider"
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
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface LeaderboardTableProps {
  campaign: string
}

export function LeaderboardTable({ campaign }: LeaderboardTableProps) {
  const { creators, refreshCreatorData } = useAppContext()
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<"views" | "videos">("views")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter creators by campaign if a specific one is selected
  const filteredCreators = campaign === "all" ? creators : creators.filter((creator) => creator.campaign === campaign)

  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    const factor = sortOrder === "desc" ? -1 : 1
    if (sortBy === "views") {
      return (a.totalViews - b.totalViews) * factor
    } else {
      return (a.videoCount - b.videoCount) * factor
    }
  })

  // Refresh creator data
  const handleRefreshCreator = async (creatorId: string) => {
    setRefreshing((prev) => ({ ...prev, [creatorId]: true }))

    try {
      await refreshCreatorData(creatorId)

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
        <CardTitle className="text-base">Top Creators</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto w-full">
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
                            <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                            <AvatarFallback>{creator.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{creator.handle}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">{creator.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{creator.videoCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {creator.totalViews >= 1000
                              ? `${(creator.totalViews / 1000).toFixed(1)}K`
                              : creator.totalViews.toLocaleString()}
                          </span>
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
      </CardContent>
    </div>
  )
}
