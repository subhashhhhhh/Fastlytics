import React, { useState, useEffect, useRef } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis, Cell // Import Cell
} from 'recharts';
import { cn, exportChartAsImage } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetryGear, fetchSessionDrivers, fetchLapTimes, SessionDriver, GearMapDataPoint } from '@/lib/api'; // Added fetchLapTimes
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1";
import { AlertCircle, User, Clock, Download } from 'lucide-react'; // Added Download icon
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define a color scale for gears - Updated for better dark UI contrast
const gearColors = [
  '#33bbee', // 1st Gear (Cyan)
  '#ee7733', // 2nd Gear (Orange)
  '#009988', // 3rd Gear (Teal)
  '#cc3311', // 4th Gear (Red)
  '#ee3377', // 5th Gear (Magenta)
  '#0077bb', // 6th Gear (Blue)
  '#aacc00', // 7th Gear (Lime Green) - Changed from Light Gray
  '#ffdd55'  // 8th Gear (Yellow) - Changed from Lighter Gray
];
const getGearColor = (gear: number): string => {
    // Handle potential gear 0 (Neutral) or gears outside 1-8
    if (gear >= 1 && gear <= gearColors.length) {
        return gearColors[gear - 1];
    }
    return '#6B7280'; // Default gray for unknown/neutral
};


interface GearMapChartProps {
  className?: string;
  delay?: number;
  year: number;
  event: string;
  session: string;
  initialDriver: string;
  lap?: string | number; // Make lap optional, default to 'fastest'
}

