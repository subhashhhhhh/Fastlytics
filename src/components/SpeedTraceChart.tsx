import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
// Import API functions and types
import { fetchTelemetrySpeed, fetchSessionDrivers, SessionDriver, SpeedDataPoint } from '@/lib/api';
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1"; // Import the spinner
import { AlertCircle, User } from 'lucide-react';
import { driverColor } from '@/lib/driverColor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpeedTraceChartProps {
  className?: string;
  delay?: number;
  title: string; // Title might become dynamic based on selection
  year: number;
  event: string;
  session: string;
  initialDriver: string; // Initial driver to show
  lap: string | number; // Lap identifier ('fastest' or number) - TODO: Make selectable?
}

const SpeedTraceChart: React.FC<SpeedTraceChartProps> = ({
  className,
  delay = 0,
  // title, // Title will be dynamic
  year,
  event,
  session,
  initialDriver,
  lap // Keep lap fixed for now, e.g., 'fastest'
}) => {

  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);

  // Fetch available drivers
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: !!year && !!event && !!session,
  });

  // Fetch speed data for the selected driver and lap
  const { data: speedData, isLoading: isLoadingSpeed, error, isError } = useQuery<SpeedDataPoint[]>({
    queryKey: ['speedTrace', year, event, session, selectedDriver, lap],
    queryFn: () => fetchTelemetrySpeed(year, event, session, selectedDriver, lap),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!selectedDriver && !!lap,
  });

  const color = driverColor(selectedDriver);
  const isLoading = isLoadingDrivers || isLoadingSpeed;

  // Dynamic title
  const chartTitle = `${selectedDriver}'s ${lap === 'fastest' ? 'Fastest Lap' : `Lap ${lap}`} Speed Trace`;

  // --- Render States ---
  const renderContent = () => {
    if (isLoading) {
      // Use LoadingSpinnerF1 instead of Skeleton
      return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }
    if (isError || !speedData) {
      return (
        <div className="w-full h-[300px] bg-gray-900/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-red-400">
           <AlertCircle className="w-10 h-10 mb-2" />
           <p className="font-semibold">Error loading speed trace</p>
           <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
        </div>
      );
    }
    if (speedData.length === 0) {
     return (
        <div className="w-full h-[300px] bg-gray-900/80 border border-gray-700/50 rounded-lg flex items-center justify-center text-gray-500">
           No speed telemetry data found for {selectedDriver} lap {lap}.
        </div>
      );
    }

    // --- Render Chart ---
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={speedData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
          {/* Updated XAxis tickFormatter for distance */}
          <XAxis type="number" dataKey="Distance" stroke="rgba(156, 163, 175, 0.7)" tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} tickFormatter={(value: number) => `${value.toFixed(2)}m`} domain={['dataMin', 'dataMax']} />
          <YAxis dataKey="Speed" stroke="rgba(156, 163, 175, 0.7)" tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} domain={['auto', 'dataMax + 10']} tickFormatter={(value) => `${value} kph`} width={50} />
          {/* Updated Tooltip labelFormatter for distance */}
          <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(100, 116, 139, 0.5)', color: '#E5E7EB', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }} labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }} itemStyle={{ color: color }} formatter={(value: number, name: string) => [`${value} kph`, name]} labelFormatter={(label: number) => `Distance: ${label.toFixed(2)}m`} />
          <Line type="monotone" dataKey="Speed" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: color }} name={selectedDriver} connectNulls={true} />
          {/* <Legend /> */}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
           <CardTitle className="text-lg font-semibold text-white">{chartTitle}</CardTitle>
           {/* Driver Selector */}
           <Select
             value={selectedDriver}
             onValueChange={setSelectedDriver}
             disabled={isLoadingDrivers || !availableDrivers}
           >
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
           {/* TODO: Add Lap Selector Here */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SpeedTraceChart;
