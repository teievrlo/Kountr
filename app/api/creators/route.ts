import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { leagueId, handle, videoUrl } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Use a placeholder if no videoUrl is provided
    const finalVideoUrl = videoUrl || `https://www.tiktok.com/${handle}/video/placeholder`

    const { data, error } = await supabase
      .from("creators")
      .insert({ league_id: leagueId, handle, video_url: finalVideoUrl })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error adding creator:", error)
    return Response.json({ error: "Failed to add creator" }, { status: 500 })
  }
}
