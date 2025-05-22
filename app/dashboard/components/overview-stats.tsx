"use client"

import type React from "react"

import { BarChart3, Eye, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    label: string
    positive: boolean
  }
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center gap-1">
          {trend && (
            <span
              className={trend.positive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}
            >
              {trend.positive ? "+" : "-"}
              {trend.value}
            </span>
          )}
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export function OverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Views"
        value="1.2M"
        description="from last month"
        trend={{ value: "12%", label: "increase", positive: true }}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Creators"
        value="48"
        description="across all campaigns"
        trend={{ value: "4", label: "new creators", positive: true }}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Campaigns"
        value="12"
        description="3 ending this month"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
