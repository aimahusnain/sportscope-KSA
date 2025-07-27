"use client"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Edit, Loader2, Plus, Search, Trash2, Warehouse } from "lucide-react"; // Updated icons
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import {
  addFacilityType,
  addSport,
  deleteAllFacilityTypes,
  deleteAllSports,
  deleteFacilityType,
  deleteSport,
  getFacilityTypes,
  getSports,
  updateFacilityType,
  updateSport,
} from "@/lib/sports"

// Define types based on your Prisma schema
interface FacilityType {
  id: string
  name: string
  _count?: {
    sports: number
  }
}

interface Sport {
  id: string
  name: string
  facilityTypeId: string
  facilityType?: FacilityType // Optional, as it's included via `include`
}

export default function SportsAndFacilitiesManager() {
  // Data states
  const [sports, setSports] = useState<Sport[]>([])
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])

  // Sport management states
  const [sportSearch, setSportSearch] = useState("")
  const [newSportName, setNewSportName] = useState("")
  const [newSportFacilityTypeId, setNewSportFacilityTypeId] = useState("")
  const [editingSport, setEditingSport] = useState<Sport | null>(null)
  const [originalEditingSport, setOriginalEditingSport] = useState<Sport | null>(null) // Store original for comparison
  const [sportDialogOpen, setSportDialogOpen] = useState(false)
  const [isSportActionPending, setIsSportActionPending] = useState(false)
  const [sportDeleteAllConfirm, setSportDeleteAllConfirm] = useState("") // For "Delete All" confirmation

  // Facility management states
  const [facilitySearch, setFacilitySearch] = useState("")
  const [newFacilityName, setNewFacilityName] = useState("")
  const [editingFacility, setEditingFacility] = useState<FacilityType | null>(null)
  const [originalEditingFacility, setOriginalEditingFacility] = useState<FacilityType | null>(null) // Store original for comparison
  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false)
  const [isFacilityActionPending, setIsFacilityActionPending] = useState(false)
  const [addFacilityTypeInSportDialog, setAddFacilityTypeInSportDialog] = useState(false) // State for nested dialog
  const [facilityDeleteAllConfirm, setFacilityDeleteAllConfirm] = useState("") // For "Delete All" confirmation

  // Fetch initial data
  const fetchData = useCallback(async () => {
    const [fetchedSports, fetchedFacilityTypes] = await Promise.all([getSports(), getFacilityTypes()])
    setSports(fetchedSports)
    setFacilityTypes(fetchedFacilityTypes)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter functions
  const filteredSports = sports.filter((sport) => sport.name.toLowerCase().includes(sportSearch.toLowerCase()))

  const filteredFacilities = facilityTypes.filter((facility) =>
    facility.name.toLowerCase().includes(facilitySearch.toLowerCase()),
  )

  // Sports CRUD operations
  const handleAddSport = async () => {
    if (!newSportName || !newSportFacilityTypeId) {
      toast.error("Please provide both sport name and facility type.")
      return
    }
    setIsSportActionPending(true)
    // Optimistic update: Add the new sport to local state immediately
    const tempId = `temp-${Date.now()}`
    const newSportWithFacility: Sport = {
      id: tempId,
      name: newSportName,
      facilityTypeId: newSportFacilityTypeId,
      facilityType: facilityTypes.find((f) => f.id === newSportFacilityTypeId),
    }
    setSports((prev) => [newSportWithFacility, ...prev]) // Add to top for visibility

    const result = await addSport(newSportName, newSportFacilityTypeId)
    if (result.success && result.data) {
      // Replace temporary item with actual data from server
      setSports((prev) => prev.map((s) => (s.id === tempId ? result.data! : s)))
      toast.success(result.message)
      setNewSportName("")
      setNewSportFacilityTypeId("")
      setSportDialogOpen(false)
      fetchData() // Re-fetch in background to ensure full consistency (e.g., updated counts)
    } else {
      toast.error(result.message)
      setSports((prev) => prev.filter((s) => s.id !== tempId)) // Revert optimistic update on failure
    }
    setIsSportActionPending(false)
  }

  const handleUpdateSport = async () => {
    if (!editingSport || !editingSport.name || !editingSport.facilityTypeId) {
      toast.error("Please provide both sport name and facility type.")
      return
    }
    setIsSportActionPending(true)
    const originalSport = sports.find((s) => s.id === editingSport.id) // Store original for revert
    // Optimistic update: Update the sport in local state immediately
    setSports((prev) =>
      prev.map((s) =>
        s.id === editingSport.id
          ? { ...editingSport, facilityType: facilityTypes.find((f) => f.id === editingSport.facilityTypeId) }
          : s,
      ),
    )

    const result = await updateSport(editingSport.id, editingSport.name, editingSport.facilityTypeId)
    if (result.success && result.data) {
      toast.success(result.message)
      setEditingSport(null)
      setSportDialogOpen(false)
      fetchData() // Re-fetch in background
    } else {
      toast.error(result.message)
      if (originalSport) {
        setSports((prev) => prev.map((s) => (s.id === originalSport.id ? originalSport : s))) // Revert
      }
    }
    setIsSportActionPending(false)
  }

  const handleDeleteSport = async (id: string) => {
    setIsSportActionPending(true)
    const sportToDelete = sports.find((s) => s.id === id) // Store for revert
    // Optimistic update: Remove the sport from local state immediately
    setSports((prev) => prev.filter((s) => s.id !== id))

    const result = await deleteSport(id)
    if (result.success) {
      toast.success(result.message)
      fetchData() // Re-fetch in background
    } else {
      toast.error(result.message)
      if (sportToDelete) {
        setSports((prev) => [...prev, sportToDelete]) // Revert optimistic update on failure
      }
    }
    setIsSportActionPending(false)
  }

  const handleDeleteAllSports = async () => {
    setIsSportActionPending(true)
    const originalSports = [...sports] // Store for revert
    // Optimistic update: Clear all sports from local state immediately
    setSports([])

    const result = await deleteAllSports()
    if (result.success) {
      toast.success(result.message)
      fetchData() // Re-fetch in background
    } else {
      toast.error(result.message)
      setSports(originalSports) // Revert optimistic update on failure
    }
    setIsSportActionPending(false)
  }

  // Facility CRUD operations
  const handleAddFacility = async () => {
    if (!newFacilityName) {
      toast.error("Please provide facility name.")
      return
    }
    setIsFacilityActionPending(true)
    const tempId = `temp-${Date.now()}`
    const newFacility: FacilityType = { id: tempId, name: newFacilityName, _count: { sports: 0 } } // Temporary ID
    setFacilityTypes((prev) => [newFacility, ...prev])

    const result = await addFacilityType(newFacilityName)
    if (result.success && result.data) {
      setFacilityTypes((prev) => prev.map((f) => (f.id === tempId ? result.data! : f)))
      toast.success(result.message)
      setNewFacilityName("")
      setFacilityDialogOpen(false)
      setAddFacilityTypeInSportDialog(false) // Close nested dialog if open
      // If adding from sport dialog, pre-select the new facility
      if (addFacilityTypeInSportDialog) {
        setNewSportFacilityTypeId(result.data.id)
      }
      fetchData() // Re-fetch in background
    } else {
      toast.error(result.message)
      setFacilityTypes((prev) => prev.filter((f) => f.id !== tempId)) // Revert
    }
    setIsFacilityActionPending(false)
  }

  const handleUpdateFacility = async () => {
    if (!editingFacility || !editingFacility.name) {
      toast.error("Please provide facility name.")
      return
    }
    setIsFacilityActionPending(true)
    const originalFacility = facilityTypes.find((f) => f.id === editingFacility.id) // Store original for revert
    setFacilityTypes((prev) => prev.map((f) => (f.id === editingFacility.id ? editingFacility : f)))

    const result = await updateFacilityType(editingFacility.id, editingFacility.name)
    if (result.success && result.data) {
      toast.success(result.message)
      setEditingFacility(null)
      setFacilityDialogOpen(false)
      fetchData() // Re-fetch in background
    } else {
      toast.error(result.message)
      if (originalFacility) {
        setFacilityTypes((prev) => prev.map((f) => (f.id === originalFacility.id ? originalFacility : f))) // Revert
      }
    }
    setIsFacilityActionPending(false)
  }

  const handleDeleteFacility = async (id: string) => {
    setIsFacilityActionPending(true)
    const facilityToDelete = facilityTypes.find((f) => f.id === id) // Store for revert
    const connectedSportsCount = sports.filter((s) => s.facilityTypeId === id).length

    if (connectedSportsCount > 0) {
      toast.error(`Cannot delete facility type. ${connectedSportsCount} sport(s) are connected to it.`)
      setIsFacilityActionPending(false)
      return
    }

    setFacilityTypes((prev) => prev.filter((f) => f.id !== id))
    const result = await deleteFacilityType(id)
    if (result.success) {
      toast.success(result.message)
      fetchData()
    } else {
      toast.error(result.message)
      if (facilityToDelete) {
        setFacilityTypes((prev) => [...prev, facilityToDelete]) // Revert
      }
    }
    setIsFacilityActionPending(false)
  }

  const handleDeleteAllFacilities = async () => {
    setIsFacilityActionPending(true)
    const originalFacilityTypes = [...facilityTypes] // Store for revert
    const connectedSportsCount = sports.length
    if (connectedSportsCount > 0) {
      toast.error("Cannot delete all facility types. Some sports are still connected to facility types.")
      setIsFacilityActionPending(false)
      return
    }

    setFacilityTypes([])
    const result = await deleteAllFacilityTypes()
    if (result.success) {
      toast.success(result.message)
      fetchData()
    } else {
      toast.error(result.message)
      setFacilityTypes(originalFacilityTypes) // Revert
    }
    setIsFacilityActionPending(false)
  }

  // Determine if update button should be disabled
  const isSportUpdateDisabled =
    isSportActionPending ||
    !editingSport ||
    (editingSport.name === originalEditingSport?.name &&
      editingSport.facilityTypeId === originalEditingSport?.facilityTypeId)

  const isFacilityUpdateDisabled =
    isFacilityActionPending || !editingFacility || editingFacility.name === originalEditingFacility?.name

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Sports & Facilities Manager</h1>
            <p className="text-muted-foreground mt-1 text-base sm:text-lg">
              Manage your sports and facility types efficiently
            </p>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="sports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 text-lg font-medium">
            <TabsTrigger value="sports" className="data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Sports
            </TabsTrigger>
            <TabsTrigger value="facilities" className="data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Facility Types
            </TabsTrigger>
          </TabsList>

          {/* Sports Tab Content */}
          <TabsContent value="sports" className="space-y-6">
            <Card className="p-0 border-none shadow-sm">
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xl font-semibold">Sports Management</span>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {sports.length} sports
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search sports..."
                      value={sportSearch}
                      onChange={(e) => setSportSearch(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog
                      open={sportDialogOpen}
                      onOpenChange={(open) => {
                        setSportDialogOpen(open)
                        if (!open) {
                          setEditingSport(null)
                          setOriginalEditingSport(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingSport(null)
                            setOriginalEditingSport(null)
                            setNewSportName("")
                            setNewSportFacilityTypeId("")
                          }}
                          className="h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Sport
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{editingSport ? "Edit Sport" : "Add New Sport"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="sport-name">Sport Name</Label>
                            <Input
                              id="sport-name"
                              value={editingSport ? editingSport.name : newSportName}
                              onChange={(e) =>
                                editingSport
                                  ? setEditingSport({ ...editingSport, name: e.target.value })
                                  : setNewSportName(e.target.value)
                              }
                              placeholder="e.g., Football"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="sport-facility">Facility Type</Label>
                            <Select
                              value={editingSport ? editingSport.facilityTypeId : newSportFacilityTypeId}
                              onValueChange={(value) =>
                                editingSport
                                  ? setEditingSport({ ...editingSport, facilityTypeId: value })
                                  : setNewSportFacilityTypeId(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select facility type" />
                              </SelectTrigger>
                              <SelectContent>
                                {facilityTypes.map((facility) => (
                                  <SelectItem key={facility.id} value={facility.id}>
                                    {facility.name}
                                  </SelectItem>
                                ))}
                                <div className="p-1 border-t mt-1">
                                  <Dialog
                                    open={addFacilityTypeInSportDialog}
                                    onOpenChange={setAddFacilityTypeInSportDialog}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" className="w-full justify-start text-sm h-8">
                                        <Plus className="h-4 w-4 mr-2" /> Add New Facility Type
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Add New Facility Type</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="new-facility-name">Facility Name</Label>
                                          <Input
                                            id="new-facility-name"
                                            value={newFacilityName}
                                            onChange={(e) => setNewFacilityName(e.target.value)}
                                            placeholder="e.g., Stadium"
                                          />
                                        </div>
                                        <Button
                                          onClick={handleAddFacility}
                                          className="w-full h-10"
                                          disabled={isFacilityActionPending}
                                        >
                                          {isFacilityActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                          Add Facility Type
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={editingSport ? handleUpdateSport : handleAddSport}
                            className="w-full h-10"
                            disabled={editingSport ? isSportUpdateDisabled : isSportActionPending}
                          >
                            {isSportActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingSport ? "Update Sport" : "Add Sport"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog
                      onOpenChange={(open) => {
                        if (!open) setSportDeleteAllConfirm("")
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon" // Changed to icon button
                          disabled={sports.length === 0 || isSportActionPending}
                          className="h-10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete All Sports</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all sports.
                            <br />
                            Please type "Delete All" to confirm.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                          placeholder="Type 'Delete All' to confirm"
                          value={sportDeleteAllConfirm}
                          onChange={(e) => setSportDeleteAllConfirm(e.target.value)}
                          className="mt-4"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAllSports}
                            disabled={isSportActionPending || sportDeleteAllConfirm !== "Delete All"}
                          >
                            {isSportActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Sports List */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSports.map((sport) => (
                    <Card key={sport.id} className="hover:shadow-lg transition-shadow duration-200 border shadow-sm">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between flex-grow">
                          <div className="flex items-center space-x-3">
                            <Dumbbell className="h-6 w-6 text-primary" /> {/* Updated icon */}
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{sport.name}</h3>
                              {sport.facilityType ? (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                  {sport.facilityType.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                                  No Facility
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingSport(sport)
                                setOriginalEditingSport(sport) // Set original for comparison
                                setSportDialogOpen(true)
                              }}
                              disabled={isSportActionPending}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isSportActionPending}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete "{sport.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSport(sport.id)}
                                    disabled={isSportActionPending}
                                  >
                                    {isSportActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredSports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-lg">
                    {sportSearch ? (
                      <div className="flex flex-col items-center gap-4">
                        <span>No sports found matching your search.</span>
                        {sportSearch && (
                          <Dialog
                            open={sportDialogOpen}
                            onOpenChange={(open) => {
                              setSportDialogOpen(open)
                              if (!open) {
                                setEditingSport(null)
                                setNewSportName("")
                                setNewSportFacilityTypeId("")
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setNewSportName(sportSearch)
                                  setNewSportFacilityTypeId("") // Clear facility type for new sport
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add "{sportSearch}" as a new sport
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Add New Sport</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="sport-name">Sport Name</Label>
                                  <Input
                                    id="sport-name"
                                    value={newSportName}
                                    onChange={(e) => setNewSportName(e.target.value)}
                                    placeholder="e.g., Football"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="sport-facility">Facility Type</Label>
                                  <Select
                                    value={newSportFacilityTypeId}
                                    onValueChange={(value) => setNewSportFacilityTypeId(value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select facility type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {facilityTypes.map((facility) => (
                                        <SelectItem key={facility.id} value={facility.id}>
                                          {facility.name}
                                        </SelectItem>
                                      ))}
                                      <div className="p-1 border-t mt-1">
                                        <Dialog
                                          open={addFacilityTypeInSportDialog}
                                          onOpenChange={setAddFacilityTypeInSportDialog}
                                        >
                                          <DialogTrigger asChild>
                                            <Button variant="ghost" className="w-full justify-start text-sm h-8">
                                              <Plus className="h-4 w-4 mr-2" /> Add New Facility Type
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                              <DialogTitle>Add New Facility Type</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                              <div className="grid gap-2">
                                                <Label htmlFor="new-facility-name">Facility Name</Label>
                                                <Input
                                                  id="new-facility-name"
                                                  value={newFacilityName}
                                                  onChange={(e) => setNewFacilityName(e.target.value)}
                                                  placeholder="e.g., Stadium"
                                                />
                                              </div>
                                              <Button
                                                onClick={handleAddFacility}
                                                className="w-full h-10"
                                                disabled={isFacilityActionPending}
                                              >
                                                {isFacilityActionPending && (
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Add Facility Type
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  onClick={handleAddSport}
                                  className="w-full h-10"
                                  disabled={isSportActionPending}
                                >
                                  {isSportActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Add Sport
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ) : (
                      "No sports added yet."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab Content */}
          <TabsContent value="facilities" className="space-y-6">
            <Card className="p-0 border-none shadow-sm">
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xl font-semibold">Facility Types Management</span>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {facilityTypes.length} facility types
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search facility types..."
                      value={facilitySearch}
                      onChange={(e) => setFacilitySearch(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog
                      open={facilityDialogOpen}
                      onOpenChange={(open) => {
                        setFacilityDialogOpen(open)
                        if (!open) {
                          setEditingFacility(null)
                          setOriginalEditingFacility(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingFacility(null)
                            setOriginalEditingFacility(null)
                            setNewFacilityName("")
                          }}
                          className="h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Facility
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{editingFacility ? "Edit Facility Type" : "Add New Facility Type"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="facility-name">Facility Name</Label>
                            <Input
                              id="facility-name"
                              value={editingFacility ? editingFacility.name : newFacilityName}
                              onChange={(e) =>
                                editingFacility
                                  ? setEditingFacility({ ...editingFacility, name: e.target.value })
                                  : setNewFacilityName(e.target.value)
                              }
                              placeholder="e.g., Stadium"
                            />
                          </div>
                          <Button
                            onClick={editingFacility ? handleUpdateFacility : handleAddFacility}
                            className="w-full h-10"
                            disabled={editingFacility ? isFacilityUpdateDisabled : isFacilityActionPending}
                          >
                            {isFacilityActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingFacility ? "Update Facility" : "Add Facility"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog
                      onOpenChange={(open) => {
                        if (!open) setFacilityDeleteAllConfirm("")
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon" // Changed to icon button
                          disabled={facilityTypes.length === 0 || isFacilityActionPending}
                          className="h-10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete All Facility Types</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all facility types.
                            <br />
                            **Note**: You cannot delete facility types if any sports are connected to them.
                            <br />
                            Please type "Delete All" to confirm.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                          placeholder="Type 'Delete All' to confirm"
                          value={facilityDeleteAllConfirm}
                          onChange={(e) => setFacilityDeleteAllConfirm(e.target.value)}
                          className="mt-4"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAllFacilities}
                            disabled={isFacilityActionPending || facilityDeleteAllConfirm !== "Delete All"}
                          >
                            {isFacilityActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredFacilities.map((facility) => (
                    <Card key={facility.id} className="hover:shadow-lg transition-shadow duration-200 border shadow-sm">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between flex-grow">
                          <div className="flex items-center space-x-3">
                            <Warehouse className="h-6 w-6 text-primary" /> {/* Updated icon */}
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{facility.name}</h3>
                              {facility._count && facility._count.sports > 0 ? (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  {facility._count.sports} Connected Sport{facility._count.sports > 1 ? "s" : ""}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                                  No Connected Sports
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingFacility(facility)
                                setOriginalEditingFacility(facility) // Set original for comparison
                                setFacilityDialogOpen(true)
                              }}
                              disabled={isFacilityActionPending}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isFacilityActionPending}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete "{facility.name}".
                                    <br />
                                    **Note**: This facility type cannot be deleted if any sports are connected to it.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteFacility(facility.id)}
                                    disabled={isFacilityActionPending}
                                  >
                                    {isFacilityActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredFacilities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-lg">
                    {facilitySearch ? (
                      <div className="flex flex-col items-center gap-4">
                        <span>No facility types found matching your search.</span>
                        {facilitySearch && (
                          <Dialog
                            open={facilityDialogOpen}
                            onOpenChange={(open) => {
                              setFacilityDialogOpen(open)
                              if (!open) {
                                setEditingFacility(null)
                                setNewFacilityName("")
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setNewFacilityName(facilitySearch)
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add "{facilitySearch}" as a new facility type
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Add New Facility Type</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="new-facility-name">Facility Name</Label>
                                  <Input
                                    id="new-facility-name"
                                    value={newFacilityName}
                                    onChange={(e) => setNewFacilityName(e.target.value)}
                                    placeholder="e.g., Stadium"
                                  />
                                </div>
                                <Button
                                  onClick={handleAddFacility}
                                  className="w-full h-10"
                                  disabled={isFacilityActionPending}
                                >
                                  {isFacilityActionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Add Facility Type
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ) : (
                      "No facility types added yet."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
