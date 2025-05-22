import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Kountr - Track and Analyze UGC Performance",
    template: "%s | Kountr",
  },
  description: "Track, analyze, and optimize your UGC campaigns across social media platforms.",
  keywords: ["UGC", "content creator", "analytics", "social media", "tracking", "performance"],
  authors: [{ name: "Kountr Team" }],
  creator: "Kountr",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
