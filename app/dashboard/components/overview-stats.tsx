"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Eye, Users, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDashboardStats } from "@/app/actions/dashboard-actions"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  isLoading?: boolean
  href?: string
}

function StatCard({ title, value, description, icon, isLoading = false, href }: StatCardProps) {
  const content = (
    <Card className={href ? "hover:bg-muted/50 transition-colors cursor-pointer" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export function OverviewStats() {
  const [stats, setStats] = useState({
    totalViews: 0,
    creatorsCount: 0,
    campaignsCount: 0,
    videosCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await fetchDashboardStats()
        if (result.success && result.data) {
          setStats(result.data)
        } else {
          console.error("Failed to load dashboard stats:", result.error)
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Views"
        value={formatViews(stats.totalViews)}
        description="across all videos"
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
        href="/dashboard/videos"
      />
      <StatCard
        title="Active Creators"
        value={stats.creatorsCount.toString()}
        description="contributing content"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
        href="/dashboard/creators"
      />
      <StatCard
        title="Active Campaigns"
        value={stats.campaignsCount.toString()}
        description="currently running"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
        href="/dashboard/campaigns"
      />
      <StatCard
        title="Total Videos"
        value={stats.videosCount.toString()}
        description="being tracked"
        icon={<Video className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
        href="/dashboard/videos"
      />
    </div>
  )
}
