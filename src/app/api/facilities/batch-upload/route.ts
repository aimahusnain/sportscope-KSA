import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface CSVFacility {
  facilityName: string
  facilityType: string
  region: string
  country: string
  fullAddress: string
  rating?: string
  reviewsNumber?: string
  detailedUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const { facilities }: { facilities: CSVFacility[] } = await request.json()

    if (!facilities || !Array.isArray(facilities)) {
      return NextResponse.json({ error: "Invalid facilities data" }, { status: 400 })
    }

    // Get all facility types to resolve names to IDs
    const facilityTypes = await prisma.facilityType.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    const facilityTypeMap = new Map(facilityTypes.map((ft) => [ft.name.toLowerCase(), ft.id]))

    let successful = 0
    let failed = 0
    const errors: string[] = []

    // Process each facility
    for (const facility of facilities) {
      try {
        // Find facility type ID
        const facilityTypeId = facilityTypeMap.get(facility.facilityType.toLowerCase())

        if (!facilityTypeId) {
          // Try to create the facility type if it doesn't exist
          try {
            const newFacilityType = await prisma.facilityType.create({
              data: {
                name: facility.facilityType,
              },
            })
            facilityTypeMap.set(facility.facilityType.toLowerCase(), newFacilityType.id)
          } catch (createError: any) {
            if (createError.code === "P2002") {
              // Facility type was created by another request, fetch it
              const existingType = await prisma.facilityType.findUnique({
                where: { name: facility.facilityType },
              })
              if (existingType) {
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

        const resolvedFacilityTypeId = facilityTypeMap.get(facility.facilityType.toLowerCase())

        if (!resolvedFacilityTypeId) {
          errors.push(
            `Could not resolve facility type "${facility.facilityType}" for facility "${facility.facilityName}"`,
          )
          failed++
          continue
        }

        // Create the facility
        await prisma.facility.create({
          data: {
            name: facility.facilityName,
            facilityTypeId: resolvedFacilityTypeId,
            region: facility.region as any, // TypeScript will validate this against the enum
            country: facility.country,
            fullAddress: facility.fullAddress,
            rating: facility.rating ? Number.parseFloat(facility.rating) : null,
            reviewsNumber: facility.reviewsNumber ? Number.parseInt(facility.reviewsNumber) : null,
            detailedUrl: facility.detailedUrl || null,
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
