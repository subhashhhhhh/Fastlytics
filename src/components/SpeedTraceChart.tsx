import React, { useState } from 'react'; // Import useState
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetrySpeed, fetchSessionDrivers, SessionDriver } from '@/lib/api'; // Import fetchSessionDrivers
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from 'lucide-react'; // Import User
import { driverColor } from '@/lib/driverColor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card

interface SpeedTraceChartProps {
  className?: string;
  delay?: number;
  title: string; // Keep title prop
  // Session identifiers
  year: number;
  event: string;
  session: string;
  // Initial driver (optional)
  initialDriver?: string;
  // Lap identifier (can be made selectable later too)
  lap: string | number;
}

const SpeedTraceChart: React.FC<SpeedTraceChartProps> = ({
  className,
  delay = 0,
  title: initialTitle, // Rename prop to avoid conflict with state
  year,
  event,
  session,
  initialDriver = "VER", // Default initial driver
  lap = "fastest" // Default lap
}) => {

  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);
  // TODO: Add state for selectedLap if you want lap selection

  // Fetch available drivers
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!year && !!event && !!session,
  });

  // Fetch speed data based on selected driver and lap
  const { data: speedData, isLoading: isLoadingSpeed, error, isError } = useQuery({
    queryKey: ['speedTrace', year, event, session, selectedDriver, lap],
    queryFn: () => fetchTelemetrySpeed(year, event, session, selectedDriver, lap),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!selectedDriver && !!lap,
  });

  const color = driverColor(selectedDriver);
  const isLoading = isLoadingDrivers || isLoadingSpeed;

  // Update title dynamically
  const chartTitle = `${initialTitle} (${selectedDriver} - Lap ${lap})`;

  // --- Render States ---
  if (isLoading) {
    return (
      <Card className={cn("chart-container bg-gray-900/80 border-gray-700", className)}>
         <CardHeader>
           <CardTitle className="text-lg font-semibold text-gray-400">{chartTitle}</CardTitle>
           {/* Placeholder for selector */}
           <Skeleton className="w-[180px] h-10 mt-3 bg-gray-800/50" />
         </CardHeader>
         <CardContent>
           <Skeleton className="w-full h-[300px] bg-gray-800/50" />
         </CardContent>
       </Card>
    );
  }

  if (isError || !speedData) {
    return (
       <Card className={cn("chart-container bg-gray-900/80 border-red-500/30", className)}>
         <CardHeader>
           <CardTitle className="text-lg font-semibold text-gray-400">{chartTitle}</CardTitle>
            {/* Still show selector even on error */}
            <div className="pt-3">
               <Select
                 value={selectedDriver}
                 onValueChange={setSelectedDriver}
                 disabled={!availableDrivers}
               >
                 <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:ring-red-500">
                   <SelectValue placeholder="Select driver..." />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-white">
                   <SelectGroup>
                     <SelectLabel>Driver</SelectLabel>
                     {availableDrivers?.map((d) => (
                       <SelectItem key={d.code} value={d.code}>
                         {d.name} ({d.code})
                       </SelectItem>
                     ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
             </div>
         </CardHeader>
         <CardContent>
           <div className="w-full h-[300px] flex flex-col items-center justify-center text-red-400">
             <AlertCircle className="w-10 h-10 mb-2" />
             <p className="font-semibold">Error loading speed trace</p>
             <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
           </div>
         </CardContent>
       </Card>
    );
  }

  // --- Render Chart & Controls ---
  return (
    <Card className={cn("chart-container bg-gray-900/80 border-gray-700 animate-fade-in", className)}
          style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{chartTitle}</CardTitle>
         {/* Driver Selector */}
         <div className="pt-3">
           <Select
             value={selectedDriver}
             onValueChange={setSelectedDriver}
             disabled={!availableDrivers}
           >
             <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:ring-red-500">
               <SelectValue placeholder="Select driver..." />
             </SelectTrigger>
             <SelectContent className="bg-gray-900 border-gray-700 text-white">
               <SelectGroup>
                 <SelectLabel>Driver</SelectLabel>
                 {availableDrivers?.map((d) => (
                   <SelectItem key={d.code} value={d.code}>
                     {d.name} ({d.code})
                   </SelectItem>
                 ))}
               </SelectGroup>
             </SelectContent>
           </Select>
           {/* TODO: Add Lap Selector here if needed */}
         </div>
      </CardHeader>
      <CardContent>
        {speedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={speedData}
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
              <XAxis
                type="number"
                dataKey="Distance"
                stroke="rgba(156, 163, 175, 0.7)"
                tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
                tickFormatter={(value) => `${value}m`}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis
                dataKey="Speed"
                stroke="rgba(156, 163, 175, 0.7)"
                tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
                domain={['auto', 'dataMax + 10']}
                tickFormatter={(value) => `${value} kph`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  borderColor: 'rgba(100, 116, 139, 0.5)',
                  color: '#E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }}
                itemStyle={{ color: color }}
                formatter={(value: number, name: string) => [`${value} kph`, name]}
                labelFormatter={(label) => `Distance: ${label}m`}
              />
              <Line
                type="monotone"
                dataKey="Speed"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: color }}
                name={selectedDriver}
                connectNulls={true}
              />
              {/* <Legend /> */} {/* Legend might be redundant for single line */}
            </LineChart>
          </ResponsiveContainer>
        ) : (
           <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
             No speed telemetry data found for this selection.
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedTraceChart;
