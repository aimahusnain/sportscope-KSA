"use client"

import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface FacilityTypesChartProps {
  data: Record<string, number>
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
]

export function FacilityTypesChart({ data }: FacilityTypesChartProps) {
  const chartData = Object.entries(data).map(([type, count], index) => ({
    type: type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    facilities: count,
    fill: chartColors[index % chartColors.length],
  }))

  const chartConfig = chartData.reduce((config, item, index) => {
    const key = item.type.toLowerCase().replace(/\s+/g, "_")
    config[key] = {
      label: item.type,
      color: chartColors[index % chartColors.length],
    }
    return config
  }, {} as ChartConfig)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Facility Types Distribution</CardTitle>
        <CardDescription className="text-base">Current facility breakdown by type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-4">
        <ChartContainer
          config={chartConfig}
          className="w-full h-full max-h-[380px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="facilities"
              label={({ facilities }) => facilities}
              nameKey="type"
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
