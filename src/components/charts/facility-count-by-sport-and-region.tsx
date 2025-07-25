"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, ResponsiveContainer } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const description = "Interactive pie chart for 13 KSA regions"

const desktopData = [
  { region: "riyadh", value: 120, fill: "var(--color-riyadh)" },
  { region: "makkah", value: 95, fill: "var(--color-makkah)" },
  { region: "madinah", value: 80, fill: "var(--color-madinah)" },
  { region: "qassim", value: 70, fill: "var(--color-qassim)" },
  { region: "eastern", value: 110, fill: "var(--color-eastern)" },
  { region: "asir", value: 60, fill: "var(--color-asir)" },
  { region: "tabuk", value: 55, fill: "var(--color-tabuk)" },
  { region: "hail", value: 40, fill: "var(--color-hail)" },
  { region: "northern", value: 35, fill: "var(--color-northern)" },
  { region: "jazan", value: 50, fill: "var(--color-jazan)" },
  { region: "najran", value: 45, fill: "var(--color-najran)" },
  { region: "bahah", value: 30, fill: "var(--color-bahah)" },
  { region: "jawf", value: 25, fill: "var(--color-jawf)" },
]

const chartConfig = {
  riyadh: { label: "Riyadh", color: "var(--chart-1)" },
  makkah: { label: "Makkah", color: "var(--chart-2)" },
  madinah: { label: "Madinah", color: "var(--chart-3)" },
  qassim: { label: "Qassim", color: "var(--chart-4)" },
  eastern: { label: "Eastern", color: "var(--chart-5)" },
  asir: { label: "Asir", color: "var(--chart-6)" },
  tabuk: { label: "Tabuk", color: "var(--chart-7)" },
  hail: { label: "Hail", color: "var(--chart-8)" },
  northern: { label: "Northern Borders", color: "var(--chart-9)" },
  jazan: { label: "Jazan", color: "var(--chart-10)" },
  najran: { label: "Najran", color: "var(--chart-11)" },
  bahah: { label: "Al Bahah", color: "var(--chart-12)" },
  jawf: { label: "Al Jawf", color: "var(--chart-13)" },
} satisfies ChartConfig

export function FacilityCountbySportandRegion() {
  const id = "ksa-regions-pie"
  const [activeRegion, setActiveRegion] = React.useState(desktopData[0].region)

  const activeIndex = React.useMemo(() => desktopData.findIndex((item) => item.region === activeRegion), [activeRegion])

  const regions = React.useMemo(() => desktopData.map((item) => item.region), [])

  return (
    <Card data-chart={id} className="flex flex-col w-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 pb-0">
        <div className="grid gap-1 flex-1">
          <CardTitle className="text-lg sm:text-xl">Facility Count by Region</CardTitle>
          <CardDescription className="text-sm">Saudi Arabia – 2024</CardDescription>
        </div>
        <Select value={activeRegion} onValueChange={setActiveRegion}>
          <SelectTrigger className="w-full sm:w-[160px] h-8 rounded-lg pl-2.5" aria-label="Select region">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl max-h-64 overflow-y-auto">
            {regions.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) return null
              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: `var(--color-${key})` }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0 px-2 sm:px-6">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] sm:max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={desktopData}
                dataKey="value"
                nameKey="region"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl sm:text-3xl font-bold"
                          >
                            {desktopData[activeIndex].value.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                            Facilities
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
