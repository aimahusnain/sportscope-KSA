import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { KSARegion } from "@prisma/client"

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

const regionIdToKsaRegionEnum: Record<string, KSARegion> = {
  "SA-01": "RIYADH",
  "SA-02": "MAKKAH",
  "SA-04": "EASTERN_PROVINCE",
  "SA-13": "ASIR",
  "SA-07": "TABUK",
  "SA-05": "QASSIM",
  "SA-06": "HAIL",
  "SA-08": "NORTHERN_BORDERS",
  "SA-09": "JAZAN",
  "SA-10": "NAJRAN",
  "SA-11": "AL_BAHAH",
  "SA-12": "AL_JOUF",
  "SA-03": "MADINAH",
}

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionIdParam = searchParams.get("region")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // Parse array parameters correctly
    const sports = searchParams.getAll("sports").filter(Boolean)
    const facilityTypes = searchParams.getAll("facilityTypes").filter(Boolean)
    const locationTypes = searchParams.getAll("locationTypes").filter(Boolean)
    const ministryOfSports = searchParams.get("ministryOfSports") === "true"

    console.log("🔍 Filtering by:", {
      selectedSports: sports.length > 0 ? sports : "All sports",
      selectedFacilityTypes: facilityTypes.length > 0 ? facilityTypes : "All facility types",
      selectedLocationTypes: locationTypes.length > 0 ? locationTypes : "All location types",
      ministryOfSports: ministryOfSports ? "Yes" : "No",
    })

    let ksaRegion: KSARegion | undefined = undefined
    if (regionIdParam) {
      ksaRegion = regionIdToKsaRegionEnum[regionIdParam] as KSARegion
      if (!ksaRegion) {
        return NextResponse.json({ error: "Invalid region provided" }, { status: 400 })
      }
    }

    const cacheKey = `dashboard-data-${ksaRegion || "all"}-${page}-${limit}-${sports.join(",")}-${facilityTypes.join(",")}-${locationTypes.join(",")}-${ministryOfSports}`

    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      })
    }

    // Build where clause for filtering
    const whereClause: any = {}

    // Region filter
    if (ksaRegion) {
      whereClause.region = ksaRegion
    }

    // Facility types filter - find facilities with ANY of these facility types
    if (facilityTypes.length > 0) {
      whereClause.facilityType = {
        name: {
          in: facilityTypes,
        },
      }
    }

    // Sports filter - CORRECTED for MongoDB many-to-many relationship
    // We need to find facilities where ANY of their connected sports match the selected sports
    if (sports.length > 0) {
      // First, get the sport IDs that match the selected sport names
      const matchingSports = await prisma.sport.findMany({
        where: {
          name: {
            in: sports, // Find sports with names in our selected array
          },
        },
        select: {
          id: true,
          name: true,
        },
      })

      console.log("🏃 Found matching sports:", matchingSports)

      if (matchingSports.length > 0) {
        const sportIds = matchingSports.map((sport) => sport.id)

        // Now find facilities that have ANY of these sport IDs in their sportIds array
        whereClause.sportIds = {
          hasSome: sportIds, // MongoDB array operator - facility's sportIds array contains any of these IDs
        }
      } else {
        // If no matching sports found, return empty results
        whereClause.id = "non-existent-id" // This will return no results
      }
    }

    // Location type filter
    if (locationTypes.length > 0) {
      whereClause.locationType = {
        in: locationTypes,
      }
    }

    // Ministry of Sports filter
    if (ministryOfSports) {
      whereClause.ministryOfSports = true
    }

    console.log("🔎 Prisma where clause:", JSON.stringify(whereClause, null, 2))

    // Execute all queries in parallel
    const [
      facilities,
      facilityTypesDataRaw,
      sportsDataRaw,
      regionDataRaw,
      totalFacilities,
      averageRatingResult,
      totalSports,
      totalRegions,
    ] = await Promise.all([
      // Get paginated facilities with their relations
      prisma.facility.findMany({
        where: whereClause,
        include: {
          facilityType: {
            select: {
              name: true,
            },
          },
          sports: {
            select: {
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

      // Get facility types count from filtered results
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

      // Get all facilities with their sports for counting (filtered)
      prisma.facility.findMany({
        where: whereClause,
        select: {
          id: true,
          sports: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Get region distribution from filtered results
      prisma.facility.groupBy({
        by: ["region"],
        where: whereClause,
        _count: {
          id: true,
        },
      }),

      // Total count of filtered facilities
      prisma.facility.count({
        where: whereClause,
      }),

      // Average rating of filtered facilities
      prisma.facility.aggregate({
        where: {
          ...whereClause,
          rating: {
            not: null,
          },
        },
        _avg: {
          rating: true,
        },
      }),

      // Total unique sports count (overall)
      prisma.sport.count(),

      // Total regions count from filtered results
      prisma.facility
        .groupBy({
          by: ["region"],
          where: whereClause,
        })
        .then((result) => result.length),
    ])

    console.log(`📊 Found ${totalFacilities} facilities matching the criteria`)
    console.log(`📄 Returning page ${page} with ${facilities.length} facilities`)

    // Process facility types data
    const facilityTypesData: Record<string, number> = {}
    for (const item of facilityTypesDataRaw) {
      if (item.facilityTypeId) {
        const facilityType = await prisma.facilityType.findUnique({
          where: { id: item.facilityTypeId },
          select: { name: true },
        })
        if (facilityType) {
          facilityTypesData[facilityType.name] = item._count.id
        }
      }
    }

    // Process sports data - count how many facilities have each sport
    const sportsData: Record<string, number> = {}
    sportsDataRaw.forEach((facility) => {
      if (facility.sports && facility.sports.length > 0) {
        facility.sports.forEach((sport) => {
          sportsData[sport.name] = (sportsData[sport.name] || 0) + 1
        })
      }
    })

    // Process region data
    const regionData: Record<string, number> = {}
    regionDataRaw.forEach((item) => {
      if (item.region) {
        const displayName = REGION_DISPLAY_NAMES[item.region] || item.region
        regionData[displayName] = item._count.id
      }
    })

    // Get top sports by facility count
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

    // Calculate pagination info
    const totalPages = Math.ceil(totalFacilities / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Log some example facilities for debugging
    if (facilities.length > 0) {
      console.log("🏟️ Example facilities found:")
      facilities.slice(0, 3).forEach((facility, index) => {
        console.log(`  ${index + 1}. ${facility.name}`)
        console.log(`     Sports: ${facility.sports.map((s) => s.name).join(", ")}`)
        console.log(`     Sport IDs: ${facility.sportIds.join(", ")}`)
        console.log(`     Type: ${facility.facilityType?.name || "Unknown"}`)
        console.log(`     Region: ${REGION_DISPLAY_NAMES[facility.region] || facility.region}`)
      })
    }

    const result = {
      facilityTypes: facilityTypesData,
      sports: sportsData,
      regions: regionData,
      topSports: topSportsData,
      stats: {
        totalFacilities,
        totalSports,
        totalRegions,
        averageRating: Math.round((averageRatingResult._avg.rating || 0) * 10) / 10,
      },
      facilities: facilities.map((facility) => ({
        id: facility.id,
        name: facility.name,
        region: REGION_DISPLAY_NAMES[facility.region] || facility.region,
        facilityType: facility.facilityType?.name || "Unknown",
        sports: facility.sports.map((sport) => sport.name),
        rating: facility.rating,
        createdAt: facility.createdAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalFacilities,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      debug: {
        appliedFilters: {
          sports: sports.length > 0 ? sports : null,
          facilityTypes: facilityTypes.length > 0 ? facilityTypes : null,
          locationTypes: locationTypes.length > 0 ? locationTypes : null,
          ministryOfSports: ministryOfSports || null,
          region: ksaRegion || null,
        },
        queryExplanation: {
          sportsLogic:
            sports.length > 0
              ? `Finding facilities where their sportIds array contains ANY of the IDs for: [${sports.join(", ")}]`
              : "No sports filter applied",
          facilityTypesLogic:
            facilityTypes.length > 0
              ? `Finding facilities with type: [${facilityTypes.join(", ")}]`
              : "No facility types filter applied",
          totalMatches: totalFacilities,
        },
      },
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

export function clearDashboardDataCache() {
  cache.clear()
}

export function getDashboardDataCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}
