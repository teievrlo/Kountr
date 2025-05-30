import { firebaseAuth } from "./firebaseClient"

export async function getAuthToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser
  if (!user) return null

  try {
    return await user.getIdToken()
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("User not authenticated")
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

// Helper functions for your API calls
export const apiClient = {
  async getMyVideos() {
    const response = await authenticatedFetch("/api/my-videos")
    if (!response.ok) throw new Error("Failed to fetch videos")
    return response.json()
  },

  async getMyCampaigns() {
    const response = await authenticatedFetch("/api/my-campaigns")
    if (!response.ok) throw new Error("Failed to fetch campaigns")
    return response.json()
  },

  async createCampaign(data: any) {
    const response = await authenticatedFetch("/api/my-campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create campaign")
    return response.json()
  },

  async getMyCreators(campaignId?: string) {
    const url = campaignId ? `/api/my-creators?campaign_id=${campaignId}` : "/api/my-creators"
    const response = await authenticatedFetch(url)
    if (!response.ok) throw new Error("Failed to fetch creators")
    return response.json()
  },

  async createCreator(data: any) {
    const response = await authenticatedFetch("/api/my-creators", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create creator")
    return response.json()
  },

  async getDashboardStats() {
    const response = await authenticatedFetch("/api/dashboard-stats")
    if (!response.ok) throw new Error("Failed to fetch dashboard stats")
    return response.json()
  },
}
