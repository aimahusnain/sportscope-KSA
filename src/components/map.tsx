"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { regionNames, regionColors, sampleData } from "@/lib/dashboard-data" // Updated imports
import ksaRegionsData from "@/data/ksa-regions-svg.json" // Updated imports

interface TooltipData {
  region: string
  gap: number
  demand: number
  supply: number
}

interface MapProps {
  activeRegion: string | null
  setActiveRegion: (value: string | null) => void
  selectedRegion: string | null
  setSelectedRegion: (value: string | null) => void
  setShowCharts: (value: boolean) => void
}

export function Map({ activeRegion, setActiveRegion, selectedRegion, setSelectedRegion, setShowCharts }: MapProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)

  const svgRef = useRef<SVGSVGElement>(null)

  // Function to handle SVG initialization
  useEffect(() => {
    const addEventListeners = () => {
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll('path[id^="SA-"]')
        paths.forEach((path) => {
          const pathElement = path as SVGPathElement
          // Remove existing event listeners first
          pathElement.removeEventListener("mouseenter", handleMouseEnter)
          pathElement.removeEventListener("mousemove", handleMouseMove)
          pathElement.removeEventListener("mouseleave", handleMouseLeave)
          pathElement.removeEventListener("click", handleClick)
          // Add fresh event listeners
          pathElement.addEventListener("mouseenter", handleMouseEnter)
          pathElement.addEventListener("mousemove", handleMouseMove)
          pathElement.addEventListener("mouseleave", handleMouseLeave)
          pathElement.addEventListener("click", handleClick)
        })
      }
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as SVGPathElement
      setActiveRegion(target.id)
      setShowTooltip(true)
      // Set tooltip data
      const data = sampleData[target.id as keyof typeof sampleData]
      if (data) {
        setTooltipData({
          region: regionNames[target.id],
          gap: data.gap,
          demand: data.demand,
          supply: data.supply,
        })
      }
    }

    const handleMouseMove = (e: Event) => {
      const svgRect = svgRef.current!.getBoundingClientRect()
      setTooltipPosition({
        x: (e as MouseEvent).clientX - svgRect.left,
        y: (e as MouseEvent).clientY - svgRect.top,
      })
    }

    const handleMouseLeave = () => {
      setShowTooltip(false)
      setActiveRegion(null)
      setTooltipData(null)
    }

    const handleClick = (e: Event) => {
      e.preventDefault()
      const target = e.target as SVGPathElement
      setSelectedRegion(target.id)
      setShowCharts(true)
    }

    addEventListeners()

    // Cleanup function
    return () => {
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll('path[id^="SA-"]')
        paths.forEach((path) => {
          const pathElement = path as SVGPathElement
          pathElement.removeEventListener("mouseenter", handleMouseEnter)
          pathElement.removeEventListener("mousemove", handleMouseMove)
          pathElement.removeEventListener("mouseleave", handleMouseLeave)
          pathElement.removeEventListener("click", handleClick)
        })
      }
    }
  }, [setActiveRegion, setSelectedRegion, setShowCharts]) // Dependencies for useEffect

  // Reset map visual state when selectedRegion changes
  useEffect(() => {
    if (!selectedRegion) {
      setActiveRegion(null)
      setShowTooltip(false)
      setTooltipData(null)
    }
  }, [selectedRegion, setActiveRegion])

  // Get color for a region with opacity adjustment when another region is hovered
  const getRegionColor = (regionId: string) => {
    if (!regionColors[regionId]) return "#71717a"
    // If this region is selected, use a darker shade
    if (selectedRegion === regionId) {
      return regionColors[regionId].hover
    }
    // If there's an active region and it's not this one, reduce opacity
    if (activeRegion && activeRegion !== regionId) {
      return `${regionColors[regionId].base}40` // 40 = 25% opacity in hex
    }
    return regionColors[regionId].base
  }

  return (
    <Card className="h-fit w-[40rem]">
      <CardContent className="p-2 lg:p-4 h-full relative">
        <div className="relative h-full">
          <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 600" className="w-full h-full">
            <defs>
              <style>
                {`
                .land {
                  stroke: white;
                  stroke-opacity: 1;
                  stroke-width: 1;
                  transition: all 0.3s ease;
                  cursor: pointer;
                }
                .land:hover {
                  filter: brightness(1.1);
                  stroke-width: 2;
                }
                .land:focus {
                  outline: none;
                  stroke: #65a30d;
                  stroke-width: 3;
                }
                `}
              </style>
            </defs>
            <g>
              {ksaRegionsData.regions.map((region) => (
                <path
                  key={region.id}
                  id={region.id}
                  className="land"
                  fill={getRegionColor(region.id)}
                  d={region.path}
                  role="button"
                  tabIndex={0}
                  aria-label={`${region.name} region`}
                >
                  <title>{region.name}</title>
                </path>
              ))}
            </g>
          </svg>
          {/* Tooltip */}
          {showTooltip && tooltipData && (
            <div
              className="absolute pointer-events-none z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-lg shadow-lg text-sm max-w-xs"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 10}px`,
                transform: "translateX(-50%) translateY(-100%)",
              }}
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{tooltipData.region}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-600 dark:text-red-400">Gap:</span>
                  <span className="font-medium">{tooltipData.gap.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Demand:</span>
                  <span className="font-medium">{tooltipData.demand.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Supply:</span>
                  <span className="font-medium">{tooltipData.supply.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Click to view detailed analytics</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
