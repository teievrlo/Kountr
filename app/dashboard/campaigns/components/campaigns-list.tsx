"use client"

import { useAppContext } from "@/app/context/app-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, MoreHorizontal, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CampaignsList() {
  const { campaigns, creators } = useAppContext()
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  // Count creators per campaign
  const getCreatorCount = (campaignName: string) => {
    return creators.filter((creator) => creator.campaign === campaignName).length
  }

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {campaigns.map((campaign) => {
          const creatorCount = getCreatorCount(campaign.name)

          return (
            <Card key={campaign.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{campaign.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-base">{campaign.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {campaign.status === "active" ? "Active Campaign" : "Draft Campaign"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(campaign)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Leaderboard</DropdownMenuItem>
                      <DropdownMenuItem>Add Creators</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Archive Campaign</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant={campaign.status === "active" ? "default" : "outline"}>
                      {campaign.status === "active" ? "Active" : "Draft"}
                    </Badge>
                    <span className="text-sm font-medium">{campaign.views} views</span>
                  </div>

                  <Progress value={campaign.progress} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{campaign.progress}% complete</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{creatorCount}</p>
                        <p className="text-xs text-muted-foreground">Creators</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{campaign.daysLeft}</p>
                        <p className="text-xs text-muted-foreground">Days Left</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-4 py-2 flex justify-center">
                <Button size="sm" onClick={() => handleViewDetails(campaign)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Campaign Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name}</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.status === "active" ? "Active Campaign" : "Draft Campaign"}
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Campaign Status</h4>
                  <p className="text-sm">{selectedCampaign.progress}% Complete</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Views</h4>
                  <p className="text-sm">{selectedCampaign.views}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Creators</h4>
                  <p className="text-sm">{getCreatorCount(selectedCampaign.name)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Time Remaining</h4>
                  <p className="text-sm">{selectedCampaign.daysLeft} days</p>
                </div>
              </div>

              {selectedCampaign.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedCampaign.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-1">Campaign Period</h4>
                <p className="text-sm">
                  {selectedCampaign.startDate ? new Date(selectedCampaign.startDate).toLocaleDateString() : "N/A"} -
                  {selectedCampaign.endDate ? new Date(selectedCampaign.endDate).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div className="pt-4">
                <Button onClick={() => router.push(`/dashboard/leaderboards?campaign=${selectedCampaign.id}`)}>
                  View Leaderboard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
