import fs from "fs"
import puppeteer from "puppeteer"
import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

const proxyLines = fs.readFileSync("proxies.txt", "utf8").trim().split("\n")
function pickProxy() {
  const [ip, port, user, pass] = proxyLines[(Math.random() * proxyLines.length) | 0].split(":")
  return { ip, port, user, pass }
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE)

// cron entry point
;(async () => {
  console.log("Starting scraper...")

  // First, get videos that need to be updated
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .lt("last_checked", new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .limit(50)

  console.log(`Found ${videos?.length || 0} videos to update`)

  // Process each video
  for (const video of videos || []) {
    try {
      const previousViews = video.views || 0
      const newViews = await scrapeViews(video.video_url)

      if (newViews !== null) {
        // Update video views
        await supabase
          .from("videos")
          .update({
            views: newViews,
            last_checked: new Date().toISOString(),
          })
          .eq("id", video.id)

        // Log the scrape result
        await supabase.from("scrape_logs").insert({
          video_id: video.id,
          previous_views: previousViews,
          new_views: newViews,
          status: "success",
        })

        console.log(
          `Updated video ${video.id}: ${previousViews} -> ${newViews} views (${newViews - previousViews > 0 ? "+" : ""}${newViews - previousViews})`,
        )
      } else {
        // Log failed scrape
        await supabase.from("scrape_logs").insert({
          video_id: video.id,
          previous_views: previousViews,
          new_views: previousViews, // Keep same views if scrape failed
          status: "failed",
          error_message: "Failed to scrape views",
        })

        console.log(`Failed to scrape video ${video.id}`)
      }
    } catch (error) {
      console.error(`Error processing video ${video.id}:`, error)

      // Log error
      await supabase.from("scrape_logs").insert({
        video_id: video.id,
        previous_views: video.views || 0,
        new_views: video.views || 0,
        status: "error",
        error_message: error.message,
      })
    }
  }

  // Now update creator total views
  await updateCreatorTotalViews()

  console.log("Scraping completed")
  process.exit(0)
})()

async function scrapeViews(url, tries = 0) {
  const { ip, port, user, pass } = pickProxy()
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=http://${ip}:${port}`, "--no-sandbox"],
  })
  const page = await browser.newPage()
  await page.authenticate({ username: user, password: pass })

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 })
    await page.waitForTimeout(2500)
    const html = await page.content()
    const m = html.match(/"playCount":(\d+)/)
    await browser.close()
    return m ? +m[1] : null
  } catch (e) {
    await browser.close()
    return tries < 2 ? scrapeViews(url, tries + 1) : null
  }
}

// Update creator total views based on their videos
async function updateCreatorTotalViews() {
  try {
    // Get all creators
    const { data: creators } = await supabase.from("creators").select("id")

    console.log(`Updating total views for ${creators?.length || 0} creators`)

    // For each creator, sum up their video views
    for (const creator of creators || []) {
      // Get all videos for this creator
      const { data: creatorVideos } = await supabase.from("videos").select("views").eq("creator_id", creator.id)

      // Calculate total views
      const totalViews = creatorVideos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

      // Update creator with total views
      await supabase.from("creators").update({ views: totalViews }).eq("id", creator.id)

      console.log(`Updated creator ${creator.id} with total views: ${totalViews}`)
    }
  } catch (error) {
    console.error("Error updating creator total views:", error)
  }
}
