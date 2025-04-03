import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trophy, Flag, BarChart2, Clock, Cpu, ArrowRightLeft, Gauge, User, Lock, AlertCircle, Zap, Calendar, MapPin, Users, Timer, Sparkles, TrendingUp, Map } from 'lucide-react'; // Added Map icon
import Navbar from '@/components/Navbar';
import RacingChart from '@/components/RacingChart';
import TireStrategy from '@/components/TireStrategy';
import SpeedTraceChart from '@/components/SpeedTraceChart';
import GearMapChart from '@/components/GearMapChart';
import PositionChart from '@/components/PositionChart';
// Import TrackEvolutionChart for merging with Lap Times
import TrackEvolutionChart from '@/components/TrackEvolutionChart';
// Import the new CircuitComparisonChart component
import CircuitComparisonChart from '@/components/CircuitComparisonChart';
import F1Card from '@/components/F1Card';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchSpecificRaceResults, fetchAvailableSessions, DetailedRaceResult, AvailableSession } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import LoadingSpinnerF1 from '@/components/ui/LoadingSpinnerF1'; // Import spinner

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

// Component for rendering the results table dynamically
const SessionResultsTable: React.FC<{ results: DetailedRaceResult[], sessionType: string, year: number }> = ({ results, sessionType, year }) => {
  const isPractice = sessionType.startsWith('FP');
  const isQualifying = sessionType.startsWith('Q') || sessionType.startsWith('SQ');
  const isRaceOrSprint = sessionType === 'R' || sessionType === 'Sprint';

  // Determine columns based on session type
  const columns: { key: keyof DetailedRaceResult | 'driver' | 'team', label: string, className?: string }[] = [
    { key: 'position', label: 'Pos', className: 'w-[50px] text-center' },
    { key: 'driver', label: 'Driver' }, // Combine name/code later
    { key: 'team', label: 'Team' }, // Combine color/name later
  ];

  if (isRaceOrSprint) {
    columns.push({ key: 'gridPosition', label: 'Grid', className: 'text-center' });
    columns.push({ key: 'status', label: 'Status' });
    columns.push({ key: 'points', label: 'Points', className: 'text-right font-bold' });
  } else if (isQualifying) {
    // Add Q1, Q2, Q3 based on which segment it is or if it's the parent Q/SQ
    if (sessionType === 'Q1' || sessionType === 'Q' || sessionType === 'SQ1' || sessionType === 'SQ') columns.push({ key: 'q1Time', label: 'Q1', className: 'text-right font-mono text-sm' });
    if (sessionType === 'Q2' || sessionType === 'Q' || sessionType === 'SQ2' || sessionType === 'SQ') columns.push({ key: 'q2Time', label: 'Q2', className: 'text-right font-mono text-sm' });
    if (sessionType === 'Q3' || sessionType === 'Q' || sessionType === 'SQ3' || sessionType === 'SQ') columns.push({ key: 'q3Time', label: 'Q3', className: 'text-right font-mono text-sm' });
    // If viewing a specific segment (Q1/Q2/Q3), maybe highlight that column or only show relevant times?
    // For simplicity now, show all available Q times if viewing Q parent.
    // If viewing Q1, maybe only show Q1? Let's show all for now.
  } else if (isPractice) {
    columns.push({ key: 'fastestLapTime', label: 'Fastest Lap', className: 'text-right font-mono text-sm' });
    columns.push({ key: 'lapsCompleted', label: 'Laps', className: 'text-center' });
  }

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gray-800/50">
          <TableRow className="border-gray-700">
            {columns.map(col => (
              <TableHead key={String(col.key)} className={cn("text-white font-semibold", col.className)}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results?.map((res) => (
            <TableRow key={res.driverCode} className="border-gray-700/50 hover:bg-gray-800/40 transition-colors">
              {columns.map(col => (
                <TableCell key={`${res.driverCode}-${String(col.key)}`} className={cn(col.className)}>
                  {col.key === 'driver' ? (
                    <div className="flex items-center gap-2">
                      <span>{res.fullName}</span>
                      {isRookie(res.driverCode, year) && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-600/40 text-blue-200 rounded font-medium">
                          Rookie
                        </span>
                      )}
                    </div>
                  ) : col.key === 'team' ? (
                    <span className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", `bg-f1-${getTeamColorClass(res.team)}`)}></span>
                      {res.team}
                    </span>
                  ) : col.key === 'points' ? (
                     res.points ?? 0 // Default points to 0 if null/undefined
                  ) : (
                    res[col.key as keyof DetailedRaceResult] ?? '-' // Access other keys directly
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


const Race = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('R'); // Default to Race
  const [selectedLap, setSelectedLap] = useState<string | number>('fastest'); // For telemetry

  // Parse year and event slug from raceId
  const { year, eventSlug, eventName } = useMemo(() => {
    if (!raceId) return { year: null, eventSlug: null, eventName: 'Race' };
    const parts = raceId.split('-');
    const parsedYear = parseInt(parts[0], 10);
    if (isNaN(parsedYear)) return { year: null, eventSlug: raceId, eventName: 'Invalid Race ID' };

    const slug = parts.slice(1).join('-');
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return { year: parsedYear, eventSlug: slug, eventName: name };
  }, [raceId]);

  // Fetch available sessions using the updated backend endpoint
  const { data: fetchedAvailableSessions, isLoading: isLoadingSessions } = useQuery<AvailableSession[]>({
    queryKey: ['availableSessions', year, eventName], // Use eventName as key if API expects it
    queryFn: () => {
        if (!year || !eventName) throw new Error("Invalid year or event name");
        // Pass eventName or eventSlug based on what the updated API expects
        return fetchAvailableSessions(year, eventName);
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for a day
    gcTime: 1000 * 60 * 60 * 24,
    enabled: !!year && !!eventName,
  });

  // Effect to update state when available sessions data is fetched
  useEffect(() => {
    if (fetchedAvailableSessions && fetchedAvailableSessions.length > 0) {
        setAvailableSessions(fetchedAvailableSessions);
        // Set default selected session to 'R' if available, otherwise last session in list
        if (fetchedAvailableSessions.some(s => s.type === 'R')) {
            setSelectedSession('R');
        } else {
            setSelectedSession(fetchedAvailableSessions[fetchedAvailableSessions.length - 1].type);
        }
    } else if (fetchedAvailableSessions) { // Handle case where fetch returns empty array
        setAvailableSessions([]);
    }
  }, [fetchedAvailableSessions]);

  // Fetch detailed results for the selected session
  const { data: sessionResults, isLoading: isLoadingResults, error, isError } = useQuery<DetailedRaceResult[]>({
    queryKey: ['sessionResult', year, eventSlug, selectedSession],
    queryFn: () => {
        if (!year || !eventSlug || !selectedSession) throw new Error("Invalid year, event slug, or session");
        return fetchSpecificRaceResults(year, eventSlug, selectedSession); // Pass selectedSession
    },
    staleTime: 1000 * 60 * 5, // Shorter stale time for potentially live data
    gcTime: 1000 * 60 * 15,
    retry: 1,
    enabled: !!year && !!eventSlug && !!selectedSession,
  });

  // --- Derived Data (Winner, Pole, Fastest Lap - specific to Race 'R') ---
  const raceWinner = useMemo(() => {
    if (selectedSession !== 'R' || !sessionResults) return null;
    return sessionResults.find(r => r.position === 1);
  }, [sessionResults, selectedSession]);

  const poleSitter = useMemo(() => {
     if (selectedSession !== 'R' || !sessionResults) return null;
     return sessionResults.find(r => r.gridPosition === 1);
  }, [sessionResults, selectedSession]);

  const fastestLapHolder = useMemo(() => {
    // Find the driver marked with the fastest lap flag by the backend
    if (selectedSession !== 'R' || !sessionResults) return null;
    return sessionResults.find(r => r.isFastestLap === true);
  }, [sessionResults, selectedSession]);

  // --- Loading and Error States ---
  const isLoading = isLoadingSessions || isLoadingResults;

  if (!year || !eventSlug) {
     // Render Invalid URL state
     return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-white">Invalid Race URL</h1>
          <p className="text-gray-400 mb-6">Could not parse year or event from the URL.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      );
  }

  // --- Render Page ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-3 text-gray-400 hover:bg-gray-800 hover:text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{eventName}</h1>
              <p className="text-lg text-gray-400">{year} Season</p>
            </div>
          </div>
          {/* Session Selector */}
          <div className="w-full md:w-auto">
             {isLoadingSessions ? (
                 <Skeleton className="h-10 w-[200px] bg-gray-800/60" />
             ) : availableSessions.length > 0 ? (
                 <Select value={selectedSession} onValueChange={setSelectedSession}>
                     <SelectTrigger className="w-full md:w-[220px] bg-gray-800/70 border-gray-700 text-white backdrop-blur-sm h-10">
                         <Calendar className="w-4 h-4 mr-2 opacity-70" />
                         <SelectValue placeholder="Select Session" />
                     </SelectTrigger>
                     <SelectContent className="bg-gray-900 border-gray-700 text-white">
                         {availableSessions.map(session => (
                             <SelectItem
                                 key={session.type}
                                 value={session.type}
                                 className="hover:bg-gray-800 focus:bg-gray-700"
                             >
                                 {session.name}
                             </SelectItem>
                         ))}
                     </SelectContent>
                 </Select>
             ) : (
                 <p className="text-sm text-gray-500">No sessions available.</p>
             )}
          </div>
        </header>

        {/* Key Info Cards (Only show for Race session 'R') */}
        {selectedSession === 'R' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-fade-in">
            {raceWinner && (
                <F1Card title="Race Winner" value={raceWinner.fullName} team={getTeamColorClass(raceWinner.team) as any} icon={<Trophy />} />
            )}
            {poleSitter && (
                 <F1Card
                    title="Pole Position"
                    value={poleSitter.fullName}
                    subValue={poleSitter.poleLapTimeValue} // Pass the pole lap time
                    team={getTeamColorClass(poleSitter.team) as any}
                    icon={<Zap />}
                 />
             )}
            {fastestLapHolder && (
                 <F1Card
                    title="Fastest Lap"
                    value={fastestLapHolder.fullName}
                    subValue={fastestLapHolder.fastestLapTimeValue} // Pass the fastest lap time
                    team={getTeamColorClass(fastestLapHolder.team) as any}
                    icon={<Clock />}
                 />
             )}
         </div>
        )}

        {/* Main Content Area */}
        {isLoadingResults ? (
             <div className="space-y-6 mt-6">
                 <Skeleton className="h-10 w-1/3 bg-gray-800/60 rounded-lg" />
                 <Skeleton className="h-10 w-full bg-gray-800/60 rounded-lg" />
                 <Skeleton className="h-80 w-full bg-gray-800/60 rounded-lg" />
             </div>
        ) : isError ? (
             <Card className="bg-red-900/20 border-red-500/50 text-red-300 mt-6">
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2"><AlertCircle /> Error Loading Data</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p>{(error as Error)?.message || 'Could not fetch data for the selected session.'}</p>
                     <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm" className="mt-4 border-red-500/50 hover:bg-red-900/30">
                         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                     </Button>
                 </CardContent>
             </Card>
        ) : !sessionResults || sessionResults.length === 0 ? (
             <Card className="bg-gray-900/50 border-gray-700 mt-6">
                 <CardHeader>
                     <CardTitle>No Data Available</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p className="text-gray-400">No results data found for the selected session ({selectedSession}).</p>
                 </CardContent>
             </Card>
        ) : (
          <Tabs defaultValue="results" className="mt-6">
            {/* Adjust grid columns based on number of tabs */}
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 p-1 bg-gray-800/80 border border-gray-700 rounded-lg h-auto mb-6">
              <TabsTrigger value="results" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><Users className="w-4 h-4 mr-1.5 inline"/>Results</TabsTrigger>
              {/* Only show certain tabs if it's Race or Sprint */}
              {(selectedSession === 'R' || selectedSession === 'Sprint') && (
                <>
                  <TabsTrigger value="positions" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><MapPin className="w-4 h-4 mr-1.5 inline"/>Positions</TabsTrigger>
                  <TabsTrigger value="laptimes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><Timer className="w-4 h-4 mr-1.5 inline"/>Lap Times</TabsTrigger>
                  <TabsTrigger value="strategy" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><Flag className="w-4 h-4 mr-1.5 inline"/>Strategy</TabsTrigger>
                  {/* Replace Track Evolution with Circuit Comparison */}
                  <TabsTrigger value="circuit" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><Map className="w-4 h-4 mr-1.5 inline"/>Circuit</TabsTrigger>
                  <TabsTrigger value="telemetry" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors"><BarChart2 className="w-4 h-4 mr-1.5 inline"/>Telemetry</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Results Tab */}
            <TabsContent value="results" className="pt-2">
               <h2 className="text-xl font-semibold mb-4 text-white">Session Results: {availableSessions.find(s => s.type === selectedSession)?.name}</h2>
               <SessionResultsTable results={sessionResults} sessionType={selectedSession} year={year} />
            </TabsContent>

            {/* Position Changes Tab (Only for Race 'R') */}
            {(selectedSession === 'R') && (
              <TabsContent value="positions" className="pt-2">
                {year && eventName && (
                  <PositionChart year={year} event={eventName} session="R" />
                )}
              </TabsContent>
            )}

            {/* Lap Times Tab (Race or Sprint) - now including track evolution */}
            {(selectedSession === 'R' || selectedSession === 'Sprint') && (
              <TabsContent value="laptimes" className="pt-2">
                {year && eventName && (
                  <>
                    <RacingChart 
                      year={year} 
                      event={eventName} 
                      session={selectedSession} 
                      initialDrivers={["VER", "LEC"]} 
                      title="Lap Time Comparison" 
                    />
                    <div className="mt-8">
                      <TrackEvolutionChart 
                        year={year} 
                        event={eventName} 
                        session={selectedSession} 
                      />
                    </div>
                  </>
                )}
              </TabsContent>
            )}

            {/* Circuit Comparison Tab (replacing Track Evolution) */}
            {(selectedSession === 'R' || selectedSession === 'Sprint') && (
              <TabsContent value="circuit" className="pt-2">
                {year && eventName && (
                  <CircuitComparisonChart
                    year={year}
                    event={eventName}
                    session={selectedSession}
                  />
                )}
              </TabsContent>
            )}

            {/* Strategy Tab (Race or Sprint) */}
            {(selectedSession === 'R' || selectedSession === 'Sprint') && (
              <TabsContent value="strategy" className="pt-2">
                 {year && eventName && (
                   <TireStrategy year={year} event={eventName} session={selectedSession} />
                 )}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                   <FeatureCard title="Undercut Simulation" icon={<ArrowRightLeft />} description="Test hypothetical pit windows..." />
                   <FeatureCard title="Tire Degradation" icon={<BarChart2 />} description="Lap time analysis showing compound performance..." />
                 </div>
              </TabsContent>
            )}

            {/* Telemetry Tab (Race or Sprint) */}
            {(selectedSession === 'R' || selectedSession === 'Sprint') && (
              <TabsContent value="telemetry" className="pt-2">
                 {year && eventName && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Speed Trace */}
                        <SpeedTraceChart
                            year={year}
                            event={eventName}
                            session={selectedSession}
                            initialDriver={sessionResults[0]?.driverCode || "VER"} // Use first driver or default
                            lap={selectedLap} // Pass selected lap state
                            title="" // Title is handled internally now
                        />
                        {/* Gear Map */}
                        <GearMapChart
                            year={year}
                            event={eventName}
                            session={selectedSession}
                            initialDriver={sessionResults[0]?.driverCode || "VER"}
                            lap={selectedLap} // Pass selected lap state
                        />
                    </div>
                 )}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                   <FeatureCard title="G-Force Analysis" icon={<Gauge />} description="Explore lateral and longitudinal G-forces..." />
                   <FeatureCard title="Brake Temperature" icon={<Cpu />} description="Animated brake temperature visualization..." />
                   <FeatureCard title="ERS Deployment" icon={<BarChart2 />} description="Energy deployment and harvesting patterns..." />
                   <FeatureCard title="Aero Efficiency" icon={<ArrowRightLeft />} description="Downforce vs drag trade-off analysis..." />
                 </div>
              </TabsContent>
            )}

          </Tabs>
        )}
      </div>
    </div>
  );
};

// Updated FeatureCard component for "Coming Soon" features
const FeatureCard = ({ title, icon, description }: { title: string; icon: React.ReactNode; description: string }) => {
  return (
    <Card className="bg-gray-900/80 border-gray-700 overflow-hidden relative backdrop-blur-sm hover:border-gray-600 transition-colors">
      {/* "Coming Soon" Badge */}
      <div className="absolute top-0 right-0 bg-blue-600/80 px-3 py-1 text-xs font-medium flex items-center rounded-bl-md text-white">
        <Sparkles className="h-3 w-3 mr-1" /> Coming Soon
      </div>
      <CardHeader className="pb-2 pt-8">
        <div className="flex items-center gap-3">
          {/* Use a neutral color for the icon background */}
          <div className="p-2.5 rounded-full bg-gray-700/50 text-gray-400">{icon}</div>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        {/* Optional: Add a disabled button or remove it */}
        <Button size="sm" className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 cursor-not-allowed" disabled>
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
};

export default Race;
