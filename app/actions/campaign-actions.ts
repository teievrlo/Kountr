"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "../lib/supabase"

// Add a new campaign
export async function addCampaign(data: {
  name: string
  description?: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    const { data: insertedData, error } = await supabase
      .from("leagues")
      .insert([
        {
          name: data.name,
          description: data.description || null,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting campaign:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the campaigns page
    revalidatePath("/dashboard/campaigns")

    return { success: true, data: insertedData }
  } catch (error) {
    console.error("Error in addCampaign action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Delete a campaign
export async function deleteCampaign(campaignId: string) {
  try {
    const supabase = getSupabaseAdmin()

    // First, check if there are any creators associated with this campaign
    const { data: creators, error: creatorsError } = await supabase
      .from("creators")
      .select("id")
      .eq("league_id", campaignId)

    if (creatorsError) {
      console.error("Error checking creators:", creatorsError)
      return { success: false, error: creatorsError.message }
    }

    if (creators && creators.length > 0) {
      return {
        success: false,
        error: "Cannot delete campaign with associated creators. Please remove all creators first.",
      }
    }

    // Delete the campaign
    const { error } = await supabase.from("leagues").delete().eq("id", campaignId)

    if (error) {
      console.error("Error deleting campaign:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the campaigns page
    revalidatePath("/dashboard/campaigns")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCampaign action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Get campaign details
export async function getCampaignDetails(campaignId: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("leagues").select("*").eq("id", campaignId).single()

    if (error) {
      console.error("Error fetching campaign details:", error)
      return { success: false, error: error.message }
    }

    // Get creator count for this campaign
    const { count: creatorCount, error: creatorError } = await supabase
      .from("creators")
      .select("*", { count: "exact", head: true })
      .eq("league_id", campaignId)

    if (creatorError) {
      console.error("Error fetching creator count:", creatorError)
      return { success: false, error: creatorError.message }
    }

    // Get total views for this campaign
    const { data: creators, error: viewsError } = await supabase
      .from("creators")
      .select("views")
      .eq("league_id", campaignId)

    if (viewsError) {
      console.error("Error fetching campaign views:", viewsError)
      return { success: false, error: viewsError.message }
    }

    const totalViews = creators.reduce((sum, creator) => sum + (creator.views || 0), 0)

    return {
      success: true,
      data: {
        ...data,
        creator_count: creatorCount || 0,
        total_views: totalViews,
      },
    }
  } catch (error) {
    console.error("Error in getCampaignDetails action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
