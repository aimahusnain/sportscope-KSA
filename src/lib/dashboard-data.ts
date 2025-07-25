// ksaRegionsData is already imported from data/ksa-regions-svg.json in app/page.tsx
// We will re-export it here for consistency.
import ksaRegionsData from "../data/ksa-regions-svg.json"

// Extract region names and create lookup objects
export const regionNames: Record<string, string> = {}
export const regionPaths: Record<string, string> = {}
ksaRegionsData.regions.forEach((region) => {
  regionNames[region.id] = region.name
  regionPaths[region.id] = region.path
})

// Map of region IDs to their colors
export const regionColors: Record<string, { base: string; hover: string }> = {
  "SA-01": { base: "#FF6B6B", hover: "#FF5252" },
  "SA-02": { base: "#4ECDC4", hover: "#26C6DA" },
  "SA-03": { base: "#FFD166", hover: "#FFCA28" },
  "SA-04": { base: "#06D6A0", hover: "#00C853" },
  "SA-05": { base: "#118AB2", hover: "#0277BD" },
  "SA-06": { base: "#073B4C", hover: "#263238" },
  "SA-07": { base: "#8338EC", hover: "#7B1FA2" },
  "SA-08": { base: "#3A86FF", hover: "#2196F3" },
  "SA-09": { base: "#FB5607", hover: "#FF5722" },
  "SA-10": { base: "#FFBE0B", hover: "#FFC107" },
  "SA-11": { base: "#EF476F", hover: "#E91E63" },
  "SA-12": { base: "#06AED5", hover: "#00BCD4" },
  "SA-13": { base: "#80B918", hover: "#8BC34A" },
}

// Sample data structure with historical data
export const sampleData = {
  "SA-01": {
    gap: 1250,
    demand: 3500,
    supply: 2250,
    gapPercentage: 35.7,
    population: 8000000,
    area: 412000,
    sports: {
      Football: { gap: 450, demand: 1200, supply: 750, gapPercentage: 37.5, priority: "High" },
      Swimming: { gap: 300, demand: 800, supply: 500, gapPercentage: 37.5, priority: "High" },
      Basketball: { gap: 250, demand: 700, supply: 450, gapPercentage: 35.7, priority: "Medium" },
      Tennis: { gap: 150, demand: 400, supply: 250, gapPercentage: 37.5, priority: "Medium" },
      Volleyball: { gap: 100, demand: 400, supply: 300, gapPercentage: 25.0, priority: "Low" },
    },
    segments: {
      Students: { gap: 500, demand: 1400, supply: 900, percentage: 40 },
      Adults: { gap: 450, demand: 1300, supply: 850, percentage: 37 },
      Professionals: { gap: 300, demand: 800, supply: 500, percentage: 23 },
    },
    trends: {
      "2021": { gap: 1450, demand: 3200, supply: 1750 },
      "2022": { gap: 1380, demand: 3300, supply: 1920 },
      "2023": { gap: 1320, demand: 3400, supply: 2080 },
      "2024": { gap: 1250, demand: 3500, supply: 2250 },
    },
    demographics: {
      Male: { gap: 750, demand: 2100, supply: 1350, percentage: 60 },
      Female: { gap: 500, demand: 1400, supply: 900, percentage: 40 },
    },
  },
  "SA-02": {
    gap: 980,
    demand: 2800,
    supply: 1820,
    gapPercentage: 35.0,
    population: 6500000,
    area: 164000,
    sports: {
      Football: { gap: 350, demand: 950, supply: 600, gapPercentage: 36.8, priority: "High" },
      Swimming: { gap: 220, demand: 650, supply: 430, gapPercentage: 33.8, priority: "Medium" },
      Basketball: { gap: 180, demand: 550, supply: 370, gapPercentage: 32.7, priority: "Medium" },
      Tennis: { gap: 130, demand: 350, supply: 220, gapPercentage: 37.1, priority: "Medium" },
      Volleyball: { gap: 100, demand: 300, supply: 200, gapPercentage: 33.3, priority: "Low" },
    },
    segments: {
      Students: { gap: 400, demand: 1100, supply: 700, percentage: 39 },
      Adults: { gap: 350, demand: 1000, supply: 650, percentage: 36 },
      Professionals: { gap: 230, demand: 700, supply: 470, percentage: 25 },
    },
    trends: {
      "2021": { gap: 1150, demand: 2600, supply: 1450 },
      "2022": { gap: 1080, demand: 2700, supply: 1620 },
      "2023": { gap: 1020, demand: 2750, supply: 1730 },
      "2024": { gap: 980, demand: 2800, supply: 1820 },
    },
    demographics: {
      Male: { gap: 590, demand: 1680, supply: 1090, percentage: 60 },
      Female: { gap: 390, demand: 1120, supply: 730, percentage: 40 },
    },
  },
  "SA-03": {
    gap: 750,
    demand: 2100,
    supply: 1350,
    gapPercentage: 35.7,
    population: 4200000,
    area: 540000,
    sports: {
      Football: { gap: 280, demand: 700, supply: 420, gapPercentage: 40.0, priority: "High" },
      Swimming: { gap: 180, demand: 500, supply: 320, gapPercentage: 36.0, priority: "High" },
      Basketball: { gap: 150, demand: 450, supply: 300, gapPercentage: 33.3, priority: "Medium" },
      Tennis: { gap: 90, demand: 250, supply: 160, gapPercentage: 36.0, priority: "Medium" },
      Volleyball: { gap: 50, demand: 200, supply: 150, gapPercentage: 25.0, priority: "Low" },
    },
    segments: {
      Students: { gap: 300, demand: 850, supply: 550, percentage: 40 },
      Adults: { gap: 280, demand: 800, supply: 520, percentage: 38 },
      Professionals: { gap: 170, demand: 450, supply: 280, percentage: 22 },
    },
    trends: {
      "2021": { gap: 850, demand: 1950, supply: 1100 },
      "2022": { gap: 810, demand: 2000, supply: 1190 },
      "2023": { gap: 780, demand: 2050, supply: 1270 },
      "2024": { gap: 750, demand: 2100, supply: 1350 },
    },
    demographics: {
      Male: { gap: 450, demand: 1260, supply: 810, percentage: 60 },
      Female: { gap: 300, demand: 840, supply: 540, percentage: 40 },
    },
  },
}
