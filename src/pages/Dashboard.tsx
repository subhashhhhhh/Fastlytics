import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flag, Lock, Cpu, Timer, User, Gauge, ArrowRight, CreditCard, Calendar } from 'lucide-react'; // Removed BarChart2
import Navbar from '@/components/Navbar';
import F1Card from '@/components/F1Card';
// Removed TrackProgress import as it's no longer used
import { Button } from "@/components/ui/button";
import {
  fetchTeamStandings,
  fetchDriverStandings,
  fetchRaceResults,
  TeamStanding,
  DriverStanding,
  RaceResult
} from '@/lib/api'; // Import API functions and types
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  // Define available years (consider fetching this dynamically)
  const availableYears = [2025, 2024, 2023];
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  // Fetch Team Standings
  const { data: teamStandings, isLoading: isLoadingTeams } = useQuery<TeamStanding[]>({
    queryKey: ['teamStandings', selectedYear],
    queryFn: () => fetchTeamStandings(selectedYear),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 120, // 2 hours
  });

  // Fetch Driver Standings
  const { data: driverStandings, isLoading: isLoadingDrivers } = useQuery<DriverStanding[]>({
    queryKey: ['driverStandings', selectedYear],
    queryFn: () => fetchDriverStandings(selectedYear),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
  });

  // Fetch Race Results
  const { data: raceResults, isLoading: isLoadingRaces } = useQuery<RaceResult[]>({
     queryKey: ['raceResults', selectedYear],
     queryFn: () => fetchRaceResults(selectedYear),
     staleTime: 1000 * 60 * 30,
     gcTime: 1000 * 60 * 60,
  });

  // Show top 4 recent races
  const recentRaces = raceResults?.slice(-4).reverse() ?? [];

  const handleRaceClick = (race: RaceResult) => {
    const raceId = `${race.year}-${race.event.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(`/race/${raceId}`);
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

      <div className="px-4 md:px-8 py-8">

        {/* --- Header Section --- */}
        <header className="mb-8 md:mb-12"> {/* Reduced bottom margin */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="animate-slide-in-left">
              {/* Responsive title size */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-1">Dashboard</h1>
              {/* Responsive subtitle size */}
              <p className="text-sm sm:text-md md:text-lg text-gray-400">{selectedYear} Season Overview</p>
            </div>
            {/* Season Selector */}
            <div className="flex items-center gap-4 animate-slide-in-right">
               <Select
                 value={String(selectedYear)}
                 onValueChange={(value) => setSelectedYear(Number(value))}
               >
                 <SelectTrigger className="w-[160px] bg-gray-800/80 border-gray-700 text-gray-200 hover:bg-gray-700/70 hover:border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-offset-0 transition-colors duration-150 py-2.5">
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
               {/* Removed Data Status Indicator */}
            </div>
          </div>
        </header>

        {/* --- Conditional CTA --- */}
        {user && (
          <div className="mb-10 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-red-600/10 via-gray-900/20 to-gray-900/10 border border-red-500/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
            <div className='flex-grow'>
              {/* Responsive CTA title */}
              <h2 className="text-lg md:text-xl font-semibold mb-1 flex items-center"><Lock className="w-5 h-5 mr-2 text-red-400"/>Unlock Premium Analytics</h2>
              <p className="text-sm text-gray-300">
                Access advanced telemetry, AI predictions, and strategy simulations.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => navigate('/subscription')}>
                <CreditCard className="mr-2 h-4 w-4" /> Upgrade Plan
              </Button>
            </div>
          </div>
        )}

        {/* --- Main Content Grid --- */}
        {/* Adjusted main grid gap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Left Column */}
           {/* Adjusted spacing between sections */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">

            {/* Team Standings Section */}
            <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center mb-4">
                 {/* Responsive section title size */}
                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Team Standings</h2>
                 <Button variant="link" className="text-red-400 hover:text-red-300 px-0 text-sm" onClick={() => navigate('/standings/teams')}>
                    See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                  </Button>
                </div>
                {isLoadingTeams ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                     {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[88px] bg-gray-800/50 rounded-lg"/>)}
                  </div>
                ) : (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {teamStandings?.slice(0, 4).map((team) => (
                      <F1Card
                        key={team.shortName || team.team}
                       title={team.team}
                       value={`${team.points} PTS`}
                       team={getTeamColorClass(team.team) as any}
                       icon={<Award className={`h-5 w-5 text-f1-${getTeamColorClass(team.team)}`} />}
                       change={null} // Change data not available from this endpoint yet
                       className="bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 transition-colors duration-200"
                     />
                   ))}
                 </div>
               )}
            </section>

            {/* Driver Standings Section */}
            <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
               <div className="flex justify-between items-center mb-4">
                 {/* Responsive section title size */}
                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Driver Standings</h2>
                  <Button variant="link" className="text-red-400 hover:text-red-300 px-0 text-sm" onClick={() => navigate('/standings/drivers')}>
                   See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                 </Button>
               </div>
               {isLoadingDrivers ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                     {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[88px] bg-gray-800/50 rounded-lg"/>)}
                 </div>
               ) : (

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                   {driverStandings?.slice(0, 4).map((driver) => (
                     <F1Card
                       key={driver.code}
                       title={driver.name}
                       value={`${driver.points} PTS`}
                       team={getTeamColorClass(driver.team) as any}
                       icon={<Users className={`h-5 w-5 text-f1-${getTeamColorClass(driver.team)}`} />}
                       change={null} // Change data not available from this endpoint yet
                       className="bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 transition-colors duration-200"
                     />
                   ))}
                 </div>
               )}
            </section>

            {/* Recent Races Section */}
            <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center mb-4">
                {/* Responsive section title size */}
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Recent Race Results ({selectedYear})</h2>
                <Button variant="link" className="text-red-400 hover:text-red-300 px-0 text-sm" onClick={() => navigate('/races')}>
                  View all races <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
               {isLoadingRaces ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                     {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[88px] bg-gray-800/50 rounded-lg"/>)}
                  </div>
               ) : recentRaces.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {recentRaces.map((race) => (
                    <div
                      key={`${race.year}-${race.event}`}
                      onClick={() => handleRaceClick(race)}
                      className="cursor-pointer group transition-transform duration-200 ease-in-out hover:scale-[1.03]"
                    >
                      <F1Card
                        title={race.event}
                        value={`Winner: ${race.driver}`}
                        team={getTeamColorClass(race.team) as any}
                        icon={<Flag className={`h-5 w-5 text-f1-${getTeamColorClass(race.team)}`} />}
                        change={null} // Change data not available from this endpoint
                        className="bg-gray-900/80 border border-gray-700/80 group-hover:border-red-500/50 transition-colors duration-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic py-10 text-center">No race results available for {selectedYear}.</p>
              )}
            </section>
          </div>

          {/* Right Column */}
          <aside className="lg:col-span-1 space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
             {/* Responsive section title size */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Explore Analytics</h2>
            <FeatureCardRedesigned
              title="Session Analysis"
              description="Track evolution, weather, safety cars"
              icon={<Timer className="h-6 w-6 text-red-400" />}
              linkTo="/dashboard" // Update links later
            />
            <FeatureCardRedesigned
              title="Driver Performance"
              description="Metrics, styles, comparisons"
              icon={<User className="h-6 w-6 text-blue-400" />}
              linkTo="/drivers"
            />
            <FeatureCardRedesigned
              title="Telemetry Deep Dive"
              description="Car data, G-forces, ERS usage"
              icon={<Gauge className="h-6 w-6 text-green-400" />}
              linkTo="/dashboard" // Update links later
            />
             <FeatureCardRedesigned
              title="Strategy Insights"
              description="Pit stops, tire wear, simulations"
              icon={<Cpu className="h-6 w-6 text-yellow-400" />}
              linkTo="/dashboard" // Update links later
            />
          </aside>

        </div>
      </div>
    </div>
  );
};

// Redesigned Feature Card Component
const FeatureCardRedesigned = ({
  title, description, icon, linkTo
}: {
  title: string; description: string; icon: React.ReactNode; linkTo: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(linkTo)}
      className={cn(
        "bg-gray-900/70 border-gray-700/80 hover:border-gray-600",
        "cursor-pointer transition-all duration-200 ease-in-out",
        "hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1 group"
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-red-400 transition-colors">{title}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
          </div>
          <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
             {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
         <div className="flex justify-end items-center text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Explore
            <ArrowRight className="w-3 h-3 ml-1"/>
         </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
