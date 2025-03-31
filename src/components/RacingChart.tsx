import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
// Import API functions and types
import { fetchLapTimes, fetchSessionDrivers, SessionDriver, LapTimeDataPoint } from '@/lib/api';
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1"; // Import the spinner
import { AlertCircle, Users } from 'lucide-react'; // Added Users icon
import { driverColor } from '@/lib/driverColor';
// Import Select components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Use Card for layout

// Helper function to format seconds into MM:SS.mmm
const formatLapTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null || isNaN(totalSeconds)) {
    return 'N/A';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // Pad seconds with leading zero if needed, keep 3 decimal places for milliseconds
  const formattedSeconds = seconds.toFixed(3).padStart(6, '0'); // 6 = SS.mmm
  return `${minutes}:${formattedSeconds}`;
};

interface RacingChartProps {
  className?: string;
  delay?: number;
  title: string;
  year: number;
  event: string;
  session: string;
  initialDrivers: string[]; // Expect array of 2 or 3 driver codes
  staticData?: LapTimeDataPoint[]; // Optional static data prop
}

const RacingChart: React.FC<RacingChartProps> = ({
  className,
  delay = 0,
  title,
  year,
  event,
  session,
  initialDrivers, // Should be length 2 or 3
  staticData // Destructure the new prop
}) => {

  // Validate initialDrivers prop length (only if not using static data)
  if (!initialDrivers || initialDrivers.length < 2 || initialDrivers.length > 3) {
     console.error("RacingChart requires an initialDrivers prop with 2 or 3 driver codes.");
     // Render an error state or default drivers if needed
      if (!staticData) initialDrivers = ["VER", "LEC"]; // Fallback default only if fetching
   }

   // Always call useState at the top level
   const [selectedDrivers, setSelectedDrivers] = useState<string[]>(initialDrivers);

   // Determine which drivers to actually display/fetch for
   // Use initialDrivers if staticData is provided, otherwise use the state
   const driversToDisplay = staticData ? initialDrivers : selectedDrivers;

   // Fetch available drivers for the session (only if not using static data)
   const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity, // Driver list for a session won't change
    gcTime: 1000 * 60 * 60 * 24, // Keep for a day
    enabled: !staticData && !!year && !!event && !!session, // Disable if staticData is provided
  });

   // Fetch lap time data based on selected drivers (only if not using static data)
   // Use selectedDrivers state for the query key and function when fetching
   const { data: fetchedLapData, isLoading: isLoadingLapTimes, error, isError } = useQuery<LapTimeDataPoint[]>({
     queryKey: ['lapTimes', year, event, session, ...selectedDrivers.sort()], // Use state here
     queryFn: () => fetchLapTimes(year, event, session, selectedDrivers),      // Use state here
     staleTime: 1000 * 60 * 5,
     gcTime: 1000 * 60 * 15,
    retry: 1,
    enabled: !staticData && !!year && !!event && !!session && driversToDisplay.length >= 2, // Disable if staticData is provided
  });

  // Use staticData if provided, otherwise use fetched data
  const lapData = staticData || fetchedLapData;

   const handleDriverChange = (index: number, value: string) => {
     // Prevent selecting the same driver multiple times
     // Check against the current state (selectedDrivers)
     if (selectedDrivers.includes(value) && selectedDrivers[index] !== value) {
         // Optionally show a toast message here
         console.warn("Driver already selected");
        return;
    }
     // This function should only be called when not using static data
     if (!staticData) {
         const newSelection = [...selectedDrivers]; // Use state here
         newSelection[index] = value;
         setSelectedDrivers(newSelection); // Use the state setter
    }
  };

  // Adjust isLoading check for static data
  const isLoading = !staticData && (isLoadingDrivers || isLoadingLapTimes);

  // --- Render States ---
  // Simplified loading/error checks
  const renderContent = () => {
    if (isLoading) {
      // Use LoadingSpinnerF1 instead of Skeleton
      return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }
    if (isError || !lapData) {
      return (
        <div className="w-full h-[300px] bg-gray-900/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-red-400">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="font-semibold">Error loading lap times</p>
          <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
        </div>
      );
    }
    if (lapData.length === 0) {
      return (
        <div className="w-full h-[300px] bg-gray-900/80 border border-gray-700/50 rounded-lg flex items-center justify-center text-gray-500">
          No common lap data found for comparison.
        </div>
      );
    }

    // --- Render Chart ---
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lapData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
          <XAxis dataKey="LapNumber" stroke="rgba(156, 163, 175, 0.7)" tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} padding={{ left: 10, right: 10 }} />
          {/* Updated YAxis tickFormatter */}
          <YAxis stroke="rgba(156, 163, 175, 0.7)" tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} tickFormatter={formatLapTime} allowDecimals={true} width={60} /> {/* Increased width for MM:SS.mmm */}
          {/* Updated Tooltip formatter */}
          <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(100, 116, 139, 0.5)', color: '#E5E7EB', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }} labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }} itemStyle={{ color: '#E5E7EB' }} formatter={(value: number | null) => [formatLapTime(value), null]} labelFormatter={(label) => `Lap ${label}`} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {/* Dynamically render lines */}
          {driversToDisplay.map((driverCode) => {
            const color = driverColor(driverCode);
            return (
              <Line
                key={driverCode}
                type="monotone"
                dataKey={driverCode}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: color }}
                name={driverCode}
                connectNulls={true}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
           <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
           {/* Driver Selectors (Hide if using static data) */}
           {!staticData && (
             <div className="flex flex-wrap gap-2">
               {driversToDisplay.map((driverCode, index) => (
                 <Select
                   key={index}
                   value={driverCode}
                   onValueChange={(value) => handleDriverChange(index, value)}
                   disabled={isLoadingDrivers || !availableDrivers}
                 >
                   <SelectTrigger className="w-full sm:w-[150px] bg-gray-800/80 border-gray-700 text-gray-200 text-xs h-8 focus:border-red-500 focus:ring-red-500">
                   <SelectValue placeholder="Select Driver" />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                   <SelectGroup>
                     <SelectLabel className="text-xs text-gray-500">Driver {index + 1}</SelectLabel>
                     {availableDrivers?.map((drv) => (
                       <SelectItem key={drv.code} value={drv.code} className="text-xs">
                         {drv.code} ({drv.name})
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
                </Select>
              ))}
              {/* Optional: Add button to add/remove 3rd driver */}
            </div>
           )} {/* <-- Added closing parenthesis for conditional rendering */}
         </div>
       </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default RacingChart;
