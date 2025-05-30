"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchRecentActivity } from "@/app/actions/activity-actions"

interface Activity {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  target: string
  time: string
  viewIncrease?: number
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const result = await fetchRecentActivity(4)
        if (result.success && result.data) {
          setActivities(result.data)
        } else {
          console.error("Failed to load recent activity:", result.error)
        }
      } catch (error) {
        console.error("Error loading recent activity:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentActivity()
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your creators</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">
              No recent activity found. Activity will appear here as creators update their content.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                    <span className="font-semibold">"{activity.target}"</span>
                    {activity.viewIncrease && activity.viewIncrease > 0 && (
                      <span className="text-green-600 ml-1">(+{activity.viewIncrease.toLocaleString()} views)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
