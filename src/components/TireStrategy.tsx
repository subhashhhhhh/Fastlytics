import React, { useState } from 'react'; // Import useState
import { cn } from "@/lib/utils"; // Corrected path
import { useQuery } from '@tanstack/react-query';
import { fetchTireStrategy, DriverStrategy, fetchSpecificRaceResults, DetailedRaceResult } from '@/lib/api'; // Added imports for race results
import { Skeleton } from "@/components/ui/skeleton"; // Corrected path
import { AlertCircle, ChevronDown } from 'lucide-react'; // Import ChevronDown
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Corrected path
import { Button } from '@/components/ui/button'; // Corrected path

// Define props for the dynamic component
interface TireStrategyProps {
  className?: string;
  delay?: number;
  year: number;
  event: string;
  session: string;
}

// Define tire compound colors (using Tailwind classes)
const tireCompoundColors: { [key: string]: string } = {
  SOFT: 'bg-red-500',
  MEDIUM: 'bg-yellow-400',
  HARD: 'bg-gray-200',
  INTERMEDIATE: 'bg-green-500',
  WET: 'bg-blue-500',
  UNKNOWN: 'bg-gray-500',
};

const getTireColorClass = (compound: string): string => {
  return tireCompoundColors[compound?.toUpperCase()] || tireCompoundColors.UNKNOWN;
};

const TireStrategy: React.FC<TireStrategyProps> = ({
  className,
  delay = 0,
  year,
  event,
  session
}) => {

  const [visibleDrivers, setVisibleDrivers] = useState(5); // State for pagination

  // Fetch race results to get finishing order
  const { data: raceResults } = useQuery<DetailedRaceResult[]>({
    queryKey: ['sessionResult', year, event, session],
    queryFn: () => fetchSpecificRaceResults(year, event, session),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session,
  });

  // Create a map of driver codes to their finishing positions
  const driverPositionMap = React.useMemo(() => {
    if (!raceResults) return new Map<string, number>();
    
    const positionMap = new Map<string, number>();
    raceResults.forEach(result => {
      positionMap.set(result.driverCode, result.position || Infinity);
    });
    return positionMap;
  }, [raceResults]);

  // Added DriverStrategy[] type annotation for data
  const { data: strategyData, isLoading, error, isError } = useQuery<DriverStrategy[]>({
    queryKey: ['tireStrategy', year, event, session],
    queryFn: () => fetchTireStrategy(year, event, session),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session,
    // Sort data by race finishing order instead of alphabetically
    select: (data) => {
      if (!data) return [];
      
      return [...data].sort((a, b) => {
        // Get positions from the map (default to Infinity if not found)
        const posA = driverPositionMap.get(a.driver) || Infinity;
        const posB = driverPositionMap.get(b.driver) || Infinity;
        
        // Sort by position (ascending)
        return posA - posB;
      });
    },
  });

  const showMoreDrivers = () => {
    setVisibleDrivers(prev => prev + 5);
  };

  // --- Render States ---
  if (isLoading) {
    return (
      <div className={cn("chart-container", className)}>
        <h2 className="text-lg font-semibold mb-4 text-white">Tire Strategy</h2> {/* Changed text color */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-[28px] bg-gray-800/50" /> // Adjusted height
          ))}
        </div>
      </div>
    );
  }

  if (isError || !strategyData) {
    return (
      <div className={cn("chart-container", className)}>
        <h2 className="text-lg font-semibold mb-4 text-white">Tire Strategy</h2> {/* Changed text color */}
        <div className="w-full h-[300px] bg-gray-900/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-red-400">
           <AlertCircle className="w-10 h-10 mb-2" />
           <p className="font-semibold">Error loading tire strategy</p>
           <p className="text-xs text-gray-500 mt-1">{(error as Error)?.message || 'Could not fetch data.'}</p>
        </div>
      </div>
    );
  }

   if (strategyData.length === 0) {
     return (
      <div className={cn("chart-container", className)}>
        <h2 className="text-lg font-semibold mb-4 text-white">Tire Strategy</h2> {/* Changed text color */}
        <div className="w-full h-[300px] bg-gray-900/80 border border-gray-700/50 rounded-lg flex items-center justify-center text-gray-500">
           No tire strategy data found for this session.
        </div>
      </div>
    );
  }

  // Find max laps for scaling the bars across all drivers
  const maxLaps = Math.max(...strategyData.flatMap(d => d.stints.map(s => s.endLap)), 1);

  const driversToShow = strategyData.slice(0, visibleDrivers);
  const canShowMore = visibleDrivers < strategyData.length;

  // --- Render Visualization ---
  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn("chart-container animate-fade-in", className)}
        style={{ animationDelay: `${delay * 100}ms` } as React.CSSProperties}
      >
        <h2 className="text-lg font-semibold mb-4 text-white">Tire Strategy</h2>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4 text-xs text-gray-400">
            {Object.entries(tireCompoundColors).map(([compound, colorClass]) => (
                compound !== 'UNKNOWN' && (
                    <div key={compound} className="flex items-center gap-1.5">
                        <span className={cn("w-2.5 h-2.5 rounded-full", colorClass)}></span>
                        <span>{compound.charAt(0) + compound.slice(1).toLowerCase()}</span>
                    </div>
                )
            ))}
        </div>
        {/* Driver Stint List */}
        <div className="space-y-2.5">
          {driversToShow.map((driverData, index) => {
            // Get position from map for display
            const position = driverPositionMap.get(driverData.driver);
            const positionText = position !== undefined ? `P${position}` : '';
            
            return (
              <div key={driverData.driver} className="flex items-center gap-3">
                <span className="w-12 text-sm font-mono text-gray-400 text-right flex-shrink-0">
                  {positionText ? (
                    <span className="flex items-center justify-end">
                      <span className="text-xs text-gray-500 mr-1">{positionText}</span>
                      {driverData.driver}
                    </span>
                  ) : (
                    driverData.driver
                  )}
                </span>
                <div className="flex-grow h-6 bg-gray-800/50 rounded overflow-hidden flex relative"> {/* Added relative */}
                  {driverData.stints.map((stint, index) => {
                    const widthPercentage = ((stint.endLap - stint.startLap + 1) / maxLaps) * 100;
                    // Calculate left offset based on previous stints' widths
                    const leftOffsetPercentage = ((stint.startLap - 1) / maxLaps) * 100;
                    const bgColorClass = getTireColorClass(stint.compound); // Use class getter
                    const tooltipContent = `${stint.compound} (L${stint.startLap}-L${stint.endLap}, ${stint.lapCount} laps)`;

                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn("h-full absolute transition-opacity hover:opacity-80", bgColorClass)} // Use class
                            style={{
                                left: `${leftOffsetPercentage}%`,
                                width: `${widthPercentage}%`,
                             }}
                            aria-label={tooltipContent}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/80 text-white border-gray-700">
                          <p>{tooltipContent}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* Show More Button */}
        {canShowMore && (
            <div className="mt-4 flex justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={showMoreDrivers}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    Show More Drivers <ChevronDown className="w-4 h-4 ml-1"/>
                </Button>
            </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TireStrategy;
