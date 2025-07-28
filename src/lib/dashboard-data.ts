import prisma from "./prisma"
import { KSARegion } from "@prisma/client"
import ksaRegionsData from "../data/ksa-regions-svg.json"

// Extract region names and create lookup objects
export const regionNames: Record<string, string> = {}
export const regionPaths: Record<string, string> = {}
ksaRegionsData.regions.forEach((region) => {
  regionNames[region.id] = region.name
  regionPaths[region.id] = region.path
})

// Map of region IDs to their colors
export const regionColors: Record<string, { base: string; hover: string }> = {
  "SA-01": { base: "#FF6B6B", hover: "#FF5252" },
  "SA-02": { base: "#4ECDC4", hover: "#26C6DA" },
  "SA-03": { base: "#FFD166", hover: "#FFCA28" },
  "SA-04": { base: "#06D6A0", hover: "#00C853" },
  "SA-05": { base: "#118AB2", hover: "#0277BD" },
  "SA-06": { base: "#073B4C", hover: "#263238" },
  "SA-07": { base: "#8338EC", hover: "#7B1FA2" },
  "SA-08": { base: "#3A86FF", hover: "#2196F3" },
  "SA-09": { base: "#FB5607", hover: "#FF5722" },
  "SA-10": { base: "#FFBE0B", hover: "#FFC107" },
  "SA-11": { base: "#EF476F", hover: "#E91E63" },
  "SA-12": { base: "#06AED5", hover: "#00BCD4" },
  "SA-13": { base: "#80B918", hover: "#8BC34A" },
}

// Explicit mapping from SA-XX IDs to KSARegion enum values
// This ensures correct enum values are used for Prisma queries
export const regionIdToKsaRegionEnum: Record<string, KSARegion> = {
  "SA-01": KSARegion.RIYADH,
  "SA-02": KSARegion.MAKKAH,
  "SA-04": KSARegion.EASTERN_PROVINCE,
  "SA-13": KSARegion.ASIR,
  "SA-07": KSARegion.TABUK,
  "SA-05": KSARegion.QASSIM,
  "SA-06": KSARegion.HAIL,
  "SA-08": KSARegion.NORTHERN_BORDERS,
  "SA-09": KSARegion.JAZAN,
  "SA-10": KSARegion.NAJRAN,
  "SA-11": KSARegion.AL_BAHAH,
  "SA-12": KSARegion.AL_JOUF,
  "SA-03": KSARegion.MADINAH,
}

