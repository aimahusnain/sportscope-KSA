"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "padel", label: "Padel" },
  { value: "tennis", label: "Tennis" },
  { value: "soccer", label: "Soccer" },
  { value: "volleyball", label: "Volleyball" },
]

const saudiRegions = [
  "Riyadh",
  "Makkah",
  "Eastern Province",
  "Asir",
  "Jazan",
  "Medina",
  "Qassim",
  "Hail",
  "Northern Borders",
  "Najran",
  "Al Bahah",
  "Tabuk",
  "Al Jouf",
]

const allSportsData = {
  football: [
    { region: "Riyadh", value: 186 },
    { region: "Makkah", value: 305 },
    { region: "Eastern Province", value: 237 },
    { region: "Asir", value: 173 },
    { region: "Jazan", value: 209 },
    { region: "Medina", value: 214 },
    { region: "Qassim", value: 165 },
    { region: "Hail", value: 145 },
    { region: "Northern Borders", value: 125 },
    { region: "Najran", value: 135 },
    { region: "Al Bahah", value: 115 },
    { region: "Tabuk", value: 155 },
    { region: "Al Jouf", value: 105 },
  ],
  basketball: [
    { region: "Riyadh", value: 145 },
    { region: "Makkah", value: 280 },
    { region: "Eastern Province", value: 190 },
    { region: "Asir", value: 220 },
    { region: "Jazan", value: 165 },
    { region: "Medina", value: 195 },
    { region: "Qassim", value: 140 },
    { region: "Hail", value: 120 },
    { region: "Northern Borders", value: 100 },
    { region: "Najran", value: 110 },
    { region: "Al Bahah", value: 95 },
    { region: "Tabuk", value: 130 },
    { region: "Al Jouf", value: 85 },
  ],
  padel: [
    { region: "Riyadh", value: 95 },
    { region: "Makkah", value: 120 },
    { region: "Eastern Province", value: 140 },
    { region: "Asir", value: 110 },
    { region: "Jazan", value: 130 },
    { region: "Medina", value: 155 },
    { region: "Qassim", value: 85 },
    { region: "Hail", value: 75 },
    { region: "Northern Borders", value: 65 },
    { region: "Najran", value: 70 },
    { region: "Al Bahah", value: 60 },
    { region: "Tabuk", value: 80 },
    { region: "Al Jouf", value: 55 },
  ],
  tennis: [
    { region: "Riyadh", value: 120 },
    { region: "Makkah", value: 150 },
    { region: "Eastern Province", value: 180 },
    { region: "Asir", value: 140 },
    { region: "Jazan", value: 170 },
    { region: "Medina", value: 160 },
    { region: "Qassim", value: 110 },
    { region: "Hail", value: 90 },
    { region: "Northern Borders", value: 80 },
    { region: "Najran", value: 85 },
    { region: "Al Bahah", value: 75 },
    { region: "Tabuk", value: 95 },
    { region: "Al Jouf", value: 70 },
  ],
  soccer: [
    { region: "Riyadh", value: 200 },
    { region: "Makkah", value: 320 },
    { region: "Eastern Province", value: 280 },
    { region: "Asir", value: 250 },
    { region: "Jazan", value: 290 },
    { region: "Medina", value: 310 },
    { region: "Qassim", value: 180 },
    { region: "Hail", value: 160 },
    { region: "Northern Borders", value: 140 },
    { region: "Najran", value: 150 },
    { region: "Al Bahah", value: 130 },
    { region: "Tabuk", value: 170 },
    { region: "Al Jouf", value: 120 },
  ],
  volleyball: [
    { region: "Riyadh", value: 80 },
    { region: "Makkah", value: 95 },
    { region: "Eastern Province", value: 110 },
    { region: "Asir", value: 85 },
    { region: "Jazan", value: 100 },
    { region: "Medina", value: 115 },
    { region: "Qassim", value: 70 },
    { region: "Hail", value: 60 },
    { region: "Northern Borders", value: 50 },
    { region: "Najran", value: 55 },
    { region: "Al Bahah", value: 45 },
    { region: "Tabuk", value: 65 },
    { region: "Al Jouf", value: 40 },
  ],
}

const sportColors = {
  football: "#8B5CF6",
  basketball: "#F97316",
  padel: "#10B981",
  tennis: "#EF4444",
  soccer: "#3B82F6",
  volleyball: "#F59E0B",
}

const getChartConfig = (selectedSports: string[]) => {
  const config: ChartConfig = {}
  selectedSports.forEach((sport) => {
    config[sport] = {
      label: sports.find((s) => s.value === sport)?.label || sport,
      color: sportColors[sport as keyof typeof sportColors],
    }
  })
  return config
}

export function AverageRatingbyRegion() {
  const [selectedSports, setSelectedSports] = useState<string[]>(["football"])
  const [open, setOpen] = useState(false)

  const getChartData = () => {
    if (selectedSports.length === 0) return []
    return saudiRegions.map((region) => {
      const regionData: any = {
        region: region.length > 8 ? region.slice(0, 8) + "..." : region,
        fullRegion: region,
      }
      selectedSports.forEach((sport) => {
        const sportData = allSportsData[sport as keyof typeof allSportsData]
        const regionSportData = sportData.find((data) => data.region === region)
        regionData[sport] = regionSportData?.value || 0
      })
      return regionData
    })
  }

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  const chartConfig = getChartConfig(selectedSports)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl">Average Rating by Region</CardTitle>
          <CardDescription className="text-sm">Sports ratings across 13 regions</CardDescription>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-full sm:w-[200px] justify-between bg-transparent"
            >
              {selectedSports.length === 0
                ? "Select sports..."
                : selectedSports.length === 1
                  ? sports.find((sport) => sport.value === selectedSports[0])?.label
                  : `${selectedSports.length} sports selected`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search sports..." />
              <CommandList>
                <CommandEmpty>No sport found.</CommandEmpty>
                <CommandGroup>
                  {sports.map((sport) => (
                    <CommandItem key={sport.value} value={sport.value} onSelect={() => toggleSport(sport.value)}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSports.includes(sport.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {sport.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>

      {selectedSports.length > 0 && (
        <div className="px-4 sm:px-6 pb-2">
          <div className="flex flex-wrap gap-1">
            {selectedSports.map((sport) => (
              <Badge key={sport} variant="secondary" className="text-xs">
                {sports.find((s) => s.value === sport)?.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 60,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="region"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={10}
                interval={0}
              />
              <YAxis fontSize={10} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload
                  return item?.fullRegion || label
                }}
              />
              {selectedSports.length > 1 && <Legend />}
              {selectedSports.map((sport) => (
                <Bar key={sport} dataKey={sport} fill={chartConfig[sport]?.color} radius={4}>
                  {selectedSports.length === 1 && (
                    <LabelList position="top" offset={12} className="fill-foreground" fontSize={10} />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
