"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchTopCreators } from "@/app/actions/dashboard-actions"
import { fetchTopCreator, fetchFastestGrowing } from "@/app/actions/leaderboard-actions"

interface Creator {
  id: string
  username: string
  profile_picture: string
  total_fans: number
  engagement_rate: number
  league_id: string
}

interface TopCreator {
  id: string
  username: string
  profile_picture: string
  total_fans: number
}

interface FastestGrowing {
  id: string
  username: string
  profile_picture: string
  follower_growth: number
}

const LeaderboardView = () => {
  const [creators, setCreators] = useState<Creator[]>([])
  const [topCreator, setTopCreator] = useState<TopCreator | null>(null)
  const [fastestGrowing, setFastestGrowing] = useState<FastestGrowing | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        const [topCreatorResult, fastestGrowingResult, creatorsResult] = await Promise.all([
          fetchTopCreator(),
          fetchFastestGrowing(),
          fetchTopCreators(selectedCampaign === "all" ? 50 : 50),
        ])

        if (topCreatorResult.success && topCreatorResult.data) {
          setTopCreator(topCreatorResult.data)
        }

        if (fastestGrowingResult.success && fastestGrowingResult.data) {
          setFastestGrowing(fastestGrowingResult.data)
        }

        if (creatorsResult.success && creatorsResult.data) {
          const filteredCreators =
            selectedCampaign === "all"
              ? creatorsResult.data
              : creatorsResult.data.filter((creator) => creator.league_id === selectedCampaign)

          setCreators(filteredCreators)
        }
      } catch (error) {
        console.error("Error loading leaderboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedCampaign])

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <Select onValueChange={handleCampaignChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="1">Campaign 1</SelectItem>
            <SelectItem value="2">Campaign 2</SelectItem>
            <SelectItem value="3">Campaign 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Creator */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Creator</h3>
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : topCreator ? (
          <div className="flex items-center space-x-4">
            <img
              src={topCreator.profile_picture || "/placeholder.svg"}
              alt={topCreator.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{topCreator.username}</p>
              <p className="text-sm text-muted-foreground">Total Fans: {topCreator.total_fans}</p>
            </div>
          </div>
        ) : (
          <p>No top creator data available.</p>
        )}
      </div>

      {/* Fastest Growing Creator */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Fastest Growing Creator</h3>
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : fastestGrowing ? (
          <div className="flex items-center space-x-4">
            <img
              src={fastestGrowing.profile_picture || "/placeholder.svg"}
              alt={fastestGrowing.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{fastestGrowing.username}</p>
              <p className="text-sm text-muted-foreground">Follower Growth: {fastestGrowing.follower_growth}</p>
            </div>
          </div>
        ) : (
          <p>No fastest growing creator data available.</p>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Fans</TableHead>
              <TableHead>Engagement Rate</TableHead>
              <TableHead>Campaign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              creators.map((creator, index) => (
                <TableRow key={creator.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{creator.username}</TableCell>
                  <TableCell>{creator.total_fans}</TableCell>
                  <TableCell>{creator.engagement_rate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{creator.league_id}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LeaderboardView
