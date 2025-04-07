import React from 'react';
import { useNavigate } from 'react-router-dom'; // Remove Link import
import { ArrowLeft, Trophy, CheckCircle, MinusCircle, Award, Calendar, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react'; // Added ArrowUp/Down
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
// Import API function and type
import { fetchDriverStandings, DriverStanding } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext'; // Import useSeason

// Define rookies by season year
const rookiesByYear: { [year: string]: string[] } = {
  '2025': ['ANT', 'BOR', 'DOO', 'BEA', 'HAD', 'LAW'], // Antonelli, Bortoleto, Doohan, Bearman, Hadjar, Lawson
  '2024': ['BEA', 'COL'], // Bearman, Colapinto
  '2023': ['PIA', 'SAR', 'DEV'], // Piastri, Sargeant, De Vries
  '2022': ['ZHO'], // Zhou
  '2021': ['MSC', 'MAZ', 'TSU'], // Mick Schumacher, Mazepin, Tsunoda
  '2020': ['LAT'], // Latifi
  '2019': ['NOR', 'RUS', 'ALB'] // Norris, Russell, Albon
};

// Helper function to check if a driver is a rookie in a given year
const isRookie = (driverCode: string, year: number): boolean => {
  const yearStr = year.toString();
  return rookiesByYear[yearStr]?.includes(driverCode) || false;
};

const DriverStandings = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason(); // Use context

  // Fetch Driver Standings for the selected year
  const { data: driverStandings, isLoading, error, isError } = useQuery<DriverStanding[]>({
    queryKey: ['driverStandings', selectedYear],
    queryFn: () => fetchDriverStandings(selectedYear),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 120,
    retry: 1,
  });

  // Function to determine change indicator color and icon
  const getChangeIndicator = (change: number | undefined) => { // Accept undefined
    if (change === undefined) { // Check for undefined
       // Return null or a default state if no change data exists
       return null;
    }
    if (change > 0) {
      return { color: 'text-green-500', icon: <ArrowUp className="h-4 w-4" /> }; // Use ArrowUp
    } else if (change < 0) {
      return { color: 'text-red-500', icon: <ArrowDown className="h-4 w-4" /> }; // Use ArrowDown
    } else { // change === 0
      return { color: 'text-gray-500', icon: <MinusCircle className="h-4 w-4" /> };
    }
  };

   // Helper to get team color class
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
             <Button 
               variant="ghost" 
               size="icon" 
               className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white" 
               onClick={() => navigate('/dashboard')}
               data-umami-event="DriverStandings Back Button"
             >
               <ArrowLeft className="h-5 w-5" />
             </Button>
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Driver Standings</h1>
           </div>
           <Select 
             value={String(selectedYear)} 
             onValueChange={(value) => {
               setSelectedYear(Number(value));
               // Track year change event
               const event = document.createElement('div');
               event.setAttribute('data-umami-event', `DriverStandings Year Change - ${value}`);
               document.body.appendChild(event);
               event.remove();
             }}
           >
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
                      data-umami-event={`DriverStandings Year Select - ${year}`}
                    >
                      {year}
                    </SelectItem>
                 ))}
               </SelectGroup>
             </SelectContent>
           </Select>
        </header>

        {/* Standings List */}
        <div className="space-y-3 md:space-y-4">
          {isLoading ? (
             [...Array(10)].map((_, i) => <Skeleton key={i} className="h-[76px] bg-gray-800/50 rounded-lg"/>)
          ) : isError ? (
             <div className="text-center py-10 text-red-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                Error loading standings for {selectedYear}. <br/>
                <span className="text-xs text-gray-500">{(error as Error)?.message || 'Please try again later.'}</span>
             </div>
          ) : driverStandings && driverStandings.length > 0 ? (
            driverStandings.map((driver, index) => { // Use fetched data
              const indicator = getChangeIndicator(driver.points_change); // Use points_change
              const teamColor = getTeamColorClass(driver.team);
              const driverIsRookie = isRookie(driver.code, selectedYear);

              return (
                <Card
                  key={driver.code}
                  className={cn(
                    "bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm",
                    "p-4 md:p-5 flex items-center gap-4 md:gap-6",
                    "transition-all duration-300 ease-in-out hover:bg-gray-800/80 hover:border-gray-600",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="text-xl md:text-2xl font-bold text-gray-500 w-8 text-center">{driver.rank}</div>
                  <div className="flex-grow">
                    {/* Driver name display */}
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-xl font-semibold text-white">{driver.name}</h2>
                      {driverIsRookie && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-600/40 text-blue-200 rounded font-medium">
                          Rookie
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5"> {/* Added slight margin-top */}
                       <span className={cn("w-2 h-2 rounded-full", `bg-f1-${teamColor}`)}></span>
                       {/* Team name display */}
                       <span>{driver.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-400 flex-shrink-0">
                     <div className="flex items-center gap-1.5" title="Wins">
                       <Trophy className="w-4 h-4 text-yellow-500"/>
                       <span>{driver.wins ?? '-'}</span>
                     </div>
                     <div className="flex items-center gap-1.5" title="Podiums">
                       <Award className="w-4 h-4 text-gray-400"/>
                       <span>{driver.podiums ?? '-'}</span>
                     </div>
                     {/* Display points change if indicator is not null */}
                     {indicator && (
                        <div className={cn("flex items-center gap-1", indicator.color)} title="Points Change Since Last Race">
                          {indicator.icon}
                          {/* Show absolute value for non-zero change */}
                          <span>{driver.points_change !== 0 ? Math.abs(driver.points_change ?? 0) : '-'}</span>
                        </div>
                     )}
                  </div>
                   <div className="text-lg md:text-xl font-bold text-white w-20 text-right">
                     {driver.points} <span className="text-xs font-normal text-gray-500">PTS</span>
                   </div>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-10">No standings data available for {selectedYear}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverStandings;
