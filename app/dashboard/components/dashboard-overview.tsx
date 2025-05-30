"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Eye,
  Users,
  Video,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Activity,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { fetchDashboardStats, fetchPerformanceData } from "@/app/actions/dashboard-actions"
import { PerformanceLineChart } from "./performance-line-chart"

interface DashboardStats {
  totalViews: number
  creatorsCount: number
  campaignsCount: number
  videosCount: number
  viewsGrowth?: number
  creatorsGrowth?: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    creatorsCount: 0,
    campaignsCount: 0,
    videosCount: 0,
  })
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsResult, performanceResult] = await Promise.all([fetchDashboardStats(), fetchPerformanceData()])

        if (statsResult.success && statsResult.data) {
          // Calculate growth percentages (demo values for now)
          setStats({
            ...statsResult.data,
            viewsGrowth: 12.5,
            creatorsGrowth: 8.3,
          })
        }

        if (performanceResult.success && performanceResult.data) {
          setPerformanceData(performanceResult.data)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const statCards = [
    {
      title: "Total Views",
      value: formatNumber(stats.totalViews),
      description: "across all videos",
      icon: Eye,
      trend: stats.viewsGrowth,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      href: "/dashboard/videos",
    },
    {
      title: "Active Creators",
      value: stats.creatorsCount.toString(),
      description: "contributing content",
      icon: Users,
      trend: stats.creatorsGrowth,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      href: "/dashboard/creators",
    },
    {
      title: "Active Campaigns",
      value: stats.campaignsCount.toString(),
      description: "currently running",
      icon: BarChart3,
      trend: null,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      href: "/dashboard/campaigns",
    },
    {
      title: "Total Videos",
      value: stats.videosCount.toString(),
      description: "being tracked",
      icon: Video,
      trend: null,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      href: "/dashboard/videos",
    },
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your UGC campaigns.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              Last 30 days
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.href}>
              <Card
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm hover:scale-105 ${stat.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${stat.color}`}>{stat.title}</p>
                      <div className="text-3xl font-bold text-gray-900">{isLoading ? "-" : stat.value}</div>
                      <p className={`text-xs mt-1 ${stat.color}`}>{stat.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Icon className={`h-8 w-8 ${stat.color.replace("600", "500")}`} />
                      {stat.trend && (
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${
                            stat.trend > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {Math.abs(stat.trend)}%
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Performance Chart Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Performance Analytics</CardTitle>
              <CardDescription>Track your view growth over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Live Data
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>{performanceData && <PerformanceLineChart data={performanceData} />}</CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Quick Actions
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Get started with common tasks</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/creators?tab=add">
                <Button size="sm" variant="secondary">
                  Add Creator
                </Button>
              </Link>
              <Link href="/dashboard/campaigns">
                <Button size="sm" variant="secondary">
                  New Campaign
                </Button>
              </Link>
              <Link href="/dashboard/leaderboards">
                <Button size="sm">
                  View Leaderboards
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
