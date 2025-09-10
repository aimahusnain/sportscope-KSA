"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Supply Data
const supplyData = [
  {
    region: "Riyadh",
    city: "Riyadh",
    facilityName: "وقت اللياقة",
    facilityType: "25m",
    facilityOwner: "Private",
    yearOfSupply: 2025,
    lat: 24.692624,
    lon: 46.605511,
    usage: 7.6,
    closestFacility: 4.566,
  },
  {
    region: "Riyadh",
    city: "Riyadh",
    facilityName: "Fitness Time - Rawabi FT",
    facilityType: "25m",
    facilityOwner: "Private",
    yearOfSupply: 2025,
    lat: 24.684777,
    lon: 46.790926,
    usage: 7.6,
    closestFacility: 4.111,
  },
  {
    region: "Riyadh",
    city: "Riyadh",
    facilityName: "Fitness Time PLUS - وقت اللياقة بلس",
    facilityType: "25m",
    facilityOwner: "Private",
    yearOfSupply: 2025,
    lat: 24.7841297,
    lon: 46.6459804,
    usage: 7.6,
    closestFacility: 1.671,
  },
  {
    region: "Riyadh",
    city: "Riyadh",
    facilityName: "Sports Facilities Al-Imam University",
    facilityType: "50m",
    facilityOwner: "Private",
    yearOfSupply: 2025,
    lat: 24.8080166,
    lon: 46.701325,
    usage: 7.6,
    closestFacility: 2.644,
  },
  {
    region: "Riyadh",
    city: "Riyadh",
    facilityName: "KSU Swimming Pool",
    facilityType: "50m",
    facilityOwner: "Private",
    yearOfSupply: 2025,
    lat: 24.7288141,
    lon: 46.6268671,
    usage: 7.6,
    closestFacility: 1.708,
  },
]

// Demand Data
const demandData = [
  { region: "Riyadh", city: "Riyadh", population: 8391929, yearOfGap: 2026, projected25m: 14, projected50m: 7 },
  { region: "Riyadh", city: "Riyadh", population: 8780386, yearOfGap: 2027, projected25m: 16, projected50m: 8 },
  { region: "Riyadh", city: "Riyadh", population: 9175621, yearOfGap: 2028, projected25m: 18, projected50m: 9 },
  { region: "Riyadh", city: "Riyadh", population: 9577483, yearOfGap: 2029, projected25m: 20, projected50m: 10 },
  { region: "Riyadh", city: "Riyadh", population: 9985241, yearOfGap: 2030, projected25m: 21, projected50m: 10 },
  { region: "Riyadh", city: "Riyadh", population: 10284675, yearOfGap: 2031, projected25m: 23, projected50m: 11 },
  { region: "Riyadh", city: "Riyadh", population: 10583381, yearOfGap: 2032, projected25m: 25, projected50m: 12 },
  { region: "Riyadh", city: "Riyadh", population: 10880638, yearOfGap: 2033, projected25m: 26, projected50m: 13 },
  { region: "Riyadh", city: "Riyadh", population: 11178290, yearOfGap: 2034, projected25m: 28, projected50m: 14 },
  { region: "Riyadh", city: "Riyadh", population: 11476546, yearOfGap: 2035, projected25m: 29, projected50m: 14 },
]

// MCA Data
const mcaData = [
  { criteria: "Equity of access", value: "24%", score: 5, weight: "20%", finalScore: 1 },
  { criteria: "Severity of the gap", value: "", score: 2, weight: "20%", finalScore: 0.4 },
  { criteria: "Utilization and efficiency", value: "14%", score: 5, weight: "20%", finalScore: 1 },
  { criteria: "Gap timing", value: "2030", score: 3, weight: "20%", finalScore: 0.6 },
  { criteria: "Asset class commercial attractiveness", value: "0.75", score: 2, weight: "20%", finalScore: 0.4 },
]

const scoringTable = [
  {
    criteria: "Asset class commercial attractiveness",
    score1: "80%",
    score2: "60%",
    score3: "40%",
    score4: "20%",
    score5: "0%",
  },
  { criteria: "Gap timing", score1: "5", score2: "4", score3: "3", score4: "2", score5: "1" },
  { criteria: "Utilization and efficiency", score1: "80%", score2: "60%", score3: "40%", score4: "20%", score5: "0%" },
  { criteria: "Severity of the gap", score1: "80%", score2: "60%", score3: "40%", score4: "20%", score5: "0%" },
  { criteria: "Equity of access", score1: "", score2: "", score3: "", score4: "", score5: "" },
]

