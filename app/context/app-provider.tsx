"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseClient } from "@/app/lib/supabase"

// Add these types for Supabase data
type CreatorFromDB = {
  id: string
  league_id: string
  handle: string
  video_url: string
  views: number
  last_checked: string
  created_at: string
}

type VideoFromDB = {
  id: string
  creator_id: string
  url: string
  views: number
  title: string
  last_checked: string
  created_at: string
}

type LeagueFromDB = {
  id: string
  name: string
  description: string
  created_at: string
}

// Define types
type Creator = {
  id: string
  handle: string
  name: string
  avatar: string
  initials: string
  totalViews: number
  videoCount: number
  isVerified: boolean
  campaign: string
  videoUrl?: string
}

type Video = {
  id: string
  creatorId: string
  url: string
  views: number
  title: string
  thumbnail: string
  dateAdded: string
}

type Campaign = {
  id: string
  name: string
  status: "active" | "draft" | "completed"
  progress: number
  creators: number
  views: string
  daysLeft: number
  startDate?: string
  endDate?: string
  goal?: string
  description?: string
}

type AppContextType = {
  creators: Creator[]
  videos: Video[]
  campaigns: Campaign[]
  addCreator: (creator: Omit<Creator, "id" | "totalViews" | "videoCount">) => Promise<Creator>
  removeCreator: (creatorId: string) => Promise<void>
  addVideos: (creatorId: string, urls: string[], savedVideos?: any[]) => void
  removeVideo: (videoId: string) => Promise<void>
  addCampaign: (campaign: Omit<Campaign, "id" | "creators" | "progress">) => Campaign
  removeCampaign: (campaignId: string) => Promise<void>
  getCreatorById: (id: string) => Creator | undefined
  getCreatorVideos: (creatorId: string) => Video[]
  getTotalViews: () => number
  getActiveCreators: () => number
  getActiveVideos: () => number
  refreshCreatorData: (creatorId: string) => Promise<void>
  refreshAllData: () => Promise<void>
  updateCampaignStats: (campaignName: string, additionalViews: number) => void
}

