import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn, exportChartAsImage } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchLapPositions, LapPositionDataPoint } from '@/lib/api'; // Import new fetch function and type
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1";
import { AlertCircle, Check, ChevronsUpDown, Download } from 'lucide-react';
import { driverColor } from '@/lib/driverColor'; // Use existing driver color mapping
import { groupDriversByTeam, getLineStylesForDriver } from '@/lib/teamUtils'; // Import team utilities
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PositionChartProps {
  className?: string;
  delay?: number;
  year: number;
  event: string;
  session: string; // Should always be 'R' for this chart
}

const PositionChart: React.FC<PositionChartProps> = ({
  className,
  delay = 0,
  year,
  event,
  session // Expect 'R'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch lap position data
  const { data: positionData, isLoading, error, isError } = useQuery<LapPositionDataPoint[]>({
    queryKey: ['lapPositions', year, event, session],
    queryFn: () => fetchLapPositions(year, event, session),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && session === 'R', // Only enable for Race session
  });

  // Extract driver codes from the first data point (assuming all laps have same drivers initially)
  const driverCodes = useMemo(() => {
    if (!positionData || positionData.length === 0) return [];
    // Sort alphabetically for consistent order in selector
    return Object.keys(positionData[0]).filter(key => key !== 'LapNumber').sort();
  }, [positionData]);

  // Initialize selected drivers when data loads or driver codes change
  useEffect(() => {
    if (driverCodes.length > 0) {
      setSelectedDrivers(driverCodes); // Select all by default
    } else {
      setSelectedDrivers([]);
    }
  }, [driverCodes]);

  const handleDriverSelectionChange = (driverCode: string) => {
    setSelectedDrivers(prevSelected =>
      prevSelected.includes(driverCode)
        ? prevSelected.filter(code => code !== driverCode)
        : [...prevSelected, driverCode]
    );
  };

  const handleSelectAll = () => {
    setSelectedDrivers(driverCodes);
  };

  const handleSelectNone = () => {
    setSelectedDrivers([]);
  };

  // Handle chart download
  const handleDownload = async () => {
    if (!chartRef.current || isLoading || !positionData || positionData.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      // Brief delay to ensure chart is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use event name for the filename
      const filename = `${event.toLowerCase().replace(/\s+/g, '-')}_race_position_changes`;
      await exportChartAsImage(chartRef, filename);
    } catch (error) {
      console.error('Failed to export chart:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Render States ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }
    if (isError || !positionData) {
      return (
        <div className="w-full h-[400px] bg-gray-900/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-red-400">
           <AlertCircle className="w-10 h-10 mb-2" />
           <p className="font-semibold">Error loading position data</p>
           <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
        </div>
      );
    }
    if (positionData.length === 0 || driverCodes.length === 0) {
     return (
        <div className="w-full h-[400px] bg-gray-900/80 border border-gray-700/50 rounded-lg flex items-center justify-center text-gray-500">
           No position data found for this session.
        </div>
      );
    }

    // Group drivers by team to determine styling
    const teamGroups = groupDriversByTeam(selectedDrivers, year);

    // --- Render Chart ---
    return (
      <ResponsiveContainer width="100%" height={400} className="export-chart-container">
        <LineChart data={positionData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
          <XAxis
            dataKey="LapNumber"
            stroke="rgba(156, 163, 175, 0.7)"
            tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
            label={{ value: 'Lap Number', position: 'insideBottom', offset: -5, fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
            allowDecimals={false}
          />
          {/* Invert Y-axis to show P1 at the top */}
          <YAxis
            stroke="rgba(156, 163, 175, 0.7)"
            tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
            reversed={true}
            domain={[1, 'dataMax + 1']} // Domain from P1 up to max position + buffer
            interval={0} // Show ticks like P1, P2, P3...
            tickFormatter={(value) => `P${value}`}
            allowDecimals={false}
            width={45}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', // Darker, more solid background
              borderColor: 'rgba(71, 85, 105, 0.6)', 
              color: '#E5E7EB', 
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', // Stronger shadow
              padding: '8px 12px' // More padding
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(100, 116, 139, 0.3)', paddingBottom: '4px' }}
            itemStyle={{ padding: '3px 0' }} // More padding between items
            formatter={(value: number | null, name: string, props: any) => {
                if (value === null) return ['DNF/N/A', name]; // Handle null positions
                const color = driverColor(name, year); // Get color for the item, passing the year
                return [
                    <span style={{ color: color }}>P{value}</span>, // Display position with color
                    name // Driver code
                ];
            }}
            labelFormatter={(label) => `Lap ${label}`}
            cursor={{ stroke: 'rgba(156, 163, 175, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }}
            // Sort items by position (ascending, so P1 comes first)
            itemSorter={(item) => {
              // Get the position, which is the value, and sort numerically
              // For DNF (null values), place them at the end
              return item.value === null ? Infinity : item.value;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            payload={selectedDrivers.map(driverCode => {
              const color = driverColor(driverCode, year);
              
              // Find the team this driver belongs to
              let team = "";
              Object.entries(teamGroups).forEach(([teamName, drivers]) => {
                if (drivers.includes(driverCode)) {
                  team = teamName;
                }
              });
              
              // Find teammates for this driver
              let teammates: string[] = [];
              Object.values(teamGroups).forEach(drivers => {
                if (drivers.includes(driverCode)) {
                  teammates = drivers;
                }
              });
              
              // Count how many teammates are actually selected
              const selectedTeammates = teammates.filter(t => selectedDrivers.includes(t));
              
              // Only determine line style if multiple drivers from the same team are selected
              let lineStyle = "";
              if (selectedTeammates.length > 1) {
                const driverIndex = teammates.indexOf(driverCode);
                switch (driverIndex % 3) {
                  case 0:
                    lineStyle = ""; // No display for solid lines
                    break;
                  case 1:
                    lineStyle = "dashed line";
                    break;
                  case 2:
                    lineStyle = "dotted line";
                    break;
                }
              }
              
              // Only show team and line style if multiple drivers from the same team are selected
              const isInMultiDriverTeam = selectedTeammates.length > 1;
              
              return {
                value: isInMultiDriverTeam && lineStyle !== "" 
                  ? `${driverCode} - ${lineStyle}` 
                  : driverCode,
                type: 'line',
                id: driverCode,
                color: color
              };
            })}
          />
          {/* Dynamically render lines for selected drivers */}
          {selectedDrivers.map((driverCode, index) => {
            const color = driverColor(driverCode, year); // Pass year to line color
            // Check if the driver exists in the base driverCodes list to prevent errors
            // if selectedDrivers somehow gets out of sync (shouldn't happen with useEffect)
            if (!driverCodes.includes(driverCode)) return null;
            
            // Find teammates for this driver
            let teammates: string[] = [];
            Object.values(teamGroups).forEach(drivers => {
              if (drivers.includes(driverCode)) {
                teammates = drivers;
              }
            });
            
            // Only get special line styles if multiple drivers from the same team are *actually selected*
            // Find how many teammates are selected
            const selectedTeammates = teammates.filter(t => selectedDrivers.includes(t));
            
            // Get line style based on teammates - only if multiple from same team are selected
            const lineStyle = selectedTeammates.length > 1 
              ? getLineStylesForDriver(driverCode, teammates, teammates.indexOf(driverCode))
              : { strokeWidth: 2 }; // Default style if no teammates are selected
            
            return (
              <Line
                key={driverCode}
                type="stepAfter" // Changed from monotone for sharp position changes
                dataKey={driverCode}
                stroke={color}
                strokeWidth={lineStyle.strokeWidth}
                strokeDasharray={lineStyle.strokeDasharray}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: color }}
                name={driverCode}
                connectNulls={false} // Don't connect lines over nulls (e.g., DNF)
                isAnimationActive={false} // Optional: disable animation for potentially many lines
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card 
      ref={chartRef}
      className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} 
      style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex items-center gap-2">
          <div>
            <CardTitle className="text-lg font-semibold text-white">Race Position Changes</CardTitle>
            <CardDescription className="text-xs text-gray-400">Select drivers to view their position changes over the laps.</CardDescription>
          </div>
        </div>

        {/* Driver Selection Popover */}
        {driverCodes.length > 0 && !isLoading && !isError && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-[180px] justify-between text-xs bg-gray-800/50 border-gray-600 hover:bg-gray-700/70 text-gray-300 hover:text-white"
              >
                {selectedDrivers.length === driverCodes.length
                  ? "All Drivers"
                  : selectedDrivers.length === 0
                  ? "Select Drivers..."
                  : `${selectedDrivers.length} Selected`}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-gray-800 border-gray-600 text-gray-200">
              <div className="p-2 flex justify-between border-b border-gray-700">
                 <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50" onClick={handleSelectAll}>Select All</Button>
                 <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-gray-700/50" onClick={handleSelectNone}>Select None</Button>
              </div>
              <ScrollArea className="h-[200px] p-2">
                {driverCodes.map((driverCode) => (
                  // Removed onClick from this div. Clicks are handled by Checkbox's onCheckedChange and Label's htmlFor.
                  <div key={driverCode} className="flex items-center space-x-2 py-1.5 px-1 rounded hover:bg-gray-700/50">
                    <Checkbox
                      id={`driver-${driverCode}`}
                      checked={selectedDrivers.includes(driverCode)}
                      onCheckedChange={() => handleDriverSelectionChange(driverCode)}
                      className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-500"
                      style={{ '--driver-color': driverColor(driverCode, year) } as React.CSSProperties} // Pass year for potential custom styling
                    />
                    <Label
                      htmlFor={`driver-${driverCode}`}
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow"
                      style={{ color: driverColor(driverCode, year) }} // Pass year to color the label
                    >
                      {driverCode}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
      <CardContent className="pt-4"> {/* Added some top padding */}
        {renderContent()}
        {!isLoading && positionData && positionData.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-7 px-2.5 text-xs bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-1.5 border border-gray-700" 
              onClick={handleDownload}
              disabled={isExporting}
              title="Download chart"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Download Chart"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionChart;
