interface DashboardStats {
  totalFacilities: number
  totalSports: number
  totalRegions: number
  averageRating: number
}

interface FacilityResponse {
  id: string
  name: string
  region: string
  facilityType: string
  sports: string[]
  rating: number | null
  createdAt: Date
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface DebugInfo {
  appliedFilters: {
    sports: string[] | null
    facilityTypes: string[] | null
    locationTypes: string[] | null
    ministryOfSports: boolean | null
    region: string | null
  }
  queryExplanation: {
    sportsLogic: string
    facilityTypesLogic: string
    totalMatches: number
  }
}

export interface DashboardResponse {
  facilityTypes: Record<string, number>
  sports: Record<string, number>
  regions: Record<string, number>
  topSports: Record<string, number>
  stats: DashboardStats
  facilities: FacilityResponse[]
  pagination: PaginationInfo
  debug: DebugInfo
}

export interface CacheEntry {
  data: DashboardResponse
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
export const CACHE_DURATION = 5 * 60 * 1000

export function getCache(): Map<string, CacheEntry> {
  return cache
}

export function clearDashboardDataCache(): void {
  cache.clear()
}

export function getDashboardDataCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}
