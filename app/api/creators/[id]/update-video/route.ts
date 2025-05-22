import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { videoUrl } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("creators")
      .update({ video_url: videoUrl })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error updating creator video:", error)
    return Response.json({ error: "Failed to update creator video" }, { status: 500 })
  }
}
