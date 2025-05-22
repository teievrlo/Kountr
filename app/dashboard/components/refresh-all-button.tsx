"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAppContext } from "@/app/context/app-provider"

interface RefreshAllButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RefreshAllButton({ variant = "default", size = "default" }: RefreshAllButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const { refreshAllData } = useAppContext()

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      await refreshAllData()

      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed from the database.",
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
          Refresh All Data
        </>
      )}
    </Button>
  )
}
