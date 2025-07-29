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

// Region ID to KSARegion enum mapping
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

// Type definitions for better type safety
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface WhereClause {
  region?: KSARegion;
  facilityType?: {
    name: {
      in: string[];
    };
  };
  sports?: {
    some: {
      name: {
        in: string[];
      };
    };
  };
  locationType?: {
    in: string[];
  };
  ministryOfSports?: boolean;
}

interface RegionData {
  [key: string]: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionIdParam = searchParams.get("region") // This will be "SA-04"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // Get filter parameters
    const sports = searchParams.get("sports")?.split(",").filter(Boolean) || []
    const facilityTypes = searchParams.get("facilityTypes")?.split(",").filter(Boolean) || []
    const locationTypes = searchParams.get("locationTypes")?.split(",").filter(Boolean) || []
    const ministryOfSports = searchParams.get("ministryOfSports") === "true"

    let ksaRegion: KSARegion | undefined = undefined
    if (regionIdParam) {
      // Use the explicit mapping to convert SA-XX ID to KSARegion enum
      ksaRegion = regionIdToKsaRegionEnum[regionIdParam] as KSARegion
      if (!ksaRegion) {
        // If the SA-XX ID doesn't map to a known KSARegion enum value
        return NextResponse.json({ error: "Invalid region provided" }, { status: 400 })
      }
    }

    // Create cache key including all parameters
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
    const whereClause: WhereClause = {}

    // Region filter
    if (ksaRegion) {
      whereClause.region = ksaRegion
    }

    // Multiple facility types filter
    if (facilityTypes.length > 0) {
      whereClause.facilityType = {
        name: {
          in: facilityTypes,
        },
      }
    }

    // Sports filter
    if (sports.length > 0) {
      whereClause.sports = {
        some: {
          name: {
            in: sports,
          },
        },
      }
    }

    // Location type filter (if you have this field)
    if (locationTypes.length > 0) {
      whereClause.locationType = {
        in: locationTypes,
      }
    }

    // Ministry of Sports filter (if you have this field)
    if (ministryOfSports) {
      whereClause.ministryOfSports = true
    }

    // Execute all queries in parallel for better performance
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

      // Get facility types count using database aggregation
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

      // Get sports count using aggregation
      prisma.facility.findMany({
        where: whereClause,
        select: {
          sports: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Get region distribution
      prisma.facility.groupBy({
        by: ["region"],
        where: whereClause,
        _count: {
          id: true,
        },
      }),

      // Get total facilities count
      prisma.facility.count({
        where: whereClause,
      }),

      // Get average rating
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

      // Get total unique sports count
      prisma.sport.count(),

      // Get total regions count
      prisma.facility
        .groupBy({
          by: ["region"],
          where: whereClause,
        })
        .then((result) => result.length),
    ])

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

    // Process sports data efficiently
    const sportsData: Record<string, number> = {}
    sportsDataRaw.forEach((facility) => {
      if (facility.sports && facility.sports.length > 0) {
        facility.sports.forEach((sport) => {
          sportsData[sport.name] = (sportsData[sport.name] || 0) + 1
        })
      }
    })

    // Process region data
    const regionData: RegionData = {}
    regionDataRaw.forEach((item) => {
      if (item.region) {
        regionData[item.region] = item._count.id
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
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

// Helper function to clear cache when data is updated
export function clearDashboardDataCache() {
  cache.clear()
}

// Helper function to get cache stats for monitoring
export function getDashboardDataCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}