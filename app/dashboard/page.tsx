"use client" // Required for using hooks

import { useFirebaseAuth } from "@/lib/firebase-auth-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// ... keep other existing imports for DashboardOverview etc.

export default function DashboardPage() {
  const { user, loading } = useFirebaseAuth() // Get auth state

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to UGC Tracker</h1>
        <p className="mb-6">Please log in to access your dashboard.</p>
        <Link href="/firebase-test">
          {" "}
          {/* Or your dedicated login page */}
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  // If user is logged in, render the original dashboard content
  return (
    <>
      {/* Keep your existing DashboardOverview and other components here */}
      {/* For example: */}
      {/* <DashboardOverview /> */}
      <div className="p-4">
        <h1 className="text-xl font-semibold">Welcome back, {user.email}!</h1>
        <p>This is your protected dashboard content.</p>
        {/* You can now fetch user-specific data using apiClient from auth-helpers.ts */}
      </div>
    </>
  )
}
