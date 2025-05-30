"use client"

import { useEffect, useState } from "react"
import { useFirebaseAuth } from "@/lib/firebase-auth-provider"
import { apiClient } from "@/lib/auth-helpers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ExternalLink } from "lucide-react"
// You might have an AddCampaignDialog component
// import { AddCampaignDialog } from "./components/add-campaign-dialog"

// Define a type for your Campaign
interface Campaign {
  id: string
  name: string
  description?: string
  status: string
  owner_uid: string
  created_at: string
  updated_at: string
  // Add counts if your API provides them (e.g., from the JOIN in pages/api/my-campaigns.ts)
  creators?: { count: number }[]
  videos?: { count: number }[]
}

export default function CampaignsPage() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchCampaigns = async () => {
        setDataLoading(true)
        setError(null)
        try {
          const data = await apiClient.getMyCampaigns()
          setCampaigns(data)
        } catch (err) {
          console.error("Failed to fetch campaigns:", err)
          setError("Failed to load campaigns. Please try again.")
        } finally {
          setDataLoading(false)
        }
      }
      fetchCampaigns()
    } else if (!authLoading) {
      setDataLoading(false)
    }
  }, [user, authLoading])

  if (authLoading) {
    return <div className="p-6 text-center">Loading authentication...</div>
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Please log in to manage your campaigns.</p>
        <Link href="/">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  if (dataLoading) {
    return <div className="p-6 text-center">Loading campaigns...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Campaigns</h1>
          <p className="text-slate-600">Manage and track all your UGC campaigns.</p>
        </div>
        {/* Replace with your AddCampaignDialog trigger or a link to an add page */}
        <Button onClick={() => alert("Open Add Campaign Dialog/Page here")} className="bg-blue-500 hover:bg-blue-600">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Campaign
        </Button>
        {/* <AddCampaignDialog open={showAddDialog} onOpenChange={setShowAddDialog} onCampaignAdded={fetchCampaigns} /> */}
      </div>

      {campaigns.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto bg-slate-100 rounded-full p-3 w-fit mb-4">
              <img src="/placeholder-45ll1.png" alt="No Campaigns" className="opacity-70" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-700">No Campaigns Yet</CardTitle>
            <CardDescription className="text-slate-500">
              Start by adding your first UGC campaign to track its performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => alert("Open Add Campaign Dialog/Page here")}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-slate-800">{campaign.name}</CardTitle>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-700"
                        : campaign.status === "paused"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                {campaign.description && (
                  <CardDescription className="text-sm text-slate-500 pt-1 leading-relaxed">
                    {campaign.description.substring(0, 100)}
                    {campaign.description.length > 100 ? "..." : ""}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="text-sm text-slate-600">
                  <strong>Creators:</strong> {campaign.creators?.[0]?.count || 0}
                </div>
                <div className="text-sm text-slate-600">
                  <strong>Videos:</strong> {campaign.videos?.[0]?.count || 0}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href={`/dashboard/campaigns/${campaign.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
