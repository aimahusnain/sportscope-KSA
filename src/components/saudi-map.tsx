"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { useFilters } from "@/contexts/filter-context"
import regionsData from "@/data/ksa-regions-svg.json"

// Generate region names from JSON data
const regionNames: Record<string, string> = regionsData.regions.reduce(
  (acc, region) => {
    acc[region.id] = region.name
    return acc
  },
  {} as Record<string, string>,
)


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

interface RegionStats {
  facilityData: Record<string, number>
  totalFacilities: number
  regionCounts: Array<{
    region: string
    count: number
    mapId: string
  }>
  appliedFilters?: {
    sports: string[]
    facilityTypes: string[]
    locationTypes: string[]
    ministryOfSports: boolean
  }
}

export default function InteractiveSaudiMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [facilityData, setFacilityData] = useState<Record<string, number>>({})
  const [totalFacilities, setTotalFacilities] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Get filters from context
  const {
    selectedSports,
    selectedFacilityTypes,
    selectedLocationTypes,
    ministryOfSports,
    clearAllFilters,
    setSelectedLocationTypes, // Function to update selectedLocationTypes
  } = useFilters()

  const getDisplayFacilityCount = (regionId: string) => {
  if (selectedLocationTypes.length === 1 && selectedLocationTypes[0] !== regionId) {
    return ""
  }
  return facilityData[regionId] || ""
}


  // Fetch facility statistics from server with filters
  const fetchRegionStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Build query parameters
      const params = new URLSearchParams()
      if (selectedSports.length > 0) {
        params.append("sports", selectedSports.join(","))
      }
      if (selectedFacilityTypes.length > 0) {
        params.append("facilityTypes", selectedFacilityTypes.join(","))
      }
      if (selectedLocationTypes.length > 0) {
        params.append("locationTypes", selectedLocationTypes.join(","))
      }
      if (ministryOfSports) {
        params.append("ministryOfSports", "true")
      }
      const response = await fetch(`/api/facilities/stats/regions?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch region statistics")
      }
      const data: RegionStats = await response.json()
      setFacilityData(data.facilityData)
      setTotalFacilities(data.totalFacilities)
    } catch (err) {
      console.error("Error fetching region stats:", err)
      setError("Failed to load region statistics")
      toast.error("Failed to load region statistics")
      // Set fallback data
      const fallbackData: Record<string, number> = {
        "SA-01": 45,
        "SA-02": 32,
        "SA-03": 28,
        "SA-04": 18,
        "SA-05": 15,
        "SA-06": 22,
        "SA-07": 12,
        "SA-08": 8,
        "SA-09": 14,
        "SA-10": 25,
        "SA-11": 19,
        "SA-12": 16,
        "SA-13": 11,
      }
      setFacilityData(fallbackData)
      setTotalFacilities(Object.values(fallbackData).reduce((sum, count) => sum + count, 0))
    } finally {
      setIsLoading(false)
    }
  }, [selectedSports, selectedFacilityTypes, selectedLocationTypes, ministryOfSports])

  // Fetch data when filters change
  useEffect(() => {
    fetchRegionStats()
  }, [fetchRegionStats])

  // Function to handle SVG path or list item click
  const handleRegionClick = useCallback(
    (regionId: string) => {
      // If the clicked region is already selected, deselect it. Otherwise, select it.
      if (selectedLocationTypes.includes(regionId)) {
        setSelectedLocationTypes([]) // Deselect
      } else {
        setSelectedLocationTypes([regionId]) // Select this region
      }
    },
    [selectedLocationTypes, setSelectedLocationTypes],
  )

  // Function to handle SVG initialization and add event listeners
  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path[id^="SA-"]')
    if (!paths) return

    const handleMouseEnter = (e: Event) => {
      const target = e.target as SVGPathElement
      setActiveRegion(target.id)
      setShowTooltip(true)
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
    }
    const handleClick = (e: Event) => {
      const target = e.target as SVGPathElement
      handleRegionClick(target.id)
    }

    if (!isLoading) {
      paths.forEach((path) => {
        path.addEventListener("mouseenter", handleMouseEnter)
        path.addEventListener("mousemove", handleMouseMove)
        path.addEventListener("mouseleave", handleMouseLeave)
        path.addEventListener("click", handleClick)
      })
    }

    // Cleanup function to remove event listeners
    return () => {
      if (!isLoading) {
        paths.forEach((path) => {
          path.removeEventListener("mouseenter", handleMouseEnter)
          path.removeEventListener("mousemove", handleMouseMove)
          path.removeEventListener("mouseleave", handleMouseLeave)
          path.removeEventListener("click", handleClick)
        })
      }
    }
  }, [isLoading, handleRegionClick])

  // Get color for a region with opacity adjustment when another region is hovered
  const getRegionColor = (regionId: string) => {
    if (!regionColors[regionId]) return "#E5E7EB"
    if (activeRegion && activeRegion !== regionId) {
      return `${regionColors[regionId].base}40`
    }
    return regionColors[regionId].base
  }

  // Check if any filters are active
  const hasActiveFilters =
    selectedSports.length > 0 ||
    selectedFacilityTypes.length > 0 ||
    selectedLocationTypes.length > 0 ||
    ministryOfSports

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-fit sm:mt-0 mt-12">
        <Card className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {hasActiveFilters ? "Applying filters..." : "Loading region statistics..."}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="w-full h-fit sm:mt-0 mt-12">
        <Card className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <p className="text-destructive font-medium">Error loading map</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <button onClick={fetchRegionStats} className="text-primary hover:text-primary/80 text-sm underline">
              Try again
            </button>
            <p className="text-xs text-muted-foreground mt-2">Using sample data for now</p>
          </div>
        </Card>
      </div>
    )
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
      {/* Mobile header with total facilities and filter status */}
      <div className="xl:hidden mb-4">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Saudi Arabia Map</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Badge variant="outline" className="text-xs bg-lime-100 text-lime-800 border-lime-300">
                  Filtered
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {totalFacilities} Total Facilities
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">Tap regions to explore</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-lime-600 hover:text-lime-800 underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
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

                  onClick={() => handleRegionClick(region.id)} // Add onClick handler
                >-
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
              <h3 className="font-semibold text-base">Facilities Per Region</h3>
              <div className="flex items-center gap-2">
          
  <Badge variant="secondary" className="text-xs">
   {totalFacilities}
  </Badge>

              </div>
            </div>
            <div className="space-y-1 mt-3">
              {Object.entries(regionNames)
                .sort(([idA], [idB]) => {
                  const countA = facilityData[idA] || 0
                  const countB = facilityData[idB] || 0
                  return countB - countA
                })
                .map(([id, name]) => (
                  <div
                    key={id}
                    className={`flex items-center gap-2 p-1.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                      activeRegion === id || selectedLocationTypes.includes(id) ? "bg-muted ring-1 ring-primary/20" : ""
                    }`}
                    onMouseEnter={() => setActiveRegion(id)}
                    onMouseLeave={() => setActiveRegion(null)}
                    onClick={() => handleRegionClick(id)} // Add onClick handler
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white shadow-sm transition-all duration-200"
                      style={{
                        backgroundColor: regionColors[id].base,
                        transform:
                          activeRegion === id || selectedLocationTypes.includes(id) ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                    <span
                      className={`text-xs font-medium transition-colors duration-200 flex-1 truncate ${
                        activeRegion === id || selectedLocationTypes.includes(id) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {name}
                    </span>
                    <div className="flex items-center gap-1">
<div title="Total number of facilities">
<span className="text-xs text-muted-foreground font-medium">{getDisplayFacilityCount(id)}</span>
                      </div>
                      {/* I need no. of facilities instead of Sa-... */}
                      {/* <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 h-5"
                        style={{
                          borderColor:
                            activeRegion === id || selectedLocationTypes.includes(id)
                              ? regionColors[id].base
                              : undefined,
                          color:
                            activeRegion === id || selectedLocationTypes.includes(id)
                              ? regionColors[id].base
                              : undefined,
                        }}
                      >
                        {id.replace("SA-", "")}
                      </Badge> */}
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Hover to highlight regions</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-lime-600 hover:text-lime-800 underline flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
              <button onClick={fetchRegionStats} className="text-xs text-primary hover:text-primary/80 underline mt-1">
                Refresh data
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
