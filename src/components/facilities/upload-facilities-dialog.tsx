"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import type { CSVRow } from "@/types/facility"
import * as XLSX from "xlsx"

interface UploadResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    facilityName: string
    error: string
  }>
  invalidRows: Array<{
    row: number
    data: CSVRow
    missingFields: string[]
  }>
}

interface UploadFacilitiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadFacilitiesDialog({ open, onOpenChange, onSuccess }: UploadFacilitiesDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0]
      if (selectedFile.name.endsWith(".xlsx")) {
        setFile(selectedFile)
        setUploadProgress(0)
        setUploadResult(null) // Reset previous results
      } else {
        toast.error("Please select an XLSX file.")
        setFile(null)
      }
    } else {
      setFile(null)
      setUploadProgress(0)
      setUploadResult(null)
    }
  }

  const handleDownloadTemplate = () => {
    const sampleData: CSVRow[] = [
      {
        facilityName: "Al-Nassr Training Ground",
        facilityType: "Sports Club",
        region: "Riyadh",
        country: "Saudi Arabia",
        fullAddress: "King Fahd Road, Riyadh",
        rating: "4.8",
        reviewsNumber: "1200",
        detailedUrl: "https://example.com/alnassr",
        sports: "Football, Gym",
      },
      {
        facilityName: "Jeddah Beach Volleyball Courts",
        facilityType: "Public Park",
        region: "Makkah",
        country: "Saudi Arabia",
        fullAddress: "Corniche Road, Jeddah",
        rating: "4.5",
        reviewsNumber: "500",
        detailedUrl: "https://example.com/jeddahbeach",
        sports: "Volleyball, Beach Soccer",
      },
      {
        facilityName: "Dammam Indoor Arena",
        facilityType: "Arena",
        region: "Eastern Province",
        country: "Saudi Arabia",
        fullAddress: "Prince Mohammed Bin Fahd Road, Dammam",
        rating: "4.7",
        reviewsNumber: "800",
        detailedUrl: "https://example.com/dammamarena",
        sports: "Basketball, Handball, Badminton",
      },
      {
        facilityName: "Madinah Community Pool",
        facilityType: "Community Center",
        region: "Madinah",
        country: "Saudi Arabia",
        fullAddress: "Al Qiblatain Road, Madinah",
        rating: "4.2",
        reviewsNumber: "300",
        detailedUrl: "https://example.com/madinahpool",
        sports: "Swimming",
      },
      {
        facilityName: "Abha Mountain Trails",
        facilityType: "Outdoor Recreation",
        region: "Asir",
        country: "Saudi Arabia",
        fullAddress: "Soudah Park, Abha",
        rating: "4.9",
        reviewsNumber: "1500",
        detailedUrl: "https://example.com/abhatrails",
        sports: "Hiking, Cycling",
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facilities")
    XLSX.writeFile(workbook, "facilities_template_with_samples.xlsx")
    toast.info("XLSX template with sample data downloaded.")
  }

  const updateProgress = (progress: number) => {
    setUploadProgress(Math.min(progress, 100))
  }

  const validateRow = (row: CSVRow, index: number) => {
    const requiredFields = ["facilityName", "facilityType", "region", "country", "fullAddress"]
    const missingFields: string[] = []

    requiredFields.forEach((field) => {
      if (!row[field as keyof CSVRow] || String(row[field as keyof CSVRow]).trim() === "") {
        missingFields.push(field)
      }
    })

    return {
      isValid: missingFields.length === 0,
      missingFields,
      row: index + 2, // +2 because Excel rows start at 1 and we have a header row
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an XLSX file to upload.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // File reading completed
        updateProgress(20)
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // File parsing started
        updateProgress(40)
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const parsedData = XLSX.utils.sheet_to_json(worksheet) as CSVRow[]

        // Data validation
        updateProgress(60)
        const validationResults = parsedData.map((row, index) => ({
          ...validateRow(row, index),
          data: row,
        }))

        const validData = validationResults.filter((result) => result.isValid).map((result) => result.data)

        const invalidRows = validationResults
          .filter((result) => !result.isValid)
          .map((result) => ({
            row: result.row,
            data: result.data,
            missingFields: result.missingFields,
          }))

        if (invalidRows.length > 0) {
          const invalidRowNumbers = invalidRows.map((r) => r.row).join(", ")
          toast.warning(
            `${invalidRows.length} row(s) were skipped due to missing required data. Rows: ${invalidRowNumbers}`,
          )
        }

        if (validData.length === 0) {
          toast.error("No valid data found in the XLSX file.")
          setUploadResult({
            success: 0,
            failed: 0,
            errors: [],
            invalidRows,
          })
          setIsUploading(false)
          setUploadProgress(0)
          return
        }

        // Starting API upload
        updateProgress(70)
        const response = await fetch("/api/facilities/batch-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ facilities: validData }),
        })

        // API call completed
        updateProgress(90)
        const result = await response.json()

        if (response.ok) {
          updateProgress(100)

          const uploadResult: UploadResult = {
            success: result.success || 0,
            failed: result.failed || 0,
            errors: result.errors || [],
            invalidRows,
          }

          setUploadResult(uploadResult)

          if (uploadResult.success > 0) {
            toast.success(`${uploadResult.success} facilities uploaded successfully!`)
          }

          if (uploadResult.failed > 0) {
            const failedRowNumbers = uploadResult.errors.map((e) => e.row).join(", ")
            toast.warning(`${uploadResult.failed} facilities failed to upload. Rows: ${failedRowNumbers}`)
          }

          if (uploadResult.success > 0) {
            onSuccess()
          }
        } else {
          toast.error(result.error || "Failed to upload facilities.")
          setUploadResult({
            success: 0,
            failed: parsedData.length,
            errors: [{ row: 0, facilityName: "All rows", error: result.error || "Upload failed" }],
            invalidRows,
          })
        }
      } catch (error) {
        console.error("Error during XLSX parsing or upload:", error)
        toast.error("Failed to process XLSX file. Please ensure it's correctly formatted.")
        setUploadResult({
          success: 0,
          failed: 0,
          errors: [{ row: 0, facilityName: "File processing", error: "Failed to process XLSX file" }],
          invalidRows: [],
        })
      } finally {
        setIsUploading(false)
        // Keep progress at 100% briefly before resetting
        setTimeout(() => {
          if (!uploadResult || (uploadResult.success === 0 && uploadResult.failed === 0)) {
            setUploadProgress(0)
          }
        }, 1000)
      }
    }

    // Start reading file
    updateProgress(10)
    reader.readAsArrayBuffer(file)
  }

  const handleClose = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-background border-border max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Upload Facilities XLSX</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload an XLSX file to add multiple facilities. For multiple sports, use a comma-separated list (e.g.,
            &quot;Basketball, Tennis&quot;).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button variant="outline" onClick={handleDownloadTemplate} className="w-fit bg-transparent">
            Download XLSX Template with Samples
          </Button>

          <FileUpload onChange={handleFileChange} />

          {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upload Progress</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {uploadProgress < 20 && "Reading file..."}
                {uploadProgress >= 20 && uploadProgress < 40 && "Parsing data..."}
                {uploadProgress >= 40 && uploadProgress < 60 && "Validating data..."}
                {uploadProgress >= 60 && uploadProgress < 90 && "Uploading to server..."}
                {uploadProgress >= 90 && uploadProgress < 100 && "Finalizing..."}
                {uploadProgress === 100 && "Upload completed!"}
              </p>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Upload Results</h3>
              </div>

              {/* Summary */}
              <div className="flex gap-4">
                {uploadResult.success > 0 && (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {uploadResult.success} Successful
                  </Badge>
                )}
                {uploadResult.failed > 0 && (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    {uploadResult.failed} Failed
                  </Badge>
                )}
                {uploadResult.invalidRows.length > 0 && (
                  <Badge variant="secondary">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {uploadResult.invalidRows.length} Invalid
                  </Badge>
                )}
              </div>

              {/* Error Details */}
              {(uploadResult.errors.length > 0 || uploadResult.invalidRows.length > 0) && (
                <ScrollArea className="h-32 w-full border rounded p-2">
                  <div className="space-y-2">
                    {/* Invalid rows (validation errors) */}
                    {uploadResult.invalidRows.map((invalidRow, index) => (
                      <div key={`invalid-${index}`} className="text-sm">
                        <span className="font-medium text-orange-600">Row {invalidRow.row}:</span>
                        <span className="text-muted-foreground ml-1">
                          &quot;{invalidRow.data.facilityName || "Unnamed"}&quot; - Missing: {invalidRow.missingFields.join(", ")}
                        </span>
                      </div>
                    ))}

                    {/* Upload errors */}
                    {uploadResult.errors.map((error, index) => (
                      <div key={`error-${index}`} className="text-sm">
                        <span className="font-medium text-red-600">Row {error.row}:</span>
                        <span className="text-muted-foreground ml-1">
                          &quot;{error.facilityName}" - {error.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {uploadResult ? "Close" : "Cancel"}
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}