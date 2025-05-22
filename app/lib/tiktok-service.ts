/**
 * TikTok API Service
 *
 * This service handles fetching data from TikTok videos.
 * Note: TikTok doesn't provide an official public API for this purpose.
 * In a production environment, you would need to:
 * 1. Use TikTok's official API if you're a partner
 * 2. Use a third-party API service like Rapid API
 * 3. Implement a scraper with proper rate limiting (with caution regarding ToS)
 */

import { validateTikTokUrl } from "./url-validator"

export interface TikTokVideoData {
  id: string
  url: string
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  author: string
  description: string
  thumbnailUrl: string
  error?: string
}

// Mock data for demonstration purposes
const mockVideoData: Record<string, TikTokVideoData> = {}

// Generate random stats for a video
function generateRandomStats(videoId: string, authorHandle: string): TikTokVideoData {
  const views = Math.floor(Math.random() * 1000000) + 5000
  const likes = Math.floor(views * (Math.random() * 0.2 + 0.05))
  const comments = Math.floor(likes * (Math.random() * 0.2 + 0.05))
  const shares = Math.floor(comments * (Math.random() * 2 + 0.5))

  return {
    id: videoId,
    url: `https://www.tiktok.com/@${authorHandle}/video/${videoId}`,
    views,
    likes,
    comments,
    shares,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    author: authorHandle,
    description: `TikTok video by ${authorHandle}`,
    thumbnailUrl: `/placeholder.svg?height=120&width=120`,
  }
}

// Extract video ID and author handle from TikTok URL
export function extractTikTokInfo(url: string): { videoId: string; authorHandle: string } | null {
  try {
    if (!validateTikTokUrl(url)) {
      return null
    }

    // Extract using regex
    const regex = /https:\/\/(www\.)?tiktok\.com\/@([^/]+)\/video\/(\d+)/
    const match = url.match(regex)

    if (!match) {
      return null
    }

    return {
      authorHandle: match[2],
      videoId: match[3],
    }
  } catch (error) {
    console.error("Error extracting TikTok info:", error)
    return null
  }
}

// Fetch video data from TikTok
export async function fetchTikTokVideoData(url: string): Promise<TikTokVideoData> {
  try {
    // Validate URL
    if (!validateTikTokUrl(url)) {
      throw new Error("Invalid TikTok URL")
    }

    // In a real implementation, you would make an API call here
    // For demo purposes, we'll use mock data

    const info = extractTikTokInfo(url)
    if (!info) {
      throw new Error("Could not extract video information from URL")
    }

    const { videoId, authorHandle } = info

    // Check if we already have mock data for this video
    if (!mockVideoData[videoId]) {
      mockVideoData[videoId] = generateRandomStats(videoId, authorHandle)
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockVideoData[videoId]
  } catch (error) {
    console.error("Error fetching TikTok data:", error)
    return {
      id: "error",
      url,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      author: "unknown",
      description: "Error fetching video data",
      thumbnailUrl: "/placeholder.svg?height=120&width=120",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Update video stats (simulates refreshing data)
export async function updateTikTokVideoStats(videoId: string): Promise<TikTokVideoData> {
  try {
    if (!mockVideoData[videoId]) {
      throw new Error("Video not found")
    }

    // Increase views by a random amount
    const currentData = mockVideoData[videoId]
    const viewIncrease = Math.floor(Math.random() * 1000) + 100

    const updatedData = {
      ...currentData,
      views: currentData.views + viewIncrease,
      likes: currentData.likes + Math.floor(viewIncrease * 0.1),
      comments: currentData.comments + Math.floor(viewIncrease * 0.02),
      shares: currentData.shares + Math.floor(viewIncrease * 0.01),
    }

    mockVideoData[videoId] = updatedData

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return updatedData
  } catch (error) {
    console.error("Error updating TikTok stats:", error)
    throw error
  }
}

// Batch fetch multiple videos
export async function batchFetchTikTokVideos(urls: string[]): Promise<TikTokVideoData[]> {
  try {
    const promises = urls.map((url) => fetchTikTokVideoData(url))
    return await Promise.all(promises)
  } catch (error) {
    console.error("Error batch fetching TikTok videos:", error)
    throw error
  }
}
