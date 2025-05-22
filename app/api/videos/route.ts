import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { creatorId, url, title } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("videos")
      .insert({
        creator_id: creatorId,
        url,
        title: title || `Video for ${creatorId}`,
        views: 0,
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error adding video:", error)
    return Response.json({ error: "Failed to add video" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const creatorId = searchParams.get("creatorId")

    const supabase = createRouteHandlerClient({ cookies })
    let query = supabase.from("videos").select("*")

    if (creatorId) {
      query = query.eq("creator_id", creatorId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
