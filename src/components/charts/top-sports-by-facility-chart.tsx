"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TopSportsByFacilityChartProps {
  data: Record<string, number>
}

const chartConfig = {
  facilityCount: {
    label: "Facility Count",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function TopSportsByFacilityChart({ data }: TopSportsByFacilityChartProps) {
  const chartData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([sport, count]) => ({
      sport: sport
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      facilityCount: count,
    }))

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Top Sports by Facility Count</CardTitle>
        <CardDescription className="text-base">Number of facilities available per sport</CardDescription>
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
              dataKey="sport"
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
            <Bar dataKey="facilityCount" fill="var(--color-facilityCount)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
