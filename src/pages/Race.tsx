import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Flag, BarChart2, Clock, Cpu, ArrowRightLeft, Gauge, User, Lock, Droplets, AlertCircle, Zap } from 'lucide-react'; // Added Zap
import Navbar from '@/components/Navbar';
import RacingChart from '@/components/RacingChart';
import TireStrategy from '@/components/TireStrategy';
import SpeedTraceChart from '@/components/SpeedTraceChart';
import GearMapChart from '@/components/GearMapChart';
import PositionChart from '@/components/PositionChart'; // Import the new chart
import F1Card from '@/components/F1Card';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSpecificRaceResults, DetailedRaceResult } from '@/lib/api';
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

const Race = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();

  // Parse year and event slug from raceId
  const { year, eventSlug, eventName } = useMemo(() => {
    if (!raceId) return { year: null, eventSlug: null, eventName: 'Race' };
    const parts = raceId.split('-');
    const parsedYear = parseInt(parts[0], 10);
    if (isNaN(parsedYear)) return { year: null, eventSlug: raceId, eventName: 'Invalid Race ID' }; // Handle invalid year

    const slug = parts.slice(1).join('-'); // The rest is the slug
    // Convert slug to title case name, replacing hyphens with spaces
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return { year: parsedYear, eventSlug: slug, eventName: name };
  }, [raceId]);

  // Fetch detailed race results (using eventSlug for the API call)
  const { data: raceResults, isLoading, error, isError } = useQuery<DetailedRaceResult[]>({
    queryKey: ['raceResult', year, eventSlug],
    queryFn: () => {
        if (!year || !eventSlug) throw new Error("Invalid year or event slug");
        return fetchSpecificRaceResults(year, eventSlug);
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    retry: 1,
    enabled: !!year && !!eventSlug,
  });

  // Find winner from fetched results
  const winner = useMemo(() => {
    if (!raceResults) return null;
    return raceResults.find(r => r.position === 1);
  }, [raceResults]);

  // Find pole sitter
  const poleSitter = useMemo(() => {
    if (!raceResults) return null;
    return raceResults.find(r => r.gridPosition === 1);
  }, [raceResults]);

  // Find fastest lap holder
  const fastestLapHolder = useMemo(() => {
    if (!raceResults) return null;
    // The isFastestLap field might be optional if the processor script hasn't run for older data
    return raceResults.find(r => r.isFastestLap === true);
  }, [raceResults]);


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

  // --- Render States ---
  if (!year || !eventSlug) {
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

  if (isLoading) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
         <Navbar />
         <div className="container py-6">
           <div className="flex items-center mb-6">
             <Skeleton className="h-10 w-10 mr-4 rounded-full bg-gray-800/50"/>
             <div>
                <Skeleton className="h-8 w-64 mb-2 bg-gray-800/50"/>
                <Skeleton className="h-4 w-32 bg-gray-800/50"/>
             </div>
           </div>
           <Skeleton className="h-24 w-full md:w-1/3 mb-8 bg-gray-800/50 rounded-lg" />
           <Skeleton className="h-10 w-full mb-6 bg-gray-800/50 rounded-lg" />
           <Skeleton className="h-80 w-full bg-gray-800/50 rounded-lg" />
         </div>
       </div>
     );
  }

  if (isError) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
         <Navbar />
         <div className="container py-6 text-center">
           <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
           <h1 className="text-2xl font-semibold mb-2 text-white">Error Loading Race Data</h1>
           <p className="text-sm text-gray-400 mb-6">{(error as Error)?.message || 'Could not fetch data for this race.'}</p>
           <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
           </Button>
         </div>
       </div>
     );
  }

  // --- Render Page ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      <div className="container py-6">
        {/* Header */}
        <header className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4 text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{eventName}</h1>
            <p className="text-gray-400">{year} Season</p>
          </div>
        </header>

        {/* Key Info Cards (Winner, Pole, Fastest Lap) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Race Winner Card */}
            {winner && (
                <F1Card
                    title="Race Winner"
                    value={winner.fullName}
                    team={getTeamColorClass(winner.team) as any}
                    icon={<Trophy className={`h-6 w-6 text-f1-${getTeamColorClass(winner.team)}`} />}
                    // points_change is optional, not applicable here
                    className="animate-fade-in bg-gray-900/80 border border-gray-700"
                />
            )}
            {/* Pole Position Card */}
            {poleSitter && (
                 <F1Card
                    title="Pole Position"
                     value={poleSitter.fullName}
                     team={getTeamColorClass(poleSitter.team) as any}
                     icon={<Zap className={`h-6 w-6 text-f1-${getTeamColorClass(poleSitter.team)}`} />} // Use Zap icon
                     // points_change is optional, not applicable here
                     className="animate-fade-in bg-gray-900/80 border border-gray-700"
                  />
             )}
              {/* Fastest Lap Card */}
            {fastestLapHolder && (
                 <F1Card
                    title="Fastest Lap"
                     value={fastestLapHolder.fullName}
                     team={getTeamColorClass(fastestLapHolder.team) as any}
                     icon={<Clock className={`h-6 w-6 text-f1-${getTeamColorClass(fastestLapHolder.team)}`} />}
                     // points_change is optional, not applicable here
                     className="animate-fade-in bg-gray-900/80 border border-gray-700"
                  />
             )}
         </div>


        {/* Race Analysis Tabs */}
        <Tabs defaultValue="results" className="mb-8">
          {/* Refined Responsive Tabs */}
          <TabsList className="flex flex-wrap h-auto justify-start gap-1 p-1 bg-gray-800/80 border border-gray-700 rounded-lg">
            <TabsTrigger value="results" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors">Results</TabsTrigger>
            <TabsTrigger value="positions" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors">Positions</TabsTrigger> {/* New Tab Trigger */}
            <TabsTrigger value="laptimes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors">Lap Times</TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors">Strategy</TabsTrigger>
            <TabsTrigger value="telemetry" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50 rounded-md px-3 py-1.5 text-sm transition-colors">Telemetry</TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results" className="pt-6">
             <h2 className="text-xl font-semibold mb-4 text-white">Full Race Results</h2>
             <div className="bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <Table>
                    <TableHeader className="bg-gray-800/50">
                        <TableRow className="border-gray-700">
                            <TableHead className="w-[50px] text-center text-white font-semibold">Pos</TableHead>
                            <TableHead className="text-white font-semibold">Driver</TableHead>
                            <TableHead className="text-white font-semibold">Team</TableHead>
                            <TableHead className="text-center text-white font-semibold">Grid</TableHead>
                            <TableHead className="text-white font-semibold">Status</TableHead>
                            <TableHead className="text-right text-white font-semibold">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {raceResults?.map((res) => (
                            <TableRow key={res.driverCode} className="border-gray-700/50 hover:bg-gray-800/40">
                                <TableCell className="text-center font-medium">{res.position ?? 'N/A'}</TableCell>
                                <TableCell className="font-medium">{res.fullName}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <span className={cn("w-2 h-2 rounded-full", `bg-f1-${getTeamColorClass(res.team)}`)}></span>
                                    {res.team}
                                </TableCell>
                                <TableCell className="text-center">{res.gridPosition ?? 'N/A'}</TableCell>
                                <TableCell>{res.status}</TableCell>
                                <TableCell className="text-right font-bold">{res.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
          </TabsContent>

           {/* Position Changes Tab */}
           <TabsContent value="positions" className="pt-6">
             {year && eventName && (
               <PositionChart
                 year={year}
                 event={eventName} // Pass the name with spaces
                 session="R" // Position data only available for Race
               />
             )}
           </TabsContent>

          {/* Lap Times Tab */}
          <TabsContent value="laptimes" className="pt-6">
            {year && eventName && (
              <RacingChart
                year={year}
                event={eventName} // Pass the name with spaces
                session="R"
                initialDrivers={["VER", "LEC"]} // Pass initial drivers array
                title="Lap Time Comparison" // Title is now more generic
              />
            )}
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="pt-6">
             {year && eventName && (
               <TireStrategy
                 year={year}
                 event={eventName} // Pass the name with spaces
                 session="R"
               />
             )}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
               <PremiumFeatureCard title="Undercut Simulation" icon={<ArrowRightLeft />} description="Test hypothetical pit windows..." />
               <PremiumFeatureCard title="Tire Degradation" icon={<BarChart2 />} description="Lap time analysis showing compound performance..." />
             </div>
          </TabsContent>

          {/* Telemetry Tab */}
          <TabsContent value="telemetry" className="pt-6">
             {year && eventName && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <SpeedTraceChart
                        year={year}
                        event={eventName} // Pass the name with spaces
                        session="R"
                        initialDriver="VER"
                        lap="fastest"
                        title="Fastest Lap Speed Trace"
                    />
                    <GearMapChart
                        year={year}
                        event={eventName} // Pass the name with spaces
                        session="R"
                        initialDriver="VER"
                        lap="fastest"
                    />
                </div>
             )}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
               <PremiumFeatureCard title="G-Force Analysis" icon={<Gauge />} description="Explore lateral and longitudinal G-forces..." />
               <PremiumFeatureCard title="Brake Temperature" icon={<Cpu />} description="Animated brake temperature visualization..." />
               <PremiumFeatureCard title="ERS Deployment" icon={<BarChart2 />} description="Energy deployment and harvesting patterns..." />
               <PremiumFeatureCard title="Aero Efficiency" icon={<ArrowRightLeft />} description="Downforce vs drag trade-off analysis..." />
             </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

// Keep PremiumFeatureCard component
const PremiumFeatureCard = ({ title, icon, description }: { title: string; icon: React.ReactNode; description: string }) => {
  const navigate = useNavigate();
  return (
    <Card className="bg-gray-900/80 border-gray-700 overflow-hidden relative">
      <div className="absolute top-0 right-0 bg-red-600/80 px-3 py-1 text-xs font-medium flex items-center rounded-bl-md text-white">
        <Lock className="h-3 w-3 mr-1" /> Premium
      </div>
      <CardHeader className="pb-2 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-red-500/10 text-red-500">{icon}</div>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
        <Button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => navigate('/subscription')}>
          Unlock Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export default Race;
