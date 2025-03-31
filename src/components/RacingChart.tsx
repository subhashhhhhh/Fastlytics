import React, { useState, useEffect } from 'react';
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
import { fetchLapTimes, fetchSessionDrivers, SessionDriver } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Users, XCircle } from 'lucide-react'; // Added XCircle
import { driverColor } from '@/lib/driverColor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button

// Define props for the dynamic chart
interface RacingChartProps {
  className?: string;
  delay?: number;
  title: string;
  // Props to identify the session
  year: number;
  event: string;
  session: string;
  // Initial drivers (optional)
  initialDrivers?: string[];
}

const RacingChart: React.FC<RacingChartProps> = ({
  className,
  delay = 0,
  title,
  year,
  event,
  session,
  initialDrivers = ["VER", "LEC"] // Default initial drivers
}) => {

  // State for selected drivers (min 2, max 3)
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(initialDrivers.slice(0, 3)); // Ensure initial state respects limits

  // Fetch available drivers for the session
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity, // Driver list for a session rarely changes
    gcTime: Infinity,
    enabled: !!year && !!event && !!session,
  });

  // Fetch lap time data based on selected drivers
  const { data: lapData, isLoading: isLoadingLapTimes, error, isError } = useQuery({
    queryKey: ['lapTimes', year, event, session, ...selectedDrivers.sort()], // Sort drivers for consistent query key
    queryFn: () => fetchLapTimes(year, event, session, selectedDrivers), // Pass array here
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    // Only run query if we have exactly 2 or 3 drivers selected and session info
    enabled: !!year && !!event && !!session && selectedDrivers.length >= 2 && selectedDrivers.length <= 3,
  });

  // Handler for driver selection change
  const handleDriverChange = (index: number, value: string) => {
    // Prevent selecting the same driver multiple times
    if (selectedDrivers.includes(value) && selectedDrivers[index] !== value) {
      // Maybe show a toast notification here?
      console.warn("Driver already selected");
      return;
    }

    const newSelection = [...selectedDrivers];
    newSelection[index] = value;
    setSelectedDrivers(newSelection);
  };

  // Handler to add a third driver selector
  const addDriverSelector = () => {
    if (selectedDrivers.length < 3 && availableDrivers) {
      // Find the first available driver not already selected
      const nextDriver = availableDrivers.find(d => !selectedDrivers.includes(d.code));
      if (nextDriver) {
        setSelectedDrivers([...selectedDrivers, nextDriver.code]);
      }
    }
  };

  // Handler to remove the third driver selector
  const removeDriverSelector = (indexToRemove: number) => {
    if (selectedDrivers.length > 2) {
      setSelectedDrivers(selectedDrivers.filter((_, index) => index !== indexToRemove));
    }
  };

  const isLoading = isLoadingDrivers || (isLoadingLapTimes && selectedDrivers.length >= 2);

  // --- Render States ---
  // Simplified loading/error for brevity, can be enhanced
  if (isLoading) {
    return (
      <Card className={cn("chart-container bg-gray-900/80 border-gray-700", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px] bg-gray-800/50" />
        </CardContent>
      </Card>
    );
  }

  if (isError && selectedDrivers.length >= 2) { // Only show lap time error if trying to load
    return (
       <Card className={cn("chart-container bg-gray-900/80 border-red-500/30", className)}>
         <CardHeader>
           <CardTitle className="text-lg font-semibold text-gray-400">{title}</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="w-full h-[300px] flex flex-col items-center justify-center text-red-400">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="font-semibold">Error loading lap times</p>
              <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
            </div>
         </CardContent>
       </Card>
    );
  }

  // --- Render Chart & Controls ---
  return (
    <Card className={cn("chart-container bg-gray-900/80 border-gray-700", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        {/* Driver Selectors */}
        <div className="flex flex-wrap gap-4 pt-3">
          {selectedDrivers.map((driverCode, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={driverCode}
                onValueChange={(value) => handleDriverChange(index, value)}
                disabled={!availableDrivers}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:border-red-500 focus:ring-red-500">
                  <SelectValue placeholder="Select driver..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectGroup>
                    <SelectLabel>Driver {index + 1}</SelectLabel>
                    {availableDrivers?.map((d) => (
                      <SelectItem key={d.code} value={d.code} disabled={selectedDrivers.includes(d.code) && selectedDrivers[index] !== d.code}>
                        {d.name} ({d.code}) - {d.team}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* Show remove button only for the 3rd driver and if there are 3 */}
              {index === 2 && selectedDrivers.length === 3 && (
                 <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500 h-8 w-8" onClick={() => removeDriverSelector(index)}>
                    <XCircle className="h-4 w-4"/>
                 </Button>
              )}
            </div>
          ))}
          {/* Add Driver Button */}
          {selectedDrivers.length < 3 && (
            <Button variant="outline" size="sm" onClick={addDriverSelector} disabled={!availableDrivers || selectedDrivers.length >= 3} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              <Users className="h-4 w-4 mr-1"/> Add Driver
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {lapData && lapData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lapData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
              <XAxis
                dataKey="LapNumber"
                stroke="rgba(156, 163, 175, 0.7)"
                tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="rgba(156, 163, 175, 0.7)"
                tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(value) => value.toFixed(1)}
                allowDecimals={true}
                width={40}
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
                itemStyle={{ color: '#E5E7EB' }} // Color will be overridden by line stroke in legend payload
                formatter={(value: number | null | undefined, name: string) => [value ? `${value.toFixed(3)}s` : 'N/A', name]}
                labelFormatter={(label) => `Lap ${label}`}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {/* Render lines dynamically */}
              {selectedDrivers.map((driverCode) => {
                 const color = driverColor(driverCode);
                 return (
                    <Line
                      key={driverCode}
                      type="monotone"
                      dataKey={driverCode} // Use driver code as data key
                      stroke={color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 1, stroke: 'rgba(255,255,255,0.5)', fill: color }}
                      name={driverCode} // Legend name
                      connectNulls={true}
                    />
                 );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
           <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
             {selectedDrivers.length < 2 ? "Select at least 2 drivers to compare." : "No common lap data found."}
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RacingChart;
