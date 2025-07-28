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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/facilities/data-table"
import { createColumns } from "@/components/facilities/columns"
import { FacilityForm } from "@/components/facilities/facility-form"
import { UploadFacilitiesDialog } from "@/components/facilities/upload-facilities-dialog"
import type { Facility, FacilityType } from "@/types/facility"
import Papa from "papaparse" // Keep Papa for export functionality

export default function FacilitiesDataTable() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Delete all facilities states
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("")
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  // Fetch data
  const fetchData = useCallback(async (page = 1, limit = 10000) => {
    try {
      setIsLoading(true)
      const [facilitiesResponse, facilityTypesResponse] = await Promise.all([
        fetch(`/api/facilities?page=${page}&limit=${limit}`),
        fetch("/api/facility-types"),
      ])

      if (facilitiesResponse.ok && facilityTypesResponse.ok) {
        const facilitiesData = await facilitiesResponse.json()
        const facilityTypesData = await facilityTypesResponse.json()
        setFacilities(facilitiesData.data || facilitiesData)
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

  // Handle delete all facilities
  const handleDeleteAll = async () => {
    setIsDeletingAll(true)
    const originalFacilities = [...facilities]

    // Optimistic update: Clear all facilities from local state immediately
    setFacilities([])

    try {
      const response = await fetch("/api/facilities/delete-all", {
        method: "DELETE",
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message || "All facilities deleted successfully")
        fetchData() // Re-fetch in background to ensure consistency
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete all facilities")
        setFacilities(originalFacilities) // Revert optimistic update on failure
      }
    } catch (error) {
      console.error("Error deleting all facilities:", error)
      toast.error("Network error. Please try again.")
      setFacilities(originalFacilities) // Revert optimistic update on failure
    } finally {
      setIsDeletingAll(false)
      setDeleteAllDialogOpen(false)
      setDeleteAllConfirmText("")
    }
  }

  // Handle upload (now opens the new dialog)
  const handleUpload = () => {
    setUploadDialogOpen(true)
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-foreground">Facilities Management</CardTitle>

            {/* Delete All Button */}
            <AlertDialog
              open={deleteAllDialogOpen}
              onOpenChange={(open) => {
                setDeleteAllDialogOpen(open)
                if (!open) {
                  setDeleteAllConfirmText("")
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={facilities.length === 0 || isLoading || isDeletingAll}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete All Facilities
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    Delete All Facilities
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground space-y-3">
                    <div>
                      This action will permanently delete <strong>all {facilities.length} facilities</strong> from your
                      database. This action cannot be undone and will also remove all connections to sports.
                    </div>
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm font-medium text-destructive">⚠️ Warning</p>
                      <p className="text-sm text-destructive/80">
                        This will permanently delete all facility data including names, addresses, ratings, and sport
                        associations.
                      </p>
                    </div>
                    <div>
                      To confirm this action, please type <strong>"Delete All Facilities"</strong> in the field below:
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-4">
                  <Input
                    placeholder="Type 'Delete All Facilities' to confirm"
                    value={deleteAllConfirmText}
                    onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                    className="bg-background border-border"
                    disabled={isDeletingAll}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border hover:bg-accent" disabled={isDeletingAll}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    disabled={isDeletingAll || deleteAllConfirmText !== "Delete All Facilities"}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {isDeletingAll ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting All...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All Facilities
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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

      {/* Upload Facilities Dialog */}
      <UploadFacilitiesDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={fetchData} // Refetch data after successful upload
      />

      {/* Delete Single Facility Confirmation */}
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
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
