"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getSports, deleteSport, deleteAllSports } from "@/lib/actions"
import { SportForm } from "./sport-form"
import { BulkUploadDialog } from "./bulk-upload-dialog"

export function SportsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSport, setEditingSport] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: sports = [], isLoading } = useQuery({
    queryKey: ["sports"],
    queryFn: getSports,
  })

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllSports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] })
      toast({ title: "Success", description: "All sports deleted successfully" })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete sports", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] })
      toast({ title: "Success", description: "Sport deleted successfully" })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete sport", variant: "destructive" })
    },
  })

  const filteredSports = sports.filter(
    (sport: any) =>
      sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sport.facilityType?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sports or facility types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <BulkUploadDialog type="sports" />

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Sport
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sport</DialogTitle>
              </DialogHeader>
              <SportForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={() => deleteAllMutation.mutate()}
            disabled={deleteAllMutation.isPending || sports.length === 0}
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
              <TableHead>Facility Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading sports...
                </TableCell>
              </TableRow>
            ) : filteredSports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No sports found matching your search" : "No sports found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSports.map((sport: any) => (
                <TableRow key={sport.id}>
                  <TableCell className="font-medium">{sport.name}</TableCell>
                  <TableCell>{sport.facilityType?.name || "N/A"}</TableCell>
                  <TableCell>{new Date(sport.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingSport(sport)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Sport</DialogTitle>
                          </DialogHeader>
                          <SportForm sport={editingSport} onClose={() => setEditingSport(null)} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(sport.id)}
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
