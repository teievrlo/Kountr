"use client"

import { useEffect, useState } from "react"
import { useFirebaseAuth } from "@/lib/firebase-auth-provider"
import { apiClient } from "@/lib/auth-helpers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardOverview } from "./components/dashboard-overview" // Assuming this is your overview component
import { PerformanceLineChart } from "./components/performance-line-chart" // Assuming this is your chart
import { PlusCircle } from "lucide-react"

// Define a type for your dashboard stats
interface DashboardStats {
  totalCampaigns: number
  totalCreators: number
  totalVideos: number
  totalViews: number
}

interface PerformanceDataItem {
  scraped_at: string // or Date
  views_increase: number
  // Add other relevant fields from your scrape_logs
}

interface DashboardData {
  stats: DashboardStats
  performanceData: PerformanceDataItem[]
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setDataLoading(true)
        setError(null)
        try {
          const data = await apiClient.getDashboardStats() // Uses authenticated fetch
          setDashboardData(data)
        } catch (err) {
          console.error("Failed to fetch dashboard stats:", err)
          setError("Failed to load dashboard data. Please try again.")
        } finally {
          setDataLoading(false)
        }
      }
      fetchData()
    } else if (!authLoading) {
      // Not logged in, and auth check is complete
      setDataLoading(false)
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Loading authentication...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Access Your Dashboard</h1>
        <p className="mb-6 text-slate-600">Please log in to view your UGC campaign performance.</p>
        <Link href="/">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  if (!dashboardData || (dashboardData.stats.totalCampaigns === 0 && dashboardData.stats.totalCreators === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6 bg-slate-50 rounded-lg shadow">
        <img src="/empty-dashboard.png" alt="Empty Dashboard" className="mb-6 opacity-70" />
        <h2 className="text-2xl font-semibold mb-3 text-slate-700">
          Welcome to Kountr, {user.displayName || user.email}!
        </h2>
        <p className="text-slate-600 mb-6 max-w-md">
          It looks like you're just getting started. Let's add your first campaign to begin tracking UGC performance.
        </p>
        <Link href="/dashboard/campaigns">
          {/* Assuming you have an AddCampaignDialog or similar, or a page to add campaigns */}
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Campaign
          </Button>
        </Link>
        <p className="text-sm text-slate-500 mt-8">
          Need help? Check out our{" "}
          <Link href="/docs/getting-started" className="text-blue-500 hover:underline">
            getting started guide
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Overview of your UGC campaign performance.</p>
      </div>

      {/* Pass the fetched stats to DashboardOverview */}
      {dashboardData.stats && <DashboardOverview stats={dashboardData.stats} />}

      {/* Pass performanceData to PerformanceLineChart */}
      {dashboardData.performanceData && dashboardData.performanceData.length > 0 && (
        <PerformanceLineChart rawData={dashboardData.performanceData} />
      )}

      {/* You might want to add other sections like CampaignStatus or CreatorLeaderboard here,
          ensuring they also fetch user-specific data if needed. */}
    </div>
  )
}
