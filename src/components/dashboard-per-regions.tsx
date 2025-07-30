"use client"; // Make it a client component

import { FacilitiesByRegionChart } from "@/components/charts/facilities-by-region-chart";
import { FacilityTypesChart } from "@/components/charts/facility-types-chart";
import { TopSportsByFacilityChart } from "@/components/charts/top-sports-by-facility-chart";
import { FacilitiesByRegionPieChart } from "./charts/facilities-by-region-chart-pie";
import { Card } from "@/components/ui/card";
import { useFilters } from "@/contexts/filter-context";
import { regionNames } from "@/lib/dashboard-data"; // Import regionNames for display
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChartPieLabel } from "./charts/FacilityTypesPichart";

interface DashboardData {
  facilityTypes: Record<string, number>;
  sports: Record<string, number>;
  regions: Record<string, number>;
  topSports: Record<string, number>;
  stats: {
    totalFacilities: number;
    totalSports: number;
    totalRegions: number;
    averageRating: number;
  };
}

export default function Dashboard() {
  const { selectedLocationTypes } = useFilters(); // Get selectedLocationTypes from context
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const regionId =
        selectedLocationTypes.length > 0 ? selectedLocationTypes[0] : "";
      const params = new URLSearchParams();
      if (regionId) {
        params.append("region", regionId);
      }

      const response = await fetch(`/api/dashboard-data?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocationTypes]); // Re-fetch when selectedLocationTypes changes

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="p-6 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive font-medium">
            Error loading dashboard
          </p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="text-primary hover:text-primary/80 text-sm underline mt-4"
          >
            Try again
          </button>
        </Card>
      </div>
    );
  }

  const data = dashboardData; // Use the fetched data

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard{" "}
            {selectedLocationTypes.length > 0
              ? `for ${
                  regionNames[selectedLocationTypes[0]] ||
                  selectedLocationTypes[0]
                }`
              : "for All Regions"}
          </h1>
          <p className="text-muted-foreground">
            Overview of facility types, sports distribution, and regional
            coverage
          </p>
        </div>

        {/* Charts Grid - Full width with responsive layout */}
        <div className="w-full flex flex-row gap-6">
          {/* Facility Types - Top Left */}
          <div className="h-[500px] w-full">
            <FacilityTypesChart
              data={data.facilityTypes}
              chartTitleId="688a90f5bc6991764213b863"
            />
          </div>
          <div className=" h-[520px] w-[600px]">
            <ChartPieLabel
              data={data.facilityTypes}
              chartTitleId="688a98c0bc6991764213b86a"
            />
          </div>
        </div>
        <div className="w-full flex flex-row gap-6">
          <div className="h-[500px] w-full">
            <FacilitiesByRegionChart
              data={data.regions}
              chartTitleId="688a998abc6991764213b86e"
            />
          </div>
          <div className=" h-[500px] w-[600px]">
            <FacilitiesByRegionPieChart
              data={data.regions}
              chartTitleId="688a98c0bc6991764213b86a"
            />
          </div>
        </div>
        <div className="h-[500px] w-full">
          <TopSportsByFacilityChart
            data={data.topSports}
            chartTitleId="688a9a65bc6991764213b875"
          />
        </div>
        <div className="w-full grid gap-6 grid-cols-1 xl:grid-cols-2"></div>
      </div>
    </div>
  );
}