const GearMapChart: React.FC<GearMapChartProps> = ({
  className,
  delay = 0,
  year,
  event,
  session,
  initialDriver,
  lap = 'fastest' // Default lap prop to 'fastest'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);
  const [selectedLap, setSelectedLap] = useState<string | number>(lap); // Initialize state with prop
  const [lapOptions, setLapOptions] = useState<Array<string | number>>(['fastest']);
  const [isExporting, setIsExporting] = useState(false);

  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session], // Keep this query
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity, gcTime: 1000 * 60 * 60 * 24, enabled: !!year && !!event && !!session,
  });

  // Fetch lap times for the selected driver to populate lap options
  const { data: lapTimes } = useQuery({
    queryKey: ['lapTimes', year, event, session, selectedDriver], // Use selectedDriver
    queryFn: () => fetchLapTimes(year, event, session, [selectedDriver]),
    enabled: !!year && !!event && !!session && !!selectedDriver,
  });

  // Effect to update lap options when lapTimes data is available
  useEffect(() => {
    if (lapTimes && lapTimes.length > 0) {
      const validLaps = lapTimes
        .filter(lap => lap[selectedDriver] !== null) // Filter laps where driver has data
        .map(lap => lap.LapNumber.toString());
      setLapOptions(['fastest', ...validLaps]);
    } else {
      setLapOptions(['fastest']); // Reset if no lap times
    }
    // Reset selected lap to 'fastest' when driver changes, unless it's the initial load with a specific lap prop
    if (selectedDriver !== initialDriver) {
        setSelectedLap('fastest');
    } else {
        setSelectedLap(lap); // Ensure initial lap prop is respected on mount
    }
  }, [lapTimes, selectedDriver, initialDriver, lap]); // Add dependencies

  // Fetch gear data based on selected driver and lap
  const { data: gearData, isLoading: isLoadingGear, error, isError } = useQuery<GearMapDataPoint[]>({
    queryKey: ['gearMap', year, event, session, selectedDriver, selectedLap], // Use selectedLap state
    queryFn: () => fetchTelemetryGear(year, event, session, selectedDriver, selectedLap), // Use selectedLap state
    staleTime: 1000 * 60 * 10, gcTime: 1000 * 60 * 30, retry: 1,
    enabled: !!year && !!event && !!session && !!selectedDriver && !!selectedLap, // Use selectedLap state
  });

  const isLoading = isLoadingDrivers || isLoadingGear;
  const chartTitle = `${selectedDriver}'s ${selectedLap === 'fastest' ? 'Fastest Lap' : `Lap ${selectedLap}`} Gear Shifts`;

  // Handle chart download
  const handleDownload = async () => {
    if (!chartRef.current || isLoading || !gearData || gearData.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      // Brief delay to ensure chart is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use event name, driver, and lap for the filename
      const filename = `${event.toLowerCase().replace(/\s+/g, '-')}_${selectedDriver}_${selectedLap === 'fastest' ? 'fastest' : `lap${selectedLap}`}_gearmap`;
      await exportChartAsImage(chartRef, filename);
    } catch (error) {
      console.error('Failed to export chart:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderContent = () => {
    // Use LoadingSpinnerF1 instead of Skeleton
    if (isLoading) {
      return (
        <div className="w-full h-[350px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }

    // Combine error and no data checks for clarity
    if (isError || !gearData || gearData.length === 0) {
      const message = isError
        ? (error as Error)?.message || 'Could not fetch data.'
        : `No gear telemetry data found for ${selectedDriver} lap ${selectedLap}.`; // Use selectedLap here
      const title = isError ? "Error loading gear map" : "No Data Available";
      return (
        <div className="w-full h-[350px] bg-gray-900/80 border border-gray-700/50 rounded-lg flex flex-col items-center justify-center text-gray-500">
           <AlertCircle className={`w-10 h-10 mb-2 ${isError ? 'text-red-400' : ''}`} />
           <p className={`font-semibold ${isError ? 'text-red-400' : ''}`}>{title}</p>
           <p className="text-xs mt-1">{message}</p>
        </div>
      );
    }

    // Prepare data for ScatterChart
    const scatterData = gearData.map(point => ({
        x: point.X,
        y: point.Y,
        z: point.nGear // Gear number for ZAxis mapping
    }));

    return (
      <ResponsiveContainer width="100%" height={350} className="export-chart-container">
        <ScatterChart margin={{ top: 15, right: 10, bottom: 10, left: 10 }}>
          <XAxis type="number" dataKey="x" hide={true} domain={['dataMin', 'dataMax']} />
          <YAxis type="number" dataKey="y" hide={true} domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} />
          <ZAxis type="number" dataKey="z" range={[1, 8]} name="Gear" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(100, 116, 139, 0.5)', color: '#E5E7EB', borderRadius: '6px' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number, name: string, props: any) => [`Gear: ${props.payload.z}`, null]}
          />
          <Legend
             formatter={(value, entry, index) => `Gear ${index + 1}`}
             iconSize={10}
             wrapperStyle={{ paddingTop: '10px' }}
             payload={gearColors.map((color, index) => ({
                 value: `Gear ${index + 1}`, type: 'circle', id: `ID${index}`, color: color
             }))}
          />
          {/* Render points individually with Cell for color */}
          <Scatter name="Track Position" data={scatterData} fill="#8884d8" shape="circle">
             {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getGearColor(entry.z)} />
             ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
     <Card 
       ref={chartRef}
       className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} 
       style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}
     >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
           <div className="flex items-center gap-2">
             <CardTitle className="text-lg font-semibold text-white">{chartTitle}</CardTitle>
           </div>
           {/* Driver and Lap Selectors */}
           <div className="flex gap-2">
             <Select
               value={selectedDriver}
               onValueChange={(value) => {
                 setSelectedDriver(value);
                 // Reset lap selection when driver changes
                 setSelectedLap('fastest');
               }}
               disabled={isLoadingDrivers || !availableDrivers}
             >
               {/* Increased width and added min-w */}
               <SelectTrigger className="w-full sm:w-[150px] min-w-[100px] bg-gray-800/80 border-gray-700 text-gray-200 text-sm h-9">
                 <User className="w-4 h-4 mr-2 opacity-70"/>
                 <SelectValue placeholder="Driver" />
               </SelectTrigger>
               <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                 <SelectGroup>
                   <SelectLabel className="text-xs text-gray-500">Driver</SelectLabel>
                   {availableDrivers?.map((drv) => (
                     <SelectItem key={drv.code} value={drv.code} className="text-sm">
                       {drv.code}
                     </SelectItem>
                   ))}
                 </SelectGroup>
               </SelectContent>
             </Select>
             <Select
               value={selectedLap.toString()} // Value must be string
               onValueChange={(value) => setSelectedLap(value === 'fastest' ? 'fastest' : parseInt(value))}
               disabled={isLoading || lapOptions.length <= 1}
             >
               {/* Increased width */}
               <SelectTrigger className="w-full sm:w-[120px] bg-gray-800/80 border-gray-700 text-gray-200 text-sm h-9">
                 <Clock className="w-4 h-4 mr-2 opacity-70"/>
                 <SelectValue placeholder="Lap" />
               </SelectTrigger>
               <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 max-h-[200px]"> {/* Added max-height */}
                 <SelectGroup>
                   <SelectLabel className="text-xs text-gray-500">Lap</SelectLabel>
                   {lapOptions.map((lapOpt) => (
                     <SelectItem key={lapOpt.toString()} value={lapOpt.toString()} className="text-sm">
                       {lapOpt === 'fastest' ? 'Fastest' : lapOpt}
                     </SelectItem>
                   ))}
                 </SelectGroup>
               </SelectContent>
             </Select>
           </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
        {!isLoading && gearData && gearData.length > 0 && (
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

export default GearMapChart;
