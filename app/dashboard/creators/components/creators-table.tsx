"use client"

import { useAppContext } from "@/app/context/app-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Eye, MoreHorizontal, RefreshCw, Video } from "lucide-react"
import { useState } from "react"
import { AddVideosDialog } from "./add-videos-dialog"

interface CreatorsTableProps {
  campaign: string
}

export function CreatorsTable({ campaign }: CreatorsTableProps) {
  const { creators, videos, refreshCreatorData } = useAppContext()
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})
  const [selectedCreators, setSelectedCreators] = useState<string[]>([])

  // Filter creators by campaign if a specific one is selected
  const filteredCreators = campaign === "all" ? creators : creators.filter((creator) => creator.campaign === campaign)

  // Sort creators by views (highest first)
  const sortedCreators = [...filteredCreators].sort((a, b) => b.totalViews - a.totalViews)

  // Get videos for a specific creator
  const getCreatorVideos = (creatorId: string) => {
    return videos.filter((video) => video.creatorId === creatorId)
  }

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

  // Toggle row selection
  const toggleRowSelection = (creatorId: string) => {
    setSelectedCreators((prev) => {
      if (prev.includes(creatorId)) {
        return prev.filter((id) => id !== creatorId)
      } else {
        return [...prev, creatorId]
      }
    })
  }

  // Toggle all rows selection
  const toggleAllRows = () => {
    if (selectedCreators.length === sortedCreators.length) {
      setSelectedCreators([])
    } else {
      setSelectedCreators(sortedCreators.map((creator) => creator.id))
    }
  }

  return (
    <div className="h-full flex flex-col w-full">
      {selectedCreators.length > 0 && (
        <div className="bg-muted/50 p-2 flex items-center justify-between w-full">
          <div className="text-sm font-medium">
            {selectedCreators.length} creator{selectedCreators.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Add to Campaign
            </Button>
            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
              Remove
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-auto flex-1 w-full">
        <div className="min-w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedCreators.length === sortedCreators.length && sortedCreators.length > 0}
                    onCheckedChange={toggleAllRows}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="hidden md:table-cell">Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Videos</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCreators.length > 0 ? (
                sortedCreators.map((creator) => {
                  const isRefreshing = refreshing[creator.id] || false
                  const creatorVideos = getCreatorVideos(creator.id)
                  const isSelected = selectedCreators.includes(creator.id)

                  return (
                    <TableRow key={creator.id} className={isSelected ? "bg-muted/50" : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRowSelection(creator.id)}
                          aria-label={`Select ${creator.handle}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                            <AvatarFallback>{creator.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center">
                              {creator.handle}
                              {creator.isVerified && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50 hidden sm:inline-flex"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{creator.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{creator.campaign}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>{creator.videoCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>
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
                          <AddVideosDialog creator={creator}>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Video className="h-3.5 w-3.5" />
                              <span className="sr-only">Add Videos</span>
                            </Button>
                          </AddVideosDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Campaign</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Remove Creator</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No creators found for this campaign.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
