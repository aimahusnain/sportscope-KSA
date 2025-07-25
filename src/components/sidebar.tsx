"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Building2,
  ChevronDown,
  MapPin,
  Building,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import * as React from "react";

// Remove the hardcoded facilityTypes array - we'll use the prop instead
const locationTypes = [
  { value: "Urban", icon: Building, label: "Urban" },
  { value: "Rural", icon: MapPin, label: "Rural" },
];

type SidebarProps = {
  sports: { id: string; name: string }[];
  facilityTypes: { id: string; name: string }[];
};

export default function Sidebar({ sports, facilityTypes }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = React.useState<
    string[]
  >([]);
  const [selectedLocationTypes, setSelectedLocationTypes] = React.useState<
    string[]
  >([]);
  const [ministryOfSports, setMinistryOfSports] = React.useState(false);

  // Set initial state based on screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSport = (sportName: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportName) 
        ? prev.filter((s) => s !== sportName) 
        : [...prev, sportName]
    );
  };

  const toggleFacilityType = (facilityTypeName: string) => {
    setSelectedFacilityTypes((prev) =>
      prev.includes(facilityTypeName)
        ? prev.filter((f) => f !== facilityTypeName)
        : [...prev, facilityTypeName]
    );
  };

  const toggleLocationType = (locationType: string) => {
    setSelectedLocationTypes((prev) =>
      prev.includes(locationType)
        ? prev.filter((l) => l !== locationType)
        : [...prev, locationType]
    );
  };

  const selectAllSports = () => {
    if (selectedSports.length === sports.length) {
      setSelectedSports([]);
    } else {
      setSelectedSports(sports.map(sport => sport.name));
    }
  };

  const selectAllFacilityTypes = () => {
    if (selectedFacilityTypes.length === facilityTypes.length) {
      setSelectedFacilityTypes([]);
    } else {
      setSelectedFacilityTypes(facilityTypes.map(facilityType => facilityType.name));
    }
  };

  // Calculate total selected filters
  const totalFilters =
    selectedSports.length +
    selectedFacilityTypes.length +
    selectedLocationTypes.length +
    (ministryOfSports ? 1 : 0);

  return (
    <div className="relative flex h-[calc(100vh-64px)]">
      {/* Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="sm"
        className={`z-[9999] flex items-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white text-black shadow-lg border-0 transition-all duration-300
          ${
            isOpen
              ? "fixed top-20 left-[320px] rounded-l-none rounded-r-md md:absolute md:top-2 md:-right-9 md:rounded-l-none md:rounded-r-md"
              : "fixed top-20 left-4 rounded-md md:absolute md:top-2 md:left-4 md:rounded-md"
          }`}
        aria-label={isOpen ? "Close filters" : "Open filters"}
      >
        {isOpen ? (
          <>
            <PanelLeftClose className="h-4 w-4" />
          </>
        ) : (
          <>
            <PanelLeft className="h-4 w-4" />
            <span className="ml-1 font-medium md:hidden">Filters</span>
            {totalFilters > 0 && (
              <Badge className="ml-1 bg-white text-black text-xs font-bold min-w-[20px] h-5 flex items-center justify-center">
                {totalFilters}
              </Badge>
            )}
          </>
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative top-16 md:top-0 left-0 md:left-auto
          h-[calc(100vh-64px)] 
          w-80 max-w-[90vw] md:max-w-none
          border-r border-border/40 
          bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 
          overflow-y-auto 
          transition-all duration-300 ease-in-out 
          z-[9998] md:z-auto
          ${
            isOpen
              ? "translate-x-0 md:translate-x-0 md:w-80"
              : "-translate-x-full md:translate-x-0 md:w-0"
          }
          md:sticky md:top-16
        `}
      >
        <div className={`p-4 sm:p-6 space-y-4 sm:space-y-6`}>
          {/* Sports Selection */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-black dark:text-white">
                  Sports
                  {selectedSports.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-lime-100 text-black border-lime-200 dark:bg-lime-900 dark:text-white dark:border-lime-700"
                    >
                      {selectedSports.length}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllSports}
                  className="h-7 px-3 text-xs font-medium text-lime-600 hover:text-black hover:bg-lime-100 dark:text-lime-400 dark:hover:text-white dark:hover:bg-lime-900/50"
                >
                  {selectedSports.length === sports.length ? "Clear" : "All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 border-border/60 hover:border-lime-300 bg-transparent text-black dark:text-white"
                  >
                    <span className="text-sm text-black/70 dark:text-white/70 truncate">
                      {selectedSports.length === 0
                        ? "Select sports..."
                        : `${selectedSports.length} sport${
                            selectedSports.length > 1 ? "s" : ""
                          } selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 max-w-[90vw] max-h-64 overflow-y-auto z-[10000]">
                  {sports.map((sport) => (
                    <DropdownMenuCheckboxItem
                      key={sport.id}
                      checked={selectedSports.includes(sport.name)}
                      onCheckedChange={() => toggleSport(sport.name)}
                      className="cursor-pointer text-black dark:text-white"
                    >
                      {sport.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Facility Types Selection */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-black dark:text-white">
                  Facility Type
                  {selectedFacilityTypes.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-lime-100 text-black border-lime-200 dark:bg-lime-900 dark:text-white dark:border-lime-700"
                    >
                      {selectedFacilityTypes.length}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllFacilityTypes}
                  className="h-7 px-3 text-xs font-medium text-lime-600 hover:text-black hover:bg-lime-100 dark:text-lime-400 dark:hover:text-white dark:hover:bg-lime-900/50"
                >
                  {selectedFacilityTypes.length === facilityTypes.length
                    ? "Clear"
                    : "All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 border-border/60 hover:border-lime-300 bg-transparent text-black dark:text-white"
                  >
                    <span className="text-sm text-black/70 dark:text-white/70 truncate">
                      {selectedFacilityTypes.length === 0
                        ? "Select facility types..."
                        : `${selectedFacilityTypes.length} facilit${
                            selectedFacilityTypes.length > 1 ? "ies" : "y"
                          } selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 max-w-[90vw] max-h-64 overflow-y-auto z-[10000]">
                  {facilityTypes.map((facilityType) => (
                    <DropdownMenuCheckboxItem
                      key={facilityType.id}
                      checked={selectedFacilityTypes.includes(facilityType.name)}
                      onCheckedChange={() => toggleFacilityType(facilityType.name)}
                      className="cursor-pointer text-black dark:text-white"
                    >
                      {facilityType.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Location Type Selection */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-black dark:text-white">
                Location Type
                {selectedLocationTypes.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-lime-100 text-black border-lime-200 dark:bg-lime-900 dark:text-white dark:border-lime-700"
                  >
                    {selectedLocationTypes.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {locationTypes.map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="lg"
                    className={`h-16 flex-col gap-2 font-medium transition-all duration-200 ${
                      selectedLocationTypes.includes(value)
                        ? "bg-lime-500 hover:bg-lime-600 text-black border-lime-500 shadow-md dark:bg-lime-500 dark:hover:bg-lime-600 dark:text-black"
                        : "hover:bg-lime-50 hover:border-lime-200 text-black dark:hover:bg-lime-900/20 dark:hover:border-lime-700 dark:text-white"
                    }`}
                    onClick={() => toggleLocationType(value)}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        selectedLocationTypes.includes(value)
                          ? "text-black"
                          : "text-lime-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        selectedLocationTypes.includes(value)
                          ? "text-black"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ministry of Sports */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="ministry-sports"
                  checked={ministryOfSports}
                  onCheckedChange={(checked) =>
                    setMinistryOfSports(checked === true)
                  }
                  className="data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-black"
                />
                <Label
                  htmlFor="ministry-sports"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer text-black dark:text-white"
                >
                  <Building2 className="w-4 h-4 text-lime-500" />
                  Ministry of Sports
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay for mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[9997] md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}