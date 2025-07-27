import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Mapping from database enum values to map region IDs
const REGION_TO_MAP_ID: Record<string, string> = {
  RIYADH: "SA-01",
  MAKKAH: "SA-02",
  EASTERN_PROVINCE: "SA-03",
  ASIR: "SA-04",
  QASSIM: "SA-05",
  HAIL: "SA-06",
  TABUK: "SA-07",
  NORTHERN_BORDERS: "SA-08",
  JAZAN: "SA-09",
  NAJRAN: "SA-10",
  AL_BAHAH: "SA-11",
  AL_JOUF: "SA-12",
  MADINAH: "SA-13",
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filter parameters
    const sportsFilter = searchParams.get("sports")?.split(",").filter(Boolean) || []
    const facilityTypesFilter = searchParams.get("facilityTypes")?.split(",").filter(Boolean) || []
    const locationTypesFilter = searchParams.get("locationTypes")?.split(",").filter(Boolean) || []
    const ministryOfSports = searchParams.get("ministryOfSports") === "true"

    // Build the where clause based on filters
    const whereClause: any = {}

    // Add facility type filter
    if (facilityTypesFilter.length > 0) {
      whereClause.facilityType = {
        name: {
          in: facilityTypesFilter,
        },
      }
    }

    // Add sports filter (through facility type relationship)
    if (sportsFilter.length > 0) {
      whereClause.facilityType = {
        ...whereClause.facilityType,
        sports: {
          some: {
            name: {
              in: sportsFilter,
            },
          },
        },
      }
    }

    // Note: Location types (Urban/Rural) and Ministry of Sports filters
    // would need additional fields in your Facility model to implement
    // For now, we'll skip these filters but you can add them later

    // Get facility counts grouped by region with filters applied
    const regionCounts = await prisma.facility.groupBy({
      by: ["region"],
      where: whereClause,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    })

    // Transform the data to match the map format
    const facilityData: Record<string, number> = {}

    // Initialize all regions with 0
    Object.values(REGION_TO_MAP_ID).forEach((mapId) => {
      facilityData[mapId] = 0
    })

    // Fill in actual counts
    regionCounts.forEach(({ region, _count }) => {
      const mapId = REGION_TO_MAP_ID[region]
      if (mapId) {
        facilityData[mapId] = _count.id
      }
    })

    // Calculate total
    const totalFacilities = regionCounts.reduce((sum, { _count }) => sum + _count.id, 0)

    return NextResponse.json({
      facilityData,
      totalFacilities,
      regionCounts: regionCounts.map(({ region, _count }) => ({
        region,
        count: _count.id,
        mapId: REGION_TO_MAP_ID[region],
      })),
      appliedFilters: {
        sports: sportsFilter,
        facilityTypes: facilityTypesFilter,
        locationTypes: locationTypesFilter,
        ministryOfSports,
      },
    })
  } catch (error) {
    console.error("Error fetching region statistics:", error)
    return NextResponse.json({ error: "Failed to fetch region statistics" }, { status: 500 })
  }
}
