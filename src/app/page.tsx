import InteractiveSaudiMap from "@/components/saudi-map"
import Sidebar from "@/components/sidebar"
import { FilterProvider } from "@/contexts/filter-context"
import { getFacilityTypes, getSports } from "@/lib/sports"

export default async function FilterSidebar() {
  const [sports, facilityTypes] = await Promise.all([getSports(), getFacilityTypes()])

  return (
    <FilterProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar sports={sports} facilityTypes={facilityTypes} />
          <div className="flex-1 min-h-[calc(100vh-64px)] bg-background/95 backdrop-blur p-4">
            <InteractiveSaudiMap />
            <section className="w-full mt-10">
              <div className="w-full max-w-full border border-white/20 dark:border-white/20 rounded-2xl px-5 py-10 bg-transparent shadow-lg">
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl text-left">Dashboard per region</h1>
              </div>
            </section>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
