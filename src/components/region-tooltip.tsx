import { Card, CardContent } from "@/components/ui/card"

interface RegionTooltipProps {
  regionName: string
  x: number
  y: number
}

export default function RegionTooltip({ regionName, x, y }: RegionTooltipProps) {
  return (
    <div
      className="absolute pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
      style={{
        left: `${x}px`,
        top: `${y - 10}px`,
      }}
    >
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-2 text-sm font-medium">{regionName}</CardContent>
      </Card>
    </div>
  )
}
