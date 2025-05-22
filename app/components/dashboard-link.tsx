"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DashboardLinkProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DashboardLink({ children, className, variant = "default", size = "default" }: DashboardLinkProps) {
  const router = useRouter()

  return (
    <Button variant={variant} size={size} className={className} onClick={() => router.push("/dashboard")}>
      {children}
    </Button>
  )
}