// Initial data
const initialCampaigns = [
  {
    id: "1",
    name: "Summer Collection",
    status: "active" as const,
    progress: 75,
    creators: 8,
    views: "1.2M",
    daysLeft: 12,
    startDate: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    goal: "2,000,000",
  },
  {
    id: "2",
    name: "Product Launch",
    status: "active" as const,
    progress: 45,
    creators: 5,
    views: "450K",
    daysLeft: 18,
    startDate: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 18)).toISOString(),
    goal: "1,000,000",
  },
  {
    id: "3",
    name: "Holiday Special",
    status: "draft" as const,
    progress: 0,
    creators: 0,
    views: "0",
    daysLeft: 30,
    startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    goal: "3,000,000",
  },
]

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [creators, setCreators] = useState<Creator[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data on client-side only
  useEffect(() => {
    if (!isInitialized) {
      fetchAllData()
    }
  }, [isInitialized])

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      const supabase = getSupabaseClient()

      // Fetch leagues (campaigns)
      const { data: leaguesData, error: leaguesError } = await supabase.from("leagues").select("*")

      // Initialize campaigns variable
      let fetchedCampaigns = initialCampaigns

      if (leaguesError) {
        console.error("Error fetching leagues:", leaguesError)
        // Fall back to initial data if there's an error
        setCampaigns(initialCampaigns)
      } else {
        // Transform leagues data to campaigns format
        fetchedCampaigns = leaguesData.map((league: LeagueFromDB) => ({
          id: league.id,
          name: league.name,
          status: "active" as const,
          progress: Math.floor(Math.random() * 100),
          creators: 0, // Will be updated later
          views: "0",
          daysLeft: 30,
          description: league.description || "",
        }))
        setCampaigns(fetchedCampaigns)
      }

      // Fetch creators
      const { data: creatorsData, error: creatorsError } = await supabase.from("creators").select("*")

      if (creatorsError) {
        console.error("Error fetching creators:", creatorsError)
        setCreators([])
      } else {
        // Transform creators data
        const fetchedCreators = creatorsData.map((creator: CreatorFromDB) => {
          // Find the campaign name for this league_id
          const campaign =
            leaguesData && Array.isArray(leaguesData)
              ? leaguesData.find((league: LeagueFromDB) => league.id === creator.league_id)?.name || "Unknown Campaign"
              : "Unknown Campaign"

          return {
            id: creator.id,
            handle: creator.handle,
            name: creator.handle.replace("@", ""),
            avatar: "/placeholder.svg?height=40&width=40",
            initials: creator.handle.substring(1, 3).toUpperCase(),
            totalViews: creator.views || 0,
            videoCount: 0, // Will be updated after fetching videos
            isVerified: false,
            campaign,
            videoUrl: creator.video_url,
          }
        })

        setCreators(fetchedCreators)

        // Fetch videos
        const { data: videosData, error: videosError } = await supabase.from("videos").select("*")

        if (videosError) {
          console.error("Error fetching videos:", videosError)
          setVideos([])
        } else {
          // Transform videos data
          const fetchedVideos = videosData.map((video: VideoFromDB) => ({
            id: video.id,
            creatorId: video.creator_id,
            url: video.url,
            views: video.views || 0,
            title: video.title || `Video`,
            thumbnail: "/placeholder.svg?height=120&width=120",
            dateAdded: video.created_at,
          }))

          setVideos(fetchedVideos)

          // Update creator video counts
          const updatedCreators = fetchedCreators.map((creator) => {
            const creatorVideos = fetchedVideos.filter((video) => video.creatorId === creator.id)
            return {
              ...creator,
              videoCount: creatorVideos.length,
            }
          })

          setCreators(updatedCreators)
        }

        // Update campaign creator counts and views
        updateAllCampaignStats(fetchedCreators, fetchedCampaigns)
      }

      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing data:", error)
      setIsInitialized(true)
    }
  }

  // Helper function to update all campaign stats
  const updateAllCampaignStats = (currentCreators: Creator[], currentCampaigns: Campaign[]) => {
    const campaignStats: Record<string, { creators: number; views: number }> = {}

    // Calculate stats for each campaign
    currentCreators.forEach((creator: Creator) => {
      if (!campaignStats[creator.campaign]) {
        campaignStats[creator.campaign] = { creators: 0, views: 0 }
      }
      campaignStats[creator.campaign].creators += 1
      campaignStats[creator.campaign].views += creator.totalViews
    })

    // Update campaign objects with calculated stats
    const updatedCampaigns = currentCampaigns.map((campaign) => {
      const stats = campaignStats[campaign.name] || { creators: 0, views: 0 }

      let viewsFormatted = stats.views.toString()
      if (stats.views >= 1000000) {
        viewsFormatted = (stats.views / 1000000).toFixed(1) + "M"
      } else if (stats.views >= 1000) {
        viewsFormatted = (stats.views / 1000).toFixed(1) + "K"
      }

      return {
        ...campaign,
        creators: stats.creators,
        views: viewsFormatted,
      }
    })

    setCampaigns(updatedCampaigns)
  }

  // Refresh all data
  const refreshAllData = async () => {
    await fetchAllData()
  }

  // Refresh creator data
  const refreshCreatorData = async (creatorId: string) => {
    try {
      const supabase = getSupabaseClient()

      // Fetch creator
      const { data: creator, error: creatorError } = await supabase
        .from("creators")
        .select("*")
        .eq("id", creatorId)
        .single()

      if (creatorError) {
        console.error("Error fetching creator:", creatorError)
        return
      }

      // Fetch creator videos
      const { data: creatorVideos, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .eq("creator_id", creatorId)

      if (videosError) {
        console.error("Error fetching creator videos:", videosError)
        return
      }

      // Update videos state
      const updatedVideos = [...videos]

      // Remove existing videos for this creator
      const filteredVideos = updatedVideos.filter((video) => video.creatorId !== creatorId)

      // Add fetched videos
      const newVideos = creatorVideos.map((video: VideoFromDB) => ({
        id: video.id,
        creatorId: video.creator_id,
        url: video.url,
        views: video.views || 0,
        title: video.title || `Video`,
        thumbnail: "/placeholder.svg?height=120&width=120",
        dateAdded: video.created_at,
      }))

      setVideos([...filteredVideos, ...newVideos])

      // Update creator
      const updatedCreators = creators.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              totalViews: creator.views || 0,
              videoCount: creatorVideos.length,
            }
          : c,
      )

      setCreators(updatedCreators)

      // Update campaign stats
      updateAllCampaignStats(updatedCreators, campaigns)
    } catch (error) {
      console.error("Error refreshing creator data:", error)
    }
  }

  const validateTikTokUrl = (url: string) => {
    try {
      new URL(url)
      return url.includes("tiktok.com")
    } catch (e) {
      return false
    }
  }

  // Add a new creator
  const addCreator = async (creatorData: Omit<Creator, "id" | "totalViews" | "videoCount">) => {
    try {
      // Find the league_id for the campaign
      const campaign = campaigns.find((c) => c.name === creatorData.campaign)
      if (!campaign) {
        throw new Error(`Campaign ${creatorData.campaign} not found`)
      }

      // Call our API to add the creator
      const response = await fetch("/api/creators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leagueId: campaign.id,
          handle: creatorData.handle,
          videoUrl: `https://www.tiktok.com/${creatorData.handle}/video/placeholder`, // Default placeholder
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add creator")
      }

      const newCreatorFromDB = await response.json()

      // Create a creator object in our app format
      const newCreator: Creator = {
        ...creatorData,
        id: newCreatorFromDB.id,
        totalViews: 0,
        videoCount: 0,
      }

      // Update creators state
      const updatedCreators = [...creators, newCreator]
      setCreators(updatedCreators)

      // Update campaign stats
      updateAllCampaignStats(updatedCreators, campaigns)

      return newCreator
    } catch (error) {
      console.error("Error adding creator:", error)
      throw error
    }
  }

  // Remove a creator
  const removeCreator = async (creatorId: string) => {
    try {
      const supabase = getSupabaseClient()

      // Delete creator from database
      const { error } = await supabase.from("creators").delete().eq("id", creatorId)

      if (error) {
        console.error("Error deleting creator:", error)
        throw error
      }

      // Remove creator's videos
      const creatorVideos = videos.filter((video) => video.creatorId === creatorId)
      for (const video of creatorVideos) {
        await removeVideo(video.id)
      }

      // Update creators state
      const updatedCreators = creators.filter((creator) => creator.id !== creatorId)
      setCreators(updatedCreators)

      // Update campaign stats
      updateAllCampaignStats(updatedCreators, campaigns)
    } catch (error) {
      console.error("Error removing creator:", error)
      throw error
    }
  }

  // Add videos to a creator
  const addVideos = (creatorId: string, urls: string[], savedVideos?: any[]) => {
    // If we have saved videos from the database, use those
    if (savedVideos && savedVideos.length > 0) {
      const newVideos = savedVideos.map((video) => ({
        id: video.id,
        creatorId: video.creator_id,
        url: video.url,
        views: video.views || 0,
        title: video.title || `Video`,
        thumbnail: "/placeholder.svg?height=120&width=120",
        dateAdded: video.created_at,
      }))

      // Update videos state
      const updatedVideos = [...videos, ...newVideos]
      setVideos(updatedVideos)

      // Calculate total new views
      const totalNewViews = newVideos.reduce((sum, video) => sum + video.views, 0)

      // Update creator's video count and total views
      const updatedCreators = creators.map((creator) => {
        if (creator.id === creatorId) {
          return {
            ...creator,
            videoCount: creator.videoCount + newVideos.length,
            totalViews: creator.totalViews + totalNewViews,
          }
        }
        return creator
      })

      setCreators(updatedCreators)

      // Update campaign stats
      updateAllCampaignStats(updatedCreators, campaigns)

      return
    }

    // Otherwise, create new videos (this is a fallback and shouldn't be used with the new DB structure)
    const newVideos: Video[] = urls.map((url, index) => ({
      id: `video-${Date.now()}-${index}`,
      creatorId,
      url,
      views: Math.floor(Math.random() * 5000) + 1000, // Random views for demo
      title: `New Video ${index + 1}`,
      thumbnail: "/placeholder.svg?height=120&width=120",
      dateAdded: new Date().toISOString(),
    }))

    // Update videos state
    const updatedVideos = [...videos, ...newVideos]
    setVideos(updatedVideos)

    // Calculate total new views
    const totalNewViews = newVideos.reduce((sum, video) => sum + video.views, 0)

    // Update creator's video count and total views
    const updatedCreators = creators.map((creator) => {
      if (creator.id === creatorId) {
        return {
          ...creator,
          videoCount: creator.videoCount + newVideos.length,
          totalViews: creator.totalViews + totalNewViews,
        }
      }
      return creator
    })

    setCreators(updatedCreators)

    // Update campaign stats
    updateAllCampaignStats(updatedCreators, campaigns)
  }

  // Remove a video
  const removeVideo = async (videoId: string) => {
    try {
      const supabase = getSupabaseClient()

      // Find the video to get its views and creator ID
      const videoToRemove = videos.find((video) => video.id === videoId)
      if (!videoToRemove) {
        throw new Error(`Video ${videoId} not found`)
      }

      // Delete video from database
      const { error } = await supabase.from("videos").delete().eq("id", videoId)

      if (error) {
        console.error("Error deleting video:", error)
        throw error
      }

      // Update videos state
      const updatedVideos = videos.filter((video) => video.id !== videoId)
      setVideos(updatedVideos)

      // Update creator's video count and total views
      const updatedCreators = creators.map((creator) => {
        if (creator.id === videoToRemove.creatorId) {
          return {
            ...creator,
            videoCount: creator.videoCount - 1,
            totalViews: creator.totalViews - videoToRemove.views,
          }
        }
        return creator
      })

      setCreators(updatedCreators)

      // Update campaign stats
      updateAllCampaignStats(updatedCreators, campaigns)
    } catch (error) {
      console.error("Error removing video:", error)
      throw error
    }
  }

  // Helper function to update campaign stats
  const updateCampaignStats = (campaignName: string, additionalViews: number) => {
    // Find all creators in this campaign
    const campaignCreators = creators.filter((creator) => creator.campaign === campaignName)

    // Calculate total views for the campaign
    const totalCampaignViews = campaignCreators.reduce((sum, creator) => sum + creator.totalViews, 0) + additionalViews

    // Format views
    let viewsFormatted = totalCampaignViews.toString()
    if (totalCampaignViews >= 1000000) {
      viewsFormatted = (totalCampaignViews / 1000000).toFixed(1) + "M"
    } else if (totalCampaignViews >= 1000) {
      viewsFormatted = (totalCampaignViews / 1000).toFixed(1) + "K"
    }

    // Update campaigns
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.name === campaignName
          ? {
              ...campaign,
              views: viewsFormatted,
              creators: campaignCreators.length,
              progress: Math.min(100, campaign.progress + (additionalViews > 0 ? 5 : 0)), // Increment progress if views are added
            }
          : campaign,
      ),
    )
  }

  // Add a new campaign
  const addCampaign = (campaignData: Omit<Campaign, "id" | "creators" | "progress">) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      creators: 0,
      progress: 0,
    }

    setCampaigns((prev) => [...prev, newCampaign])
    return newCampaign
  }

  // Remove a campaign
  const removeCampaign = async (campaignId: string) => {
    try {
      const supabase = getSupabaseClient()

      // Find the campaign to get its name
      const campaignToRemove = campaigns.find((campaign) => campaign.id === campaignId)
      if (!campaignToRemove) {
        throw new Error(`Campaign ${campaignId} not found`)
      }

      // Delete campaign from database
      const { error } = await supabase.from("leagues").delete().eq("id", campaignId)

      if (error) {
        console.error("Error deleting campaign:", error)
        throw error
      }

      // Find all creators in this campaign
      const campaignCreators = creators.filter((creator) => creator.campaign === campaignToRemove.name)

      // Remove all creators in this campaign
      for (const creator of campaignCreators) {
        await removeCreator(creator.id)
      }

      // Update campaigns state
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
    } catch (error) {
      console.error("Error removing campaign:", error)
      throw error
    }
  }

  // Get a creator by ID
  const getCreatorById = (id: string) => {
    return creators.find((creator) => creator.id === id)
  }

  // Get videos for a specific creator
  const getCreatorVideos = (creatorId: string) => {
    return videos.filter((video) => video.creatorId === creatorId)
  }

  // Get total views across all creators
  const getTotalViews = () => {
    return creators.reduce((sum, creator) => sum + creator.totalViews, 0)
  }

  // Get number of active creators
  const getActiveCreators = () => {
    return creators.length
  }

  // Get number of active videos
  const getActiveVideos = () => {
    return videos.length
  }

  return (
    <AppContext.Provider
      value={{
        creators,
        videos,
        campaigns,
        addCreator,
        removeCreator,
        addVideos,
        removeVideo,
        addCampaign,
        removeCampaign,
        getCreatorById,
        getCreatorVideos,
        getTotalViews,
        getActiveCreators,
        getActiveVideos,
        refreshCreatorData,
        refreshAllData,
        updateCampaignStats,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
