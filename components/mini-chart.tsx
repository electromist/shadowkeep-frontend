"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

const data = [
  { label: "25th", value: 120 },
  { label: "", value: 240 },
  { label: "", value: 180 },
  { label: "", value: 320 },
  { label: "", value: 280 },
  { label: "27th", value: 550, active: true },
  { label: "", value: 460 },
  { label: "", value: 580, active: true },
  { label: "", value: 410 },
  { label: "30th", value: 680, active: true },
]

export function MiniChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const maxValue = Math.max(...data.map((d) => d.value))

  useEffect(() => {
    if (hoveredIndex !== null) {
      setDisplayValue(data[hoveredIndex].value)
    }
  }, [hoveredIndex])

  const handleContainerEnter = () => setIsHovering(true)
  const handleContainerLeave = () => {
    setIsHovering(false)
    setHoveredIndex(null)
    setTimeout(() => {
      setDisplayValue(null)
    }, 150)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
      className="group relative w-full p-6 pb-10 rounded-2xl bg-[#141416]/60 border border-zinc-800/80 backdrop-blur-sm transition-all duration-500 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-400">Decryptions</span>
          <div className="relative h-5 flex items-center">
            <span
              className={cn(
                "text-xs font-semibold tabular-nums transition-all duration-300 ease-out text-[#ff5c00]",
                isHovering && displayValue !== null ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
              )}
            >
              {displayValue !== null ? `${displayValue} decryptions` : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-3 text-[11px]">
          <button className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-semibold transition-colors">
            Last 7 days
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-3 h-28 relative mt-2 mb-6 ">
        {data.map((item, index) => {
          const heightPx = (item.value / maxValue) * 112
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null

          return (
            <div
              key={index}
              className="relative flex-1 flex flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-lg cursor-pointer transition-all duration-300 ease-out origin-bottom",
                  isHovered
                    ? "bg-[#ff5c00] shadow-[0_0_12px_rgba(255,92,0,0.4)]"
                    : item.active
                      ? isAnyHovered
                        ? "bg-[#ff5c00]/60"
                        : "bg-[#ff5c00]"
                      : isAnyHovered
                        ? "bg-[#ff5c00]/15"
                        : "bg-[#ff5c00]/25 hover:bg-[#ff5c00]/35",
                )}
                style={{
                  height: `${heightPx}px`,
                  transform: isHovered ? "scaleX(1.05) scaleY(1.02)" : "scaleX(1)",
                }}
              />

              {/* Label */}
              {item.label ? (
                <span
                  className={cn(
                    "text-[10px] font-medium transition-all duration-300 whitespace-nowrap absolute -bottom-5 left-1/2 -translate-x-1/2",
                    isHovered ? "text-zinc-200 font-semibold" : "text-zinc-500",
                  )}
                >
                  {item.label}
                </span>
              ) : null}

              {/* Tooltip */}
              <div
                className={cn(
                  "absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 text-zinc-100 text-[10px] font-medium transition-all duration-200 whitespace-nowrap shadow-lg border border-zinc-800/50 z-20 pointer-events-none",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                )}
              >
                {item.value} decryptions
              </div>
            </div>
          )
        })}
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#ff5c00]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
