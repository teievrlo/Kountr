"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/app/lib/supabase"
import { addCreator } from "@/app/actions/creator-actions"
import { UserPlus, Loader2 } from "lucide-react"

interface Campaign {
  id: string
  name: string
}

interface AddCreatorFormProps {
  onCreatorAdded?: () => void
}

export function AddCreatorForm({ onCreatorAdded }: AddCreatorFormProps) {
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

    fetchCampaigns()
  }, [supabase, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      const result = await addCreator({
        handle: handle.trim(),
        leagueId: campaignId,
        videoUrl: videoUrl.trim() || undefined,
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Creator added successfully!",
        description: `${handle} has been added to the campaign.`,
      })

      // Reset form
      setHandle("")
      setVideoUrl("")
      setCampaignId("")

      // Callback to refresh creators list
      if (onCreatorAdded) {
        onCreatorAdded()
      }
    } catch (error) {
      console.error("Error adding creator:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add creator. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Creator
          </CardTitle>
          <CardDescription>Add a new content creator to track their TikTok performance and videos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="handle">TikTok Handle *</Label>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@username"
                  required
                />
                <p className="text-sm text-muted-foreground">Enter the creator's TikTok handle (with or without @)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign *</Label>
                {isLoadingCampaigns ? (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Loading campaigns..." />
                    </SelectTrigger>
                  </Select>
                ) : campaigns.length === 0 ? (
                  <div className="p-3 border rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground">
                      No campaigns available. Please create a campaign first.
                    </p>
                  </div>
                ) : (
                  <Select value={campaignId} onValueChange={setCampaignId} required>
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
                <p className="text-sm text-muted-foreground">Choose which campaign this creator belongs to</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Initial Video URL (Optional)</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                />
                <p className="text-sm text-muted-foreground">
                  Add a specific video URL to start tracking (you can add more videos later)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingCampaigns || campaigns.length === 0}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Creator...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Creator
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
