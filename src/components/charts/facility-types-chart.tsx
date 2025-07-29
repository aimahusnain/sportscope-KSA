"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts"
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

interface FacilityTypesChartProps {
  data: Record<string, number>
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  // add more if needed
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

  // Minimal config for your ChartContainer
  const chartConfig: ChartConfig = {
    facilities: { label: "Facilities", color: "var(--chart-1)" },
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-foreground">
          Facility Types Distribution
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Current facility breakdown by type
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center p-4">
        {/* Set the text color here; ticks use currentColor */}
        <ChartContainer
          config={chartConfig}
          className="w-full h-full max-h-[380px] text-muted-foreground"
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 12, bottom: 24 }}
          >
            {/* Grid + axes use your tokens */}
            <CartesianGrid stroke="var(--border)" vertical={false} />

            <XAxis
              dataKey="type"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "currentColor" }}   // resolves to text-muted-foreground
              // If labels overlap: interval={0} angle={-30} height={60}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "currentColor" }}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar dataKey="facilities" radius={[6, 6, 0, 0]}>
              {/* Top labels readable in both themes */}
              <LabelList
                dataKey="facilities"
                position="top"
                fill="var(--foreground)"
              />
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
