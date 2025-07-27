"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface FilterContextType {
  selectedSports: string[]
  selectedFacilityTypes: string[]
  selectedLocationTypes: string[]
  ministryOfSports: boolean
  setSelectedSports: (sports: string[]) => void
  setSelectedFacilityTypes: (types: string[]) => void
  setSelectedLocationTypes: (types: string[]) => void
  setMinistryOfSports: (value: boolean) => void
  clearAllFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [ministryOfSports, setMinistryOfSports] = useState(false)

  const clearAllFilters = () => {
    setSelectedSports([])
    setSelectedFacilityTypes([])
    setSelectedLocationTypes([])
    setMinistryOfSports(false)
  }

  return (
    <FilterContext.Provider
      value={{
        selectedSports,
        selectedFacilityTypes,
        selectedLocationTypes,
        ministryOfSports,
        setSelectedSports,
        setSelectedFacilityTypes,
        setSelectedLocationTypes,
        setMinistryOfSports,
        clearAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}