import React from "react";

export default function RequirementsPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Business Requirements: Sports Facility Visualization Tool (KSA)
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Overview</h2>
        <p className="">
          This tool helps visualize gaps in sports facility infrastructure
          across regions in Saudi Arabia. It supports planners and
          decision-makers in understanding current supply and demand.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Interactive Map</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Map of Saudi Arabia divided by regions</li>
          <li>Hover to show summary data</li>
          <li>Click to drill down into details</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Top-Level Filters</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Metric (Gap, Demand, Supply)</li>
          <li>Year</li>
          <li>Sport (e.g., Football, Swimming)</li>
          <li>Segment (Students, Adults, Professionals)</li>
          <li>Gender (Male, Female)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Hover Interaction</h2>
        <p className="">
          Show quick data summary on region hover, including gaps and
          breakdowns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Click Interaction</h2>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Click region: view gap by sport</li>
          <li>Click sport: view gap by segment</li>
          <li>Click segment: view demand and supply</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          6. Data Input and Refresh
        </h2>
        <p className="">
          Support data uploads and automatic refresh for updated visuals without
          redevelopment.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Design Requirements</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Modern and responsive UI</li>
          <li>Consistent colors, fonts, and layout</li>
          <li>Accessible across devices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Technology Stack</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Frontend: Next.js (TypeScript) + Tailwind CSS</li>
          <li>Map: Mapbox or Leaflet</li>
          <li>Charts: Recharts, Chart.js, etc.</li>
          <li>Backend (optional): Node.js + DB</li>
          <li>Deployment: Vercel or similar</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Target Users</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Government and Sports Authorities</li>
          <li>Urban Planners</li>
          <li>Development Agencies</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">10. Business Goals</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Identify underserved regions</li>
          <li>Enable data-driven infrastructure planning</li>
          <li>Promote fair and inclusive sports access</li>
        </ul>
      </section>
    </div>
  );
}
