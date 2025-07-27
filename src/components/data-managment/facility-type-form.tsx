"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { createFacilityType, updateFacilityType } from "@/lib/actions"

interface FacilityTypeFormProps {
  facilityType?: any
  onClose: () => void
}

export function FacilityTypeForm({ facilityType, onClose }: FacilityTypeFormProps) {
  const [name, setName] = useState(facilityType?.name || "")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: facilityType ? (data: any) => updateFacilityType(facilityType.id, data) : createFacilityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilityTypes"] })
      queryClient.invalidateQueries({ queryKey: ["sports"] })
      toast({
        title: "Success",
        description: `Facility type ${facilityType ? "updated" : "created"} successfully`,
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${facilityType ? "update" : "create"} facility type`,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a facility type name",
        variant: "destructive",
      })
      return
    }
    mutation.mutate({ name: name.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Facility Type Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter facility type name"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : facilityType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
