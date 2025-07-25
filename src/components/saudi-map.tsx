"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import regionsData from "@/data/ksa-regions-svg.json"

// Generate region names from JSON data
const regionNames: Record<string, string> = regionsData.regions.reduce(
  (acc, region) => {
    acc[region.id] = region.name
    return acc
  },
  {} as Record<string, string>,
)

// Sample facility data for each region
const facilityData: Record<string, number> = {
  "SA-01": 45, // Riyadh
  "SA-02": 32, // Makkah
  "SA-03": 28, // Eastern Province
  "SA-04": 18, // Asir
  "SA-05": 15, // Qassim
  "SA-06": 22, // Ha'il
  "SA-07": 12, // Tabuk
  "SA-08": 8, // Northern Borders
  "SA-09": 14, // Jazan
  "SA-10": 25, // Najran
  "SA-11": 19, // Al Bahah
  "SA-12": 16, // Al Jawf
  "SA-13": 11, // Madinah
}

// Beautiful, harmonious color palette - soft and professional
const regionColors: Record<string, { base: string; hover: string }> = {
  "SA-01": { base: "#6366F1", hover: "#4F46E5" }, // Soft Indigo
  "SA-02": { base: "#8B5CF6", hover: "#7C3AED" }, // Soft Purple
  "SA-03": { base: "#06B6D4", hover: "#0891B2" }, // Soft Cyan
  "SA-04": { base: "#10B981", hover: "#059669" }, // Soft Emerald
  "SA-05": { base: "#84CC16", hover: "#65A30D" }, // Soft Lime
  "SA-06": { base: "#F59E0B", hover: "#D97706" }, // Soft Amber
  "SA-07": { base: "#F97316", hover: "#EA580C" }, // Soft Orange
  "SA-08": { base: "#EF4444", hover: "#DC2626" }, // Soft Red
  "SA-09": { base: "#EC4899", hover: "#DB2777" }, // Soft Pink
  "SA-10": { base: "#14B8A6", hover: "#0D9488" }, // Soft Teal
  "SA-11": { base: "#A855F7", hover: "#9333EA" }, // Soft Violet
  "SA-12": { base: "#3B82F6", hover: "#2563EB" }, // Soft Blue
  "SA-13": { base: "#22C55E", hover: "#16A34A" }, // Soft Green
}

export default function InteractiveSaudiMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Calculate total facilities
  const totalFacilities = Object.values(facilityData).reduce((sum, count) => sum + count, 0)

  // Function to handle SVG initialization
  useEffect(() => {
    // Add event listeners to SVG paths when the component mounts
    const addEventListeners = () => {
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll('path[id^="SA-"]')
        paths.forEach((path) => {
          path.addEventListener("mouseenter", (e) => {
            const target = e.target as SVGPathElement
            setActiveRegion(target.id)
            setShowTooltip(true)
          })

          path.addEventListener("mousemove", (e) => {
            const svgRect = svgRef.current!.getBoundingClientRect()
            setTooltipPosition({
              x: (e as MouseEvent).clientX - svgRect.left,
              y: (e as MouseEvent).clientY - svgRect.top,
            })
          })

          path.addEventListener("mouseleave", () => {
            setShowTooltip(false)
            setActiveRegion(null)
          })
        })
      }
    }

    // Call the function to add event listeners
    addEventListeners()
  }, [])

  // Get color for a region with opacity adjustment when another region is hovered
  const getRegionColor = (regionId: string) => {
    if (!regionColors[regionId]) return "#E5E7EB"
    // If there's an active region and it's not this one, reduce opacity
    if (activeRegion && activeRegion !== regionId) {
      return `${regionColors[regionId].base}40` // 40 = 25% opacity in hex
    }
    // Always use base color, no darker shade on hover
    return regionColors[regionId].base
  }

  if (!regionsData?.regions || regionsData.regions.length === 0) {
    return (
      <div className="w-full h-full p-4">
        <Card className="p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Map data is not available</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-fit sm:mt-0 mt-12">
      {/* Mobile header with total facilities */}
      <div className="xl:hidden mb-4">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Saudi Arabia Map</h3>
            <Badge variant="secondary" className="text-xs">
              {totalFacilities} Total Facilities
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Tap regions to explore</p>
        </Card>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full">
        <div className="relative flex-grow min-h-0">
          {/* SVG Map */}
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 750 600"
            className="w-full h-full max-h-[600px] border rounded-lg shadow-sm"
          >
            <defs>
              <style>
                {`
                .land {
                  stroke: white;
                  stroke-opacity: 1;
                  stroke-width: 1;
                  transition: all 0.3s ease;
                  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                  outline: none;
                }
                .land:hover {
                  cursor: pointer;
                  stroke-width: 2;
                  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
                }
                .land:focus {
                  outline: none;
                }
                .land:active {
                  outline: none;
                }
              `}
              </style>
            </defs>
            <g>
              {regionsData.regions.map((region) => (
                <path
                  key={region.id}
                  id={region.id}
                  className="land"
                  fill={getRegionColor(region.id)}
                  d={region.path}
                  role="button"
                  tabIndex={0}
                  aria-label={`${region.name} region - ${facilityData[region.id] || 0} facilities`}
                >
                  <title>
                    {region.name} - {facilityData[region.id] || 0} facilities
                  </title>
                </path>
              ))}
            </g>
          </svg>

          {/* Tooltip with facility count */}
          {showTooltip && activeRegion && (
            <div
              className="absolute pointer-events-none z-10 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md shadow-md border text-xs whitespace-nowrap"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 35}px`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-medium">{regionNames[activeRegion] || activeRegion}</div>
              <div className="text-muted-foreground">{facilityData[activeRegion] || 0} facilities</div>
            </div>
          )}
        </div>

        {/* Desktop Legend - Hidden on mobile */}
        <div className="hidden xl:block xl:w-64 flex-shrink-0">
          <Card className="p-3 h-fit">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">KSA Regions</h3>
              <Badge variant="secondary" className="text-xs">
                {totalFacilities}
              </Badge>
            </div>
            <div className="space-y-1">
              {Object.entries(regionNames).map(([id, name]) => (
                <div
                  key={id}
                  className={`flex items-center gap-2 p-1.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                    activeRegion === id ? "bg-muted ring-1 ring-primary/20" : ""
                  }`}
                  onMouseEnter={() => setActiveRegion(id)}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm transition-all duration-200"
                    style={{
                      backgroundColor: regionColors[id].base,
                      transform: activeRegion === id ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-200 flex-1 truncate ${
                      activeRegion === id ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">{facilityData[id] || 0}</span>
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0 h-5"
                      style={{
                        borderColor: activeRegion === id ? regionColors[id].base : undefined,
                        color: activeRegion === id ? regionColors[id].base : undefined,
                      }}
                    >
                      {id.replace("SA-", "")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground">Hover to highlight</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
