"use client"

import type React from "react"
import { useMemo } from "react"

interface DataElementProps {
  type: "number" | "bar" | "percentage" | "trend"
  style: React.CSSProperties
  content?: string
  colorClass: string
  animationClass: string
}

const DataElement: React.FC<DataElementProps> = ({ type, style, content, colorClass, animationClass }) => {
  const baseClasses = "absolute text-xs md:text-sm lg:text-base rounded-md"

  if (type === "bar") {
    return <div className={`${baseClasses} ${colorClass} ${animationClass}`} style={style}></div>
  }
  return (
    <span className={`${baseClasses} ${colorClass} ${animationClass} font-mono`} style={style}>
      {content}
    </span>
  )
}

const DataScapeBackground: React.FC = () => {
  const elements = useMemo(() => {
    const numElements = 30 // Adjust for density
    const generatedElements: DataElementProps[] = []
    const colors = [
      "bg-sky-500/20 text-sky-300/70",
      "bg-purple-500/20 text-purple-300/70",
      "bg-teal-500/20 text-teal-300/70",
      "bg-pink-500/20 text-pink-300/70",
    ]
    const animations = ["animate-pulse-slow", "animate-float-subtle", "animate-fade-gentle"]

    const sampleTexts = {
      number: ["1.2K", "25M", "780", "3.5K", "9.1M"],
      percentage: ["+15%", "-5%", "+120%", "+33%", "-2%"],
      trend: ["↗", "↘"],
    }

    for (let i = 0; i < numElements; i++) {
      const typeRandom = Math.random()
      let type: DataElementProps["type"]
      let content: string | undefined
      let elementStyle: React.CSSProperties = {}

      const top = `${Math.random() * 100}%`
      const left = `${Math.random() * 100}%`
      const animationDelay = `${Math.random() * 5}s`
      const opacity = Math.random() * 0.3 + 0.2 // Opacity between 0.2 and 0.5

      if (typeRandom < 0.35) {
        // Bar
        type = "bar"
        elementStyle = {
          width: `${Math.random() * 30 + 10}px`, // Width between 10px and 40px
          height: `${Math.random() * 80 + 20}px`, // Height between 20px and 100px
          transform: `rotate(${Math.random() > 0.5 ? "0deg" : "0deg"}) scale(${Math.random() * 0.3 + 0.7})`, // Slight scale variation
        }
      } else if (typeRandom < 0.65) {
        // Number
        type = "number"
        content = sampleTexts.number[Math.floor(Math.random() * sampleTexts.number.length)]
      } else if (typeRandom < 0.9) {
        // Percentage
        type = "percentage"
        content = sampleTexts.percentage[Math.floor(Math.random() * sampleTexts.percentage.length)]
      } else {
        // Trend arrow
        type = "trend"
        content = sampleTexts.trend[Math.floor(Math.random() * sampleTexts.trend.length)]
        elementStyle = { fontSize: "1.5rem" } // Larger for arrows
      }

      generatedElements.push({
        type,
        style: {
          top,
          left,
          animationDelay,
          opacity,
          ...elementStyle,
        },
        content,
        colorClass: colors[Math.floor(Math.random() * colors.length)],
        animationClass: animations[Math.floor(Math.random() * animations.length)],
      })
    }
    return generatedElements
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {elements.map((el, i) => (
        <DataElement key={i} {...el} />
      ))}
    </div>
  )
}

export default DataScapeBackground
