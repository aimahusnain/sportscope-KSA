"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FacilitiesByRegionPieChartProps {
  data: Record<string, number>
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function formatRegionName(region: string): string {
  return region
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function FacilitiesByRegionPieChart({ data }: FacilitiesByRegionPieChartProps) {
  const chartData = Object.entries(data).map(([region, count], index) => ({
    browser: formatRegionName(region),
    visitors: count,
    fill: chartColors[index % chartColors.length],
  }))

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Facilities",
    },
  }

  return (
    <Card className="flex w-full h-full flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Facilities by Region Pie Chart</CardTitle>
        <CardDescription>Distribution of facilities across KSA regions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[300px] mt-[40px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
