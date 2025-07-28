import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
    try {
        const deleteResult = await prisma.facility.deleteMany({})

        return NextResponse.json({
            message: `Successfully deleted ${deleteResult.count} facilities`,
            deletedCount: deleteResult.count,
        })
    } catch (error) {
        console.error("Error deleting all facilities:", error)
        return NextResponse.json({ error: "Failed to delete all facilities" }, { status: 500 })
    }
}
