"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, AlertCircle, Loader2, MapPin, Target, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { toast } from "sonner"

interface DashboardData {
  facilities: Array<{
    id: string
    name: string
    region: string
    type: string
    sports: string[]
    [key: string]: unknown
  }>
  regionData: Array<{ region: string; count: number }>
  facilityTypeData: Array<{ type: string; count: number }>
  sportsData: Array<{ sport: string; count: number }>
  pieData: Array<{ region: string; count: number; fill: string }>
  summary: {
    totalFacilities: number
    totalRegions: number
    totalFacilityTypes: number
    totalSports: number
  }
}

export default function FacilityDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/facility-dashboard")
      const result = await response.json()

      if (result.success) {
        setDashboardData(result.data)
      } else {
        setError(result.error || "Failed to fetch dashboard data")
        toast.error("Failed to load dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Network error occurred")
      toast.error("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Loading Dashboard</h2>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-lg font-semibold">Failed to load dashboard</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { regionData, facilityTypeData, sportsData, pieData, summary } = dashboardData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Facility Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Saudi Arabia Sports Facilities</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="w-full sm:w-auto bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Facilities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{summary.totalFacilities}</div>
              <p className="text-xs text-muted-foreground">Sports facilities tracked</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Regions</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{summary.totalRegions}</div>
              <p className="text-xs text-muted-foreground">Across Saudi Arabia</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Facility Types</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{summary.totalFacilityTypes}</div>
              <p className="text-xs text-muted-foreground">Different facility types</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Sports</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{summary.totalSports}</div>
              <p className="text-xs text-muted-foreground">Sports categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Facilities by Region Bar Chart */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Facilities by Region</CardTitle>
              <CardDescription className="text-sm">Number of facilities in each region</CardDescription>
            </CardHeader>
            <CardContent>
              {regionData.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Facilities",
                      color: "var(--chart-1)",
                    },
                  }}
                  className="h-[250px] sm:h-[300px] w-full lg:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="region"
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                        interval={0}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Regional Distribution Pie Chart */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Regional Distribution</CardTitle>
              <CardDescription className="text-sm">Percentage breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ChartContainer
                  config={Object.fromEntries(
                    pieData.map((item, index) => [
                      item.region,
                      {
                        label: item.region,
                        color: `var(--chart-${(index % 5) + 1})`,
                      },
                    ]),
                  )}
                  className="h-[250px] w-full sm:h-[300px] lg:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <ChartTooltip content={<ChartTooltipContent nameKey="region" hideLabel />} />
                      <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="region"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        label={({ region, count, percent }) => `${region}: ${count} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Facility Types Bar Chart */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Facility Types</CardTitle>
              <CardDescription className="text-sm">Distribution of facility types</CardDescription>
            </CardHeader>
            <CardContent>
              {facilityTypeData.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "var(--chart-2)",
                    },
                  }}
                  className="h-[250px] w-full sm:h-[300px] lg:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facilityTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="type"
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={5}
                        fontSize={12}
                        interval={0}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sports Categories Bar Chart */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Sports Categories</CardTitle>
              <CardDescription className="text-sm">Distribution of sports offered</CardDescription>
            </CardHeader>
            <CardContent>
              {sportsData.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "var(--chart-3)",
                    },
                  }}
                  className="h-[250px] w-full sm:h-[300px] lg:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sportsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="sport"
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={5}
                        fontSize={12}
                        interval={0}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
