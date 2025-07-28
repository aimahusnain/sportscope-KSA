"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { KSARegion } from "@prisma/client"

interface FacilitiesByRegionChartProps {
  data: Record<KSARegion, number>
}

const chartConfig = {
  facilities: {
    label: "Facilities",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function formatRegionName(region: string): string {
  return region
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function FacilitiesByRegionChart({ data }: FacilitiesByRegionChartProps) {
  const chartData = Object.entries(data).map(([region, count]) => ({
    region: formatRegionName(region),
    facilities: count,
  }))

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Facilities by Region</CardTitle>
        <CardDescription className="text-base">Distribution of facilities across KSA regions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <ChartContainer config={chartConfig} className="w-full h-full max-h-[380px]">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 60,
              left: 20,
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
              height={60}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="facilities" fill="var(--color-facilities)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
