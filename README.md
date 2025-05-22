# UGC Tracker

A platform for tracking and analyzing user-generated content across social media platforms.

## Supabase Integration

This project uses Supabase for data storage and authentication.

## TikTok Scraper

The project includes a TikTok scraper that can be run as a cron job to update view counts for videos.

### Setup

1. Create a `proxies.txt` file with a list of proxies in the format `ip:port:username:password`, one per line.
2. Install dependencies:
   \`\`\`
   npm install puppeteer @supabase/supabase-js dotenv
   \`\`\`
3. Set up environment variables in a `.env` file:
   \`\`\`
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
   \`\`\`

### Running the Scraper

\`\`\`
node scrape.js
\`\`\`

### Setting up as a Cron Job

To run the scraper automatically, you can set up a cron job:

\`\`\`
# Run every hour
0 * * * * cd /path/to/project && node scrape.js >> scraper.log 2>&1
\`\`\`

## API Endpoints

### POST /api/creators

Adds a new creator with their TikTok handle and video URL.

Request body:
\`\`\`json
{
  "leagueId": "uuid",
  "handle": "@username",
  "videoUrl": "https://www.tiktok.com/@username/video/1234567890"
}
\`\`\`

### GET /api/league/[id]

Gets all creators for a specific league, ordered by views.

Response:
\`\`\`json
[
  {
    "id": "uuid",
    "league_id": "uuid",
    "handle": "@username",
    "video_url": "https://www.tiktok.com/@username/video/1234567890",
    "views": 12345,
    "last_checked": "2023-05-20T13:39:05Z",
    "created_at": "2023-05-20T13:39:05Z"
  }
]
