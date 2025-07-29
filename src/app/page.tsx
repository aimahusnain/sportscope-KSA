import Boxesforthepage from "@/components/Boxesforthepage";
import DashboardperFacilityType from "@/components/dashboard-per-facility-type";
import DashboardPerRegions from "@/components/dashboard-per-regions";
import InteractiveSaudiMap from "@/components/saudi-map";
import Sidebar from "@/components/sidebar";
import { FilterProvider } from "@/contexts/filter-context";
import { getFacilityTypes, getSports } from "@/lib/sports";

export default async function FilterSidebar() {
  const [sports, facilityTypes] = await Promise.all([
    getSports(),
    getFacilityTypes(),
  ]);

  return (
    <FilterProvider>
      <div className="max-h-full min-h-full bg-background">
        <div className="flex">
          <Sidebar sports={sports} facilityTypes={facilityTypes} />
          <div className="flex-1 bg-background/95 backdrop-blur p-4">
          <Boxesforthepage />
            <InteractiveSaudiMap />
            <DashboardPerRegions />
            <DashboardperFacilityType />
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}
