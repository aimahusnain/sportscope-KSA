// components/Dashboard.tsx
"use client"; // Make it a client component
import { FacilitiesByRegionChart } from "@/components/charts/facilities-by-region-chart";
import { FacilityTypesChart } from "@/components/charts/facility-types-chart";
import { TopSportsByFacilityChart } from "@/components/charts/top-sports-by-facility-chart";
import { FacilitiesByRegionPieChart } from "./charts/facilities-by-region-chart-pie";
import { Card } from "@/components/ui/card";
import { useFilters } from "@/contexts/filter-context";
import { Loader2 } from 'lucide-react';
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

// Region mapping - same as in your API route
const REGION_DISPLAY_NAMES: Record<string, string> = {
  "SA-01": "Riyadh",
  "SA-02": "Makkah",
  "SA-03": "Madinah",
  "SA-04": "Eastern Province",
  "SA-05": "Al-Qassim",
  "SA-06": "Ha'il",
  "SA-07": "Tabuk",
  "SA-08": "Northern Borders",
  "SA-09": "Jazan",
  "SA-10": "Najran",
  "SA-11": "Al Bahah",
  "SA-12": "Al Jouf",
  "SA-13": "Asir",
};

export default function Dashboard() {
  const {
    selectedSports,
    selectedFacilityTypes,
    selectedLocationTypes,
    selectedRegions,
    ministryOfSports,
  } = useFilters(); // Get all relevant filters from context
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      // Append all selected filters to the URLSearchParams
      selectedSports.forEach((sport) => params.append("sports", sport));
      selectedFacilityTypes.forEach((type) => params.append("facilityTypes", type));
      selectedLocationTypes.forEach((type) => params.append("locationTypes", type));
      
      // Add region filter if a region is selected
      if (selectedRegions.length > 0) {
        params.append("region", selectedRegions[0]);
      }
      
      if (ministryOfSports) {
        params.append("ministryOfSports", "true");
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
  }, [selectedSports, selectedFacilityTypes, selectedLocationTypes, selectedRegions, ministryOfSports]); // Re-fetch when any relevant filter changes
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to get region display name
  const getRegionDisplayName = (regionId: string): string => {
    return REGION_DISPLAY_NAMES[regionId] || regionId;
  };

  // Generate dynamic title based on active filters
  const generateDashboardTitle = (): string => {
    const activeFilters: string[] = [];
    
    // Add region filter
    if (selectedRegions.length > 0) {
      const regionName = getRegionDisplayName(selectedRegions[0]);
      activeFilters.push(regionName);
    }
    
    // Add sports filter
    if (selectedSports.length > 0) {
      if (selectedSports.length === 1) {
        activeFilters.push(`${selectedSports[0]} facilities`);
      } else {
        activeFilters.push(`${selectedSports.length} selected sports`);
      }
    }
    
    // Add facility types filter
    if (selectedFacilityTypes.length > 0) {
      if (selectedFacilityTypes.length === 1) {
        activeFilters.push(selectedFacilityTypes[0]);
      } else {
        activeFilters.push(`${selectedFacilityTypes.length} facility types`);
      }
    }
    
    // Add location types filter
    if (selectedLocationTypes.length > 0) {
      if (selectedLocationTypes.length === 1) {
        activeFilters.push(selectedLocationTypes[0]);
      } else {
        activeFilters.push(`${selectedLocationTypes.length} location types`);
      }
    }
    
    // Add ministry of sports filter
    if (ministryOfSports) {
      activeFilters.push("Ministry of Sports facilities");
    }
    
    // Generate title
    if (activeFilters.length === 0) {
      return "Dashboard for All Regions";
    } else if (activeFilters.length === 1) {
      return `Dashboard for ${activeFilters[0]}`;
    } else {
      return `Dashboard for ${activeFilters.slice(0, -1).join(", ")} and ${activeFilters[activeFilters.length - 1]}`;
    }
  };

  const dashboardTitle = generateDashboardTitle();
  
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {dashboardTitle}
          </h1>
          <p className="text-muted-foreground">
            Overview of facility types, sports distribution, and regional
            coverage
          </p>
        </div>
        
        {/* Loading and Error States */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        ) : error || !dashboardData ? (
          <div className="flex items-center justify-center min-h-[400px]">
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
        ) : (
          <>
            {/* Charts Grid - Full width with responsive layout */}
            <div className="w-full flex flex-row gap-6">
              {/* Facility Types - Top Left */}
              <div className="h-[500px] w-full">
                <FacilityTypesChart
                  data={dashboardData.facilityTypes}
                  chartTitleId="688a90f5bc6991764213b863"
                />
              </div>
              <div className=" h-[520px] w-[600px]">
                <ChartPieLabel
                  data={dashboardData.facilityTypes}
                  chartTitleId="688a98c0bc6991764213b86a"
                />
              </div>
            </div>
            <div className="w-full flex flex-row gap-6">
              <div className="h-[500px] w-full">
                <FacilitiesByRegionChart
                  data={dashboardData.regions}
                  chartTitleId="688a998abc6991764213b86e"
                />
              </div>
              <div className=" h-[500px] w-[600px]">
                <FacilitiesByRegionPieChart
                  data={dashboardData.regions}
                  chartTitleId="688a98c0bc6991764213b86a"
                />
              </div>
            </div>
            <div className="h-[500px] w-full">
              <TopSportsByFacilityChart
                data={dashboardData.topSports}
                chartTitleId="688a9a65bc6991764213b875"
              />
            </div>
            <div className="w-full grid gap-6 grid-cols-1 xl:grid-cols-2"></div>
          </>
        )}
      </div>
    </div>
  );
}