export default function FacilityDashboard() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-balance">Swimming Facility Analysis Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground text-pretty">
          Comprehensive analysis of swimming facility supply, demand, and multi-criteria assessment for Riyadh
        </p>
      </div>

      <Tabs defaultValue="supply" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="supply" className="text-sm">
            Supply Data
          </TabsTrigger>
          <TabsTrigger value="demand" className="text-sm">
            Demand Data
          </TabsTrigger>
          <TabsTrigger value="mca" className="text-sm">
            MCA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supply" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">Swimming Facility Supply Analysis</CardTitle>
              <CardDescription className="text-sm">
                Current and planned swimming facilities in Riyadh region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[800px] px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Region</TableHead>
                        <TableHead className="text-xs md:text-sm">City</TableHead>
                        <TableHead className="text-xs md:text-sm min-w-[150px]">Facility Name</TableHead>
                        <TableHead className="text-xs md:text-sm">Type</TableHead>
                        <TableHead className="text-xs md:text-sm">Owner</TableHead>
                        <TableHead className="text-xs md:text-sm">Year</TableHead>
                        <TableHead className="text-xs md:text-sm">Latitude</TableHead>
                        <TableHead className="text-xs md:text-sm">Longitude</TableHead>
                        <TableHead className="text-xs md:text-sm">Usage</TableHead>
                        <TableHead className="text-xs md:text-sm">Closest (km)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplyData.map((facility, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs md:text-sm">{facility.region}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.city}</TableCell>
                          <TableCell className="font-medium text-xs md:text-sm">{facility.facilityName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={facility.facilityType === "50m" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {facility.facilityType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.facilityOwner}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.yearOfSupply}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.lat.toFixed(6)}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.lon.toFixed(6)}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.usage}</TableCell>
                          <TableCell className="text-xs md:text-sm">{facility.closestFacility}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">Swimming Facility Demand Projections</CardTitle>
              <CardDescription className="text-sm">
                Population growth and projected facility demand for Riyadh (2026-2035)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Region</TableHead>
                        <TableHead className="text-xs md:text-sm">City</TableHead>
                        <TableHead className="text-xs md:text-sm">Population</TableHead>
                        <TableHead className="text-xs md:text-sm">Year of Gap</TableHead>
                        <TableHead className="text-xs md:text-sm">25m Demand</TableHead>
                        <TableHead className="text-xs md:text-sm">50m Demand</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demandData.map((demand, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs md:text-sm">{demand.region}</TableCell>
                          <TableCell className="text-xs md:text-sm">{demand.city}</TableCell>
                          <TableCell className="text-xs md:text-sm">{demand.population.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {demand.yearOfGap}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-primary font-semibold text-xs md:text-sm">
                            {demand.projected25m}
                          </TableCell>
                          <TableCell className="text-primary font-semibold text-xs md:text-sm">
                            {demand.projected50m}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mca" className="space-y-4">
          <div className="text-center">
            <Badge variant="default" className="text-sm md:text-lg px-3 md:px-4 py-1 md:py-2">
              25M Pool
            </Badge>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Multi-Criteria Analysis Results</CardTitle>
                <CardDescription className="text-sm">Weighted scoring for facility assessment criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="min-w-[500px] px-4 md:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">Criteria</TableHead>
                          <TableHead className="text-xs md:text-sm">Value</TableHead>
                          <TableHead className="text-xs md:text-sm">Score</TableHead>
                          <TableHead className="text-xs md:text-sm">Weight</TableHead>
                          <TableHead className="text-xs md:text-sm">Final Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mcaData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs md:text-sm">{item.criteria}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.value}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.weight}</TableCell>
                            <TableCell className="font-semibold text-primary text-xs md:text-sm">
                              {item.finalScore}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-primary">
                          <TableCell className="font-bold text-xs md:text-sm">Total Score</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className="font-bold text-primary text-sm md:text-lg">3.4</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Scoring Reference Table</CardTitle>
                <CardDescription className="text-sm">Scoring scale (1-5) for each assessment criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="min-w-[500px] px-4 md:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">Criteria</TableHead>
                          <TableHead className="text-xs md:text-sm">1</TableHead>
                          <TableHead className="text-xs md:text-sm">2</TableHead>
                          <TableHead className="text-xs md:text-sm">3</TableHead>
                          <TableHead className="text-xs md:text-sm">4</TableHead>
                          <TableHead className="text-xs md:text-sm">5</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scoringTable.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs md:text-sm">{item.criteria}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score1}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score2}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score3}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score4}</TableCell>
                            <TableCell className="text-xs md:text-sm">{item.score5}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
