/**
 * URL Validator
 *
 * Utility functions to validate TikTok URLs
 */

// Validate TikTok URL format
export function validateTikTokUrl(url: string): boolean {
  try {
    // Basic validation
    if (!url || typeof url !== "string") {
      return false
    }

    // Check if it's a valid URL
    try {
      new URL(url)
    } catch {
      return false
    }

    // Check if it's a TikTok URL
    const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/
    return tiktokRegex.test(url)
  } catch (error) {
    console.error("Error validating URL:", error)
    return false
  }
}

// Extract username from TikTok URL
export function extractTikTokUsername(url: string): string | null {
  try {
    if (!validateTikTokUrl(url)) {
      return null
    }

    const regex = /@([\w.-]+)/
    const match = url.match(regex)

    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting username:", error)
    return null
  }
}

// Extract video ID from TikTok URL
export function extractTikTokVideoId(url: string): string | null {
  try {
    if (!validateTikTokUrl(url)) {
      return null
    }

    const regex = /\/video\/(\d+)/
    const match = url.match(regex)

    return match ? match[1] : null
  } catch (error) {
    console.error("Error extracting video ID:", error)
    return null
  }
}
