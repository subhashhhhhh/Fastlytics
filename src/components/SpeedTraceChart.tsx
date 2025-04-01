import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetrySpeed, fetchSessionDrivers, fetchLapTimes, SessionDriver, SpeedDataPoint } from '@/lib/api';
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1";
import { AlertCircle, User, Clock } from 'lucide-react';
import { driverColor } from '@/lib/driverColor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpeedTraceChartProps {
  className?: string;
  delay?: number;
  title: string;
  year: number;
  event: string;
  session: string;
  initialDriver: string;
  lap?: string | number;
}

const SpeedTraceChart: React.FC<SpeedTraceChartProps> = ({
  className,
  delay = 0,
  year,
  event,
  session,
  initialDriver,
  lap = 'fastest'
}) => {
  const [selectedDriver, setSelectedDriver] = useState<string>(initialDriver);
  const [selectedLap, setSelectedLap] = useState<string | number>(lap);
  const [lapOptions, setLapOptions] = useState<Array<string | number>>(['fastest']);

  // Fetch available drivers
  const { data: availableDrivers, isLoading: isLoadingDrivers } = useQuery<SessionDriver[]>({
    queryKey: ['sessionDrivers', year, event, session],
    queryFn: () => fetchSessionDrivers(year, event, session),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: !!year && !!event && !!session,
  });

  // Fetch lap times to populate lap options
  const { data: lapTimes } = useQuery({
    queryKey: ['lapTimes', year, event, session, selectedDriver],
    queryFn: () => fetchLapTimes(year, event, session, [selectedDriver]),
    enabled: !!year && !!event && !!session && !!selectedDriver,
  });

  useEffect(() => {
    if (lapTimes && lapTimes.length > 0) {
      const validLaps = lapTimes
        .filter(lap => lap[selectedDriver] !== null)
        .map(lap => lap.LapNumber.toString());
      setLapOptions(['fastest', ...validLaps]);
    }
  }, [lapTimes, selectedDriver]);

  // Fetch speed data
  const { data: speedData, isLoading: isLoadingSpeed, error } = useQuery<SpeedDataPoint[]>({
    queryKey: ['speedTrace', year, event, session, selectedDriver, selectedLap],
    queryFn: () => fetchTelemetrySpeed(year, event, session, selectedDriver, selectedLap),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session && !!selectedDriver && !!selectedLap,
  });

  const color = driverColor(selectedDriver, year); // Pass year to driverColor
  const isLoading = isLoadingDrivers || isLoadingSpeed;
  const chartTitle = `${selectedDriver}'s ${selectedLap === 'fastest' ? 'Fastest Lap' : `Lap ${selectedLap}`} Speed Trace`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-900/50 rounded-lg">
          <LoadingSpinnerF1 />
        </div>
      );
    }
    if (error || !speedData) {
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
          No speed telemetry data found for {selectedDriver} lap {selectedLap}.
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={speedData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
          <XAxis 
            type="number" 
            dataKey="Distance" 
            stroke="rgba(156, 163, 175, 0.7)" 
            tick={{ fill: 'rgba(156, 163, 175, 0.9)', fontSize: 12 }} 
            tickFormatter={(value: number) => `${value.toFixed(2)}m`} 
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
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)' 
            }} 
            labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }} 
            itemStyle={{ color: color }} 
            formatter={(value: number) => [`${value} kph`, 'Speed']} 
            labelFormatter={(label: number) => `Distance: ${label.toFixed(2)}m`} 
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} 
          style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-white">{chartTitle}</CardTitle>
          <div className="flex gap-2">
            <Select
              value={selectedDriver}
              onValueChange={(value) => {
                setSelectedDriver(value);
                setSelectedLap('fastest');
              }}
               disabled={isLoadingDrivers || !availableDrivers}
             >
               {/* Increased width and added min-w for better responsiveness */}
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
              value={selectedLap.toString()}
              onValueChange={(value) => setSelectedLap(value === 'fastest' ? 'fastest' : parseInt(value))}
               disabled={isLoading || lapOptions.length <= 1}
             >
                {/* Increased width */}
               <SelectTrigger className="w-full sm:w-[120px] bg-gray-800/80 border-gray-700 text-gray-200 text-sm h-9">
                 <Clock className="w-4 h-4 mr-2 opacity-70"/>
                 <SelectValue placeholder="Lap" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                <SelectGroup>
                  <SelectLabel className="text-xs text-gray-500">Lap</SelectLabel>
                  {lapOptions.map((lap) => (
                    <SelectItem key={lap.toString()} value={lap.toString()} className="text-sm">
                      {lap === 'fastest' ? 'Fastest' : lap}
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
      </CardContent>
    </Card>
  );
};

export default SpeedTraceChart;
