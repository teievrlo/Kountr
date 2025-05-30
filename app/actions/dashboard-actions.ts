"use server"

import { getSupabaseAdmin } from "../lib/supabase"
import { format, startOfDay, subDays, subMonths, subWeeks } from "date-fns"

// Fetch overview statistics for the dashboard
export async function fetchDashboardStats() {
  try {
    const supabase = getSupabaseAdmin()

    // Get total views from videos table
    const { data: videosData, error: videosError } = await supabase.from("videos").select("views")

    if (videosError) {
      console.error("Error fetching total views:", videosError)
      return { success: false, error: videosError.message }
    }

    const totalViews = videosData.reduce((sum, video) => sum + (video.views || 0), 0)

    // Get active creators count
    const { count: creatorsCount, error: creatorsError } = await supabase
      .from("creators")
      .select("*", { count: "exact", head: true })

    if (creatorsError) {
      console.error("Error fetching creators count:", creatorsError)
      return { success: false, error: creatorsError.message }
    }

    // Get active campaigns count
    const { count: campaignsCount, error: campaignsError } = await supabase
      .from("leagues")
      .select("*", { count: "exact", head: true })

    if (campaignsError) {
      console.error("Error fetching campaigns count:", campaignsError)
      return { success: false, error: campaignsError.message }
    }

    // Get videos count
    const { count: videosCount, error: videosCountError } = await supabase
      .from("videos")
      .select("*", { count: "exact", head: true })

    if (videosCountError) {
      console.error("Error fetching videos count:", videosCountError)
      return { success: false, error: videosCountError.message }
    }

    return {
      success: true,
      data: {
        totalViews,
        creatorsCount: creatorsCount || 0,
        campaignsCount: campaignsCount || 0,
        videosCount: videosCount || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
    }
  }
}

// Fetch performance data for charts
export async function fetchPerformanceData() {
  try {
    const supabase = getSupabaseAdmin()

    // For daily data - last 7 days
    const dailyData = await fetchDailyViewData(supabase)

    // For weekly data - last 4 weeks
    const weeklyData = await fetchWeeklyViewData(supabase)

    // For monthly data - last 6 months
    const monthlyData = await fetchMonthlyViewData(supabase)

    return {
      success: true,
      data: {
        dailyData,
        weeklyData,
        monthlyData,
      },
    }
  } catch (error) {
    console.error("Error fetching performance data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch performance data",
    }
  }
}

// Helper function to fetch daily view data
async function fetchDailyViewData(supabase: any) {
  // Get data for the last 7 days
  const today = startOfDay(new Date())
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i)
    return {
      date,
      dateStr: format(date, "EEE"), // Mon, Tue, etc.
      views: 0,
    }
  })

  // Get all scrape logs from the last 7 days
  const sevenDaysAgo = subDays(today, 6)
  const { data: scrapeLogs, error } = await supabase
    .from("scrape_logs")
    .select("*")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching scrape logs:", error)
    // Return empty data with dates
    return days.map((day) => ({
      date: day.dateStr,
      views: 0,
    }))
  }

  // Calculate daily view increases
  scrapeLogs.forEach((log) => {
    const logDate = startOfDay(new Date(log.created_at))
    const dayIndex = days.findIndex(
      (day) =>
        day.date.getFullYear() === logDate.getFullYear() &&
        day.date.getMonth() === logDate.getMonth() &&
        day.date.getDate() === logDate.getDate(),
    )

    if (dayIndex !== -1) {
      // Add the view difference to that day
      const viewDiff = log.new_views - log.previous_views
      if (viewDiff > 0) {
        days[dayIndex].views += viewDiff
      }
    }
  })

  // If no scrape logs, simulate some data for demonstration
  if (scrapeLogs.length === 0) {
    days.forEach((day, index) => {
      // Generate random views between 100-1000
      day.views = Math.floor(Math.random() * 900) + 100
    })
  }

  // Format for chart
  return days.map((day) => ({
    date: day.dateStr,
    views: day.views,
  }))
}

