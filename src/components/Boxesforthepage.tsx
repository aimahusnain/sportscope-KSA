  "use client";
  import React, { useCallback, useEffect, useState } from "react";

  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { useFilters } from "@/contexts/filter-context";
  import { Building2, Loader2, MapPin, Trophy } from "lucide-react";
  import { toast } from "sonner";

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

  const Boxesforthepage = () => {
    const {
      selectedLocationTypes,
      selectedSports,
      selectedFacilityTypes,
      ministryOfSports,
    } = useFilters();

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Add location type
        if (selectedLocationTypes.length > 0) {
          params.append("region", selectedLocationTypes[0]);
        }

        // Add sports
        if (selectedSports.length > 0) {
          selectedSports.forEach((sport) => params.append("sports", sport));
        }

        // Add facility types
        if (selectedFacilityTypes.length > 0) {
          selectedFacilityTypes.forEach((type) =>
            params.append("facilityTypes", type)
          );
        }

        // Add ministry flag
        if (ministryOfSports) {
          params.append("ministry", "true");
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
    }, [
      selectedLocationTypes,
      selectedSports,
      selectedFacilityTypes,
      ministryOfSports,
    ]);

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
            <p className="text-destructive font-medium">Error loading dashboard</p>
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

    const data = dashboardData;

    return (
      <div>
        {/* Stats Cards */}
        <div className="grid gap-4 mb-6 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.totalFacilities.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Active facilities</p>
            </CardContent>
          </Card>

<div className="relative group">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Sports Covered</CardTitle>
      <Trophy className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{data.stats.totalSports}</div>
      <p className="text-xs text-muted-foreground">
        Different sports available
      </p>
    </CardContent>
  </Card>

  {/* Full expanded tooltip */}
  <div className="absolute z-50 hidden group-hover:block top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md p-4 text-sm text-gray-800 w-auto min-w-[200px] max-w-[400px]">
    <p className="font-semibold mb-2">All Sports:</p>
    <ul className="list-disc list-inside grid grid-cols-2 gap-x-4 gap-y-1">
      {Object.keys(data.sports).map((sport) => (
        <li key={sport}>{sport}</li>
      ))}
    </ul>
  </div>
</div>


          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalRegions}</div>
              <p className="text-xs text-muted-foreground">KSA regions covered</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  export default Boxesforthepage;
