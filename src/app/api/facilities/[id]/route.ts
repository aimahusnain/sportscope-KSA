import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const facility = await prisma.facility.findUnique({
      where: { id: params.id },
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
    })
    
    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }
    
    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error fetching facility:", error)
    return NextResponse.json({ error: "Failed to fetch facility" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const body = await request.json()
    const {
      name,
      facilityTypeId,
      region,
      country,
      fullAddress,
      rating,
      reviewsNumber,
      detailedUrl,
      sportIds = [],
    } = body

    // Validate required fields
    if (!name || !facilityTypeId || !region || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if facility exists
    const existingFacility = await prisma.facility.findUnique({
      where: { id: params.id },
      include: { sports: true },
    })

    if (!existingFacility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    // Verify facility type exists
    const facilityType = await prisma.facilityType.findUnique({
      where: { id: facilityTypeId },
    })

    if (!facilityType) {
      return NextResponse.json({ error: "Invalid facility type" }, { status: 400 })
    }

    // Verify sports exist if provided
    if (sportIds.length > 0) {
      const existingSports = await prisma.sport.findMany({
        where: { id: { in: sportIds } },
      })

      if (existingSports.length !== sportIds.length) {
        return NextResponse.json({ error: "One or more invalid sport IDs" }, { status: 400 })
      }
    }

    // Get old sport IDs to update relationships
    const oldSportIds = existingFacility.sports.map((sport) => sport.id)

    // Update the facility with new sports relationship
    const facility = await prisma.facility.update({
      where: { id: params.id },
      data: {
        name,
        facilityTypeId,
        region,
        country,
        fullAddress,
        rating: rating ? Number.parseFloat(rating) : null,
        reviewsNumber: reviewsNumber ? Number.parseInt(reviewsNumber) : null,
        detailedUrl: detailedUrl || null,
        sportIds: sportIds, // Update the sportIds array directly
      },
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
    })

    // Update sport relationships - Remove facility from old sports
    const sportsToRemove = oldSportIds.filter((id) => !sportIds.includes(id))
    if (sportsToRemove.length > 0) {
      for (const sportId of sportsToRemove) {
        const sport = await prisma.sport.findUnique({
          where: { id: sportId },
        })
        if (sport) {
          const updatedFacilityIds = sport.facilityIds.filter((id) => id !== params.id)
          await prisma.sport.update({
            where: { id: sportId },
            data: {
              facilityIds: updatedFacilityIds,
            },
          })
        }
      }
    }

    // Add facility to new sports
    const sportsToAdd = sportIds.filter((id: string) => !oldSportIds.includes(id))
    if (sportsToAdd.length > 0) {
      for (const sportId of sportsToAdd) {
        const sport = await prisma.sport.findUnique({
          where: { id: sportId },
        })
        if (sport && !sport.facilityIds.includes(params.id)) {
          await prisma.sport.update({
            where: { id: sportId },
            data: {
              facilityIds: [...sport.facilityIds, params.id],
            },
          })
        }
      }
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error updating facility:", error)
    return NextResponse.json({ error: "Failed to update facility" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    
    // Check if facility exists and get its sports
    const existingFacility = await prisma.facility.findUnique({
      where: { id: params.id },
      include: { sports: true },
    })

    if (!existingFacility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    // Remove facility from all connected sports
    if (existingFacility.sports && existingFacility.sports.length > 0) {
      for (const sport of existingFacility.sports) {
        const currentSport = await prisma.sport.findUnique({
          where: { id: sport.id },
        })
        if (currentSport) {
          const updatedFacilityIds = currentSport.facilityIds.filter((id) => id !== params.id)
          await prisma.sport.update({
            where: { id: sport.id },
            data: {
              facilityIds: updatedFacilityIds,
            },
          })
        }
      }
    }

    await prisma.facility.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Facility deleted successfully" })
  } catch (error) {
    console.error("Error deleting facility:", error)
    return NextResponse.json({ error: "Failed to delete facility" }, { status: 500 })
  }
}