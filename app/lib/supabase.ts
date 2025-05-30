import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type Creator = {
  id: string
  name: string
  handle: string
  avatar?: string
  bio?: string
  campaign_id?: string
  total_views: number
  created_at: string
}

export type Campaign = {
  id: string
  name: string
  description?: string
  start_date: string
  end_date?: string
  status: "active" | "draft" | "completed"
  goal?: number
  progress: number
  creator_count: number
  total_views: number
}

export type Video = {
  id: string
  creator_id: string
  video_url: string // Changed from url to video_url to match the database schema
  title: string
  description?: string
  thumbnail_url?: string
  views: number
  likes?: number
  comments?: number
  shares?: number
  created_at: string
}

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

// Get the Supabase client for client-side operations
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabaseClient
}

// Get the Supabase admin client for server-side operations
export function getSupabaseAdmin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper functions for database operations

// Creators
export async function getCreators() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("creators").select("*").order("total_views", { ascending: false })

  if (error) throw error
  return data as Creator[]
}

// Campaigns
export async function getCampaigns() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Campaign[]
}

// Videos
export async function getVideos(creatorId?: string) {
  const supabase = getSupabaseClient()
  let query = supabase.from("videos").select("*")

  if (creatorId) {
    query = query.eq("creator_id", creatorId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Video[]
}
