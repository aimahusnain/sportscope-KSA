import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10000")
    const skip = (page - 1) * limit

    // Search and filter parameters
    const search = searchParams.get("search") || ""
    const region = searchParams.get("region")
    const facilityTypeId = searchParams.get("facilityTypeId")
    const sportIds = searchParams.get("sportIds")?.split(",").filter(Boolean) || []

    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build where clause
    const whereClause: any = {}

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { fullAddress: { contains: search, mode: "insensitive" } },
        { facilityType: { name: { contains: search, mode: "insensitive" } } },
        { sports: { some: { name: { contains: search, mode: "insensitive" } } } },
      ]
    }

    // Add region filter
    if (region) {
      whereClause.region = region
    }

    // Add facility type filter
    if (facilityTypeId) {
      whereClause.facilityTypeId = facilityTypeId
    }

    // Add sports filter
    if (sportIds.length > 0) {
      whereClause.sportIds = {
        hasSome: sportIds,
      }
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (sortBy === "facilityType") {
      orderBy.facilityType = { name: sortOrder }
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Execute queries in parallel for better performance
    const [facilities, totalCount] = await Promise.all([
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.facility.count({ where: whereClause }),
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      data: facilities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      meta: {
        search,
        region,
        facilityTypeId,
        sportIds,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    // Create the facility
    const facility = await prisma.facility.create({
      data: {
        name,
        facilityTypeId,
        region,
        country,
        fullAddress,
        rating: rating ? Number.parseFloat(rating) : null,
        reviewsNumber: reviewsNumber ? Number.parseInt(reviewsNumber) : null,
        detailedUrl: detailedUrl || null,
        sportIds: sportIds,
      },
    })

    // Update sports to include this facility
    if (sportIds.length > 0) {
      for (const sportId of sportIds) {
        const sport = await prisma.sport.findUnique({
          where: { id: sportId },
        })

        if (sport && !sport.facilityIds.includes(facility.id)) {
          await prisma.sport.update({
            where: { id: sportId },
            data: {
              facilityIds: [...sport.facilityIds, facility.id],
            },
          })
        }
      }
    }

    // Fetch the created facility with relations
    const createdFacility = await prisma.facility.findUnique({
      where: { id: facility.id },
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

    return NextResponse.json(createdFacility, { status: 201 })
  } catch (error) {
    console.error("Error creating facility:", error)
    return NextResponse.json({ error: "Failed to create facility" }, { status: 500 })
  }
}
