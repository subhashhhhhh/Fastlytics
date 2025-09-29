import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { motion, useInView, useScroll, useTransform } from 'framer-motion'; // Added framer-motion imports
import { Award, Flag, Lock, Cpu, Timer, User, Gauge, ArrowRight, CreditCard, Calendar, Clock, Users, Trophy, ChevronDown } from 'lucide-react'; // Added Trophy and ChevronDown icons
import Navbar from '@/components/Navbar';
import F1Card from '@/components/F1Card';
 // Import the new Discord banner
import MobileWarningBanner from '@/components/MobileWarningBanner'; // Import mobile warning banner
// Removed TrackProgress import as it's no longer used
import { Button } from "@/components/ui/button";
import {
  fetchTeamStandings,
  fetchDriverStandings,
  fetchRaceResults,
  fetchSchedule,
  TeamStanding,
  DriverStanding,
  RaceResult,
  ScheduleEvent
} from '@/lib/api'; // Import API functions and types
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext'; // Import useSeason
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define a type for combined race data
interface CombinedRaceData extends ScheduleEvent {
  result?: RaceResult;
  isUpcoming: boolean;
  isOngoing: boolean;
  displayDate: string;
}

// Define rookies by season year
const rookiesByYear: { [year: string]: string[] } = {
  '2025': ['ANT', 'BOR', 'DOO', 'BEA', 'HAD', 'LAW', 'COL'], // Antonelli, Bortoleto, Doohan, Bearman, Hadjar, Lawson, Colapinto
  '2024': ['BEA', 'COL'], // Bearman, Colapinto
  '2023': ['PIA', 'SAR', 'DEV'], // Piastri, Sargeant, De Vries
  '2022': ['ZHO'], // Zhou
  '2021': ['MSC', 'MAZ', 'TSU'], // Mick Schumacher, Mazepin, Tsunoda
  '2020': ['LAT'], // Latifi
  '2019': ['NOR', 'RUS', 'ALB'] // Norris, Russell, Albon
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Helper function to check if a driver is a rookie in a given year
const isRookie = (driverCode: string, year: number): boolean => {
  const yearStr = year.toString();
  return rookiesByYear[yearStr]?.includes(driverCode) || false;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason(); // Use context
  
  // Refs for scroll-triggered animations
  const teamsRef = useRef(null);
  const driversRef = useRef(null);
  const racesRef = useRef(null);
  
  // Check if sections are in view
  const isTeamsInView = useInView(teamsRef, { once: false, amount: 0.2 });
  const isDriversInView = useInView(driversRef, { once: false, amount: 0.2 });
  const isRacesInView = useInView(racesRef, { once: false, amount: 0.2 });
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

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
  const { data: raceResults, isLoading: isLoadingRaceResults } = useQuery<RaceResult[]>({
     queryKey: ['raceResults', selectedYear],
     queryFn: () => fetchRaceResults(selectedYear),
     staleTime: 1000 * 60 * 30,
     gcTime: 1000 * 60 * 60,
  });

  // NEW: Fetch Schedule to show ongoing races
  const { data: scheduleData, isLoading: isLoadingSchedule } = useQuery<ScheduleEvent[]>({
     queryKey: ['schedule', selectedYear],
     queryFn: () => fetchSchedule(selectedYear),
     staleTime: 1000 * 60 * 60 * 24, // Cache schedule for a day
     gcTime: 1000 * 60 * 60 * 48,
     retry: 1,
  });

  // Combine schedule and results data like the Races page
  const combinedRaceData = useMemo<CombinedRaceData[]>(() => {
    if (!scheduleData) return [];

    const resultsMap = new Map(raceResults?.map(res => [res.event, res]));
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
  }, [scheduleData, raceResults]);

  // Get 6 most recent races (including upcoming race during race week)
  const recentRaces = useMemo<CombinedRaceData[]>(() => {
    if (!combinedRaceData.length) return [];
    
    const now = new Date();
    
    // Helper function to check if we're in race week (Monday to Sunday of race week)
    const isInRaceWeek = (raceDate: Date): boolean => {
      // Get the Monday of the race week (6 days before race)
      const raceWeekStart = new Date(raceDate);
      raceWeekStart.setDate(raceDate.getDate() - 6); // Go back 6 days to Monday
      raceWeekStart.setHours(0, 0, 0, 0);
      
      // Get the Sunday after race (race week end)
      const raceWeekEnd = new Date(raceDate);
      raceWeekEnd.setDate(raceDate.getDate() + 1); // Day after race
      raceWeekEnd.setHours(23, 59, 59, 999);
      
      return now >= raceWeekStart && now <= raceWeekEnd;
    };
    
    // Filter to include:
    // 1. Races that have already happened (not upcoming) - these have results
    // 2. Current race weekend - date is within 3 days of now (ongoing)
    // 3. Upcoming races during race week (Monday to Sunday of race week)
    const filteredRaces = combinedRaceData.filter(race => {
      const eventDate = new Date(race.EventDate);
      
      if (!race.isUpcoming) {
        // Include all completed races
        return true;
      } else {
        // For upcoming races, include if it's within 3 days (ongoing) OR if we're in race week
        const nearFuture = new Date();
        nearFuture.setDate(now.getDate() + 3);
        
        return (eventDate <= nearFuture) || isInRaceWeek(eventDate);
      }
    });
    
    // Sort by date (most recent first, but put current/upcoming race week first)
    return filteredRaces
      .sort((a, b) => {
        const dateA = new Date(a.EventDate);
        const dateB = new Date(b.EventDate);
        
        // If one is in current race week and the other isn't, prioritize race week
        const aIsRaceWeek = a.isUpcoming && isInRaceWeek(dateA);
        const bIsRaceWeek = b.isUpcoming && isInRaceWeek(dateB);
        
        if (aIsRaceWeek && !bIsRaceWeek) return -1;
        if (!aIsRaceWeek && bIsRaceWeek) return 1;
        
        // Otherwise sort by date (most recent first)
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 6);
  }, [combinedRaceData]);

  const handleRaceClick = (race: CombinedRaceData) => {
    // Use the event name from either result or schedule
    // For upcoming races, race.result will be undefined, so use EventName
    const eventName = race.result?.event || race.EventName;
    const raceId = `${selectedYear}-${eventName.toLowerCase().replace(/\s+/g, '-')}`;
    console.log('Navigating to race:', { eventName, raceId, isUpcoming: race.isUpcoming });
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Background Elements - decorative circuit lines, similar to landing page */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0" 
          style={{ y }}
        />
        <motion.div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/10 to-red-600/0" 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }} 
        />
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[300px] h-[300px] rounded-full bg-red-900/10 blur-3xl" />
      </div>

      <div className="px-4 md:px-8 py-8 relative z-10">
        {/* --- Header Section --- */}
        <motion.header 
          className="mb-8 md:mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white" style={{ backgroundSize: '200% 100%' }}>
                Dashboard
              </h1>
              <p className="text-sm sm:text-md md:text-lg text-gray-400">{selectedYear} Season Overview</p>
            </div>
            {/* Season Selector */}
            <motion.div 
              className="flex items-center gap-4"
              variants={fadeInUp}
            >
              <div className="relative group">
                <Select
                  value={String(selectedYear)}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-[180px] bg-gray-900/70 border border-red-500/20 text-white hover:bg-gray-800/80 hover:border-red-500/40 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-offset-0 transition-all duration-200 py-2.5 backdrop-blur-md rounded-xl shadow-[0_4px_12px_rgba(153,27,27,0.15)] pr-8 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 bg-red-500/20 rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        <Trophy className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{selectedYear}</span>
                        <div className="ml-2 text-xs bg-red-600/70 text-white px-1.5 py-0.5 rounded-full">
                          F1
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70 transition-transform duration-200 group-hover:opacity-100 group-data-[state=open]:rotate-180" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 border-red-500/20 text-white rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SelectGroup>
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                          <SelectLabel className="text-gray-400 text-xs uppercase tracking-wider">Season</SelectLabel>
                          <span className="text-xs text-gray-500">{availableYears.length} seasons</span>
                        </div>
                        <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {availableYears.map((year, index) => (
                            <SelectItem
                              key={year}
                              value={String(year)}
                              className="text-base py-2.5 pl-10 pr-3 focus:bg-red-600/20 data-[state=checked]:bg-red-600/30 data-[state=checked]:text-white relative"
                            >
                              <div className="flex items-center w-full">
                                <span className="w-12 text-gray-400 font-mono text-sm">{year}</span>
                                <span className="font-medium ml-2">Formula 1</span>
                                {selectedYear === year && (
                                  <div className="ml-auto h-2 w-2 rounded-full bg-red-500"></div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectGroup>
                    </motion.div>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </motion.div>
        </motion.header>

        {/* Discord Community Banner (non-closeable) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
        </motion.div>

        {/* Mobile Warning Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <MobileWarningBanner 
            id="mobile-view-warning"
            expiresInDays={1}
          />
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Team Standings Section */}
            <section ref={teamsRef}>
              <motion.div
                initial="hidden"
                animate={isTeamsInView ? "visible" : "hidden"}
                variants={staggerChildren}
              >
                <motion.div variants={fadeInUp} className="flex justify-between items-center mb-5">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Team <span className="text-red-500">Standings</span>
                  </h2>
                  <Button 
                    variant="link" 
                    className="text-red-400 hover:text-red-300 px-0 text-sm" 
                    onClick={() => navigate('/standings/teams')}
                  >
                    See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                  </Button>
                </motion.div>
                
                {isLoadingTeams ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Skeleton className="h-[88px] bg-gray-800/50 rounded-lg"/>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {teamStandings?.slice(0, 4).map((team, index) => (
                      <motion.div
                        key={team.shortName || team.team}
                        initial="hidden"
                        animate={isTeamsInView ? "visible" : "hidden"}
                        whileHover="hover"
                        custom={{ delay: index * 0.1 }}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 }
                          },
                          hover: { 
                            y: -10, 
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                            transition: { duration: 0.3, ease: "easeOut" }
                          }
                        }}
                        className="h-full"
                      >
                        <F1Card
                          title={team.team}
                          value={`${team.points} PTS`}
                          team={getTeamColorClass(team.team) as any}
                          icon={<Award className={`h-5 w-5 text-f1-${getTeamColorClass(team.team)}`} />}
                          points_change={team.points_change}
                          className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-600/50 transition-colors duration-200 h-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>

            {/* Driver Standings Section */}
            <section ref={driversRef}>
              <motion.div
                initial="hidden"
                animate={isDriversInView ? "visible" : "hidden"}
                variants={staggerChildren}
              >
                <motion.div variants={fadeInUp} className="flex justify-between items-center mb-5">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Driver <span className="text-red-500">Standings</span>
                  </h2>
                  <Button 
                    variant="link" 
                    className="text-red-400 hover:text-red-300 px-0 text-sm" 
                    onClick={() => navigate('/standings/drivers')}
                  >
                    See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                  </Button>
                </motion.div>
                
                {isLoadingDrivers ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Skeleton className="h-[88px] bg-gray-800/50 rounded-lg"/>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {driverStandings?.slice(0, 4).map((driver, index) => (
                      <motion.div
                        key={driver.code}
                        initial="hidden"
                        animate={isDriversInView ? "visible" : "hidden"}
                        whileHover="hover"
                        custom={{ delay: index * 0.1 }}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 }
                          },
                          hover: { 
                            y: -10, 
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                            transition: { duration: 0.3, ease: "easeOut" }
                          }
                        }}
                        className="h-full"
                      >
                        <F1Card
                          title={driver.name}
                          value={`${driver.points} PTS`}
                          team={getTeamColorClass(driver.team) as any}
                          icon={<Users className={`h-5 w-5 text-f1-${getTeamColorClass(driver.team)}`} />}
                          points_change={driver.points_change}
                          isRookie={isRookie(driver.code, selectedYear)}
                          className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-600/50 transition-colors duration-200 h-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>
          </div>

          {/* Right Column - Explore Analytics by Race */}
          <aside className="lg:col-span-1 space-y-6" ref={racesRef}>
            <motion.div
              initial="hidden"
              animate={isRacesInView ? "visible" : "hidden"}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className="flex justify-between items-center mb-5">
                <h2 className="text-xl md:text-2xl font-bold">
                  Race <span className="text-red-500">Analytics</span>
                </h2>
                <Button 
                  variant="link" 
                  className="text-red-400 hover:text-red-300 px-0 text-sm" 
                  onClick={() => navigate('/races')}
                >
                  View all races <ArrowRight className="w-4 h-4 ml-1"/>
                </Button>
              </motion.div>
              
              {isLoadingRaceResults || isLoadingSchedule ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Skeleton className="h-[88px] bg-gray-800/50 rounded-lg"/>
                    </motion.div>
                  ))}
                </div>
              ) : recentRaces.length > 0 ? (
                <div className="space-y-4">
                  {recentRaces.slice(0, 4).map((race, index) => {
                    const teamColor = race.result ? getTeamColorClass(race.result.team) : 'gray';
                    
                    return (
                      <motion.div
                        key={`${selectedYear}-${race.EventName}`}
                        initial="hidden"
                        animate={isRacesInView ? "visible" : "hidden"}
                        whileHover="hover"
                        custom={{ delay: index * 0.1 }}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 }
                          },
                          hover: { 
                            y: -10, 
                            scale: 1.02,
                            transition: { duration: 0.3, ease: "easeOut" }
                          }
                        }}
                        onClick={() => handleRaceClick(race)}
                        className="cursor-pointer"
                      >
                        <Card 
                          className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-500/50 transition-colors duration-200"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold text-white">{race.EventName}</CardTitle>
                                <CardDescription className="text-gray-400 text-sm">
                                  {race.displayDate}{race.Location ? `, ${race.Location}` : ''}
                                </CardDescription>
                              </div>
                              <div className={`p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/80 text-f1-${teamColor}`}>
                                <Flag className="h-5 w-5" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="flex justify-between items-center">
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
                                <span className="text-sm text-gray-300">Winner: {race.result.driver}</span>
                              ) : (
                                <span className="text-sm text-gray-300 italic">Race in progress</span>
                              )}
                              <ArrowRight className="w-4 h-4 text-red-400"/>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.p
                  variants={fadeInUp}
                  className="text-gray-500 italic py-10 text-center"
                >
                  No race results available for {selectedYear}.
                </motion.p>
              )}
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Replaced the FeatureCardRedesigned component since it's no longer used
const FeatureCardRedesigned = ({
  title, description, icon, linkTo
}: {
  title: string; description: string; icon: React.ReactNode; linkTo: string;
}) => {
  return (
    <Card
      className={cn(
        "bg-gray-900/70 border-gray-700/80",
        "cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-800/80 hover:border-red-500/50",
        "relative overflow-hidden" 
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
          </div>
          <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex justify-end items-center text-xs text-red-400">
          <ArrowRight className="w-3 h-3 ml-1"/>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
