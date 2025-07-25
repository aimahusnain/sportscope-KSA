"use client";
import Header from "@/components/header";
import InteractiveSaudiMap from "@/components/saudi-map";
import Sidebar from "@/components/sidebar";

const FilterSidebar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-[calc(100vh-64px)] bg-background/95 backdrop-blur p-4">
          <InteractiveSaudiMap />
          <section className="w-full mt-10">
            <div className="w-full max-w-full border border-white/20 dark:border-white/20 rounded-2xl px-5 py-10 bg-transparent shadow-lg">
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl text-left">
                Dashboard per region
              </h1>
              {/* Yahan aur content bhi add kar sakti ho */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
