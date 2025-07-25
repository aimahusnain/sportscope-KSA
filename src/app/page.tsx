// page.tsx (or your main page file) - Server Component
import Header from "@/components/header";
import InteractiveSaudiMap from "@/components/saudi-map";
import Sidebar from "@/components/sidebar";
import { getSports, getFacilityTypes } from "@/lib/sports";

// This is now a Server Component (no "use client")
export default async function FilterSidebar() {
  // Fetch both sports and facility types data on the server
  const [sports, facilityTypes] = await Promise.all([
    getSports(),
    getFacilityTypes()
  ]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Pass both sports and facility types data as props to the client component */}
        <Sidebar sports={sports} facilityTypes={facilityTypes} />
        <div className="flex-1 min-h-[calc(100vh-64px)] bg-background/95 backdrop-blur p-4">
          <InteractiveSaudiMap />
          <section className="w-full mt-10">
            <div className="w-full max-w-full border border-white/20 dark:border-white/20 rounded-2xl px-5 py-10 bg-transparent shadow-lg">
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl text-left">
                Dashboard per region
              </h1>
              {/* You can add more content here */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}