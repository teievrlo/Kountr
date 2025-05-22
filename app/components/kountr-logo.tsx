import Link from "next/link"
import { cn } from "@/lib/utils"

interface KountrLogoProps {
  className?: string
  size?: "tiny" | "xs" | "sm" | "md" | "lg"
  variant?: "dark" | "light"
}

export function KountrLogo({ className, size = "tiny", variant = "dark" }: KountrLogoProps) {
  const sizeClasses = {
    tiny: "text-lg",
    xs: "text-xl",
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  }

  return (
    <Link href="/" className={cn("font-bold", className)}>
      <span className={cn(sizeClasses[size], variant === "light" ? "text-white" : "text-black")}>Kountr</span>
    </Link>
  )
}
