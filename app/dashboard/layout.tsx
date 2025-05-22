"use client"

import type React from "react"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { DashboardHeader } from "./components/dashboard-header"
import { AppProvider } from "@/app/context/app-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
        <Toaster />
      </div>
    </AppProvider>
  )
}
