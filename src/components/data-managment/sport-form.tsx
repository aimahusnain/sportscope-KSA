"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createSport, updateSport, getFacilityTypes } from "@/lib/actions"

interface SportFormProps {
  sport?: any
  onClose: () => void
}

export function SportForm({ sport, onClose }: SportFormProps) {
  const [name, setName] = useState(sport?.name || "")
  const [facilityTypeId, setFacilityTypeId] = useState(sport?.facilityTypeId || "")
  const queryClient = useQueryClient()

  const { data: facilityTypes = [] } = useQuery({
    queryKey: ["facilityTypes"],
    queryFn: getFacilityTypes,
  })

  const mutation = useMutation({
    mutationFn: sport ? (data: any) => updateSport(sport.id, data) : createSport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] })
      toast({
        title: "Success",
        description: `Sport ${sport ? "updated" : "created"} successfully`,
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${sport ? "update" : "create"} sport`,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !facilityTypeId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    mutation.mutate({ name: name.trim(), facilityTypeId })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Sport Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter sport name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facilityType">Facility Type</Label>
        <Select value={facilityTypeId} onValueChange={setFacilityTypeId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select facility type" />
          </SelectTrigger>
          <SelectContent>
            {facilityTypes.map((facilityType: any) => (
              <SelectItem key={facilityType.id} value={facilityType.id}>
                {facilityType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : sport ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
