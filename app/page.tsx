"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, LineChart, Users, Video, LogOut, UserCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { KountrLogo } from "./components/kountr-logo"
import { FirebaseLogin } from "@/app/components/firebase-login"
import { useFirebaseAuth } from "@/lib/firebase-auth-provider"
import { logOut } from "@/lib/firebase-auth"
import { useState } from "react"
import ModernHero from "@/app/components/modern-hero"

export default function Home() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logOut()
  }

  const renderAuthContent = () => {
    if (authLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px] text-slate-600 dark:text-slate-700">
          <p>Loading user session...</p>
        </div>
      )
    }

    if (user) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <UserCircle className="h-16 w-16 text-blue-600 mb-2" />
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-900">Welcome back,</h2>
          <p className="text-xl font-medium text-slate-700 dark:text-slate-800 break-all">
            {user.displayName || user.email}!
          </p>
          <p className="text-slate-500 dark:text-slate-600">Ready to dive back into your UGC analytics?</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-xs">
            <Link href="/dashboard" className="w-full">
              <Button
                size="lg"
                className="w-full gap-1.5 bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white shadow-md"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full gap-1.5 text-slate-600 border-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-700 dark:border-slate-500 dark:hover:bg-slate-200 dark:hover:text-slate-900"
            >
              {isLoggingOut ? (
                "Logging out..."
              ) : (
                <>
                  Log Out <LogOut className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )
    }
    return <FirebaseLogin /> // FirebaseLogin uses Card which should adapt to light theme
  }

  return (
    // Overall page theme set to light
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-white text-slate-800 dark:text-slate-900">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-slate-200 dark:border-slate-300 bg-white/80 dark:bg-slate-50/80 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center justify-between w-full">
          <KountrLogo size="tiny" className="text-blue-600" /> {/* Ensure logo has good contrast */}
          <div className="flex items-center gap-2">
            {user && !authLoading ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-sky-100">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="#auth-section">
                <Button className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <ModernHero
          mainHeadline="Unlock Your UGC Potential"
          subHeadline="Kountr empowers you to track, analyze, and amplify your User-Generated Content campaigns like never before. Discover top creators, measure real impact, and drive unparalleled growth."
          ctaText="Get Started Free"
          ctaLink="#auth-section"
          isLoggedIn={!!user}
          dashboardLink="/dashboard"
        >
          {renderAuthContent()}
        </ModernHero>

        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-pink-100 dark:bg-rose-100 px-3 py-1 text-sm text-pink-600 dark:text-rose-700 font-medium">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800 dark:text-slate-900">
                Everything You Need for UGC Success
              </h2>
              <p className="max-w-[900px] text-slate-600 dark:text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides powerful tools to manage your campaigns, track performance, and understand your
                audience engagement like never before.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Video,
                  title: "Video Tracking",
                  description: "Monitor views, likes, and comments for all UGC videos in one place.",
                },
                {
                  icon: Users,
                  title: "Creator Management",
                  description: "Organize creators, track their content, and identify top performers.",
                },
                {
                  icon: BarChart3,
                  title: "Performance Analytics",
                  description: "Deep dive into engagement metrics and conversion rates with detailed reports.",
                },
                {
                  icon: LineChart,
                  title: "Campaign Insights",
                  description: "Compare campaign effectiveness and optimize your strategy for maximum impact.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-3 rounded-xl border border-slate-200 dark:border-slate-300 bg-white dark:bg-slate-50 p-6 text-center shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:border-blue-400 dark:hover:border-sky-500"
                >
                  <div className="rounded-full bg-blue-100 dark:bg-sky-100 p-3">
                    <feature.icon className="h-7 w-7 text-blue-600 dark:text-sky-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-200 dark:border-slate-300 bg-slate-100 dark:bg-slate-200">
        <div className="flex-1">
          <KountrLogo size="tiny" className="text-blue-600" />
          <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">
            &copy; {new Date().getFullYear()} Kountr. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-blue-600 dark:text-slate-600 dark:hover:text-sky-700"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-blue-600 dark:text-slate-600 dark:hover:text-sky-700"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-blue-600 dark:text-slate-600 dark:hover:text-sky-700"
          >
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
