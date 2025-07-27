"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SportsTable } from "./sports-table"
import { FacilityTypesTable } from "./facility-types-table"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export function SportsManagement() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Sports Management</h1>
          <p className="text-muted-foreground mt-2">Manage sports and facility types with lightning-fast operations</p>
        </div>

        <Tabs defaultValue="sports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="facility-types">Facility Types</TabsTrigger>
          </TabsList>

          <TabsContent value="sports">
            <Card>
              <CardHeader>
                <CardTitle>Sports Management</CardTitle>
                <CardDescription>Add, edit, delete, and bulk manage sports entries</CardDescription>
              </CardHeader>
              <CardContent>
                <SportsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facility-types">
            <Card>
              <CardHeader>
                <CardTitle>Facility Types Management</CardTitle>
                <CardDescription>Add, edit, delete, and bulk manage facility type entries</CardDescription>
              </CardHeader>
              <CardContent>
                <FacilityTypesTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  )
}
