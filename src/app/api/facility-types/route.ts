import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const facilityTypes = await prisma.facilityType.findMany({
      include: {
        _count: {
          select: {
            sports: true,
            facilities: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(facilityTypes)
  } catch (error) {
    console.error("Error fetching facility types:", error)
    return NextResponse.json({ error: "Failed to fetch facility types" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Facility type name is required" }, { status: 400 })
    }

    const facilityType = await prisma.facilityType.create({
      data: {
        name: name.trim(),
      },
      include: {
        _count: {
          select: {
            sports: true,
            facilities: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Facility type created successfully",
      data: facilityType,
    })
    } catch (error) {
    // error is unknown, so we can use type narrowing if needed
    console.error("Error creating facility type:", error)

    if (typeof error === "object" && error !== null && "code" in error && (error as any).code === "P2002") {
      return NextResponse.json({ error: "Facility type with this name already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create facility type" }, { status: 500 })
  }
}
