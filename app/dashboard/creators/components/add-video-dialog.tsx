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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { addVideo } from "@/app/actions/video-actions"

interface AddVideoDialogProps {
  children: React.ReactNode
  creatorId: string
  creatorHandle: string
  onComplete?: () => void
}

export function AddVideoDialog({ children, creatorId, creatorHandle, onComplete }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const extractVideoId = (url: string): string | null => {
    const regex = /\/video\/(\d+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Video URL is required",
        variant: "destructive",
      })
      return
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      toast({
        title: "Error",
        description: "Invalid TikTok video URL. URL should contain /video/[id]",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Use the server action to add the video
      const result = await addVideo({
        creatorId,
        videoUrl,
        title: title || `Video by ${creatorHandle}`,
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Video added",
        description: "The video has been added successfully.",
      })

      // Reset form and close dialog
      setVideoUrl("")
      setTitle("")
      setOpen(false)

      // Callback to refresh creator data
      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error("Error adding video:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Video for {creatorHandle}</DialogTitle>
          <DialogDescription>Add a TikTok video to track its performance.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoUrl" className="text-right">
              TikTok URL
            </Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://www.tiktok.com/@username/video/1234567890"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title (Optional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Summer Collection Showcase"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Video"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
