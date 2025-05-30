"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTable } from "./components/leaderboard-table"
import { LeaderboardStats } from "./components/leaderboard-stats"
import { LeaderboardChart } from "./components/leaderboard-chart"
import { getSupabaseClient } from "@/app/lib/supabase"

interface Campaign {
  id: string
  name: string
}

export default function LeaderboardsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("leagues").select("id, name").order("name")

        if (error) {
          console.error("Error fetching campaigns:", error)
        } else {
          setCampaigns(data || [])
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  if (isLoading) {
    return (
      <div className="container space-y-4 p-8 pt-6 max-w-full h-full w-full">
        <div className="px-4 py-4 h-full flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
              <p className="text-muted-foreground">Track and compare creator performance across campaigns.</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin h-6 w-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container space-y-4 p-8 pt-6 max-w-full h-full w-full">
      <div className="px-4 py-4 h-full flex flex-col w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
            <p className="text-muted-foreground">Track and compare creator performance across campaigns.</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="mt-4 flex-1 flex flex-col w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            {campaigns.map((campaign) => (
              <TabsTrigger key={campaign.id} value={campaign.id}>
                {campaign.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full">
            <LeaderboardStats className="md:col-span-3 w-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 flex-1 w-full">
            <Card className="lg:col-span-3 overflow-hidden flex flex-col w-full">
              <TabsContent value="all" className="m-0 flex-1 flex flex-col w-full">
                <LeaderboardTable campaign="all" />
              </TabsContent>
              {campaigns.map((campaign) => (
                <TabsContent key={campaign.id} value={campaign.id} className="m-0 flex-1 flex flex-col w-full">
                  <LeaderboardTable campaign={campaign.name} />
                </TabsContent>
              ))}
            </Card>

            <Card className="lg:col-span-1 flex flex-col w-full">
              <TabsContent value="all" className="m-0 h-full flex-1 w-full">
                <LeaderboardChart campaign="all" />
              </TabsContent>
              {campaigns.map((campaign) => (
                <TabsContent key={campaign.id} value={campaign.id} className="m-0 h-full flex-1 w-full">
                  <LeaderboardChart campaign={campaign.name} />
                </TabsContent>
              ))}
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
