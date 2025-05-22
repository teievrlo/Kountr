"use client"

import { useState } from "react"
import { useAppContext } from "@/app/context/app-provider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreatorTable } from "./creator-table"
import { Card } from "@/components/ui/card"

export function LeaderboardView() {
  const { campaigns } = useAppContext()
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")

  // Handle campaign selection
  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value)
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {selectedCampaign === "all" ? "All Campaigns" : selectedCampaign} Leaderboard
        </h2>
        <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Campaigns</SelectLabel>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.name}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <CreatorTable campaign={selectedCampaign} />
      </Card>
    </div>
  )
}
