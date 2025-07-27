"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { DataTable } from "@/components/facilities/data-table"
import { createColumns } from "@/components/facilities/columns"
import { FacilityForm } from "@/components/facilities/facility-form"
import type { Facility, FacilityType } from "@/types/facility"
import Papa from "papaparse"

export default function FacilitiesDataTable() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  // Handle add facility
  const handleAdd = () => {
    setEditingFacility(null)
    setFormOpen(true)
  }

  // Handle edit facility
  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility)
    setFormOpen(true)
  }

  // Handle delete facility
  const handleDelete = (facility: Facility) => {
    setDeletingFacility(facility)
  }

  const confirmDelete = async () => {
    if (!deletingFacility) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/facilities/${deletingFacility.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Facility deleted successfully")
        setFacilities((prev) => prev.filter((f) => f.id !== deletingFacility.id))
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete facility")
      }
    } catch (error) {
      console.error("Error deleting facility:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setIsDeleting(false)
      setDeletingFacility(null)
    }
  }

  // Handle upload (placeholder - you can integrate with your existing upload logic)
  const handleUpload = () => {
    toast.info("Upload functionality - integrate with your existing upload dialog")
  }

  // Handle export
  const handleExport = () => {
    const exportData = facilities.map((facility) => ({
      name: facility.name,
      facilityType: facility.facilityType?.name || "",
      region: facility.region,
      country: facility.country,
      fullAddress: facility.fullAddress,
      rating: facility.rating || "",
      reviewsNumber: facility.reviewsNumber || "",
      detailedUrl: facility.detailedUrl || "",
      createdAt: new Date(facility.createdAt).toLocaleDateString(),
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `facilities_export_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Data exported successfully")
  }

  // Create columns with handlers
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl font-semibold text-foreground">Facilities Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={facilities}
            onAdd={handleAdd}
            onUpload={handleUpload}
            onExport={handleExport}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      <FacilityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        facility={editingFacility}
        facilityTypes={facilityTypes}
        onSuccess={fetchData}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFacility} onOpenChange={() => setDeletingFacility(null)}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Facility</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{deletingFacility?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-accent">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
