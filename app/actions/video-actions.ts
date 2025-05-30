"use server"

import { getSupabaseAdmin } from "../lib/supabase"

export async function addVideo(data: {
  creatorId: string
  videoUrl: string
  title: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    const { data: insertedData, error } = await supabase
      .from("videos")
      .insert([
        {
          creator_id: data.creatorId,
          video_url: data.videoUrl,
          title: data.title || `Video by creator`,
          views: 0,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting video:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: insertedData }
  } catch (error) {
    console.error("Error in addVideo action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
