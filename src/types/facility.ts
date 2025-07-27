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

export interface FacilityType {
  id: string
  name: string
  _count?: {
    sports: number
    facilities: number
  }
}

export interface CSVRow {
  facilityName: string
  facilityType: string
  region: string
  country: string
  fullAddress: string
  rating?: string
  reviewsNumber?: string
  detailedUrl?: string
}
