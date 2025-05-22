"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LayoutDashboard, Users, Menu, PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { KountrLogo } from "@/app/components/kountr-logo"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: LayoutDashboard,
  },
  {
    title: "Creators",
    href: "/dashboard/creators",
    icon: Users,
  },
  {
    title: "Leaderboards",
    href: "/dashboard/leaderboards",
    icon: BarChart3,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="border-b p-4">
            <KountrLogo size="sm" />
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden border-r bg-background transition-all duration-300 md:block",
          collapsed ? "w-[60px]" : "w-[240px]",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!collapsed && <KountrLogo size="sm" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("ml-auto", collapsed && "rotate-180")}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="p-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(collapsed ? "hidden" : "block")}>{item.title}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
