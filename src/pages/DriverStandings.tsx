import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, Trophy, MinusCircle, Award, 
  AlertCircle, ArrowUp, ArrowDown, ChevronDown,
  User, Flag, Medal, Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { fetchDriverStandings, DriverStanding } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext';

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

// Define driver numbers for recent years
const driverNumbers: { [year: string]: { [driverCode: string]: number } } = {
  '2025': {
    'VER': 1, 'HAM': 44, 'NOR': 4, 'LEC': 16, 'SAI': 55, 'RUS': 63, 'PIA': 81, 
    'ALO': 14, 'STR': 18, 'OCO': 31, 'GAS': 10, 'HUL': 27, 'MAG': 20, 
    'ALB': 23, 'TSU': 22, 'ZHO': 24, 'BOT': 77, 'LAW': 40, 'ANT': 87, 'BOR': 84, 
    'BEA': 28, 'DOO': 61, 'HAD': 50, 'COL': 43
  },
  '2024': {
    'VER': 1, 'HAM': 44, 'NOR': 4, 'LEC': 16, 'SAI': 55, 'RUS': 63, 'PIA': 81, 
    'ALO': 14, 'STR': 18, 'OCO': 31, 'GAS': 10, 'HUL': 27, 'MAG': 20, 
    'ALB': 23, 'TSU': 22, 'ZHO': 24, 'BOT': 77, 'RIC': 3, 'SAR': 2, 'BEA': 50, 'COL': 43
  },
  '2023': {
    'VER': 1, 'HAM': 44, 'NOR': 4, 'LEC': 16, 'SAI': 55, 'RUS': 63, 'PIA': 81, 
    'ALO': 14, 'STR': 18, 'OCO': 31, 'GAS': 10, 'HUL': 27, 'MAG': 20, 
    'ALB': 23, 'TSU': 22, 'ZHO': 24, 'BOT': 77, 'RIC': 3, 'SAR': 2, 'DEV': 21
  },
  '2022': {
    'VER': 1, 'HAM': 44, 'LEC': 16, 'SAI': 55, 'RUS': 63, 
    'PER': 11, 'NOR': 4, 'RIC': 3, 'ALO': 14, 'OCO': 31, 
    'GAS': 10, 'TSU': 22, 'VET': 5, 'STR': 18, 'ZHO': 24, 
    'BOT': 77, 'ALB': 23, 'LAT': 6, 'MSC': 47, 'MAG': 20
  },
  '2021': {
    'VER': 33, 'HAM': 44, 'BOT': 77, 'NOR': 4, 'PER': 11, 
    'LEC': 16, 'RIC': 3, 'SAI': 55, 'TSU': 22, 'STR': 18, 
    'RAI': 7, 'ALO': 14, 'GAS': 10, 'OCO': 31, 'VET': 5, 
    'GIO': 99, 'RUS': 63, 'MSC': 47, 'MAZ': 9, 'LAT': 6
  },
  '2020': {
    'HAM': 44, 'BOT': 77, 'VER': 33, 'PER': 11, 'RIC': 3,
    'SAI': 55, 'ALB': 23, 'LEC': 16, 'NOR': 4, 'GAS': 10,
    'STR': 18, 'OCO': 31, 'VET': 5, 'KVY': 26, 'HUL': 27,
    'RAI': 7, 'GIO': 99, 'MAG': 20, 'LAT': 6, 'GRO': 8, 'RUS': 63
  },
  '2019': {
    'HAM': 44, 'BOT': 77, 'VER': 33, 'LEC': 16, 'VET': 5,
    'SAI': 55, 'GAS': 10, 'ALB': 23, 'RIC': 3, 'PER': 11,
    'NOR': 4, 'RAI': 7, 'KVY': 26, 'HUL': 27, 'STR': 18,
    'MAG': 20, 'KUB': 88, 'GRO': 8, 'GIO': 99, 'RUS': 63
  }
};

// Get driver number
const getDriverNumber = (driverCode: string, year: number): number | null => {
  const yearStr = year.toString();
  return driverNumbers[yearStr]?.[driverCode] || null;
};

