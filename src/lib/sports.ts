"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Sport Actions ---

export async function getSports() {
  try {
    const sports = await prisma.sport.findMany({
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

    return sports
  } catch (error) {
    console.error("Error fetching sports:", error)
    return []
  }
}

export async function getFacilityTypes() {
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

    return facilityTypes
  } catch (error) {
    console.error("Error fetching facility types:", error)
    return []
  }
}

export async function getSportsByFacilityType(facilityTypeId: string) {
  try {
    const sports = await prisma.sport.findMany({
      where: {
        facilityTypeId: facilityTypeId,
      },
      include: {
        facilityType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return sports
  } catch (error) {
    console.error("Error fetching sports by facility type:", error)
    return []
  }
}


export async function addSport(name: string, facilityTypeId: string) {
  try {
    const newSport = await prisma.sport.create({
      data: {
        name,
        facilityTypeId,
      },
      include: {
        facilityType: true, // Include facilityType for optimistic update
      },
    })
    revalidatePath("/")
    return { success: true, message: "Sport added successfully.", data: newSport }
  } catch (error: any) {
    console.error("Failed to add sport:", error)
    return { success: false, message: error.message || "Failed to add sport." }
  }
}

export async function updateSport(id: string, name: string, facilityTypeId: string) {
  try {
    const updatedSport = await prisma.sport.update({
      where: { id },
      data: {
        name,
        facilityTypeId,
      },
      include: {
        facilityType: true, // Include facilityType for optimistic update
      },
    })
    revalidatePath("/")
    return { success: true, message: "Sport updated successfully.", data: updatedSport }
  } catch (error: any) {
    console.error("Failed to update sport:", error)
    return { success: false, message: error.message || "Failed to update sport." }
  }
}

export async function deleteSport(id: string) {
  try {
    await prisma.sport.delete({
      where: { id },
    })
    revalidatePath("/")
    return { success: true, message: "Sport deleted successfully." }
  } catch (error: any) {
    console.error("Failed to delete sport:", error)
    return { success: false, message: error.message || "Failed to delete sport." }
  }
}

export async function deleteAllSports() {
  try {
    await prisma.sport.deleteMany({})
    revalidatePath("/")
    return { success: true, message: "All sports deleted successfully." }
  } catch (error: any) {
    console.error("Failed to delete all sports:", error)
    return { success: false, message: error.message || "Failed to delete all sports." }
  }
}

// --- Facility Type Actions ---
export async function addFacilityType(name: string) {
  try {
    const newFacilityType = await prisma.facilityType.create({
      data: {
        name,
      },
      include: {
        _count: {
          select: { sports: true },
        },
      },
    })
    revalidatePath("/")
    return { success: true, message: "Facility type added successfully.", data: newFacilityType }
  } catch (error: any) {
    console.error("Failed to add facility type:", error)
    return { success: false, message: error.message || "Failed to add facility type." }
  }
}

export async function updateFacilityType(id: string, name: string) {
  try {
    const updatedFacilityType = await prisma.facilityType.update({
      where: { id },
      data: {
        name,
      },
      include: {
        _count: {
          select: { sports: true },
        },
      },
    })
    revalidatePath("/")
    return { success: true, message: "Facility type updated successfully.", data: updatedFacilityType }
  } catch (error: any) {
    console.error("Failed to update facility type:", error)
    return { success: false, message: error.message || "Failed to update facility type." }
  }
}

export async function deleteFacilityType(id: string) {
  try {
    const connectedSports = await prisma.sport.count({
      where: { facilityTypeId: id },
    })

    if (connectedSports > 0) {
      return {
        success: false,
        message: `Cannot delete facility type. ${connectedSports} sport(s) are connected to it.`,
      }
    }

    await prisma.facilityType.delete({
      where: { id },
    })
    revalidatePath("/")
    return { success: true, message: "Facility type deleted successfully." }
  } catch (error: any) {
    console.error("Failed to delete facility type:", error)
    return { success: false, message: error.message || "Failed to delete facility type." }
  }
}

export async function deleteAllFacilityTypes() {
  try {
    const connectedSportsCount = await prisma.sport.count()
    if (connectedSportsCount > 0) {
      return {
        success: false,
        message: "Cannot delete all facility types. Some sports are still connected to facility types.",
      }
    }

    await prisma.facilityType.deleteMany({})
    revalidatePath("/")
    return { success: true, message: "All facility types deleted successfully." }
  } catch (error: any) {
    console.error("Failed to delete all facility types:", error)
    return { success: false, message: error.message || "Failed to delete all facility types." }
  }
}

