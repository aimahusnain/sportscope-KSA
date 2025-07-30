"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FacilityPieChartProps {
  data: Record<string, number>
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function ChartPieLabel({ data }: FacilityPieChartProps) {
  const chartData = Object.entries(data).map(([type, count], index) => ({
    browser: type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    visitors: count,
    fill: chartColors[index % chartColors.length],
  }))

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Facilities",
    },
  }

  return (
    <Card className="flex w-full h-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Facility Types Distribution Pie Chart</CardTitle>
        <CardDescription>Current facility breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex   pb-0">
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
