// lib/cache-utils.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache - shared across the application
const dashboardCache = new Map<string, CacheEntry<unknown>>()

// Helper function to clear cache when data is updated
export function clearDashboardDataCache() {
  dashboardCache.clear()
}

// Helper function to get cache stats for monitoring
export function getDashboardDataCacheStats() {
  return {
    size: dashboardCache.size,
    keys: Array.from(dashboardCache.keys()),
  }
}

// Export the cache instance for use in API routes
export { dashboardCache }