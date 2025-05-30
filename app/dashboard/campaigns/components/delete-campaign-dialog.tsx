"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { deleteCampaign } from "@/app/actions/campaign-actions"
import { AlertTriangle } from "lucide-react"

interface DeleteCampaignDialogProps {
  children: React.ReactNode
  campaignId: string
  campaignName: string
  onCampaignDeleted?: () => void
}

export function DeleteCampaignDialog({
  children,
  campaignId,
  campaignName,
  onCampaignDeleted,
}: DeleteCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteCampaign(campaignId)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Campaign deleted",
        description: `${campaignName} has been deleted successfully.`,
      })

      setOpen(false)

      // Callback to refresh campaigns list
      if (onCampaignDeleted) {
        onCampaignDeleted()
      }
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Campaign
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{campaignName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete the campaign. Make sure all creators have been
              removed from this campaign before deleting.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
