"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { getSupabaseClient } from "@/app/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Campaign {
  id: string
  name: string
}

interface AddCreatorDialogProps {
  children: React.ReactNode
}

export function AddCreatorDialog({ children }: AddCreatorDialogProps) {
  const [open, setOpen] = useState(false)
  const [handle, setHandle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [campaignId, setCampaignId] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchCampaigns() {
      setIsLoadingCampaigns(true)

      const { data, error } = await supabase.from("leagues").select("id, name").order("name")

      if (error) {
        console.error("Error fetching campaigns:", error)
        toast({
          title: "Error",
          description: "Failed to load campaigns. Please try again.",
          variant: "destructive",
        })
      } else {
        setCampaigns(data || [])
      }

      setIsLoadingCampaigns(false)
    }

    if (open) {
      fetchCampaigns()
    }
  }, [open, supabase, toast])

  const handleSubmit = async () => {
    if (!handle.trim()) {
      toast({
        title: "Error",
        description: "Creator handle is required",
        variant: "destructive",
      })
      return
    }

    if (!campaignId) {
      toast({
        title: "Error",
        description: "Please select a campaign",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format handle to ensure it starts with @
      const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`

      const { data, error } = await supabase
        .from("creators")
        .insert([
          {
            handle: formattedHandle,
            league_id: campaignId,
            video_url: videoUrl || null,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Creator added",
        description: "The creator has been added successfully.",
      })

      // Reset form and close dialog
      setHandle("")
      setVideoUrl("")
      setCampaignId("")
      setOpen(false)
    } catch (error) {
      console.error("Error adding creator:", error)
      toast({
        title: "Error",
        description: "Failed to add creator. Please try again.",
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
          <DialogTitle>Add Creator</DialogTitle>
          <DialogDescription>Add a new creator to track their TikTok content.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="handle" className="text-right">
              TikTok Handle
            </Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="col-span-3"
              placeholder="@username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoUrl" className="text-right">
              Video URL
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
            <Label htmlFor="campaign" className="text-right">
              Campaign
            </Label>
            <div className="col-span-3">
              {isLoadingCampaigns ? (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Loading campaigns..." />
                  </SelectTrigger>
                </Select>
              ) : campaigns.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No campaigns available. Please create a campaign first.
                </div>
              ) : (
                <Select value={campaignId} onValueChange={setCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingCampaigns || campaigns.length === 0}>
            {isSubmitting ? "Adding..." : "Add Creator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
