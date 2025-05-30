"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface PerformanceLineChartProps {
  data: {
    dailyData: Array<{ date: string; views: number }>
    weeklyData: Array<{ date: string; views: number }>
    monthlyData: Array<{ date: string; views: number }>
  }
}

export function PerformanceLineChart({ data }: PerformanceLineChartProps) {
  const chartConfig = {
    views: {
      label: "Views",
      color: "#06d6a0",
    },
  }

  const CustomTooltip = ({ active, payload, label, color = "#06d6a0" }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg p-3 shadow-lg border bg-emerald-50" style={{ borderColor: color }}>
          <p className="text-sm font-medium mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-sm">Total Views:</span>
            <span className="font-bold text-lg" style={{ color }}>
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderChart = (timeData: any[], gradientId: string, strokeColor: string) => {
    const margin = { top: 20, right: 30, left: 20, bottom: 20 }

    return (
      <AreaChart data={timeData} margin={margin}>
        <defs>
          <linearGradient id={`vibrant${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#118ab2" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#073b4c" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#06d6a0" strokeOpacity={0.3} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#073b4c", fontSize: 12, fontWeight: 500 }}
          axisLine={{ stroke: "#06d6a0" }}
        />
        <YAxis
          tick={{ fill: "#073b4c", fontSize: 12, fontWeight: 500 }}
          axisLine={{ stroke: "#06d6a0" }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip content={<CustomTooltip color="#06d6a0" />} />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#06d6a0"
          strokeWidth={3}
          fill={`url(#vibrant${gradientId})`}
          dot={{ fill: "#06d6a0", strokeWidth: 2, r: 5 }}
          activeDot={{ r: 8, stroke: "#06d6a0", strokeWidth: 3, fill: "#ffffff" }}
        />
      </AreaChart>
    )
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">Performance Analytics</h3>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(data.dailyData, "colorViewsDaily", "#06d6a0")}
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(data.weeklyData, "colorViewsWeekly", "#06d6a0")}
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(data.monthlyData, "colorViewsMonthly", "#06d6a0")}
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