// Sample data structure with historical data (kept for reference, not used in getDashboardData)
export const sampleData = {
  "SA-01": {
    gap: 1250,
    demand: 3500,
    supply: 2250,
    gapPercentage: 35.7,
    population: 8000000,
    area: 412000,
    sports: {
      Football: { gap: 450, demand: 1200, supply: 750, gapPercentage: 37.5, priority: "High" },
      Swimming: { gap: 300, demand: 800, supply: 500, gapPercentage: 37.5, priority: "High" },
      Basketball: { gap: 250, demand: 700, supply: 450, gapPercentage: 35.7, priority: "Medium" },
      Tennis: { gap: 150, demand: 400, supply: 250, gapPercentage: 37.5, priority: "Medium" },
      Volleyball: { gap: 100, demand: 400, supply: 300, gapPercentage: 25.0, priority: "Low" },
    },
    segments: {
      Students: { gap: 500, demand: 1400, supply: 900, percentage: 40 },
      Adults: { gap: 450, demand: 1300, supply: 850, percentage: 37 },
      Professionals: { gap: 300, demand: 800, supply: 500, percentage: 23 },
    },
    trends: {
      "2021": { gap: 1450, demand: 3200, supply: 1750 },
      "2022": { gap: 1380, demand: 3300, supply: 1920 },
      "2023": { gap: 1320, demand: 3400, supply: 2080 },
      "2024": { gap: 1250, demand: 3500, supply: 2250 },
    },
    demographics: {
      Male: { gap: 750, demand: 2100, supply: 1350, percentage: 60 },
      Female: { gap: 500, demand: 1400, supply: 900, percentage: 40 },
    },
  },
  "SA-02": {
    gap: 980,
    demand: 2800,
    supply: 1820,
    gapPercentage: 35.0,
    population: 6500000,
    area: 164000,
    sports: {
      Football: { gap: 350, demand: 950, supply: 600, gapPercentage: 36.8, priority: "High" },
      Swimming: { gap: 220, demand: 650, supply: 430, gapPercentage: 33.8, priority: "Medium" },
      Basketball: { gap: 180, demand: 550, supply: 370, gapPercentage: 32.7, priority: "Medium" },
      Tennis: { gap: 130, demand: 350, supply: 220, gapPercentage: 37.1, priority: "Medium" },
      Volleyball: { gap: 100, demand: 300, supply: 200, gapPercentage: 33.3, priority: "Low" },
    },
    segments: {
      Students: { gap: 400, demand: 1100, supply: 700, percentage: 39 },
      Adults: { gap: 350, demand: 1000, supply: 650, percentage: 36 },
      Professionals: { gap: 230, demand: 700, supply: 470, percentage: 25 },
    },
    trends: {
      "2021": { gap: 1150, demand: 2600, supply: 1450 },
      "2022": { gap: 1080, demand: 2700, supply: 1620 },
      "2023": { gap: 1020, demand: 2750, supply: 1730 },
      "2024": { gap: 980, demand: 2800, supply: 1820 },
    },
    demographics: {
      Male: { gap: 590, demand: 1680, supply: 1090, percentage: 60 },
      Female: { gap: 390, demand: 1120, supply: 730, percentage: 40 },
    },
  },
  "SA-03": {
    gap: 750,
    demand: 2100,
    supply: 1350,
    gapPercentage: 35.7,
    population: 4200000,
    area: 540000,
    sports: {
      Football: { gap: 280, demand: 700, supply: 420, gapPercentage: 40.0, priority: "High" },
      Swimming: { gap: 180, demand: 500, supply: 320, gapPercentage: 36.0, priority: "High" },
      Basketball: { gap: 150, demand: 450, supply: 300, gapPercentage: 33.3, priority: "Medium" },
      Tennis: { gap: 90, demand: 250, supply: 160, gapPercentage: 36.0, priority: "Medium" },
      Volleyball: { gap: 50, demand: 200, supply: 150, gapPercentage: 25.0, priority: "Low" },
    },
    segments: {
      Students: { gap: 300, demand: 850, supply: 550, percentage: 40 },
      Adults: { gap: 280, demand: 800, supply: 520, percentage: 38 },
      Professionals: { gap: 170, demand: 450, supply: 280, percentage: 22 },
    },
    trends: {
      "2021": { gap: 850, demand: 1950, supply: 1100 },
      "2022": { gap: 810, demand: 2000, supply: 1190 },
      "2023": { gap: 780, demand: 2050, supply: 1270 },
      "2024": { gap: 750, demand: 2100, supply: 1350 },
    },
    demographics: {
      Male: { gap: 450, demand: 1260, supply: 810, percentage: 60 },
      Female: { gap: 300, demand: 840, supply: 540, percentage: 40 },
    },
  },
}

export async function getDashboardData(regionId?: KSARegion) {
  try {
    // Get all facilities with their relations, optionally filtered by region
    const facilities = await prisma.facility.findMany({
      where: regionId ? { region: regionId } : {}, // Add region filter here
      include: {
        facilityType: true,
        sports: true,
      },
    })

    // Calculate facility types distribution
    const facilityTypesData = facilities.reduce(
      (acc, facility) => {
        // Add null check for facilityType
        if (facility.facilityType) {
          const typeName = facility.facilityType.name
          acc[typeName] = (acc[typeName] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate sports distribution (by participant count - using facilities as proxy)
    const sportsData = facilities.reduce(
      (acc, facility) => {
        // Add null check for sports array
        if (facility.sports && facility.sports.length > 0) {
          facility.sports.forEach((sport) => {
            if (sport) { // Additional safety check
              acc[sport.name] = (acc[sport.name] || 0) + 1
            }
          })
        }
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate facilities by region
    const regionData = facilities.reduce(
      (acc, facility) => {
        const region = facility.region
        if (region) { // Add null check for region
          acc[region] = (acc[region] || 0) + 1
        }
        return acc
      },
      {} as Record<KSARegion, number>,
    )

    // Calculate top sports by facility count
    const topSportsData = Object.entries(sportsData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .reduce(
        (acc, [sport, count]) => {
          acc[sport] = count
          return acc
        },
        {} as Record<string, number>,
      )

    // Calculate total stats
    const totalFacilities = facilities.length
    const totalSports = Object.keys(sportsData).length
    const totalRegions = Object.keys(regionData).length
    
    // Get average rating
    const facilitiesWithRating = facilities.filter((f) => f.rating !== null && f.rating !== undefined)
    const averageRating =
      facilitiesWithRating.length > 0
        ? facilitiesWithRating.reduce((sum, f) => sum + (f.rating || 0), 0) / facilitiesWithRating.length
        : 0

    return {
      facilityTypes: facilityTypesData,
      sports: sportsData,
      regions: regionData,
      topSports: topSportsData,
      stats: {
        totalFacilities,
        totalSports,
        totalRegions,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}

// Helper function to format region names for display
export function formatRegionName(region: KSARegion): string {
  return region
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
