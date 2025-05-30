"use client"

import { useState, useEffect } from "react"
import { useFirebaseAuth } from "@/lib/firebase-auth-provider"
import { apiClient } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProtectedDashboard() {
  const { user, loading } = useFirebaseAuth()
  const [stats, setStats] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const [statsData, campaignsData] = await Promise.all([apiClient.getDashboardStats(), apiClient.getMyCampaigns()])

      setStats(statsData.stats)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  if (loading) {
    return <div>Loading authentication...</div>
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to view your dashboard</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.email}</CardTitle>
          <CardDescription>Your UGC Tracker Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadData} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh Data"}
          </Button>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCreators}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVideos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-2 border rounded">
                  <div className="font-semibold">{campaign.name}</div>
                  <div className="text-sm text-gray-600">{campaign.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
