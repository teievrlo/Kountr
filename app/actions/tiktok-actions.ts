"use server"

import { revalidatePath } from "next/cache"
import { fetchTikTokVideoData, batchFetchTikTokVideos, updateTikTokVideoStats } from "../lib/tiktok-service"
import { validateTikTokUrl } from "../lib/url-validator"

// Fetch data for a single TikTok video
export async function fetchVideoData(url: string) {
  try {
    if (!validateTikTokUrl(url)) {
      return { success: false, error: "Invalid TikTok URL" }
    }

    const data = await fetchTikTokVideoData(url)

    return { success: true, data }
  } catch (error) {
    console.error("Error in fetchVideoData action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch video data",
    }
  }
}

// Fetch data for multiple TikTok videos
export async function fetchMultipleVideos(urls: string[]) {
  try {
    // Filter out invalid URLs
    const validUrls = urls.filter((url) => validateTikTokUrl(url))

    if (validUrls.length === 0) {
      return { success: false, error: "No valid TikTok URLs provided" }
    }

    const data = await batchFetchTikTokVideos(validUrls)

    return { success: true, data }
  } catch (error) {
    console.error("Error in fetchMultipleVideos action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch videos data",
    }
  }
}

// Refresh stats for a video
export async function refreshVideoStats(videoId: string, path?: string) {
  try {
    const data = await updateTikTokVideoStats(videoId)

    // Revalidate the path if provided
    if (path) {
      revalidatePath(path)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in refreshVideoStats action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to refresh video stats",
    }
  }
}

// Add videos to a creator with real data
export async function addVideosWithData(creatorId: string, urls: string[]) {
  try {
    // Filter out invalid URLs
    const validUrls = urls.filter((url) => validateTikTokUrl(url))

    if (validUrls.length === 0) {
      return { success: false, error: "No valid TikTok URLs provided" }
    }

    // Fetch data for all videos
    const videoData = await batchFetchTikTokVideos(validUrls)

    // In a real implementation, you would save this data to your database
    // For now, we'll just return the fetched data

    return {
      success: true,
      data: {
        creatorId,
        videos: videoData,
      },
    }
  } catch (error) {
    console.error("Error in addVideosWithData action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add videos",
    }
  }
}
