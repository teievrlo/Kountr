"use client"

import { useAppContext } from "@/app/context/app-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface CreatorTableProps {
  campaign: string
}

export function CreatorTable({ campaign }: CreatorTableProps) {
  const { creators, refreshCreatorData } = useAppContext()
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({})

  // Filter creators by campaign if a specific one is selected
  const filteredCreators = campaign === "all" ? creators : creators.filter((creator) => creator.campaign === campaign)

  // Sort creators by views (highest first)
  const sortedCreators = [...filteredCreators].sort((a, b) => b.totalViews - a.totalViews)

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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>
              <div className="flex items-center">
                Views
                <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>Campaign</TableHead>
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
                    <Badge variant={index < 3 ? "default" : "outline"} className={index === 0 ? "bg-yellow-500" : ""}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                        <AvatarFallback>{creator.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{creator.handle}</div>
                        <div className="text-xs text-muted-foreground">{creator.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{creator.totalViews.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{creator.videoCount} videos</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{creator.campaign}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefreshCreator(creator.id)}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span className="sr-only">Refresh</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <ChevronDown className="h-4 w-4" />
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
  )
}
