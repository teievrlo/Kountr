import type { Metadata } from "next"
import { CampaignStatus } from "./components/campaign-status"
import { CreatorLeaderboard } from "./components/creator-leaderboard"
import { OverviewStats } from "./components/overview-stats"
import { PerformanceChart } from "./components/performance-chart"

export const metadata: Metadata = {
  title: "Dashboard | Kountr",
  description: "Track and analyze your UGC campaign performance",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track and analyze your UGC campaign performance</p>
      </div>

      <OverviewStats />

      <PerformanceChart />

      <div className="grid gap-6 md:grid-cols-2">
        <CampaignStatus />
        <CreatorLeaderboard />
      </div>
    </div>
  )
}
