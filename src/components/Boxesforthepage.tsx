"use client"; // Make it a client component
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/contexts/filter-context";
import { Building2, Loader2, MapPin, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
    <div>
             {/* Stats Cards */}
        <div className="grid gap-4 mb-6 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Facilities
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.totalFacilities.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Active facilities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sports Covered
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalSports}</div>
              <p className="text-xs text-muted-foreground">
                Different sports available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Regions
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.totalRegions}
              </div>
              <p className="text-xs text-muted-foreground">
                KSA regions covered
              </p>
            </CardContent>
          </Card>
        </div>
        
    </div>
  )
}

export default Boxesforthepage