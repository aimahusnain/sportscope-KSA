"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

interface FilterContextType {
  selectedSports: string[]
  selectedFacilityTypes: string[]
  selectedLocationTypes: string[] // Assuming this is for regions or a conceptual location type
  ministryOfSports: boolean
  selectedRegionName: string | null // New: for map region selection
  setSelectedSports: (sports: string[]) => void
  setSelectedFacilityTypes: (types: string[]) => void
  setSelectedLocationTypes: (types: string[]) => void
  setMinistryOfSports: (value: boolean) => void
  setSelectedRegionName: (regionName: string | null) => void // New: setter for selected region
  clearAllFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [ministryOfSports, setMinistryOfSports] = useState<boolean>(false)
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null) // New state

  const clearAllFilters = useCallback(() => {
    setSelectedSports([])
    setSelectedFacilityTypes([])
    setSelectedLocationTypes([])
    setMinistryOfSports(false)
    setSelectedRegionName(null) // Clear selected region
  }, [])

  const value = {
    selectedSports,
    selectedFacilityTypes,
    selectedLocationTypes,
    ministryOfSports,
    selectedRegionName, // Add to value
    setSelectedSports,
    setSelectedFacilityTypes,
    setSelectedLocationTypes,
    setMinistryOfSports,
    setSelectedRegionName, // Add to value
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
