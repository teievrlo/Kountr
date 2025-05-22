import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase
    .from("creators")
    .select("*")
    .eq("league_id", params.id)
    .order("views", { ascending: false })
  return Response.json(data)
}
