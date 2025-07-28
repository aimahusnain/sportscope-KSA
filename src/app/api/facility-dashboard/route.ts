import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

export async function GET() {
  try {
    // Fetch all facilities with their related data
    const facilities = await prisma.facility.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    // Process data for charts
    const regionData = facilities.reduce((acc: any[], facility) => {
      const regionName = REGION_DISPLAY_NAMES[facility.region] || facility.region
      const existing = acc.find((item) => item.region === regionName)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({
          region: regionName,
          count: 1,
        })
      }
      return acc
    }, [])

    const facilityTypeData = facilities.reduce((acc: any[], facility) => {
      if (facility.facilityType) {
        const existing = acc.find((item) => item.type === facility.facilityType!.name)
        if (existing) {
          existing.count += 1
        } else {
          acc.push({
            type: facility.facilityType.name,
            count: 1,
          })
        }
      }
      return acc
    }, [])

    // Process sports data (handle multiple sports per facility)
    const sportsCount: Record<string, number> = {}
    facilities.forEach((facility) => {
      facility.sports.forEach((sport) => {
        sportsCount[sport.name] = (sportsCount[sport.name] || 0) + 1
      })
    })

    const sportsData = Object.entries(sportsCount).map(([sport, count]) => ({
      sport,
      count,
    }))

    // Get unique counts
    const totalFacilities = facilities.length
    const totalRegions = regionData.length
    const totalFacilityTypes = facilityTypeData.length
    const totalSports = sportsData.length

    // Prepare pie chart data with colors
    const pieData = regionData.map((item, index) => ({
      region: item.region,
      count: item.count,
      fill: `var(--chart-${(index % 5) + 1})`,
    }))

    return NextResponse.json({
      success: true,
      data: {
        facilities,
        regionData,
        facilityTypeData,
        sportsData,
        pieData,
        summary: {
          totalFacilities,
          totalRegions,
          totalFacilityTypes,
          totalSports,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