// Helper function to fetch weekly view data
async function fetchWeeklyViewData(supabase: any) {
  const today = new Date()
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = subWeeks(today, 4 - i - 1)
    const weekEnd = i === 3 ? today : subWeeks(today, 4 - i - 2)
    return {
      label: `Week ${i + 1}`,
      start: weekStart,
      end: weekEnd,
      views: 0,
    }
  })

  // Get all scrape logs from the last 4 weeks
  const fourWeeksAgo = subWeeks(today, 4)
  const { data: scrapeLogs, error } = await supabase
    .from("scrape_logs")
    .select("*")
    .gte("created_at", fourWeeksAgo.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching scrape logs:", error)
    // Return empty data with week labels
    return weeks.map((week) => ({
      date: week.label,
      views: 0,
    }))
  }

  // Calculate weekly view increases
  scrapeLogs.forEach((log) => {
    const logDate = new Date(log.created_at)
    const weekIndex = weeks.findIndex((week) => logDate >= week.start && logDate <= week.end)

    if (weekIndex !== -1) {
      // Add the view difference to that week
      const viewDiff = log.new_views - log.previous_views
      if (viewDiff > 0) {
        weeks[weekIndex].views += viewDiff
      }
    }
  })

  // If no scrape logs, simulate some data for demonstration
  if (scrapeLogs.length === 0) {
    weeks.forEach((week, index) => {
      // Generate random views between 1000-5000
      week.views = Math.floor(Math.random() * 4000) + 1000
    })
  }

  // Format for chart
  return weeks.map((week) => ({
    date: week.label,
    views: week.views,
  }))
}

// Helper function to fetch monthly view data
async function fetchMonthlyViewData(supabase: any) {
  const today = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(today, 5 - i)
    return {
      date,
      label: format(date, "MMM"), // Jan, Feb, etc.
      views: 0,
    }
  })

  // Get all scrape logs from the last 6 months
  const sixMonthsAgo = subMonths(today, 6)
  const { data: scrapeLogs, error } = await supabase
    .from("scrape_logs")
    .select("*")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching scrape logs:", error)
    // Return empty data with month labels
    return months.map((month) => ({
      date: month.label,
      views: 0,
    }))
  }

  // Calculate monthly view increases
  scrapeLogs.forEach((log) => {
    const logDate = new Date(log.created_at)
    const monthIndex = months.findIndex(
      (month) => month.date.getMonth() === logDate.getMonth() && month.date.getFullYear() === logDate.getFullYear(),
    )

    if (monthIndex !== -1) {
      // Add the view difference to that month
      const viewDiff = log.new_views - log.previous_views
      if (viewDiff > 0) {
        months[monthIndex].views += viewDiff
      }
    }
  })

  // If no scrape logs, simulate some data for demonstration
  if (scrapeLogs.length === 0) {
    months.forEach((month, index) => {
      // Generate random views between 5000-20000
      month.views = Math.floor(Math.random() * 15000) + 5000
    })
  }

  // Format for chart
  return months.map((month) => ({
    date: month.label,
    views: month.views,
  }))
}

// Fetch top creators
export async function fetchTopCreators(limit = 50) {
  try {
    const supabase = getSupabaseAdmin()

    // Get all creators
    const { data: creatorsData, error: creatorsError } = await supabase.from("creators").select("id, handle, league_id")

    if (creatorsError) {
      console.error("Error fetching creators:", creatorsError)
      return { success: false, error: creatorsError.message }
    }

    if (!creatorsData || creatorsData.length === 0) {
      return {
        success: true,
        data: [],
      }
    }

    // Calculate total views for each creator from their videos
    const creatorsWithViews = await Promise.all(
      creatorsData.map(async (creator) => {
        // Get total views from all videos for this creator
        const { data: videosData, error: videosError } = await supabase
          .from("videos")
          .select("views")
          .eq("creator_id", creator.id)

        if (videosError) {
          console.error(`Error fetching videos for creator ${creator.id}:`, videosError)
        }

        const totalViews = videosData?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

        // Get campaign name
        let campaignName = "No Campaign"
        if (creator.league_id) {
          const { data: campaignData } = await supabase
            .from("leagues")
            .select("name")
            .eq("id", creator.league_id)
            .single()
          campaignName = campaignData?.name || "Unknown Campaign"
        }

        return {
          id: creator.id,
          handle: creator.handle,
          views: totalViews,
          league_id: creator.league_id,
          campaign_name: campaignName,
        }
      }),
    )

    // Sort by views (highest first) and limit
    const sortedCreators = creatorsWithViews.sort((a, b) => b.views - a.views).slice(0, limit)

    return {
      success: true,
      data: sortedCreators,
    }
  } catch (error) {
    console.error("Error fetching top creators:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch top creators",
    }
  }
}
