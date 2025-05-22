"use client"

import { useAppContext } from "@/app/context/app-provider"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface LeaderboardChartProps {
  campaign: string
}

export function LeaderboardChart({ campaign }: LeaderboardChartProps) {
  const { creators } = useAppContext()

  // Filter creators by campaign if a specific one is selected
  const filteredCreators = campaign === "all" ? creators : creators.filter((creator) => creator.campaign === campaign)

  // Sort creators by views (highest first) and take top 5
  const topCreators = [...filteredCreators]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5)
    .map((creator) => ({
      name: creator.handle,
      value: creator.totalViews,
    }))

  // Calculate total views for "Others" category
  const topCreatorsViews = topCreators.reduce((sum, creator) => sum + creator.value, 0)
  const allCreatorsViews = filteredCreators.reduce((sum, creator) => sum + creator.totalViews, 0)
  const othersViews = allCreatorsViews - topCreatorsViews

  // Add "Others" category if there are more than 5 creators
  const chartData = [...topCreators]
  if (filteredCreators.length > 5 && othersViews > 0) {
    chartData.push({
      name: "Others",
      value: othersViews,
    })
  }

  // Colors for the pie chart - using Kountr brand colors
  const COLORS = [
    "hsl(var(--kountr-blue))",
    "hsl(var(--kountr-purple))",
    "hsl(var(--kountr-teal))",
    "hsl(var(--kountr-blue-light))",
    "hsl(var(--kountr-purple-light))",
    "hsl(var(--kountr-teal-light))",
  ]

  return (
    <div className="flex flex-col h-full w-full">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-base">Views Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col justify-center w-full">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="70%"
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} Views`, "Views"]}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  )
}
