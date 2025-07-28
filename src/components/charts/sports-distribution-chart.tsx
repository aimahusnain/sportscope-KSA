"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SportsDistributionChartProps {
  data: Record<string, number>
}

const chartConfig = {
  facilities: {
    label: "Facilities",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SportsDistributionChart({ data }: SportsDistributionChartProps) {
  const chartData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([sport, count]) => ({
      sport: sport
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      facilities: count,
    }))

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Sports Distribution</CardTitle>
        <CardDescription className="text-base">Number of facilities per sport</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <ChartContainer config={chartConfig} className="w-full h-full max-h-[380px]">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 80,
            }}
          >
            <XAxis type="number" dataKey="facilities" hide />
            <YAxis
              dataKey="sport"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={70}
              fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="facilities" fill="var(--color-facilities)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
