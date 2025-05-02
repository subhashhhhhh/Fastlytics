import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { motion, useInView, useScroll, useTransform } from 'framer-motion'; // Added framer-motion imports
import { Award, Flag, Timer, User, Gauge, ArrowRight, Calendar, Clock, Users, LineChart, BarChart2, MapPin, Trophy, Zap, ChevronRight } from 'lucide-react'; // Added more icons
import EnhancedNavbar from '@/components/EnhancedNavbar';
import F1Card from '@/components/F1Card';
import EnhancedDiscordBanner from '@/components/EnhancedDiscordBanner'; // Import the enhanced Discord banner
import MobileWarningBanner from '@/components/MobileWarningBanner'; // Import mobile warning banner
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext'; // Import useSeason
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EnhancedStatsCard from '@/components/EnhancedStatsCard';
import EnhancedRaceCard from '@/components/EnhancedRaceCard';

// Define a type for combined race data
interface CombinedRaceData extends ScheduleEvent {
  result?: RaceResult;
  isUpcoming: boolean;
  isOngoing: boolean;
  displayDate: string;
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
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

const shimmer = {
  hidden: { backgroundPosition: '200% 0', opacity: 0.7 },
  visible: {
    backgroundPosition: '-200% 0',
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "linear"
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

  // Get 6 most recent races (either completed or ongoing)
  const recentRaces = useMemo<CombinedRaceData[]>(() => {
    if (!combinedRaceData.length) return [];
    
    const now = new Date();
    // Current date + 3 days to consider only current race weekend as "ongoing"
    const nearFuture = new Date();
    nearFuture.setDate(now.getDate() + 3);
    
    // Filter to include:
    // 1. Races that have already happened (not upcoming) - these have results
    // 2. Current race weekend - date is within 3 days of now
    const filteredRaces = combinedRaceData.filter(race => {
      const eventDate = new Date(race.EventDate);
      return !race.isUpcoming || (eventDate <= nearFuture);
    });
    
    // Sort by date (most recent first)
    return filteredRaces
      .sort((a, b) => new Date(b.EventDate).getTime() - new Date(a.EventDate).getTime())
      .slice(0, 6);
  }, [combinedRaceData]);

  const handleRaceClick = (race: CombinedRaceData) => {
    // Use the event name from either result or schedule
    const eventName = race.result?.event || race.EventName;
    const raceId = `${selectedYear}-${eventName.toLowerCase().replace(/\s+/g, '-')}`;
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
      <EnhancedNavbar />
      
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* Circuit-inspired pattern lines */}
        <motion.div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0" 
          style={{ y }}
        />
        <motion.div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/10 to-red-600/0" 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }} 
        />
        <motion.div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/15 to-red-600/0" 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }} 
        />
        
        {/* Curved racing line */}
        <svg 
          className="absolute top-[25%] right-0 w-[800px] h-[800px] opacity-10"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M800 0C800 441.828 441.828 800 0 800" 
            stroke="url(#paint0_linear)" 
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="800" x2="800" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glowing orbs */}
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[300px] h-[300px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-[250px] h-[250px] rounded-full bg-red-900/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-900/5 blur-3xl opacity-50" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
      </div>

      <div className="px-4 md:px-8 py-8 relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Premium Hero Header Section */}
        <motion.div 
          className="relative mb-8 md:mb-12 py-10 px-6 md:px-10 rounded-2xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {/* Background gradient overlay for header with enhanced design */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/95 backdrop-blur-sm rounded-2xl"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 -right-16 w-32 h-32 bg-red-600/5 rounded-full blur-2xl"></div>
          
          {/* Animated race line */}
          <motion.div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-700/0 via-red-700 to-red-700/0"
            variants={shimmer}
            style={{
              backgroundSize: '200% 100%'
            }}
          />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <motion.div className="md:max-w-lg" variants={fadeInLeft}>
                <motion.h1 
                  className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-3"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  F1 Season {selectedYear}
                </motion.h1>
                <p className="text-lg text-gray-300 mb-4">
                  Dive into detailed race analytics, team and driver statistics
                </p>
                <motion.div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1">LIVE DATA</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1">REAL-TIME UPDATES</Badge>
                  <span className="text-gray-400 text-sm">Refreshed every race weekend</span>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInRight} className="flex flex-col md:items-end gap-4">
                <Select
                  value={String(selectedYear)}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800/70 border-gray-700/80 text-gray-200 hover:bg-gray-700/60 hover:border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-offset-0 transition-colors duration-150 py-3 rounded-xl backdrop-blur-md shadow-lg">
                    <Calendar className="w-4 h-4 mr-2 opacity-60"/>
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-md border-gray-700/80 text-gray-200 rounded-xl">
                    <SelectGroup>
                      <SelectLabel className="text-gray-500 px-2 py-1.5">F1 Season</SelectLabel>
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
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 hidden md:flex w-full justify-center"
                    onClick={() => navigate('/races')}
                  >
                    View All Races
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Discord Community Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <EnhancedDiscordBanner />
        </motion.div>

        {/* Mobile Warning Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <MobileWarningBanner 
            id="mobile-view-warning"
            expiresInDays={1}
          />
        </motion.div>

        {/* --- Main Content Grid --- */
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 md:gap-8 mt-6">
          {/* Left Column - Team & Driver Standings */}
          <div className="lg:col-span-4 space-y-10">
            {/* Team Standings Section */}
            <motion.section 
              ref={teamsRef}
              className="rounded-2xl p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 shadow-xl relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-[100px] h-[100px] bg-red-600/5 rounded-full blur-2xl -ml-5 -mb-5"></div>
              <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0"></div>
              
              <motion.div
                initial="hidden"
                animate={isTeamsInView ? "visible" : "hidden"}
                variants={staggerChildren}
                className="relative z-10"
              >
                <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-600/20 rounded-xl">
                      <Award className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      Team <span className="text-red-500">Standings</span>
                    </h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 text-sm rounded-full" 
                    onClick={() => navigate('/standings/teams')}
                  >
                    Full standings <ArrowRight className="w-4 h-4 ml-1"/>
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
                        <Skeleton className="h-[100px] bg-gray-800/50 rounded-xl"/>
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
                        className="h-full cursor-pointer"
                        onClick={() => navigate(`/standings/teams?highlight=${team.team}`)}
                      >
                        <F1Card
                          title={team.team}
                          value={`${team.points} PTS`}
                          team={getTeamColorClass(team.team) as any}
                          icon={<Award className={`h-5 w-5 text-f1-${getTeamColorClass(team.team)}`} />}
                          points_change={team.points_change}
                          className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-600/50 transition-colors duration-200 h-full rounded-xl shadow-lg"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Team standings quick summary - new addition */}
                {!isLoadingTeams && teamStandings && teamStandings.length > 0 && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-800/30"
                    variants={fadeInUp}
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Points gap between 1st and 2nd: 
                        <span className="font-medium text-white ml-1">
                          {teamStandings[0].points - teamStandings[1].points}
                        </span>
                      </div>
                      <Badge 
                        className="bg-gray-800/60 text-gray-300 border-gray-700/50"
                      >
                        {teamStandings.length} Teams
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.section>

            {/* Driver Standings Section */}
            <motion.section 
              ref={driversRef}
              className="rounded-2xl p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 shadow-xl relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-red-600/5 rounded-full blur-3xl -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-red-600/5 rounded-full blur-2xl -mr-5 -mb-5"></div>
              <div className="absolute top-1/2 right-1/4 w-px h-32 bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0"></div>
              
              <motion.div
                initial="hidden"
                animate={isDriversInView ? "visible" : "hidden"}
                variants={staggerChildren}
                className="relative z-10"
              >
                <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-600/20 rounded-xl">
                      <Users className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      Driver <span className="text-red-500">Standings</span>
                    </h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 text-sm rounded-full" 
                    onClick={() => navigate('/standings/drivers')}
                  >
                    Full standings <ArrowRight className="w-4 h-4 ml-1"/>
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
                        <Skeleton className="h-[100px] bg-gray-800/50 rounded-xl"/>
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
                        className="h-full cursor-pointer group"
                        onClick={() => navigate(`/standings/drivers?highlight=${driver.code}`)}
                      >
                        <F1Card
                          title={driver.name}
                          value={`${driver.points} PTS`}
                          team={getTeamColorClass(driver.team) as any}
                          icon={<Users className={`h-5 w-5 text-f1-${getTeamColorClass(driver.team)}`} />}
                          points_change={driver.points_change}
                          isRookie={isRookie(driver.code, selectedYear)}
                          className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-600/50 transition-colors duration-200 h-full rounded-xl shadow-lg relative"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Driver standings quick summary - new addition */}
                {!isLoadingDrivers && driverStandings && driverStandings.length > 0 && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-800/30"
                    variants={fadeInUp}
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Points gap between 1st and 2nd: 
                        <span className="font-medium text-white ml-1">
                          {driverStandings[0].points - driverStandings[1].points}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                          {rookiesByYear[selectedYear.toString()]?.length || 0} Rookies
                        </Badge>
                        <Badge className="bg-gray-800/60 text-gray-300 border-gray-700/50">
                          {driverStandings.length} Drivers
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.section>

            {/* Quick Stats Dashboard Section */}
            <motion.section 
              className="rounded-2xl p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-1/2 left-1/4 w-[100px] h-[100px] bg-red-600/5 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-600/20 rounded-xl">
                  <LineChart className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold">
                  Season <span className="text-red-500">Statistics</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <EnhancedStatsCard
                  icon={<Flag className="h-5 w-5" />}
                  title="Races"
                  value={raceResults?.length || "0"}
                  description="Completed races"
                  iconColor="blue-400"
                  accentColor="blue-500/20"
                />

                <EnhancedStatsCard
                  icon={<Users className="h-5 w-5" />}
                  title="Teams"
                  value={teamStandings?.length || "0"}
                  description="Constructors"
                  iconColor="amber-400"
                  accentColor="amber-500/20"
                />

                <EnhancedStatsCard
                  icon={<User className="h-5 w-5" />}
                  title="Drivers"
                  value={driverStandings?.length || "0"}
                  description="Competitors"
                  iconColor="green-400"
                  accentColor="green-500/20"
                />

                <EnhancedStatsCard
                  icon={<Trophy className="h-5 w-5" />}
                  title="Points"
                  value={teamStandings ? teamStandings.reduce((sum, team) => sum + (team.points || 0), 0) : "0"}
                  description="Total awarded"
                  iconColor="purple-400"
                  accentColor="purple-500/20"
                />
              </div>
            </motion.section>
          </div>

          {/* Right Column - Race Analytics */}
          <aside className="lg:col-span-2 space-y-6" ref={racesRef}>
            <motion.div
              className="rounded-2xl p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800/50 shadow-xl relative overflow-hidden h-full"
              initial="hidden"
              animate={isRacesInView ? "visible" : "hidden"}
              variants={staggerChildren}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-red-600/5 rounded-full blur-3xl -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-red-600/5 rounded-full blur-2xl -mr-5 -mb-5"></div>
              
              <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-600/20 rounded-xl">
                    <Flag className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    Race <span className="text-red-500">Analysis</span>
                  </h2>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 text-sm rounded-full" 
                  onClick={() => navigate('/races')}
                >
                  All races <ArrowRight className="w-4 h-4 ml-1"/>
                </Button>
              </motion.div>
              
              {isLoadingRaceResults || isLoadingSchedule ? (
                <motion.div className="space-y-5" variants={fadeInUp}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[100px] bg-gray-800/50 rounded-xl"/>
                  ))}
                </motion.div>
              ) : recentRaces.length > 0 ? (
                <motion.div className="space-y-5 relative z-10" variants={fadeInUp}>
                  {recentRaces.slice(0, 4).map((race, index) => {
                    const teamColor = race.result ? getTeamColorClass(race.result.team) : 'gray';
                    
                    return (
                      <motion.div
                        key={`${selectedYear}-${race.EventName}`}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 }
                          }
                        }}
                      >
                        <EnhancedRaceCard 
                          raceName={race.EventName}
                          date={race.displayDate}
                          location={race.Location}
                          isUpcoming={race.isUpcoming}
                          isOngoing={race.isOngoing}
                          winnerName={race.result?.driver}
                          winnerTeam={teamColor}
                          onClick={() => handleRaceClick(race)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div variants={fadeInUp} className="relative z-10">
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-gray-800/60 backdrop-blur-lg rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No race data available</p>
                    <p className="text-gray-500 text-sm mb-6">Season {selectedYear} data hasn't been added yet</p>
                    <Button 
                      variant="outline" 
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => setSelectedYear(availableYears[1] || selectedYear)}
                    >
                      Try a different season
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Quick Access Cards */}
              {recentRaces.length > 0 && (
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-800/50"
                  variants={fadeInUp}
                >
                  <h3 className="text-lg font-medium mb-4">Quick Access</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="border-gray-700/80 bg-gray-800/30 hover:bg-gray-800/60 text-gray-300 w-full justify-start px-4"
                      onClick={() => navigate('/standings/teams')}
                    >
                      <Award className="mr-2 h-4 w-4 text-amber-400" />
                      Team Standings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-700/80 bg-gray-800/30 hover:bg-gray-800/60 text-gray-300 w-full justify-start px-4"
                      onClick={() => navigate('/standings/drivers')}
                    >
                      <Users className="mr-2 h-4 w-4 text-blue-400" />
                      Driver Standings
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Replaced the FeatureCardRedesigned component with a new design
const FeatureCardRedesigned = ({
  title, description, icon, linkTo
}: {
  title: string; description: string; icon: React.ReactNode; linkTo: string;
}) => {
  return (
    <Card
      className={cn(
        "bg-gray-900/60 backdrop-blur-lg border-gray-800/50",
        "cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-800/70 hover:border-red-500/40",
        "relative overflow-hidden rounded-xl shadow-lg" 
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
          </div>
          <div className="p-2.5 bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-end items-center text-xs text-red-400">
          <ArrowRight className="w-3 h-3 ml-1"/>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
