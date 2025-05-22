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
import { Trash2, AlertCircle, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppContext } from "@/app/context/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { validateTikTokUrl } from "@/app/lib/url-validator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AddVideosDialog({
  children,
  creator,
  onComplete,
}: {
  children: React.ReactNode
  creator: any
  onComplete?: () => void
}) {
  const { addVideos, refreshCreatorData } = useAppContext()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [videoUrls, setVideoUrls] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [urlValidation, setUrlValidation] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const handleAddVideoField = () => {
    setVideoUrls([...videoUrls, ""])
  }

  const handleVideoUrlChange = (index: number, value: string) => {
    const updatedUrls = [...videoUrls]
    updatedUrls[index] = value
    setVideoUrls(updatedUrls)

    // Validate URL as user types
    if (value.trim() !== "") {
      const isValid = validateTikTokUrl(value)
      setUrlValidation((prev) => ({ ...prev, [index]: isValid }))
    } else {
      setUrlValidation((prev) => {
        const newValidation = { ...prev }
        delete newValidation[index]
        return newValidation
      })
    }
  }

  const handleRemoveVideoField = (index: number) => {
    if (videoUrls.length === 1) {
      setVideoUrls([""])
      return
    }

    const updatedUrls = videoUrls.filter((_, i) => i !== index)
    setVideoUrls(updatedUrls)

    // Update validation state
    setUrlValidation((prev) => {
      const newValidation = { ...prev }
      delete newValidation[index]

      // Reindex the remaining validations
      const reindexed: Record<number, boolean> = {}
      Object.keys(newValidation).forEach((key) => {
        const keyNum = Number.parseInt(key)
        if (keyNum > index) {
          reindexed[keyNum - 1] = newValidation[keyNum]
        } else {
          reindexed[keyNum] = newValidation[keyNum]
        }
      })

      return reindexed
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Filter out empty URLs
      const validUrls = videoUrls.filter((url) => url.trim() !== "")

      if (validUrls.length === 0) {
        setError("Please enter at least one valid TikTok URL")
        setIsSubmitting(false)
        return
      }

      // Check if all URLs are valid
      const allValid = validUrls.every((url) => validateTikTokUrl(url))

      if (!allValid) {
        setError("One or more URLs are not valid TikTok video URLs")
        setIsSubmitting(false)
        return
      }

      // Save videos to the database
      const response = await fetch(`/api/creators/${creator.id}/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: validUrls,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add videos")
      }

      const savedVideos = await response.json()

      // Add videos to the app context
      addVideos(creator.id, validUrls, savedVideos)

      // Refresh creator data to get updated view counts
      await refreshCreatorData(creator.id)

      toast({
        title: "Videos Added",
        description: `${validUrls.length} videos have been added to ${creator.handle}`,
      })

      handleClose()
    } catch (err) {
      console.error("Error adding videos:", err)
      setError(err instanceof Error ? err.message : "An error occurred while adding videos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setVideoUrls([""])
    setUrlValidation({})
    setError(null)
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add TikTok Videos for {creator.handle}</DialogTitle>
          <DialogDescription>
            Enter the TikTok video URLs you want to track. You can add multiple videos.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="grid gap-4 py-4">
            {videoUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="https://www.tiktok.com/@creator/video/1234567890"
                    value={url}
                    onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                    className={`flex-1 ${
                      url.trim() !== "" && urlValidation[index] === false ? "border-red-500 pr-8" : ""
                    }`}
                  />
                  {url.trim() !== "" && urlValidation[index] === false && (
                    <AlertCircle className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveVideoField(index)} title="Remove video">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddVideoField} type="button" className="mt-2">
              Add Another Video
            </Button>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              videoUrls.every((url) => url.trim() === "") ||
              Object.values(urlValidation).some((isValid) => isValid === false)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Videos...
              </>
            ) : (
              "Save Videos"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
