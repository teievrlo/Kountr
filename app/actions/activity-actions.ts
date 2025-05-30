"use server"

import { getSupabaseAdmin } from "../lib/supabase"

export async function fetchRecentActivity(limit = 4) {
  try {
    const supabase = getSupabaseAdmin()

    // Get recent scrape logs with video and creator information
    const { data: scrapeLogs, error } = await supabase
      .from("scrape_logs")
      .select("*")
      .eq("status", "success")
      .order("created_at", { ascending: false })
      .limit(limit * 2) // Get more to filter for meaningful activities

    if (error) {
      console.error("Error fetching scrape logs:", error)
      return { success: false, error: error.message }
    }

    // Get video and creator details for each log
    const activities = await Promise.all(
      scrapeLogs.slice(0, limit).map(async (log) => {
        // Get video details
        const { data: videoData } = await supabase
          .from("videos")
          .select("title, creator_id")
          .eq("id", log.video_id)
          .single()

        if (!videoData) return null

        // Get creator details
        const { data: creatorData } = await supabase
          .from("creators")
          .select("handle")
          .eq("id", videoData.creator_id)
          .single()

        if (!creatorData) return null

        const viewIncrease = log.new_views - log.previous_views

        // Create activity description based on view increase
        let action = "updated video stats"
        const target = videoData.title

        if (viewIncrease > 1000) {
          action = "gained significant views on"
        } else if (viewIncrease > 100) {
          action = "gained views on"
        }

        return {
          id: log.id,
          user: {
            name: creatorData.handle,
            avatar: "/diverse-avatars.png",
            initials: creatorData.handle.substring(0, 2).toUpperCase(),
          },
          action,
          target,
          time: formatTimeAgo(new Date(log.created_at)),
          viewIncrease,
        }
      }),
    )

    // Filter out null activities and return
    const validActivities = activities.filter((activity) => activity !== null)

    return {
      success: true,
      data: validActivities,
    }
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch recent activity",
    }
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}
