"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "@Creator1", views: 12830 },
  { name: "@Creator2", views: 10120 },
  { name: "@Creator3", views: 8920 },
  { name: "@Creator4", views: 7450 },
  { name: "@Creator5", views: 6200 },
]

export function CreatorBarChart() {
  return (
    <div className="w-full h-[300px]">
      <ChartContainer
        config={{
          views: {
            label: "Views",
            color: "hsl(var(--kountr-purple))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="views" name="Views" fill="hsl(var(--kountr-purple))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
