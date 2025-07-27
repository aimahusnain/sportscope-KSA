"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Facility, FacilityType } from "@/types/facility"

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

interface FacilityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facility?: Facility | null
  facilityTypes: FacilityType[]
  onSuccess: () => void
}

interface FormData {
  name: string
  facilityTypeId: string
  region: string
  country: string
  fullAddress: string
  rating: string
  reviewsNumber: string
  detailedUrl: string
}

export function FacilityForm({ open, onOpenChange, facility, facilityTypes, onSuccess }: FacilityFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    facilityTypeId: "",
    region: "",
    country: "Saudi Arabia",
    fullAddress: "",
    rating: "",
    reviewsNumber: "",
    detailedUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!facility

  // Reset form when dialog opens/closes or facility changes
  useEffect(() => {
    if (open) {
      if (facility) {
        setFormData({
          name: facility.name,
          facilityTypeId: facility.facilityTypeId,
          region: facility.region,
          country: facility.country,
          fullAddress: facility.fullAddress,
          rating: facility.rating?.toString() || "",
          reviewsNumber: facility.reviewsNumber?.toString() || "",
          detailedUrl: facility.detailedUrl || "",
        })
      } else {
        setFormData({
          name: "",
          facilityTypeId: "",
          region: "",
          country: "Saudi Arabia",
          fullAddress: "",
          rating: "",
          reviewsNumber: "",
          detailedUrl: "",
        })
      }
      setErrors({})
    }
  }, [open, facility])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Facility name is required"
    }
    if (!formData.facilityTypeId) {
      newErrors.facilityTypeId = "Facility type is required"
    }
    if (!formData.region) {
      newErrors.region = "Region is required"
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }
    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Full address is required"
    }
    if (
      formData.rating &&
      (isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 5)
    ) {
      newErrors.rating = "Rating must be a number between 0 and 5"
    }
    if (formData.reviewsNumber && (isNaN(Number(formData.reviewsNumber)) || Number(formData.reviewsNumber) < 0)) {
      newErrors.reviewsNumber = "Reviews number must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name.trim(),
        facilityTypeId: formData.facilityTypeId,
        region: formData.region,
        country: formData.country.trim(),
        fullAddress: formData.fullAddress.trim(),
        rating: formData.rating ? Number(formData.rating) : null,
        reviewsNumber: formData.reviewsNumber ? Number(formData.reviewsNumber) : null,
        detailedUrl: formData.detailedUrl.trim() || null,
      }

      const url = isEditing ? `/api/facilities/${facility.id}` : "/api/facilities"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(isEditing ? "Facility updated successfully" : "Facility created successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{isEditing ? "Edit Facility" : "Add New Facility"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing ? "Update the facility information below." : "Fill in the details to create a new facility."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Facility Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`bg-background border-border ${errors.name ? "border-destructive" : ""}`}
                placeholder="Enter facility name"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilityType" className="text-foreground">
                Facility Type *
              </Label>
              <Select
                value={formData.facilityTypeId}
                onValueChange={(value) => handleInputChange("facilityTypeId", value)}
              >
                <SelectTrigger
                  className={`bg-background border-border ${errors.facilityTypeId ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {facilityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.facilityTypeId && <p className="text-xs text-destructive">{errors.facilityTypeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-foreground">
                Region *
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                <SelectTrigger className={`bg-background border-border ${errors.region ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {KSA_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {REGION_DISPLAY_NAMES[region]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-foreground">
                Country *
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={`bg-background border-border ${errors.country ? "border-destructive" : ""}`}
                placeholder="Enter country"
              />
              {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className="text-foreground">
                Rating (0-5)
              </Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                className={`bg-background border-border ${errors.rating ? "border-destructive" : ""}`}
                placeholder="Enter rating"
              />
              {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewsNumber" className="text-foreground">
                Number of Reviews
              </Label>
              <Input
                id="reviewsNumber"
                type="number"
                min="0"
                value={formData.reviewsNumber}
                onChange={(e) => handleInputChange("reviewsNumber", e.target.value)}
                className={`bg-background border-border ${errors.reviewsNumber ? "border-destructive" : ""}`}
                placeholder="Enter number of reviews"
              />
              {errors.reviewsNumber && <p className="text-xs text-destructive">{errors.reviewsNumber}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullAddress" className="text-foreground">
              Full Address *
            </Label>
            <Textarea
              id="fullAddress"
              value={formData.fullAddress}
              onChange={(e) => handleInputChange("fullAddress", e.target.value)}
              className={`bg-background border-border ${errors.fullAddress ? "border-destructive" : ""}`}
              placeholder="Enter full address"
              rows={3}
            />
            {errors.fullAddress && <p className="text-xs text-destructive">{errors.fullAddress}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedUrl" className="text-foreground">
              Detailed URL
            </Label>
            <Input
              id="detailedUrl"
              type="url"
              value={formData.detailedUrl}
              onChange={(e) => handleInputChange("detailedUrl", e.target.value)}
              className="bg-background border-border"
              placeholder="Enter detailed URL (optional)"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Facility" : "Create Facility"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
