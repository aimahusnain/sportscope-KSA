import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const facilityTypeId = searchParams.get("facilityTypeId")

    let whereClause = {}

    // If facilityTypeId is provided, filter by it, otherwise get all sports
    if (facilityTypeId) {
      whereClause = {
        facilityTypeId: facilityTypeId,
      }
    }

    const sports = await prisma.sport.findMany({
      where: whereClause,
      include: {
        facilityType: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            facilities: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(sports)
  } catch (error) {
    console.error("Error fetching sports:", error)
    return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, facilityTypeId } = body

    if (!name || !facilityTypeId) {
      return NextResponse.json({ error: "Name and facility type are required" }, { status: 400 })
    }

    // Check if sport already exists
    const existingSport = await prisma.sport.findFirst({
      where: {
        name: name,
        facilityTypeId: facilityTypeId,
      },
    })

    if (existingSport) {
      return NextResponse.json({ error: "Sport already exists for this facility type" }, { status: 400 })
    }

    const sport = await prisma.sport.create({
      data: {
        name,
        facilityTypeId,
        facilityIds: [], // Initialize with empty array
      },
      include: {
        facilityType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(sport, { status: 201 })
  } catch (error) {
    console.error("Error creating sport:", error)
    return NextResponse.json({ error: "Failed to create sport" }, { status: 500 })
  }
}
