import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { KSARegion, Prisma } from "@prisma/client"

const REGION_DISPLAY_NAMES: Record<string, string> = {
  RIYADH: "Riyadh",
  MAKKAH: "Makkah",
  MADINAH: "Madinah",
  EASTERN_PROVINCE: "Eastern Province",
  ASIR: "Asir",
  TABUK: "Tabuk",
  QASSIM: "Al-Qassim",
  HAIL: "Ha'il",
  NORTHERN_BORDERS: "Northern Borders",
  JAZAN: "Jazan",
  NAJRAN: "Najran",
  AL_BAHAH: "Al Bahah",
  AL_JOUF: "Al Jouf",
}

// Type definitions for better type safety
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Use Prisma-generated types for better type safety
type FacilityWhereInput = Prisma.FacilityWhereInput

// Simple in-memory cache
const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const region = searchParams.get("region") || undefined

    // Get filter parameters
    const sports = searchParams.get("sports")?.split(",").filter(Boolean) || []
    const facilityTypes = searchParams.get("facilityTypes")?.split(",").filter(Boolean) || []
    const locationTypes = searchParams.get("locationTypes")?.split(",").filter(Boolean) || []
    const ministryOfSports = searchParams.get("ministryOfSports") === "true"

    // Create cache key including filters
    const cacheKey = `facility-dashboard-${page}-${limit}-${region || "all"}-${sports.join(",")}-${facilityTypes.join(",")}-${locationTypes.join(",")}-${ministryOfSports}`

    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(
        {
          success: true,
          data: cached.data,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        },
      )
    }

    // Build where clause for filtering
    const whereClause: FacilityWhereInput = {}

    // Region filter - convert string to KSARegion enum
    if (region && region in REGION_DISPLAY_NAMES) {
      whereClause.region = region as KSARegion
    }

    // Sports filter - First get sport IDs, then filter facilities
    if (sports.length > 0) {
      // Find sports that match the selected sport names (case-insensitive)
      const matchingSports = await prisma.sport.findMany({
        where: {
          name: {
            in: sports,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      })

      const sportIds = matchingSports.map((sport) => sport.id)

      if (sportIds.length > 0) {
        // Filter facilities that have any of these sport IDs in their sportIds array
        whereClause.sportIds = {
          hasSome: sportIds,
        }
      } else {
        // If no matching sports found, return empty results
        whereClause.id = "non-existent-id" // This will return no results
      }
    }

    // Facility types filter - check if facility's facilityType matches any selected types
    if (facilityTypes.length > 0) {
      whereClause.facilityType = {
        name: {
          in: facilityTypes,
          mode: "insensitive",
        },
      }
    }

    // Location type filter - update field name to match your schema
    // Uncomment and update field name if this field exists in your Facility model
    // if (locationTypes.length > 0) {
    //   whereClause.location_type = {  // Update to your actual field name
    //     in: locationTypes,
    //   }
    // }

    // Ministry of Sports filter - update field name to match your schema
    // Uncomment and update field name if this field exists in your Facility model
    // if (ministryOfSports) {
    //   whereClause.ministry_of_sports = true  // Update to your actual field name
    // }

    // Execute all queries in parallel for better performance
    const [
      facilities,
      regionDataRaw,
      facilityTypeDataRaw,
      totalCount,
      totalFacilities,
      totalRegions,
      totalFacilityTypes,
      totalSports,
    ] = await Promise.all([
      // Get paginated facilities
      prisma.facility.findMany({
        where: whereClause,
        include: {
          facilityType: {
            select: {
              id: true,
              name: true,
            },
          },
          sports: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      // Get region distribution using database aggregation
      prisma.facility.groupBy({
        by: ["region"],
        where: whereClause,
        _count: {
          id: true,
        },
      }),
      // Get facility type distribution - only for facilities that have a facilityTypeId
      prisma.facility.groupBy({
        by: ["facilityTypeId"],
        where: {
          ...whereClause,
          facilityTypeId: {
            not: null,
          },
        },
        _count: {
          id: true,
        },
      }),
      // Get total count for pagination
      prisma.facility.count({
        where: whereClause,
      }),
      // Get summary statistics (unfiltered totals)
      prisma.facility.count(),
      // Count distinct regions
      prisma.facility
        .groupBy({
          by: ["region"],
          _count: { region: true },
        })
        .then((result) => result.length),
      prisma.facilityType.count(),
      prisma.sport.count(),
    ])

    // Process region data
    const regionData = regionDataRaw.map((item) => ({
      region: REGION_DISPLAY_NAMES[item.region] || item.region,
      count: item._count?.id || 0,
    }))

    // Process facility type data - handle null facilityTypeId properly
    const facilityTypeData = await Promise.all(
      facilityTypeDataRaw
        .filter((item) => item.facilityTypeId !== null) // Filter out null values
        .map(async (item) => {
          // Convert null to undefined for Prisma query
          const facilityTypeId = item.facilityTypeId || undefined
          if (!facilityTypeId) return null

          const facilityType = await prisma.facilityType.findUnique({
            where: { id: facilityTypeId },
            select: { name: true },
          })

          return {
            type: facilityType?.name || "Unknown",
            count: item._count?.id || 0,
          }
        }),
    ).then((results) => results.filter((item) => item !== null)) // Remove null results

    // Process sports data - get sports count from filtered facilities
    const sportsCount: Record<string, number> = {}
    
    // Get all unique sport IDs from facilities
    const allSportIds = new Set<string>()
    facilities.forEach((facility) => {
      if (facility.sportIds && facility.sportIds.length > 0) {
        facility.sportIds.forEach((sportId) => allSportIds.add(sportId))
      }
    })
    
    // Fetch sport names for all sport IDs
    const sportsWithNames = await prisma.sport.findMany({
      where: {
        id: {
          in: Array.from(allSportIds),
        },
      },
      select: {
        id: true,
        name: true,
      },
    })
    
    // Create a map of sport ID to sport name
    const sportIdToNameMap = new Map(
      sportsWithNames.map((sport) => [sport.id, sport.name])
    )
    
    // Count sports by name
    facilities.forEach((facility) => {
      if (facility.sportIds && facility.sportIds.length > 0) {
        facility.sportIds.forEach((sportId) => {
          const sportName = sportIdToNameMap.get(sportId)
          if (sportName) {
            sportsCount[sportName] = (sportsCount[sportName] || 0) + 1
          }
        })
      }
    })

    const sportsData = Object.entries(sportsCount).map(([sport, count]) => ({
      sport,
      count,
    }))

    // Prepare pie chart data with colors
    const pieData = regionData.map((item, index) => ({
      region: item.region,
      count: item.count,
      fill: `var(--chart-${(index % 5) + 1})`,
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const result = {
      facilities,
      regionData,
      facilityTypeData,
      sportsData,
      pieData,
      summary: {
        totalFacilities,
        totalRegions,
        totalFacilityTypes,
        totalSports,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching facility dashboard data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch facility dashboard data" }, { status: 500 })
  }
}