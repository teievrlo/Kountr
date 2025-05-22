import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className="container space-y-4 p-8 pt-6">{children}</div>
}
