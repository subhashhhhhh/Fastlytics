import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchLapPositions, LapPositionDataPoint } from '@/lib/api'; // Import new fetch function and type
import LoadingSpinnerF1 from "@/components/ui/LoadingSpinnerF1";
import { AlertCircle } from 'lucide-react';
import { driverColor } from '@/lib/driverColor'; // Use existing driver color mapping
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const driverCodes = React.useMemo(() => {
    if (!positionData || positionData.length === 0) return [];
    return Object.keys(positionData[0]).filter(key => key !== 'LapNumber');
  }, [positionData]);

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

    // --- Render Chart ---
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={positionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: 'rgba(100, 116, 139, 0.5)', color: '#E5E7EB', borderRadius: '6px' }}
            labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }}
            itemStyle={{}} // Handled by formatter
            formatter={(value: number | null, name: string, props: any) => {
                if (value === null) return ['DNF/N/A', name]; // Handle null positions
                const color = driverColor(name); // Get color for the item
                return [
                    <span style={{ color: color }}>P{value}</span>, // Display position with color
                    name // Driver code
                ];
            }}
            labelFormatter={(label) => `Lap ${label}`}
            cursor={{ stroke: 'rgba(156, 163, 175, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {/* Dynamically render lines for each driver */}
          {driverCodes.map((driverCode) => {
            const color = driverColor(driverCode);
            return (
              <Line
                key={driverCode}
                type="monotone"
                dataKey={driverCode}
                stroke={color}
                strokeWidth={2}
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
    <Card className={cn("chart-container bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm animate-fade-in", className)} style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}>
      <CardHeader>
         <CardTitle className="text-lg font-semibold text-white">Race Position Changes</CardTitle>
         {/* Could add driver highlighting/filtering controls here later */}
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PositionChart;