const DriverStandings = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason();
  const standingsRef = useRef(null);
  const isStandingsInView = useInView(standingsRef, { once: true, amount: 0.2 });
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Fetch Driver Standings for the selected year
  const { data: driverStandings, isLoading, error, isError } = useQuery<DriverStanding[]>({
    queryKey: ['driverStandings', selectedYear],
    queryFn: () => fetchDriverStandings(selectedYear),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 120,
    retry: 1,
  });

  // Function to determine change indicator color and icon
  const getChangeIndicator = (change: number | undefined) => {
    if (change === undefined) {
       return null;
    }
    if (change > 0) {
      return { color: 'text-green-500', icon: <ArrowUp className="h-4 w-4" /> };
    } else if (change < 0) {
      return { color: 'text-red-500', icon: <ArrowDown className="h-4 w-4" /> };
    } else {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Background Elements - decorative circuit lines */}
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
      
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto relative z-10" ref={standingsRef}>
        {/* Header */}
        <motion.header 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div 
            variants={fadeInUp}
            className="flex items-center"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white" 
              onClick={() => navigate('/dashboard')}
              data-umami-event="DriverStandings Back Button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                Driver Standings
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                {selectedYear} Season Overview
              </p>
            </div>
          </motion.div>
          
          {/* Season Selector - Styled like Races page */}
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
                        {availableYears.map((year) => (
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
        </motion.header>

        {/* Standings List with modern styling */}
        <motion.div 
          initial="hidden" 
          animate={isStandingsInView ? "visible" : "hidden"}
          variants={staggerChildren}
          className="w-full"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Skeleton className="h-[96px] bg-gray-800/50 rounded-xl"/>
                </motion.div>
              ))}
            </div>
          ) : isError ? (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-10 text-red-400 bg-gray-900/30 rounded-xl border border-red-500/20 p-8"
            >
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              Error loading standings for {selectedYear}. <br/>
              <span className="text-xs text-gray-500">
                {(error as Error)?.message || 'Please try again later.'}
              </span>
            </motion.div>
          ) : driverStandings && driverStandings.length > 0 ? (
            <div className="space-y-4">
              {driverStandings.map((driver, index) => {
                const indicator = getChangeIndicator(driver.points_change);
                const teamColor = getTeamColorClass(driver.team);
                const driverIsRookie = isRookie(driver.code, selectedYear);
                const driverNumber = getDriverNumber(driver.code, selectedYear);
                
                // Determine podium/trophy backgrounds
                const isOnPodium = driver.rank <= 3;
                const podiumBackground = 
                  driver.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30'
                  : driver.rank === 2 ? 'bg-gray-300/10 border-gray-300/30'
                  : driver.rank === 3 ? 'bg-amber-700/10 border-amber-700/30'
                  : '';
                
                return (
                  <motion.div
                    key={driver.code}
                    initial="hidden"
                    animate={isStandingsInView ? "visible" : "hidden"}
                    custom={{ delay: index * 0.07 }}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { duration: 0.6, ease: "easeOut", delay: index * 0.07 }
                      }
                    }}
                  >
                    <Card
                      className={cn(
                        "bg-gray-900/70 border border-gray-800 hover:border-red-500/40",
                        "backdrop-blur-sm rounded-xl overflow-hidden",
                        "transition-all duration-300 ease-in-out",
                        "hover:bg-gray-900/90 hover:shadow-[0_8px_30px_rgb(185,28,28,0.15)]",
                        isOnPodium ? podiumBackground : ""
                      )}
                    >
                      <div className="p-5 flex items-center gap-5 relative">
                        {/* Team color accent bar */}
                        <div className={cn("absolute top-0 left-0 h-full w-1.5", `bg-f1-${teamColor}`)}></div>
                        
                        {/* Rank */}
                        <div className="text-center w-14">
                          <div className={cn(
                            "text-3xl md:text-4xl font-bold",
                            driver.rank === 1 ? "text-yellow-400" : 
                            driver.rank === 2 ? "text-gray-300" : 
                            driver.rank === 3 ? "text-amber-600" : 
                            "text-gray-500"
                          )}>
                            {driver.rank}
                          </div>
                          <div className="text-xs font-medium uppercase text-gray-500 mt-1">P{driver.rank}</div>
                        </div>
                        
                        {/* Driver number */}
                        {driverNumber && (
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold border border-gray-700 bg-gray-800/80 text-f1-${teamColor}`}>
                            {driverNumber}
                          </div>
                        )}
                        
                        {/* Driver details */}
                        <div className="flex-grow pl-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">{driver.name}</h2>
                            {driverIsRookie && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-600/40 text-blue-200 rounded font-medium">
                                ROOKIE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("w-2 h-2 rounded-full", `bg-f1-${teamColor}`)}></span>
                              <span className="text-sm text-gray-400">{driver.team}</span>
                            </div>
                            
                            {/* Add code text */}
                            <div className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded-sm font-mono">
                              {driver.code}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-6 mr-4">
                          {/* Wins */}
                          <div className="flex flex-col items-center gap-1 text-sm">
                            <div className="text-sm font-bold text-white">{driver.wins || 0}</div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-500">WINS</span>
                            </div>
                          </div>
                          
                          {/* Podiums */}
                          <div className="flex flex-col items-center gap-1 text-sm">
                            <div className="text-sm font-bold text-white">{driver.podiums || 0}</div>
                            <div className="flex items-center gap-1">
                              <Medal className="w-3 h-3 text-amber-600" />
                              <span className="text-xs text-gray-500">PODIUMS</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Points */}
                        <div className="flex flex-col items-end">
                          <div className="font-bold text-2xl md:text-3xl text-white">{driver.points}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-1.5">POINTS</span>
                            {indicator && (
                              <div className={cn("flex items-center gap-0.5", indicator.color)}>
                                {indicator.icon}
                                <span className="font-medium">
                                  {driver.points_change !== 0 ? Math.abs(driver.points_change ?? 0) : '-'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.p
              variants={fadeInUp}
              className="text-center text-gray-500 py-10 bg-gray-900/30 rounded-xl border border-gray-700 p-8"
            >
              No standings data available for {selectedYear}.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DriverStandings;
