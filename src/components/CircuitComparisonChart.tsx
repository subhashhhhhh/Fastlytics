import React, { useState, useEffect, useMemo, useRef } from 'react'; // Import useMemo and useRef
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
// Import new API function and update existing one
import { fetchSessionDrivers, fetchSectorComparison, fetchDriverLapNumbers, fetchTelemetrySpeed, SessionDriver, SectorComparisonData, SpeedDataPoint } from '@/lib/api';
import { driverColor } from '@/lib/driverColor';
import { cn, exportChartAsImage } from "@/lib/utils";
import { User, Clock, Download } from 'lucide-react'; // Import icons including Download
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1";
import { AlertCircle } from 'lucide-react';
import { areTeammates } from '@/lib/teamUtils';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Interface definitions
interface CircuitComparisonChartProps {
  className?: string;
  year: number;
  event: string;
  session: string;
}

// Note: TrackSection and SectorComparisonData interfaces remain the same as before

// Define circuit comparison chart component
const CircuitComparisonChart: React.FC<CircuitComparisonChartProps> = ({
  className,
  year,
  event,
  session
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  // State for selected drivers and laps
  const [driver1, setDriver1] = useState<string>("");
  const [driver2, setDriver2] = useState<string>("");
  const [selectedLap1, setSelectedLap1] = useState<string | number>('fastest');
  const [selectedLap2, setSelectedLap2] = useState<string | number>('fastest');

  // Fetch available drivers for this session
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session], // Keep this query
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity, gcTime: 1000 * 60 * 60 * 24,
    enabled: !!year && !!event && !!session,
  });

  // Initialize driver selections when data is available
  useEffect(() => {
    if (availableDrivers && availableDrivers.length >= 2) {
      // Set defaults to the first two drivers if available
      setDriver1(availableDrivers[0]?.code || "");
      setDriver2(availableDrivers[1]?.code || "");
      // Reset laps to fastest when drivers are initialized/changed by availableDrivers
      setSelectedLap1('fastest');
      setSelectedLap2('fastest');
    }
  }, [availableDrivers]);

  // Fetch lap numbers for Driver 1
  const { data: lapNumbers1, isLoading: isLoadingLaps1 } = useQuery<number[]>({
    queryKey: ['driverLapNumbers', year, event, session, driver1],
    queryFn: () => fetchDriverLapNumbers(year, event, session, driver1),
    staleTime: 1000 * 60 * 15, // Cache for 15 mins
    gcTime: 1000 * 60 * 30,
    enabled: !!year && !!event && !!session && !!driver1,
  });

  // Fetch lap numbers for Driver 2
  const { data: lapNumbers2, isLoading: isLoadingLaps2 } = useQuery<number[]>({
    queryKey: ['driverLapNumbers', year, event, session, driver2],
    queryFn: () => fetchDriverLapNumbers(year, event, session, driver2),
    staleTime: 1000 * 60 * 15, // Cache for 15 mins
    gcTime: 1000 * 60 * 30,
    enabled: !!year && !!event && !!session && !!driver2,
  });

  // Memoize lap options to include 'fastest'
  const lapOptions1 = useMemo(() => ['fastest', ...(lapNumbers1 || [])], [lapNumbers1]);
  const lapOptions2 = useMemo(() => ['fastest', ...(lapNumbers2 || [])], [lapNumbers2]);

  // Fetch sector comparison data - now includes selected laps
  const { data: comparisonData, isLoading: isLoadingComparison, error, isError } = useQuery<SectorComparisonData>({
    // Include selected laps in the query key
    queryKey: ['sectorComparison', year, event, session, driver1, driver2, selectedLap1, selectedLap2],
    // Pass selected laps to the API function
    queryFn: () => fetchSectorComparison(year, event, session, driver1, driver2, selectedLap1, selectedLap2),
    staleTime: 1000 * 60 * 10, // Cache comparison for 10 mins
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!driver1 && !!driver2 && driver1 !== driver2, // Keep existing enabled logic
  });

  // Fetch speed telemetry data for Driver 1
  const { data: speedData1, isLoading: isLoadingSpeed1 } = useQuery<SpeedDataPoint[]>({
    queryKey: ['speedTrace', year, event, session, driver1, selectedLap1],
    queryFn: () => fetchTelemetrySpeed(year, event, session, driver1, selectedLap1),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!driver1 && !!selectedLap1,
  });

  // Fetch speed telemetry data for Driver 2
  const { data: speedData2, isLoading: isLoadingSpeed2 } = useQuery<SpeedDataPoint[]>({
    queryKey: ['speedTrace', year, event, session, driver2, selectedLap2],
    queryFn: () => fetchTelemetrySpeed(year, event, session, driver2, selectedLap2),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!driver2 && !!selectedLap2,
  });

  // Combine speed data for both drivers
  const combinedSpeedData = useMemo(() => {
    if (!speedData1 || !speedData2) return [];
    
    // Create a map of distances to make lookup easier
    const distanceMap = new Map();
    
    // Add driver1 data to the map
    speedData1.forEach(point => {
      distanceMap.set(point.Distance, {
        Distance: point.Distance,
        [`Speed_${driver1}`]: point.Speed,
        [`Speed_${driver2}`]: null
      });
    });
    
    // Add or update with driver2 data
    speedData2.forEach(point => {
      if (distanceMap.has(point.Distance)) {
        const existingPoint = distanceMap.get(point.Distance);
        existingPoint[`Speed_${driver2}`] = point.Speed;
      } else {
        distanceMap.set(point.Distance, {
          Distance: point.Distance,
          [`Speed_${driver1}`]: null,
          [`Speed_${driver2}`]: point.Speed
        });
      }
    });
    
    // Convert map to array and sort by distance
    return Array.from(distanceMap.values()).sort((a, b) => a.Distance - b.Distance);
  }, [speedData1, speedData2, driver1, driver2]);

  // Combined loading state including speed data
  const isLoading = isLoadingDrivers || isLoadingComparison || isLoadingLaps1 || isLoadingLaps2 || isLoadingSpeed1 || isLoadingSpeed2;

  // Get driver colors
  let driver1Color = driverColor(driver1, year);
  let driver2Color = driverColor(driver2, year);

  // Check if drivers are teammates
  const sameTeam = driver1 && driver2 ? areTeammates(driver1, driver2, year) : false;

  // Override driver 2 color to white if they are teammates
  if (sameTeam) {
    driver2Color = '#FFFFFF'; // Use white for driver 2 when teammates
  }

  // Handle chart download
  const handleDownload = async () => {
    if (!chartRef.current || isLoading || !comparisonData) {
      return;
    }

    setIsExporting(true);
    try {
      // Brief delay to ensure chart is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use event name and drivers for the filename
      const filename = `${event.toLowerCase().replace(/\s+/g, '-')}_${driver1}_vs_${driver2}_circuit_comparison`;
      await exportChartAsImage(chartRef, filename);
    } catch (error) {
      console.error('Failed to export chart:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Render function
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }

    if (isError || !comparisonData) {
      return (
        <div className="w-full h-[500px] bg-gray-900/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-red-400">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="font-semibold">Error loading circuit comparison data</p>
          <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
          {driver1 === driver2 && (
            <p className="text-sm text-amber-400 mt-4">Please select two different drivers to compare.</p>
          )}
        </div>
      );
    }

    // Map through track sections and render with appropriate colors
    return (
      <div className="w-full">
        {/* Display selected laps */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: driver1Color }}></div>
            <span className="font-semibold">{driver1}</span>
             <span className="text-xs text-gray-400">(Lap {selectedLap1 === 'fastest' ? 'Fastest' : selectedLap1})</span>
          </div>
          <div className="text-gray-500">vs</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{driver2}</span>
             <span className="text-xs text-gray-400">(Lap {selectedLap2 === 'fastest' ? 'Fastest' : selectedLap2})</span>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: driver2Color }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Circuit map container */}
          <div className="circuit-map-container relative w-full h-[400px] bg-gray-900/50 rounded-lg overflow-hidden" data-export="true">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <g transform="scale(1,-1) translate(0,-500)">
                {/* Circuit base outline */}
                <path
                  d={comparisonData.circuitLayout}
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.4)"
                  strokeWidth="10" // Slightly thinner base outline
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Circuit sections highlighting advantages */}
                {comparisonData.sections.map((section) => {
                  // Determine which driver has advantage
                  let strokeColor = "rgba(156, 163, 175, 0.4)"; // Neutral color if no significant advantage
                  let advantageText = "Neutral or negligible difference";

                  // Check advantage without threshold
                  if (section.driver1Advantage && section.driver1Advantage > 0) {
                    // Driver 1 advantage
                    strokeColor = driver1Color;
                    advantageText = `${driver1} faster by ${Math.abs(section.driver1Advantage).toFixed(3)}s`;
                  } else if (section.driver1Advantage && section.driver1Advantage < 0) {
                    // Driver 2 advantage
                    strokeColor = driver2Color; // Will be white if sameTeam is true due to override above
                    advantageText = `${driver2} faster by ${Math.abs(section.driver1Advantage).toFixed(3)}s`;
                  } else if (section.driver1Advantage === 0) {
                    // Explicitly handle exact zero difference as neutral
                    advantageText = "Identical time";
                  }

                  return (
                    <path
                      key={section.id}
                      d={section.path}
                      fill="none" // No fill for section paths
                      stroke={strokeColor}
                      strokeWidth="12" // Make section highlight slightly thicker than base
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-section-name={section.name}
                    >
                      <title>{section.name}: {advantageText}</title>
                    </path>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Speed Trace Chart */}
          <div className="speed-trace-container relative w-full h-[400px] bg-gray-900/50 rounded-lg overflow-hidden">
            {combinedSpeedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={combinedSpeedData} 
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis 
                    type="number" 
                    dataKey="Distance" 
                    stroke="rgba(156, 163, 175, 0.7)" 
                    tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} 
                    tickFormatter={(value: number) => `${value.toFixed(0)}m`} 
                    domain={['dataMin', 'dataMax']} 
                    label={{ value: 'Distance (m)', position: 'insideBottomRight', offset: -5, fill: 'rgba(156, 163, 175, 0.9)' }}
                  />
                  <YAxis 
                    stroke="rgba(156, 163, 175, 0.7)" 
                    tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} 
                    domain={['auto', 'auto']} 
                    tickFormatter={(value) => `${value}`} 
                    label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fill: 'rgba(156, 163, 175, 0.9)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                      borderColor: 'rgba(100, 116, 139, 0.5)', 
                      color: '#E5E7EB', 
                      borderRadius: '6px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.5)' 
                    }} 
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }} 
                    labelFormatter={(label: number) => `Distance: ${label.toFixed(2)}m`} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey={`Speed_${driver1}`} 
                    stroke={driver1Color} 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 4, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: driver1Color }} 
                    name={`Speed_${driver1}`} 
                    connectNulls={true} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey={`Speed_${driver2}`} 
                    stroke={driver2Color} 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 4, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: driver2Color }} 
                    name={`Speed_${driver2}`}
                    connectNulls={true} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Select two drivers and their laps to view speed comparison
              </div>
            )}
          </div>
        </div>

        {/* Legend - Updated for lap display */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
              <line x1="0" y1="8" x2="16" y2="8" stroke={driver1Color} strokeWidth="3" />
            </svg>
            <span>{driver1} Advantage (Lap {selectedLap1 === 'fastest' ? 'F' : selectedLap1})</span>
          </div>
          <div className="flex items-center gap-2">
             <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
              <line x1="0" y1="8" x2="16" y2="8" stroke={driver2Color} strokeWidth="3" />
            </svg>
            <span>{driver2} Advantage (Lap {selectedLap2 === 'fastest' ? 'F' : selectedLap2})</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block">
               <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(156, 163, 175, 0.6)" strokeWidth="3" />
            </svg>
            <span>Neutral</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card 
      ref={chartRef}
      className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm", className)}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-white">Circuit & Speed Comparison by Lap</CardTitle>
          </div>

          {/* Driver and Lap selectors */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
             {/* Driver 1 Controls */}
             <div className="flex items-center gap-2">
               <Select
                 value={driver1}
                 onValueChange={(value) => {
                   setDriver1(value);
                   setSelectedLap1('fastest'); // Reset lap on driver change
                 }}
                 disabled={isLoadingDrivers || !availableDrivers}
               >
                 <SelectTrigger className="w-full sm:w-[120px] bg-gray-800/80 border-gray-700 text-gray-200 text-xs h-8 focus:border-red-500 focus:ring-red-500">
                    <User className="w-3 h-3 mr-1 opacity-70"/>
                    <SelectValue placeholder="Driver 1" />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 max-h-[200px]">
                   <SelectGroup>
                     <SelectLabel className="text-xs text-gray-500">Driver 1</SelectLabel>
                     {availableDrivers?.map((drv) => (
                       <SelectItem key={`d1-${drv.code}`} value={drv.code} className="text-xs">
                         {drv.code} ({drv.name})
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
               <Select
                 value={String(selectedLap1)}
                 onValueChange={(value) => setSelectedLap1(value === 'fastest' ? 'fastest' : parseInt(value))}
                 disabled={isLoadingLaps1 || !driver1 || lapOptions1.length <= 1}
               >
                 <SelectTrigger className="w-full sm:w-[100px] bg-gray-800/80 border-gray-700 text-gray-200 text-xs h-8 focus:border-red-500 focus:ring-red-500">
                    <Clock className="w-3 h-3 mr-1 opacity-70"/>
                    <SelectValue placeholder="Lap" />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 max-h-[200px]">
                   <SelectGroup>
                     <SelectLabel className="text-xs text-gray-500">Lap</SelectLabel>
                     {lapOptions1.map((lapOpt) => (
                       <SelectItem key={`d1-lap-${lapOpt}`} value={String(lapOpt)} className="text-xs">
                         {lapOpt === 'fastest' ? 'Fastest' : lapOpt}
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
             </div>

            <span className="text-gray-500 mx-2">vs</span>

             {/* Driver 2 Controls */}
             <div className="flex items-center gap-2">
               <Select
                 value={driver2}
                 onValueChange={(value) => {
                   setDriver2(value);
                   setSelectedLap2('fastest'); // Reset lap on driver change
                 }}
                 disabled={isLoadingDrivers || !availableDrivers}
               >
                 <SelectTrigger className="w-full sm:w-[120px] bg-gray-800/80 border-gray-700 text-gray-200 text-xs h-8 focus:border-red-500 focus:ring-red-500">
                    <User className="w-3 h-3 mr-1 opacity-70"/>
                    <SelectValue placeholder="Driver 2" />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 max-h-[200px]">
                   <SelectGroup>
                     <SelectLabel className="text-xs text-gray-500">Driver 2</SelectLabel>
                     {availableDrivers?.map((drv) => (
                       <SelectItem key={`d2-${drv.code}`} value={drv.code} className="text-xs">
                         {drv.code} ({drv.name})
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
               <Select
                 value={String(selectedLap2)}
                 onValueChange={(value) => setSelectedLap2(value === 'fastest' ? 'fastest' : parseInt(value))}
                 disabled={isLoadingLaps2 || !driver2 || lapOptions2.length <= 1}
               >
                 <SelectTrigger className="w-full sm:w-[100px] bg-gray-800/80 border-gray-700 text-gray-200 text-xs h-8 focus:border-red-500 focus:ring-red-500">
                    <Clock className="w-3 h-3 mr-1 opacity-70"/>
                    <SelectValue placeholder="Lap" />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 max-h-[200px]">
                   <SelectGroup>
                     <SelectLabel className="text-xs text-gray-500">Lap</SelectLabel>
                     {lapOptions2.map((lapOpt) => (
                       <SelectItem key={`d2-lap-${lapOpt}`} value={String(lapOpt)} className="text-xs">
                         {lapOpt === 'fastest' ? 'Fastest' : lapOpt}
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
             </div>
           </div>
         </div>
       </CardHeader>
       <CardContent className="pt-0">
         {renderContent()}
         {!isLoading && comparisonData && (
           <div className="mt-4 flex justify-end">
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

 export default CircuitComparisonChart;
