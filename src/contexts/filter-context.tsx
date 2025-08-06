// contexts/filter-context.tsx
"use client"
import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
interface FilterContextType {
  selectedSports: string[]
  selectedFacilityTypes: string[]
  selectedLocationTypes: string[] // For Urban/Rural
  selectedRegions: string[] // For actual regions
  ministryOfSports: boolean
  selectedRegionName: string | null 
  setSelectedSports: (sports: string[]) => void
  setSelectedFacilityTypes: (types: string[]) => void
  setSelectedLocationTypes: (types: string[]) => void
  setSelectedRegions: (regions: string[]) => void
  setMinistryOfSports: (value: boolean) => void
  setSelectedRegionName: (regionName: string | null) => void
  clearAllFilters: () => void
}
const FilterContext = createContext<FilterContextType | undefined>(undefined)
export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [ministryOfSports, setMinistryOfSports] = useState<boolean>(false)
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null)
  const clearAllFilters = useCallback(() => {
    setSelectedSports([])
    setSelectedFacilityTypes([])
    setSelectedLocationTypes([])
    setSelectedRegions([])
    setMinistryOfSports(false)
    setSelectedRegionName(null)
  }, [])
  const value = {
    selectedSports,
    selectedFacilityTypes,
    selectedLocationTypes,
    selectedRegions,
    ministryOfSports,
    selectedRegionName,
    setSelectedSports,
    setSelectedFacilityTypes,
    setSelectedLocationTypes,
    setSelectedRegions,
    setMinistryOfSports,
    setSelectedRegionName,
    clearAllFilters,
  }
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}
export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}