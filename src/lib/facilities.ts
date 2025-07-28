import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface Facility {
  id: string
  name: string
  facilityTypeId: string
  facilityType?: {
    id: string
    name: string
  }
  region: string
  country: string
  fullAddress: string
  rating?: number
  reviewsNumber?: number
  detailedUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateFacilityData {
  name: string
  facilityTypeId: string
  region: string
  country: string
  fullAddress: string
  rating?: number
  reviewsNumber?: number
  detailedUrl?: string
}

export interface UpdateFacilityData extends CreateFacilityData {
  id: string
}

// Get all facilities with facility type information
export async function getFacilities() {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        facilityType: {
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
    return { success: true, data: facilities, message: "Facilities fetched successfully" }
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return { success: false, data: [], message: "Failed to fetch facilities" }
  }
}

// Add a new facility
export async function addFacility(facilityData: CreateFacilityData) {
  try {
    const facility = await prisma.facility.create({
      data: {
        name: facilityData.name,
        facilityTypeId: facilityData.facilityTypeId,
        region: facilityData.region as any, // Cast to enum
        country: facilityData.country,
        fullAddress: facilityData.fullAddress,
        rating: facilityData.rating,
        reviewsNumber: facilityData.reviewsNumber,
        detailedUrl: facilityData.detailedUrl,
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
    return { success: true, data: facility, message: "Facility added successfully" }
  } catch (error) {
    console.error("Error adding facility:", error)
    return { success: false, data: null, message: "Failed to add facility" }
  }
}

// Update a facility
export async function updateFacility(facilityData: UpdateFacilityData) {
  try {
    const facility = await prisma.facility.update({
      where: { id: facilityData.id },
      data: {
        name: facilityData.name,
        facilityTypeId: facilityData.facilityTypeId,
        region: facilityData.region as any, // Cast to enum
        country: facilityData.country,
        fullAddress: facilityData.fullAddress,
        rating: facilityData.rating,
        reviewsNumber: facilityData.reviewsNumber,
        detailedUrl: facilityData.detailedUrl,
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
    return { success: true, data: facility, message: "Facility updated successfully" }
  } catch (error) {
    console.error("Error updating facility:", error)
    return { success: false, data: null, message: "Failed to update facility" }
  }
}

// Delete a facility
export async function deleteFacility(id: string) {
  try {
    await prisma.facility.delete({
      where: { id },
    })
    return { success: true, message: "Facility deleted successfully" }
  } catch (error) {
    console.error("Error deleting facility:", error)
    return { success: false, message: "Failed to delete facility" }
  }
}

// Delete all facilities
export async function deleteAllFacilities() {
  try {
    await prisma.facility.deleteMany({})
    return { success: true, message: "All facilities deleted successfully" }
  } catch (error) {
    console.error("Error deleting all facilities:", error)
    return { success: false, message: "Failed to delete all facilities" }
  }
}

// KSA Regions enum values
export const KSA_REGIONS = [
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
] as const

// Helper function to format region names for display
export function formatRegionName(region: string): string {
  return region
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
