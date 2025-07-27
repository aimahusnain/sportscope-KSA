"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getFacilityTypes, deleteFacilityType, deleteAllFacilityTypes } from "@/lib/actions"
import { FacilityTypeForm } from "./facility-type-form"
import { BulkUploadDialog } from "./bulk-upload-dialog"

export function FacilityTypesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFacilityType, setEditingFacilityType] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: facilityTypes = [], isLoading } = useQuery({
    queryKey: ["facilityTypes"],
    queryFn: getFacilityTypes,
  })

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllFacilityTypes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilityTypes"] })
      toast({ title: "Success", description: "All facility types deleted successfully" })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete facility types", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFacilityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilityTypes"] })
      toast({ title: "Success", description: "Facility type deleted successfully" })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete facility type", variant: "destructive" })
    },
  })

  const filteredFacilityTypes = facilityTypes.filter((facilityType: any) =>
    facilityType.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search facility types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <BulkUploadDialog type="facilityTypes" />

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Facility Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Facility Type</DialogTitle>
              </DialogHeader>
              <FacilityTypeForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={() => deleteAllMutation.mutate()}
            disabled={deleteAllMutation.isPending || facilityTypes.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sports Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading facility types...
                </TableCell>
              </TableRow>
            ) : filteredFacilityTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No facility types found matching your search" : "No facility types found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFacilityTypes.map((facilityType: any) => (
                <TableRow key={facilityType.id}>
                  <TableCell className="font-medium">{facilityType.name}</TableCell>
                  <TableCell>{facilityType.sports?.length || 0}</TableCell>
                  <TableCell>{new Date(facilityType.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingFacilityType(facilityType)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Facility Type</DialogTitle>
                          </DialogHeader>
                          <FacilityTypeForm
                            facilityType={editingFacilityType}
                            onClose={() => setEditingFacilityType(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(facilityType.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
