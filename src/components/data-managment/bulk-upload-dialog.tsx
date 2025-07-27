"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { bulkCreateSports, bulkCreateFacilityTypes } from "@/lib/actions"

interface BulkUploadDialogProps {
  type: "sports" | "facilityTypes"
}

export function BulkUploadDialog({ type }: BulkUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (csvData: string) => {
      if (type === "sports") {
        return bulkCreateSports(csvData)
      } else {
        return bulkCreateFacilityTypes(csvData)
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [type] })
      if (type === "sports") {
        queryClient.invalidateQueries({ queryKey: ["facilityTypes"] })
      }
      toast({
        title: "Success",
        description: `${result.count} ${type} uploaded successfully`,
      })
      setIsOpen(false)
      setFile(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to upload ${type}`,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const text = await file.text()
    mutation.mutate(text)
  }

  const downloadTemplate = () => {
    const headers = type === "sports" ? "name,facilityTypeName" : "name"
    const example = type === "sports" ? "Football,Stadium\nBasketball,Court" : "Stadium\nCourt\nField"
    const csvContent = `${headers}\n${example}`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload {type === "sports" ? "Sports" : "Facility Types"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Download Template</Label>
            <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          {file && <div className="text-sm text-muted-foreground">Selected: {file.name}</div>}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || mutation.isPending}>
              {mutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
