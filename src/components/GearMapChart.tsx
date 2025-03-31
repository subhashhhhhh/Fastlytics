import React, { useState } from 'react'; // Removed useEffect as it wasn't used
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis, Cell // Import Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetryGear, fetchSessionDrivers, SessionDriver, GearMapDataPoint } from '@/lib/api';
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1"; // Import the spinner
import { AlertCircle, User } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a color scale for gears - Updated for better dark UI contrast
const gearColors = [
  '#33bbee', // 1st Gear (Cyan)
  '#ee7733', // 2nd Gear (Orange)
  '#009988', // 3rd Gear (Teal)
  '#cc3311', // 4th Gear (Red)
  '#ee3377', // 5th Gear (Magenta)
  '#0077bb', // 6th Gear (Blue)
  '#bbbbbb', // 7th Gear (Light Gray)
  '#dddddd'  // 8th Gear (Lighter Gray) - Assuming 8 gears max
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
  // No title prop needed
  year: number;
  event: string;
  session: string;
  initialDriver: string;
  lap: string | number;
}

const GearMapChart: React.FC<GearMapChartProps> = ({
  className,
  delay = 0,
  year,
  event,
  session,
  initialDriver,
  lap
}) => {

  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);

  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity, gcTime: 1000 * 60 * 60 * 24, enabled: !!year && !!event && !!session,
  });

  const { data: gearData, isLoading: isLoadingGear, error, isError } = useQuery<GearMapDataPoint[]>({
    queryKey: ['gearMap', year, event, session, selectedDriver, lap],
    queryFn: () => fetchTelemetryGear(year, event, session, selectedDriver, lap),
    staleTime: 1000 * 60 * 10, gcTime: 1000 * 60 * 30, retry: 1, enabled: !!year && !!event && !!session && !!selectedDriver && !!lap,
  });

  const isLoading = isLoadingDrivers || isLoadingGear;
  const chartTitle = `${selectedDriver}'s ${lap === 'fastest' ? 'Fastest Lap' : `Lap ${lap}`} Gear Shifts`;

  const renderContent = () => {
    // Use LoadingSpinnerF1 instead of Skeleton
    if (isLoading) {
      return (
        <div className="w-full h-[350px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          {/* Removed message prop as it's not supported */}
          <LoadingSpinnerF1 />
        </div>
      );
    }

    // Combine error and no data checks for clarity
    if (isError || !gearData || gearData.length === 0) {
      const message = isError
        ? (error as Error)?.message || 'Could not fetch data.'
        : `No gear telemetry data found for ${selectedDriver} lap ${lap}.`;
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
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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
     <Card className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
           <CardTitle className="text-lg font-semibold text-white">{chartTitle}</CardTitle>
           <Select value={selectedDriver} onValueChange={setSelectedDriver} disabled={isLoadingDrivers || !availableDrivers}>
             <SelectTrigger className="w-full sm:w-[180px] bg-gray-800/80 border-gray-700 text-gray-200 text-sm h-9 focus:border-red-500 focus:ring-red-500">
               <User className="w-4 h-4 mr-2 opacity-70"/>
               <SelectValue placeholder="Select Driver" />
             </SelectTrigger>
             <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
               <SelectGroup>
                 <SelectLabel className="text-xs text-gray-500">Driver</SelectLabel>
                 {availableDrivers?.map((drv) => (
                   <SelectItem key={drv.code} value={drv.code} className="text-sm">
                     {drv.code} ({drv.name})
                   </SelectItem>
                 ))}
               </SelectGroup>
             </SelectContent>
           </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default GearMapChart;
