"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "../lib/supabase"

// Add a new creator
export async function addCreator(data: {
  handle: string
  leagueId: string
  videoUrl?: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    // Format handle to ensure it starts with @
    const formattedHandle = data.handle.startsWith("@") ? data.handle : `@${data.handle}`

    const { data: insertedData, error } = await supabase
      .from("creators")
      .insert([
        {
          handle: formattedHandle,
          league_id: data.leagueId,
          video_url: data.videoUrl || null,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting creator:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the creators page
    revalidatePath("/dashboard/creators")

    return { success: true, data: insertedData }
  } catch (error) {
    console.error("Error in addCreator action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Delete a creator
export async function deleteCreator(creatorId: string) {
  try {
    const supabase = getSupabaseAdmin()

    // First, delete all videos associated with this creator
    const { error: videosError } = await supabase.from("videos").delete().eq("creator_id", creatorId)

    if (videosError) {
      console.error("Error deleting creator videos:", videosError)
      return { success: false, error: videosError.message }
    }

    // Then delete the creator
    const { error } = await supabase.from("creators").delete().eq("id", creatorId)

    if (error) {
      console.error("Error deleting creator:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the creators page
    revalidatePath("/dashboard/creators")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCreator action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Get creator details
export async function getCreatorDetails(creatorId: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("creators").select("*").eq("id", creatorId).single()

    if (error) {
      console.error("Error fetching creator details:", error)
      return { success: false, error: error.message }
    }

    // Get video count for this creator
    const { count: videoCount, error: videoError } = await supabase
      .from("videos")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", creatorId)

    if (videoError) {
      console.error("Error fetching video count:", videoError)
      return { success: false, error: videoError.message }
    }

    return {
      success: true,
      data: {
        ...data,
        video_count: videoCount || 0,
      },
    }
  } catch (error) {
    console.error("Error in getCreatorDetails action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
