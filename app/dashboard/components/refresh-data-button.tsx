"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface RefreshDataButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RefreshDataButton({ variant = "outline", size = "sm" }: RefreshDataButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // Simulate refreshing data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Data Refreshed",
        description: "Successfully updated all campaign data.",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Refreshing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </>
      )}
    </Button>
  )
}
