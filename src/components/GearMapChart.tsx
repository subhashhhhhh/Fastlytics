import React, { useState } from 'react'; // Import useState
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetryGear, fetchSessionDrivers, SessionDriver } from '@/lib/api'; // Import fetchSessionDrivers
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from 'lucide-react'; // Import User
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card

// Define props for the dynamic chart
interface GearMapChartProps {
  className?: string;
  delay?: number;
  title: string;
  year: number;
  event: string;
  session: string;
  initialDriver?: string; // Make initial driver optional
  lap: string | number;
}

// Define a color scale for gears
const gearColors = [
  '#6B7280', // 0/N - Gray
  '#A1A1AA', // 1 - Gray
  '#FACC15', // 2 - Yellow
  '#FB923C', // 3 - Orange
  '#4ADE80', // 4 - Green
  '#2DD4BF', // 5 - Teal
  '#3B82F6', // 6 - Blue
  '#A78BFA', // 7 - Violet
  '#F43F5E', // 8 - Red/Pink
];

const GearMapChart: React.FC<GearMapChartProps> = ({
  className,
  delay = 0,
  title: initialTitle,
  year,
  event,
  session,
  initialDriver = "VER", // Default initial driver
  lap = "fastest"
}) => {

  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);
  // TODO: Add state for selectedLap

  // Fetch available drivers
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!year && !!event && !!session,
  });

  // Fetch gear data based on selected driver and lap
  const { data: gearData, isLoading: isLoadingGear, error, isError } = useQuery({
    queryKey: ['gearMap', year, event, session, selectedDriver, lap],
    queryFn: () => fetchTelemetryGear(year, event, session, selectedDriver, lap),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!selectedDriver && !!lap,
  });

  const isLoading = isLoadingDrivers || isLoadingGear;
  const chartTitle = `${initialTitle} (${selectedDriver} - Lap ${lap})`;

  // --- Render States ---
  if (isLoading) {
    return (
       <Card className={cn("chart-container bg-gray-900/80 border-gray-700", className)}>
         <CardHeader>
           <CardTitle className="text-lg font-semibold text-gray-400">{chartTitle}</CardTitle>
           <Skeleton className="w-[180px] h-10 mt-3 bg-gray-800/50" />
         </CardHeader>
         <CardContent>
           <Skeleton className="w-full aspect-square max-w-[500px] mx-auto bg-gray-800/50" /> {/* Aspect square skeleton */}
         </CardContent>
       </Card>
    );
  }

  if (isError || !gearData) {
    return (
       <Card className={cn("chart-container bg-gray-900/80 border-red-500/30", className)}>
         <CardHeader>
           <CardTitle className="text-lg font-semibold text-gray-400">{chartTitle}</CardTitle>
            <div className="pt-3">
               <Select value={selectedDriver} onValueChange={setSelectedDriver} disabled={!availableDrivers}>
                 <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:ring-red-500">
                   <SelectValue placeholder="Select driver..." />
                 </SelectTrigger>
                 <SelectContent className="bg-gray-900 border-gray-700 text-white">
                   <SelectGroup>
                     <SelectLabel>Driver</SelectLabel>
                     {availableDrivers?.map((d) => ( <SelectItem key={d.code} value={d.code}>{d.name} ({d.code})</SelectItem> ))}
                   </SelectGroup>
                 </SelectContent>
               </Select>
             </div>
         </CardHeader>
         <CardContent>
           <div className="w-full aspect-square max-w-[500px] mx-auto flex flex-col items-center justify-center text-red-400">
             <AlertCircle className="w-10 h-10 mb-2" />
             <p className="font-semibold">Error loading gear map</p>
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
           <Select value={selectedDriver} onValueChange={setSelectedDriver} disabled={!availableDrivers}>
             <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:ring-red-500">
               <SelectValue placeholder="Select driver..." />
             </SelectTrigger>
             <SelectContent className="bg-gray-900 border-gray-700 text-white">
               <SelectGroup>
                 <SelectLabel>Driver</SelectLabel>
                 {availableDrivers?.map((d) => ( <SelectItem key={d.code} value={d.code}>{d.name} ({d.code})</SelectItem> ))}
               </SelectGroup>
             </SelectContent>
           </Select>
           {/* TODO: Add Lap Selector here */}
         </div>
      </CardHeader>
      <CardContent>
        {gearData.length > 0 ? (
          <div className="aspect-square w-full max-w-[500px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>{/* Increased bottom margin for legend */}
                <XAxis type="number" dataKey="X" hide domain={['dataMin', 'dataMax']} />
                <YAxis type="number" dataKey="Y" hide domain={['dataMin', 'dataMax']} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(100, 116, 139, 0.5)', color: '#E5E7EB', borderRadius: '6px', padding: '8px 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)'}}
                  itemStyle={{ color: '#E5E7EB' }}
                  formatter={(value: number, name: string) => [name === 'nGear' ? `Gear ${value}` : value, null]} // Format gear, hide name for X/Y
                  labelFormatter={() => ''}
                />
                {/* Removed size prop from Scatter */}
                <Scatter name="Gear Shifts" data={gearData} fill="#8884d8" shape="circle">
                  {gearData.map((entry, index) => {
                    const colorIndex = Math.max(0, Math.min(entry.nGear, gearColors.length - 1)); // Use nGear directly (0-8)
                    const color = gearColors[colorIndex] || '#9CA3AF';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
                 <Legend
                    content={(props) => (
                      <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '15px', padding: 0, listStyle: 'none' }}>
                        {gearColors.map((color, index) => (
                          <li key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#9CA3AF' }}>
                            <span style={{ width: '10px', height: '10px', backgroundColor: color, marginRight: '5px', borderRadius: '50%' }}></span>
                            {index} {/* Display gear number 0-8 */}
                          </li>
                        ))}
                      </ul>
                    )}
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ bottom: -5 }} // Adjust legend position
                  />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
             No gear telemetry data found for this selection.
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GearMapChart;
