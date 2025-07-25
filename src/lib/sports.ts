import { prisma } from "@/lib/prisma"; // adjust path as needed

export const revalidate = 86400; // Cache for 1 day (in seconds)

export async function getSports() {
  const sports = await prisma.sport.findMany({
    orderBy: { name: "asc" },
  });
  return sports;
}

export async function getFacilityTypes() {
  const facilityTypes = await prisma.facilityType.findMany({
    orderBy: { name: "asc" },
  });
  return facilityTypes;
}