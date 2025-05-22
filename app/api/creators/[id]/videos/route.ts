import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("creator_id", params.id)
      .order("views", { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error fetching creator videos:", error)
    return Response.json({ error: "Failed to fetch creator videos" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { urls } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    if (!Array.isArray(urls) || urls.length === 0) {
      return Response.json({ error: "No URLs provided" }, { status: 400 })
    }

    // Get creator info for title generation
    const { data: creator } = await supabase.from("creators").select("handle").eq("id", params.id).single()

    const videosToInsert = urls.map((url, index) => ({
      creator_id: params.id,
      url,
      title: `${creator?.handle || "Creator"} Video ${index + 1}`,
      views: 0,
    }))

    const { data, error } = await supabase.from("videos").insert(videosToInsert).select()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    // Update the creator's total views
    await updateCreatorTotalViews(supabase, params.id)

    return Response.json(data)
  } catch (error) {
    console.error("Error adding creator videos:", error)
    return Response.json({ error: "Failed to add creator videos" }, { status: 500 })
  }
}

// Helper function to update a creator's total views based on their videos
async function updateCreatorTotalViews(supabase: any, creatorId: string) {
  try {
    // Get sum of views from all videos
    const { data: viewsData } = await supabase.from("videos").select("views").eq("creator_id", creatorId)

    const totalViews = viewsData?.reduce((sum: number, video: any) => sum + (video.views || 0), 0) || 0

    // Update creator with total views
    await supabase.from("creators").update({ views: totalViews }).eq("id", creatorId)
  } catch (error) {
    console.error("Error updating creator total views:", error)
  }
}
