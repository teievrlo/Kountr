"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const dailyData = [
  { date: "Mon", views: 2400 },
  { date: "Tue", views: 1398 },
  { date: "Wed", views: 9800 },
  { date: "Thu", views: 3908 },
  { date: "Fri", views: 4800 },
  { date: "Sat", views: 3800 },
  { date: "Sun", views: 4300 },
]

const weeklyData = [
  { date: "Week 1", views: 12500 },
  { date: "Week 2", views: 18700 },
  { date: "Week 3", views: 15400 },
  { date: "Week 4", views: 21200 },
]

const monthlyData = [
  { date: "Jan", views: 45000 },
  { date: "Feb", views: 52000 },
  { date: "Mar", views: 61000 },
  { date: "Apr", views: 58000 },
  { date: "May", views: 73000 },
  { date: "Jun", views: 69000 },
]

export function PerformanceChart() {
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
                <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="mt-0 w-full">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="mt-0 w-full">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
