"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight } from "lucide-react"
import { fetchTopCreators } from "@/app/actions/dashboard-actions"

interface Creator {
  id: string
  handle: string
  views: number
  campaign_name: string
}

export function CreatorLeaderboard() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTopCreators() {
      try {
        const result = await fetchTopCreators(5)
        if (result.success && result.data) {
          setCreators(result.data)
        } else {
          console.error("Failed to load top creators:", result.error)
        }
      } catch (error) {
        console.error("Error loading top creators:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTopCreators()
  }, [])

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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Creator Leaderboard</CardTitle>
          <CardDescription>Top performing creators this month</CardDescription>
        </div>
        <Link href="/dashboard/leaderboards">
          <Button size="sm" variant="outline">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">
              No creators found. Add creators to your campaigns to see them here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Campaign</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator, index) => (
                <TableRow key={creator.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href="/dashboard/leaderboards" className="flex items-center gap-2 hover:underline">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/diverse-avatars.png" alt={creator.handle} />
                        <AvatarFallback>{creator.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{creator.handle}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{formatViews(creator.views)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="ml-auto">
                      {creator.campaign_name}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {creators.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/dashboard/leaderboards">
              <Button variant="ghost" className="w-full justify-center">
                View Full Leaderboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
