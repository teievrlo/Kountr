"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { fetchPerformanceData } from "@/app/actions/dashboard-actions"

type ChartData = {
  date: string
  views: number
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<{
    dailyData: ChartData[]
    weeklyData: ChartData[]
    monthlyData: ChartData[]
  }>({
    dailyData: [],
    weeklyData: [],
    monthlyData: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPerformanceData() {
      try {
        const result = await fetchPerformanceData()
        if (result.success && result.data) {
          setChartData(result.data)
        } else {
          console.error("Failed to load performance data:", result.error)
        }
      } catch (error) {
        console.error("Error loading performance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPerformanceData()
  }, [])

  // Placeholder data for loading state
  const loadingData = Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    views: 0,
  }))

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Views Over Time</CardTitle>
        <CardDescription>Total views across all videos</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex items-center px-6 mb-2">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="daily" className="mt-0 w-full">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={isLoading ? loadingData : chartData.dailyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                <span className="font-bold text-muted-foreground">{label}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                                <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--kountr-blue))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                    isAnimationActive={!isLoading}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="mt-0 w-full">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={isLoading ? loadingData : chartData.weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                <span className="font-bold text-muted-foreground">{label}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                                <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--kountr-purple))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                    isAnimationActive={!isLoading}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="mt-0 w-full">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={isLoading ? loadingData : chartData.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                <span className="font-bold text-muted-foreground">{label}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                                <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--kountr-teal))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                    isAnimationActive={!isLoading}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
