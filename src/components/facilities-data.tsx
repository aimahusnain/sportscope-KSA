"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Building2,
  Download,
  Edit,
  FileSpreadsheet,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import Papa from "papaparse"
import * as XLSX from "xlsx"

// Types
interface Facility {
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

interface FacilityType {
  id: string
  name: string
  _count?: {
    sports: number
    facilities: number
  }
}

interface CSVRow {
  facilityName: string
  facilityType: string
  region: string
  country: string
  fullAddress: string
  rating?: string
  reviewsNumber?: string
  detailedUrl?: string
}

interface UploadProgress {
  total: number
  processed: number
  successful: number
  failed: number
  isUploading: boolean
  currentBatch: number
  totalBatches: number
  errors: string[]
}

const KSA_REGIONS = [
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
]

const REGION_DISPLAY_NAMES: Record<string, string> = {
  RIYADH: "Riyadh",
  MAKKAH: "Makkah",
  MADINAH: "Madinah",
  EASTERN_PROVINCE: "Eastern Province",
  ASIR: "Asir",
  TABUK: "Tabuk",
  QASSIM: "Qassim",
  HAIL: "Ha'il",
  NORTHERN_BORDERS: "Northern Borders",
  JAZAN: "Jazan",
  NAJRAN: "Najran",
  AL_BAHAH: "Al Bahah",
  AL_JOUF: "Al Jouf",
}

export default function FacilitiesData() {
  // Data states
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("all")

  // Upload states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    isUploading: false,
    currentBatch: 0,
    totalBatches: 0,
    errors: [],
  })
  const [parsedData, setParsedData] = useState<CSVRow[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [facilitiesResponse, facilityTypesResponse] = await Promise.all([
        fetch("/api/facilities"),
        fetch("/api/facility-types"),
      ])

      if (facilitiesResponse.ok && facilityTypesResponse.ok) {
        const facilitiesData = await facilitiesResponse.json()
        const facilityTypesData = await facilityTypesResponse.json()

        setFacilities(facilitiesData)
        setFacilityTypes(facilityTypesData)
      } else {
        toast.error("Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error fetching data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter facilities
  useEffect(() => {
    let filtered = facilities

    if (searchTerm) {
      filtered = filtered.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((facility) => facility.region === selectedRegion)
    }

    if (selectedFacilityType !== "all") {
      filtered = filtered.filter((facility) => facility.facilityTypeId === selectedFacilityType)
    }

    setFilteredFacilities(filtered)
  }, [facilities, searchTerm, selectedRegion, selectedFacilityType])

  // File handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid CSV or Excel file")
      return
    }

    setSelectedFile(file)
    parseFile(file)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return

      try {
        let parsedRows: CSVRow[] = []

        if (file.type === "text/csv") {
          // Parse CSV
          const result = Papa.parse(data as string, {
            header: true,
            skipEmptyLines: true,
          })
          parsedRows = result.data as CSVRow[]
        } else {
          // Parse Excel
          const workbook = XLSX.read(data, { type: "binary" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          parsedRows = jsonData as CSVRow[]
        }

        // Validate and clean data
        const { validData, errors } = validateData(parsedRows)
        setParsedData(validData)
        setValidationErrors(errors)

        if (errors.length > 0) {
          toast.warning(`File parsed with ${errors.length} validation errors`)
        } else {
          toast.success(`File parsed successfully. ${validData.length} records ready for upload.`)
        }
      } catch (error) {
        toast.error("Error parsing file. Please check the format.")
        console.error("Parse error:", error)
      }
    }

    if (file.type === "text/csv") {
      reader.readAsText(file)
    } else {
      reader.readAsBinaryString(file)
    }
  }

  const validateData = (data: CSVRow[]) => {
    const validData: CSVRow[] = []
    const errors: string[] = []

    data.forEach((row, index) => {
      const rowErrors: string[] = []

      // Required fields validation
      if (!row.facilityName?.trim()) {
        rowErrors.push(`Row ${index + 1}: Facility name is required`)
      }
      if (!row.facilityType?.trim()) {
        rowErrors.push(`Row ${index + 1}: Facility type is required`)
      }
      if (!row.region?.trim()) {
        rowErrors.push(`Row ${index + 1}: Region is required`)
      }
      if (!row.country?.trim()) {
        rowErrors.push(`Row ${index + 1}: Country is required`)
      }
      if (!row.fullAddress?.trim()) {
        rowErrors.push(`Row ${index + 1}: Full address is required`)
      }

      // Region validation
      if (row.region && !KSA_REGIONS.includes(row.region.toUpperCase())) {
        rowErrors.push(`Row ${index + 1}: Invalid region "${row.region}". Valid regions: ${KSA_REGIONS.join(", ")}`)
      }

      // Rating validation
      if (row.rating && (isNaN(Number(row.rating)) || Number(row.rating) < 0 || Number(row.rating) > 5)) {
        rowErrors.push(`Row ${index + 1}: Rating must be a number between 0 and 5`)
      }

      // Reviews number validation
      if (row.reviewsNumber && (isNaN(Number(row.reviewsNumber)) || Number(row.reviewsNumber) < 0)) {
        rowErrors.push(`Row ${index + 1}: Reviews number must be a positive number`)
      }

      if (rowErrors.length === 0) {
        validData.push({
          ...row,
          region: row.region.toUpperCase(),
        })
      } else {
        errors.push(...rowErrors)
      }
    })

    return { validData, errors }
  }

  const uploadData = async () => {
    if (parsedData.length === 0) {
      toast.error("No valid data to upload")
      return
    }

    const batchSize = 15
    const totalBatches = Math.ceil(parsedData.length / batchSize)

    setUploadProgress({
      total: parsedData.length,
      processed: 0,
      successful: 0,
      failed: 0,
      isUploading: true,
      currentBatch: 0,
      totalBatches,
      errors: [],
    })

    let successful = 0
    let failed = 0
    const allErrors: string[] = []

    for (let i = 0; i < totalBatches; i++) {
      const batch = parsedData.slice(i * batchSize, (i + 1) * batchSize)

      setUploadProgress((prev) => ({
        ...prev,
        currentBatch: i + 1,
      }))

      try {
        const response = await fetch("/api/facilities/batch-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ facilities: batch }),
        })

        if (response.ok) {
          const result = await response.json()
          successful += result.successful || 0
          failed += result.failed || 0
          if (result.errors) {
            allErrors.push(...result.errors)
          }
        } else {
          const errorData = await response.json()
          failed += batch.length
          allErrors.push(`Batch ${i + 1}: ${errorData.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error(`Batch ${i + 1} upload error:`, error)
        failed += batch.length
        allErrors.push(`Batch ${i + 1}: Network error`)
      }

      setUploadProgress((prev) => ({
        ...prev,
        processed: Math.min((i + 1) * batchSize, parsedData.length),
        successful,
        failed,
        errors: allErrors,
      }))

      // Small delay between batches to prevent overwhelming the server
      if (i < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setUploadProgress((prev) => ({
      ...prev,
      isUploading: false,
      processed: parsedData.length,
    }))

    if (successful > 0) {
      toast.success(`Upload completed! ${successful} facilities uploaded successfully.`)
      fetchData() // Refresh data
    }

    if (failed > 0) {
      toast.error(`${failed} facilities failed to upload.`)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setParsedData([])
    setValidationErrors([])
    setUploadProgress({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      isUploading: false,
      currentBatch: 0,
      totalBatches: 0,
      errors: [],
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        facilityName: "Example Stadium",
        facilityType: "Stadium",
        region: "RIYADH",
        country: "Saudi Arabia",
        fullAddress: "123 King Fahd Road, Riyadh, Saudi Arabia",
        rating: "4.5",
        reviewsNumber: "150",
        detailedUrl: "https://example.com/stadium",
      },
    ]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "facilities_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card dark:bg-card">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xl font-semibold text-foreground">Facilities Data</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-secondary/50 text-secondary-foreground">
                {facilities.length} facilities
              </Badge>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-background border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Upload Facilities Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground">Select CSV or Excel File</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadTemplate}
                          className="border-border hover:bg-accent bg-transparent"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                      </div>

                      <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-muted/20 dark:bg-muted/10">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        {selectedFile ? (
                          <div className="space-y-2">
                            <FileSpreadsheet className="h-8 w-8 mx-auto text-primary" />
                            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="border-border hover:bg-accent"
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to select a CSV or Excel file</p>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="border-border hover:bg-accent"
                            >
                              Select File
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-destructive">Validation Errors</Label>
                        <div className="max-h-32 overflow-y-auto bg-destructive/10 dark:bg-destructive/20 rounded-md p-3 border border-destructive/20">
                          {validationErrors.slice(0, 10).map((error, index) => (
                            <p key={index} className="text-xs text-destructive">
                              {error}
                            </p>
                          ))}
                          {validationErrors.length > 10 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ... and {validationErrors.length - 10} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {uploadProgress.isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-foreground">
                          <span>
                            Uploading batch {uploadProgress.currentBatch} of {uploadProgress.totalBatches}
                          </span>
                          <span>
                            {uploadProgress.processed} / {uploadProgress.total}
                          </span>
                        </div>
                        <Progress value={(uploadProgress.processed / uploadProgress.total) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Upload Summary */}
                    {uploadProgress.processed > 0 && !uploadProgress.isUploading && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {uploadProgress.successful}
                            </p>
                            <p className="text-xs text-muted-foreground">Successful</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{uploadProgress.failed}</p>
                            <p className="text-xs text-muted-foreground">Failed</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-foreground">{uploadProgress.total}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>

                        {/* Upload Errors */}
                        {uploadProgress.errors.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-destructive">Upload Errors</Label>
                            <div className="max-h-32 overflow-y-auto bg-destructive/10 dark:bg-destructive/20 rounded-md p-3 border border-destructive/20">
                              {uploadProgress.errors.slice(0, 5).map((error, index) => (
                                <p key={index} className="text-xs text-destructive">
                                  {error}
                                </p>
                              ))}
                              {uploadProgress.errors.length > 5 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  ... and {uploadProgress.errors.length - 5} more errors
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={resetUpload}
                        disabled={uploadProgress.isUploading}
                        className="border-border hover:bg-accent bg-transparent"
                      >
                        Reset
                      </Button>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setUploadDialogOpen(false)}
                          disabled={uploadProgress.isUploading}
                          className="border-border hover:bg-accent"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={uploadData}
                          disabled={
                            parsedData.length === 0 || uploadProgress.isUploading || validationErrors.length > 0
                          }
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {uploadProgress.isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Upload {parsedData.length} Facilities
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="h-10 bg-background border-border text-foreground">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Regions</SelectItem>
                {KSA_REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {REGION_DISPLAY_NAMES[region]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
              <SelectTrigger className="h-10 bg-background border-border text-foreground">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Types</SelectItem>
                {facilityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10 bg-transparent border-border hover:bg-accent text-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>

          {/* Facilities Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFacilities.map((facility) => (
              <Card
                key={facility.id}
                className="hover:shadow-lg transition-shadow duration-200 border-border/50 bg-card dark:bg-card hover:bg-accent/5 dark:hover:bg-accent/10"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-base line-clamp-1 text-foreground">{facility.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-foreground">Delete Facility</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              Are you sure you want to delete "{facility.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-border hover:bg-accent">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground">
                        {facility.facilityType?.name || "Unknown Type"}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        {REGION_DISPLAY_NAMES[facility.region] || facility.region}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground line-clamp-2">{facility.fullAddress}</p>
                    </div>

                    {facility.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-foreground">{facility.rating}</span>
                        {facility.reviewsNumber && (
                          <span className="text-sm text-muted-foreground">({facility.reviewsNumber} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFacilities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2 text-foreground">No facilities found</p>
              <p className="text-sm">
                {searchTerm || selectedRegion !== "all" || selectedFacilityType !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Upload some data or add facilities manually to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
