import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, BarChart3, LineChart, Users, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { KountrLogo } from "./components/kountr-logo"
import { CreatorBarChart } from "./components/creator-bar-chart"

export const metadata: Metadata = {
  title: "Kountr - Track and Analyze UGC Performance",
  description: "Kountr helps you track, analyze, and optimize your UGC campaigns across social media platforms.",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <div className="flex items-center justify-between w-full">
          <KountrLogo size="tiny" />
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Track and Analyze Your UGC Performance
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Kountr helps you track, analyze, and optimize your UGC campaigns across social media platforms.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <CreatorBarChart />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Powerful Features for UGC Management
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage and optimize your UGC campaigns in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-2">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Video Tracking</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Track performance metrics for all your UGC videos in one dashboard.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Creator Management</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Manage all your creators and their content in a centralized platform.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Performance Analytics</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Get detailed analytics on views, engagement, and conversion rates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-2">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Campaign Insights</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Compare campaign performance and identify top-performing content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex-1">
          <KountrLogo size="tiny" />
          <p className="text-sm text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()} Kountr. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  )
}
