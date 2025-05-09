import InteractiveSaudiMap from "@/components/saudi-map"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl font-bold mb-8">Interactive Map of Saudi Arabia</h1>
      <div className="w-full max-w-4xl">
        <InteractiveSaudiMap />
      </div>
    </main>
  )
}
