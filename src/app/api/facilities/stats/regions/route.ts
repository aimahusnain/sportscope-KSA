import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { KSARegion } from "@prisma/client" // Import the enum from Prisma client

// Helper to map string region names to KSARegion enum values
function mapRegionToKsaRegion(region: string): KSARegion | undefined {
  const normalizedRegion = region.toUpperCase().replace(/ /g, "_").replace(/-/g, "_")
  if (Object.values(KSARegion).includes(normalizedRegion as KSARegion)) {
    return normalizedRegion as KSARegion
  }
  return undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sportsParam = searchParams.get("sports")
    const facilityTypesParam = searchParams.get("facilityTypes")
    const locationTypesParam = searchParams.get("locationTypes")
    const ministryOfSportsParam = searchParams.get("ministryOfSports")

    const whereClause: {
      sportIds?: { hasSome: string[] }
      facilityTypeId?: { in: string[] }
      region?: { in: KSARegion[] }
      isMinistryOfSports?: boolean
    } = {}

    // 1. Filter by Sports
    if (sportsParam) {
      const selectedSportNames = sportsParam.split(",").map((s) => s.trim())
      if (selectedSportNames.length > 0) {
        const sports = await prisma.sport.findMany({
          where: {
            name: {
              in: selectedSportNames,
            },
          },
          select: { id: true },
        })
        const sportIds = sports.map((s) => s.id)
        if (sportIds.length > 0) {
          whereClause.sportIds = {
            hasSome: sportIds,
          }
        } else {
          // If no sports found for the given names, return no facilities
          return NextResponse.json({ facilityData: {}, totalFacilities: 0, regionCounts: [] })
        }
      }
    }

    // 2. Filter by Facility Types
    if (facilityTypesParam) {
      const selectedFacilityTypeNames = facilityTypesParam.split(",").map((t) => t.trim())
      if (selectedFacilityTypeNames.length > 0) {
        const facilityTypes = await prisma.facilityType.findMany({
          where: {
            name: {
              in: selectedFacilityTypeNames,
            },
          },
          select: { id: true },
        })
        const facilityTypeIds = facilityTypes.map((ft) => ft.id)
        if (facilityTypeIds.length > 0) {
          whereClause.facilityTypeId = {
            in: facilityTypeIds,
          }
        } else {
          // If no facility types found for the given names, return no facilities
          return NextResponse.json({ facilityData: {}, totalFacilities: 0, regionCounts: [] })
        }
      }
    }

    // 3. Filter by Location Types (assuming this maps to regions for now)
    // NOTE: Your frontend `locationTypes` are "Urban" and "Rural", which don't directly map
    // to KSARegion enum values. If you intend to filter by specific regions,
    // the frontend should send region names (e.g., "Riyadh", "Makkah").
    // For demonstration, if `locationTypes` were actual region names, you'd do:
    if (locationTypesParam) {
      const selectedRegionNames = locationTypesParam.split(",").map((r) => r.trim())
      const ksaRegions = selectedRegionNames
        .map((name) => mapRegionToKsaRegion(name))
        .filter((r): r is KSARegion => r !== undefined)

      if (ksaRegions.length > 0) {
        whereClause.region = {
          in: ksaRegions,
        }
      } else {
        // If no valid regions found, return no facilities
        // Or handle as an error if strict validation is needed
      }
    }

    // 4. Filter by Ministry of Sports (assuming a boolean field `isMinistryOfSports` on Facility model)
    // You might need to add `isMinistryOfSports: Boolean?` to your Facility model in schema.prisma
    if (ministryOfSportsParam === "true") {
      whereClause.isMinistryOfSports = true
    }

    const facilities = await prisma.facility.findMany({
      where: whereClause,
      select: {
        id: true,
        region: true,
      },
    })

    const facilityData: Record<string, number> = {}
    let totalFacilities = 0

    facilities.forEach((facility) => {
      const regionIndex = Object.keys(KSARegion).indexOf(facility.region) + 1
      // FIX: Ensure two-digit format for region ID (e.g., SA-01, SA-05)
      const regionId = `SA-${regionIndex.toString().padStart(2, "0")}`
      facilityData[regionId] = (facilityData[regionId] || 0) + 1
      totalFacilities++
    })

    // Prepare regionCounts for the frontend if needed (though map uses facilityData directly)
    const regionCounts = Object.entries(facilityData).map(([mapId, count]) => ({
      region: mapId, // This is the map ID like "SA-01"
      count: count,
      mapId: mapId,
    }))

    return NextResponse.json({
      facilityData,
      totalFacilities,
      regionCounts,
      appliedFilters: {
        sports: sportsParam ? sportsParam.split(",") : [],
        facilityTypes: facilityTypesParam ? facilityTypesParam.split(",") : [],
        locationTypes: locationTypesParam ? locationTypesParam.split(",") : [],
        ministryOfSports: ministryOfSportsParam === "true",
      },
    })
  } catch (error) {
    console.error("Error fetching region stats:", error)
    return NextResponse.json({ error: "Failed to fetch region statistics" }, { status: 500 })
  }
}
