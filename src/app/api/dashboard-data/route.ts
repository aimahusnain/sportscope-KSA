import { NextResponse } from "next/server"
import { getDashboardData, regionIdToKsaRegionEnum } from "@/lib/dashboard-data"
import type { KSARegion } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionIdParam = searchParams.get("region") // This will be "SA-04"

    let ksaRegion: KSARegion | undefined = undefined

    if (regionIdParam) {
      // Use the explicit mapping to convert SA-XX ID to KSARegion enum
      ksaRegion = regionIdToKsaRegionEnum[regionIdParam]
      if (!ksaRegion) {
        // If the SA-XX ID doesn't map to a known KSARegion enum value
        return NextResponse.json({ error: "Invalid region provided" }, { status: 400 })
      }
    }

    // Pass the mapped KSARegion enum value to getDashboardData
    const data = await getDashboardData(ksaRegion)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
