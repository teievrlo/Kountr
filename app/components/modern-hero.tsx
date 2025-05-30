"use client"

import type React from "react"
import { KountrLogo } from "./kountr-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChartBig, Users, TrendingUp, VideoIcon, Palette } from "lucide-react" // Added Palette for variety

interface ShapeProps {
  id: number
  type: "cube" | "sphere" | "pyramid" | "dataBar" | "trendLine" | "ring"
  size: number
  color: string // e.g., "bg-blue-500", "bg-red-400", "bg-pink-400"
  top: string
  left: string
  animationClass: string
  zIndex: number
  icon?: React.ElementType
  opacityClass?: string // e.g., "opacity-70"
}

const Shape: React.FC<ShapeProps> = ({
  type,
  size,
  color,
  top,
  left,
  animationClass,
  zIndex,
  icon: Icon,
  opacityClass = "opacity-60",
}) => {
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    top,
    left,
    position: "absolute",
    zIndex,
  }

  const commonShapeClasses = `${opacityClass} transform-gpu ${animationClass}`
  const iconColor = "text-white/80" // Icons on vibrant shapes look good with white

  if (type === "cube") {
    return (
      <div
        style={style}
        className={`${commonShapeClasses} ${color} rounded-lg shadow-xl flex items-center justify-center`}
      >
        {Icon && <Icon className={`w-1/2 h-1/2 ${iconColor}`} />}
      </div>
    )
  }
  if (type === "sphere") {
    return (
      <div
        style={{ ...style, borderRadius: "50%" }}
        className={`${commonShapeClasses} ${color} shadow-xl flex items-center justify-center`}
      >
        {Icon && <Icon className={`w-1/2 h-1/2 ${iconColor}`} />}
      </div>
    )
  }
  if (type === "pyramid") {
    return (
      <div
        style={{
          ...style,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid`,
          backgroundColor: "transparent",
        }}
        className={`${commonShapeClasses} ${color.replace("bg-", "border-b-")} shadow-xl`}
      />
    )
  }
  if (type === "dataBar") {
    return (
      <div
        style={{ ...style, height: `${size * 1.5}px`, width: `${size * 0.3}px` }}
        className={`${commonShapeClasses} ${color} rounded-sm shadow-xl flex items-end justify-center p-1`}
      >
        {Icon && <Icon className={`w-full h-auto ${iconColor}`} />}
      </div>
    )
  }
  if (type === "trendLine") {
    return (
      <div
        style={{ ...style, height: "3px", width: `${size * 1.2}px` }} // Made line thicker
        className={`${commonShapeClasses} ${color} rounded-full shadow-xl flex items-center justify-center`}
      >
        {Icon && <Icon className={`w-6 h-6 ${iconColor} absolute -top-3 right-0`} />}
      </div>
    )
  }
  if (type === "ring") {
    return (
      <div
        style={{ ...style, borderRadius: "50%", borderWidth: `${size * 0.15}px` }} // Thicker ring
        className={`${commonShapeClasses} ${color.replace("bg-", "border-")} shadow-xl`}
      />
    )
  }
  return null
}

interface ModernHeroProps {
  children: React.ReactNode
  mainHeadline: string
  subHeadline: string
  ctaLink: string
  ctaText: string
  isLoggedIn: boolean
  dashboardLink: string
}

const ModernHero: React.FC<ModernHeroProps> = ({
  children,
  mainHeadline,
  subHeadline,
  ctaLink,
  ctaText,
  isLoggedIn,
  dashboardLink,
}) => {
  const shapes: ShapeProps[] = [
    {
      id: 1,
      type: "sphere",
      size: 100,
      color: "bg-blue-500",
      top: "10%",
      left: "5%",
      animationClass: "animate-float-diag",
      zIndex: 1,
      icon: BarChartBig,
      opacityClass: "opacity-70",
    },
    {
      id: 2,
      type: "cube",
      size: 70,
      color: "bg-pink-500",
      top: "15%",
      left: "85%",
      animationClass: "animate-float-slow",
      zIndex: 2,
      icon: Users,
      opacityClass: "opacity-60",
    },
    {
      id: 3,
      type: "ring",
      size: 120,
      color: "bg-red-500",
      top: "65%",
      left: "10%",
      animationClass: "animate-spin-slow-alt",
      zIndex: 1,
      opacityClass: "opacity-50",
    },
    {
      id: 4,
      type: "pyramid",
      size: 60,
      color: "bg-sky-400",
      top: "70%",
      left: "88%",
      animationClass: "animate-float-diag-alt",
      zIndex: 3,
      opacityClass: "opacity-70",
    },
    {
      id: 5,
      type: "dataBar",
      size: 80,
      color: "bg-rose-400",
      top: "45%",
      left: "2%",
      animationClass: "animate-float-vertical-slow",
      zIndex: 1,
      opacityClass: "opacity-60",
    },
    {
      id: 6,
      type: "trendLine",
      size: 140,
      color: "bg-blue-600",
      top: "80%",
      left: "55%",
      animationClass: "animate-float-slow",
      zIndex: 2,
      icon: TrendingUp,
      opacityClass: "opacity-70",
    },
    {
      id: 7,
      type: "sphere",
      size: 50,
      color: "bg-red-400",
      top: "5%",
      left: "45%",
      animationClass: "animate-float-diag",
      zIndex: 1,
      icon: Palette,
      opacityClass: "opacity-60",
    },
    {
      id: 8,
      type: "cube",
      size: 90,
      color: "bg-pink-400",
      top: "30%",
      left: "70%",
      animationClass: "animate-float-vertical",
      zIndex: 3,
      icon: VideoIcon,
      opacityClass: "opacity-70",
    },
  ]

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[calc(100vh-4rem)] py-12 md:py-20 lg:py-28 flex items-center justify-center bg-gradient-to-br from-sky-100 via-rose-50 to-pink-100 dark:from-sky-50 dark:via-rose-50 dark:to-pink-50 overflow-hidden">
      {shapes.map((shape) => (
        <Shape key={shape.id} {...shape} />
      ))}

      {/* Optional: Light overlay for subtle depth, if needed. Can be removed. */}
      {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10"></div> */}

      <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
        <div
          className="w-48 h-96 md:w-60 md:h-[480px] lg:w-72 lg:h-[576px] bg-white/30 dark:bg-slate-100/30 rounded-3xl border border-slate-300/50 dark:border-slate-300/50 shadow-2xl 
                        flex items-center justify-center opacity-40 dark:opacity-30 transform rotate-[8deg] scale-90 translate-x-[20%] translate-y-[5%] md:translate-x-[15%]"
        >
          <KountrLogo size="large" className="opacity-50 text-blue-700" />
        </div>
      </div>

      <div className="container px-4 md:px-6 relative z-20">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-6 text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-800 dark:text-slate-900">
              {mainHeadline}
            </h1>
            <p className="max-w-[600px] text-slate-600 dark:text-slate-700 md:text-xl lg:text-lg">{subHeadline}</p>
            {!isLoggedIn && (
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    variant="default"
                    className="w-full sm:w-auto text-lg py-7 px-8 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg transform transition-all hover:scale-105"
                  >
                    {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href={dashboardLink} className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    variant="default"
                    className="w-full sm:w-auto text-lg py-7 px-8 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg transform transition-all hover:scale-105"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center lg:min-h-[450px]">
            <div className="w-full max-w-md bg-white/80 dark:bg-slate-50/90 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-300">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModernHero
