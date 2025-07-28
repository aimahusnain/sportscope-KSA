import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CSVRow } from "@/types/facility" // Import CSVRow from the shared types

// Add this helper function at the top of the file, before the POST function
// It maps string region names to the KSARegion enum values.
function mapRegionToKsaRegion(region: string): string | undefined {
  const normalizedRegion = region.toUpperCase().replace(/ /g, "_").replace(/-/g, "_")
  const validRegions = [
    "RIYADH",
    "MAKKAH",
    "MADINAH",
    "EASTERN_PROVINCE",
    "ASIR",
    "TABUK",
    "QASSIM",
    "HAIL",
    "NORTHERN_BORDERS",
    "JAZAN",
    "NAJRAN",
    "AL_BAHAH",
    "AL_JOUF",
  ]
  if (validRegions.includes(normalizedRegion)) {
    return normalizedRegion
  }
  return undefined // Or throw an error if you want strict validation
}

export async function POST(request: NextRequest) {
  try {
    const { facilities }: { facilities: CSVRow[] } = await request.json()
    if (!facilities || !Array.isArray(facilities)) {
      return NextResponse.json({ error: "Invalid facilities data" }, { status: 400 })
    }

    const facilityTypes = await prisma.facilityType.findMany({
      select: { id: true, name: true },
    })
    const facilityTypeMap = new Map(facilityTypes.map((ft) => [ft.name.toLowerCase(), ft.id]))

    // Fetch all existing sports to avoid re-fetching in loop and for mapping
    const existingSports = await prisma.sport.findMany({
      select: { id: true, name: true },
    })
    const sportMap = new Map(existingSports.map((s) => [s.name.toLowerCase(), s.id]))

    let successful = 0
    let failed = 0
    const errors: string[] = []

    for (const facility of facilities) {
      try {
        let resolvedFacilityTypeId = facilityTypeMap.get(facility.facilityType.toLowerCase())
        if (!resolvedFacilityTypeId) {
          try {
            const newFacilityType = await prisma.facilityType.create({
              data: { name: facility.facilityType },
            })
            resolvedFacilityTypeId = newFacilityType.id
            facilityTypeMap.set(facility.facilityType.toLowerCase(), newFacilityType.id)
          } catch (createError: any) {
            if (createError.code === "P2002") {
              const existingType = await prisma.facilityType.findUnique({
                where: { name: facility.facilityType },
              })
              if (existingType) {
                resolvedFacilityTypeId = existingType.id
                facilityTypeMap.set(facility.facilityType.toLowerCase(), existingType.id)
              }
            } else {
              errors.push(
                `Failed to create facility type "${facility.facilityType}" for facility "${facility.facilityName}"`,
              )
              failed++
              continue
            }
          }
        }

        if (!resolvedFacilityTypeId) {
          errors.push(
            `Could not resolve facility type "${facility.facilityType}" for facility "${facility.facilityName}"`,
          )
          failed++
          continue
        }

        // Handle sports
        const sportIds: string[] = []
        if (facility.sports) {
          const sportNames = facility.sports
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
          for (const sportName of sportNames) {
            let resolvedSportId = sportMap.get(sportName.toLowerCase())
            if (!resolvedSportId) {
              try {
                const newSport = await prisma.sport.create({
                  data: {
                    name: sportName,
                    facilityTypeId: resolvedFacilityTypeId, // Associate with the facility's type
                  },
                })
                resolvedSportId = newSport.id
                sportMap.set(sportName.toLowerCase(), newSport.id)
              } catch (createError: any) {
                if (createError.code === "P2002") {
                  const existingSport = await prisma.sport.findUnique({
                    where: { name: sportName },
                  })
                  if (existingSport) {
                    resolvedSportId = existingSport.id
                    sportMap.set(sportName.toLowerCase(), existingSport.id)
                  }
                } else {
                  errors.push(`Failed to create sport "${sportName}" for facility "${facility.facilityName}"`)
                  continue // Skip this sport but try to create facility
                }
              }
            }
            if (resolvedSportId) {
              sportIds.push(resolvedSportId)
            }
          }
        }

        await prisma.facility.create({
          data: {
            name: facility.facilityName,
            facilityTypeId: resolvedFacilityTypeId,
            region: mapRegionToKsaRegion(facility.region) as any, // Ensure it's a valid enum value
            country: facility.country,
            fullAddress: facility.fullAddress,
            rating: facility.rating ? Number.parseFloat(facility.rating) : null,
            reviewsNumber: facility.reviewsNumber ? Number.parseInt(facility.reviewsNumber) : null,
            detailedUrl: facility.detailedUrl || null,
            sportIds: sportIds, // Assign the collected sport IDs
          },
        })
        successful++
      } catch (error: any) {
        console.error(`Error creating facility "${facility.facilityName}":`, error)
        if (error.code === "P2002") {
          errors.push(`Facility "${facility.facilityName}" already exists`)
        } else {
          errors.push(`Failed to create facility "${facility.facilityName}": ${error.message}`)
        }
        failed++
      }
    }
    return NextResponse.json({
      message: `Batch processed: ${successful} successful, ${failed} failed`,
      successful,
      failed,
      errors: errors.slice(0, 10), // Return first 10 errors
    })
  } catch (error) {
    console.error("Batch upload error:", error)
    return NextResponse.json({ error: "Failed to process batch" }, { status: 500 })
  }
}
