import { firebaseAuth } from "./firebaseClient"

export async function getAuthToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser
  if (!user) {
    console.warn("getAuthToken: No current user.")
    return null
  }

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
    // This case should ideally be handled before calling authenticatedFetch,
    // e.g., by checking if the user is logged in.
    console.error(`authenticatedFetch: No auth token for URL: ${url}. User might be logged out.`)
    throw new Error("User not authenticated. Unable to fetch data.")
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Assuming POST/PUT requests send JSON
      Accept: "application/json", // Requesting JSON response
    },
  })

  if (!response.ok) {
    // Attempt to get more details from the response if it's an error
    let errorBody
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      errorBody = await response.json()
    } else {
      errorBody = await response.text() // Get HTML or plain text error
    }
    console.error(`API Error ${response.status} for ${url}:`, errorBody)
    throw new Error(
      `Failed to fetch from ${url}. Status: ${response.status}. ${
        typeof errorBody === "string" ? errorBody.substring(0, 100) + "..." : JSON.stringify(errorBody)
      }`,
    )
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  } else {
    // This case should ideally not happen if the API is correctly sending JSON
    const textResponse = await response.text()
    console.warn(
      `API Warning: Expected JSON response from ${url} but received ${contentType}. Response body: ${textResponse.substring(0, 200)}...`,
    )
    // Depending on your needs, you might throw an error here or try to handle non-JSON
    throw new Error(`Expected JSON response from ${url}, but received ${contentType}.`)
  }
}

// Helper functions for your API calls (apiClient remains the same)
export const apiClient = {
  async getMyVideos() {
    return authenticatedFetch("/api/my-videos")
  },
  async getMyCampaigns() {
    return authenticatedFetch("/api/my-campaigns")
  },
  async createCampaign(data: any) {
    return authenticatedFetch("/api/my-campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  async getMyCreators(campaignId?: string) {
    const url = campaignId ? `/api/my-creators?campaign_id=${campaignId}` : "/api/my-creators"
    return authenticatedFetch(url)
  },
  async createCreator(data: any) {
    return authenticatedFetch("/api/my-creators", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  async getDashboardStats() {
    return authenticatedFetch("/api/dashboard-stats")
  },
}
