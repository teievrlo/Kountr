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
import { deleteCreator } from "@/app/actions/creator-actions"
import { AlertTriangle } from "lucide-react"

interface DeleteCreatorDialogProps {
  children: React.ReactNode
  creatorId: string
  creatorHandle: string
  onCreatorDeleted?: () => void
}

export function DeleteCreatorDialog({
  children,
  creatorId,
  creatorHandle,
  onCreatorDeleted,
}: DeleteCreatorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteCreator(creatorId)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Creator deleted",
        description: `${creatorHandle} has been deleted successfully.`,
      })

      setOpen(false)

      // Callback to refresh creators list
      if (onCreatorDeleted) {
        onCreatorDeleted()
      }
    } catch (error) {
      console.error("Error deleting creator:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete creator. Please try again.",
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
            Delete Creator
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{creatorHandle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete the creator and all associated videos.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Creator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
