import { DashboardHeader } from "../components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTable } from "./components/leaderboard-table"
import { LeaderboardStats } from "./components/leaderboard-stats"
import { LeaderboardChart } from "./components/leaderboard-chart"

export default function LeaderboardsPage() {
  return (
    <DashboardShell className="max-w-full h-full w-full">
      <div className="px-4 py-4 h-full flex flex-col w-full">
        <DashboardHeader heading="Leaderboards" text="Track and compare creator performance across campaigns." />

        <Tabs defaultValue="all" className="mt-4 flex-1 flex flex-col w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="summer">Summer Collection</TabsTrigger>
            <TabsTrigger value="product">Product Launch</TabsTrigger>
            <TabsTrigger value="holiday">Holiday Special</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full">
            <LeaderboardStats className="md:col-span-3 w-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 flex-1 w-full">
            <Card className="lg:col-span-3 overflow-hidden flex flex-col w-full">
              <TabsContent value="all" className="m-0 flex-1 flex flex-col w-full">
                <LeaderboardTable campaign="all" />
              </TabsContent>
              <TabsContent value="summer" className="m-0 flex-1 flex flex-col w-full">
                <LeaderboardTable campaign="Summer Collection" />
              </TabsContent>
              <TabsContent value="product" className="m-0 flex-1 flex flex-col w-full">
                <LeaderboardTable campaign="Product Launch" />
              </TabsContent>
              <TabsContent value="holiday" className="m-0 flex-1 flex flex-col w-full">
                <LeaderboardTable campaign="Holiday Special" />
              </TabsContent>
            </Card>

            <Card className="lg:col-span-1 flex flex-col w-full">
              <TabsContent value="all" className="m-0 h-full flex-1 w-full">
                <LeaderboardChart campaign="all" />
              </TabsContent>
              <TabsContent value="summer" className="m-0 h-full flex-1 w-full">
                <LeaderboardChart campaign="Summer Collection" />
              </TabsContent>
              <TabsContent value="product" className="m-0 h-full flex-1 w-full">
                <LeaderboardChart campaign="Product Launch" />
              </TabsContent>
              <TabsContent value="holiday" className="m-0 h-full flex-1 w-full">
                <LeaderboardChart campaign="Holiday Special" />
              </TabsContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
