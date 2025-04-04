import React, { useState, useMemo } from 'react'; // Keep the combined import
import { useNavigate } from 'react-router-dom'; // Keep single import
import { ArrowLeft, Flag, Calendar, AlertCircle, Clock } from 'lucide-react'; // Added Clock icon
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
// Import both schedule and results functions/types
import { fetchRaceResults, RaceResult, fetchSchedule, ScheduleEvent } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card'; // Removed unused CardHeader, CardContent, CardTitle
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext'; // Import useSeason

const Races = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason(); // Use context

  // Fetch Full Schedule for the selected year
  const { data: scheduleData, isLoading: isLoadingSchedule, error: scheduleError } = useQuery<ScheduleEvent[]>({
     queryKey: ['schedule', selectedYear],
     queryFn: () => fetchSchedule(selectedYear),
     staleTime: 1000 * 60 * 60 * 24, // Cache schedule for a day
     gcTime: 1000 * 60 * 60 * 48,
     retry: 1,
  });

  // Fetch Race Results Summary for the selected year
  const { data: resultsData, isLoading: isLoadingResults, error: resultsError } = useQuery<RaceResult[]>({
     queryKey: ['raceResults', selectedYear], // Use the same query key as Dashboard
     queryFn: () => fetchRaceResults(selectedYear),
     staleTime: 1000 * 60 * 30, // 30 minutes
     gcTime: 1000 * 60 * 60, // 1 hour
     retry: 1,
  });

  // Combine schedule and results data
  const combinedRaceData = useMemo(() => {
    if (!scheduleData) return [];

    const resultsMap = new Map(resultsData?.map(res => [res.event, res]));
    const now = new Date(); // Get current date/time
    // Current date + 3 days to determine the "ongoing" window
    const nearFuture = new Date();
    nearFuture.setDate(now.getDate() + 3);

    return scheduleData.map(event => {
      const result = resultsMap.get(event.EventName);
      const eventDate = new Date(event.EventDate); // Use the main EventDate from schedule
      
      // First determine if it's a future race
      const isUpcoming = eventDate > now;
      
      // Then determine if it's the current ongoing race (within the next 3 days)
      const isOngoing = isUpcoming && eventDate <= nearFuture;

      return {
        ...event, // Spread schedule event properties
        result, // Attach result if found
        isUpcoming,
        isOngoing,
        displayDate: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
  }, [scheduleData, resultsData]);

  const handleRaceClick = (eventName: string, year: number) => {
    // Navigate to the specific race page
    const raceId = `${year}-${eventName.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(`/race/${raceId}`);
  };

   // Helper to get team color class (copied from Dashboard)
   const getTeamColorClass = (teamName: string | undefined): string => {
      if (!teamName) return 'gray';
      const simpleName = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (simpleName.includes('mclaren')) return 'mclaren';
      if (simpleName.includes('mercedes')) return 'mercedes';
      if (simpleName.includes('redbull')) return 'redbull';
      if (simpleName.includes('ferrari')) return 'ferrari';
      if (simpleName.includes('alpine')) return 'alpine';
      if (simpleName.includes('astonmartin')) return 'astonmartin';
      if (simpleName.includes('williams')) return 'williams';
      if (simpleName.includes('haas')) return 'haas';
      if (simpleName.includes('sauber')) return 'alfaromeo';
      if (simpleName.includes('racingbulls') || simpleName.includes('alphatauri')) return 'alphatauri';
      return 'gray';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
           <div className="flex items-center">
             <Button variant="ghost" size="icon" className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => navigate('/dashboard')}>
               <ArrowLeft className="h-5 w-5" />
             </Button>
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Race Calendar & Results</h1>
           </div>
           <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
             <SelectTrigger className="w-full md:w-[180px] bg-gray-800/80 border-gray-700 text-gray-200 hover:bg-gray-700/70 hover:border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-offset-0 transition-colors duration-150 py-2.5">
               <Calendar className="w-4 h-4 mr-2 opacity-60"/>
               <SelectValue placeholder="Select Season" />
             </SelectTrigger>
             <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
               <SelectGroup>
                 <SelectLabel className="text-gray-500 px-2 py-1.5">Season</SelectLabel>
                 {availableYears.map((year) => (
                    <SelectItem
                      key={year}
                      value={String(year)}
                      className="focus:bg-red-600/30 focus:text-white data-[state=checked]:bg-red-600/20"
                    >
                      {year}
                    </SelectItem>
                 ))}
               </SelectGroup>
             </SelectContent>
           </Select>
        </header>

        {/* Races List - Updated Logic */}
        <div className="space-y-3 md:space-y-4">
          {isLoadingSchedule || isLoadingResults ? (
             // Show more skeletons based on typical season length
             [...Array(15)].map((_, i) => <Skeleton key={i} className="h-[76px] bg-gray-800/50 rounded-lg"/>)
          ) : scheduleError || resultsError ? (
             <div className="text-center py-10 text-red-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                Error loading data for {selectedYear}. <br/>
                <span className="text-xs text-gray-500">
                  {((scheduleError || resultsError) as Error)?.message || 'Please try again later.'}
                </span>
             </div>
          ) : combinedRaceData.length > 0 ? (
            combinedRaceData.map((race, index) => {
              const teamColor = race.result ? getTeamColorClass(race.result.team) : 'gray'; // Default to gray if no result/upcoming
              // Make both completed races and ongoing races clickable
              const isClickable = !race.isUpcoming || race.isOngoing; 

              return (
                <Card
                  key={`${selectedYear}-${race.EventName}`}
                  onClick={isClickable ? () => handleRaceClick(race.EventName, selectedYear) : undefined}
                  className={cn(
                    "bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm",
                    "p-4 md:p-5 flex items-center gap-4 md:gap-6",
                    "transition-all duration-300 ease-in-out",
                    isClickable ? "hover:bg-gray-800/80 hover:border-gray-600 cursor-pointer" : "opacity-60 cursor-default",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 40}ms` }} // Slightly faster animation
                >
                  {/* Display Date */}
                  <div className="text-base md:text-lg font-medium text-gray-400 w-16 text-center">{race.displayDate}</div>
                  {/* Color Bar */}
                  <div className={cn("w-1.5 h-10 rounded-full", `bg-f1-${teamColor}`)}></div>
                  {/* Event Name & Location */}
                  <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-semibold text-white">{race.EventName}</h2>
                    <p className="text-sm text-gray-500">{race.Location}</p>
                  </div>
                  {/* Winner Info or Upcoming Status */}
                  <div className="flex flex-col items-end text-sm text-gray-400 flex-shrink-0 w-28 md:w-32">
                    {race.isOngoing ? (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">ONGOING</span>
                      </div>
                    ) : race.isUpcoming ? (
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">UPCOMING</span>
                      </div>
                    ) : race.result ? (
                      <>
                        <div className="flex items-center gap-1.5" title="Winner">
                          <Flag className="w-4 h-4 text-yellow-500"/>
                          <span className="font-medium text-gray-200">{race.result.driver ?? 'N/A'}</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-0.5">{race.result.team ?? ''}</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Results Pending</span>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-10">No race results available for {selectedYear}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Races;
