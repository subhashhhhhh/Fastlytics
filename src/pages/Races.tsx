import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, Flag, Calendar, AlertCircle, 
  Clock, Trophy, ChevronDown, Medal, Users 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { fetchRaceResults, RaceResult, fetchSchedule, ScheduleEvent } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeason } from '@/contexts/SeasonContext';

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

// Country name to ISO country code mapping for flags
const getCountryCode = (location: string | undefined): string => {
  if (!location) return 'xx'; // Unknown
  
  // Strip any text in parentheses like "Monaco (Monte Carlo)"
  const cleanLocation = location.replace(/\s*\([^)]*\)\s*/g, '').trim();
  
  // Map location names to 2-letter ISO country codes
  const countryMap: Record<string, string> = {
    'Australia': 'au',
    'Austria': 'at',
    'Azerbaijan': 'az',
    'Bahrain': 'bh',
    'Belgium': 'be',
    'Brazil': 'br',
    'Canada': 'ca',
    'China': 'cn',
    'Denmark': 'dk',
    'Emilia Romagna': 'it',
    'France': 'fr',
    'Germany': 'de',
    'Great Britain': 'gb',
    'United Kingdom': 'gb',
    'Hungary': 'hu',
    'India': 'in',
    'Italy': 'it',
    'Japan': 'jp',
    'Las Vegas': 'us',
    'Malaysia': 'my',
    'Mexico': 'mx',
    'Miami': 'us',
    'Monaco': 'mc',
    'Netherlands': 'nl',
    'Portugal': 'pt',
    'Qatar': 'qa',
    'Russia': 'ru',
    'Saudi Arabia': 'sa',
    'Singapore': 'sg',
    'South Africa': 'za',
    'Spain': 'es',
    'Styria': 'at',
    'Turkey': 'tr',
    'Abu Dhabi': 'ae',
    'United States': 'us',
    'USA': 'us',
    'Sakhir': 'bh',
    'Miami Gardens': 'us',
    'Jeddah': 'sa',
    'Lusail': 'qa',
    'Imola': 'it',
    'Monza': 'it',
    'São Paulo': 'br',
    'Spielberg': 'at',
    'Silverstone': 'gb',
    'Spa': 'be',
    'Zandvoort': 'nl',
    'Austin': 'us',
    'Montréal': 'ca',
    'Montreal': 'ca',
    'Shanghai': 'cn',
    'Baku': 'az',
    'Barcelona': 'es',
    'Budapest': 'hu',
    'Suzuka': 'jp',
    'Mexico City': 'mx'
  };

  // Try to match with various parts of the location string
  for (const [country, code] of Object.entries(countryMap)) {
    if (cleanLocation.includes(country)) {
      return code.toLowerCase();
    }
  }
  
  // Default to placeholder for unknown
  return 'xx';
};

const Races = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason();
  const racesRef = useRef(null);
  const isRacesInView = useInView(racesRef, { once: true, amount: 0.2 });
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

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
     queryKey: ['raceResults', selectedYear],
     queryFn: () => fetchRaceResults(selectedYear),
     staleTime: 1000 * 60 * 30,
     gcTime: 1000 * 60 * 60,
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
        countryCode: getCountryCode(event.Country || event.Location)
      };
    });
  }, [scheduleData, resultsData]);

  const handleRaceClick = (eventName: string, year: number) => {
    // Navigate to the specific race page
    const raceId = `${year}-${eventName.toLowerCase().replace(/\s+/g, '-')}`;
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
      
      {/* Background Elements - decorative circuit lines, similar to dashboard */}
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
      
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto relative z-10" ref={racesRef}>
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
              data-umami-event="Races Page Back Button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                Race Calendar & Results
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                {selectedYear} Season Overview
              </p>
            </div>
          </motion.div>
          
          {/* Season Selector - Similar to Dashboard */}
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
        </motion.header>

        {/* Grid Layout for Races */}
        <motion.div 
          initial="hidden" 
          animate={isRacesInView ? "visible" : "hidden"}
          variants={staggerChildren}
          className="w-full"
        >
          {isLoadingSchedule || isLoadingResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Skeleton className="h-[140px] md:h-[160px] bg-gray-800/50 rounded-xl"/>
                </motion.div>
              ))}
            </div>
          ) : scheduleError || resultsError ? (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-10 text-red-400 bg-gray-900/30 rounded-xl border border-red-500/20 p-8"
            >
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              Error loading data for {selectedYear}. <br/>
              <span className="text-xs text-gray-500">
                {((scheduleError || resultsError) as Error)?.message || 'Please try again later.'}
              </span>
            </motion.div>
          ) : combinedRaceData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {combinedRaceData.map((race, index) => {
                const teamColor = race.result ? getTeamColorClass(race.result.team) : 'gray';
                const isClickable = !race.isUpcoming || race.isOngoing;
                
                return (
                  <motion.div
                    key={`${selectedYear}-${race.EventName}`}
                    initial="hidden"
                    animate={isRacesInView ? "visible" : "hidden"}
                    whileHover={isClickable ? "hover" : undefined}
                    custom={{ delay: index * 0.05 }}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { duration: 0.5, ease: "easeOut", delay: index * 0.05 }
                      },
                      hover: { 
                        y: -10, 
                        transition: { duration: 0.3, ease: "easeOut" }
                      }
                    }}
                    onClick={isClickable ? () => {
                      handleRaceClick(race.EventName, selectedYear);
                      // Track race click event
                      const event = document.createElement('div');
                      event.setAttribute('data-umami-event', `Race Click - ${race.EventName} ${selectedYear}`);
                      document.body.appendChild(event);
                      event.remove();
                    } : undefined}
                    className={cn(
                      "h-full",
                      isClickable ? "cursor-pointer" : "opacity-60"
                    )}
                  >
                    <Card className={cn(
                      "bg-gray-900/70 border border-gray-800 hover:border-red-500/40 h-full",
                      "backdrop-blur-sm rounded-xl overflow-hidden",
                      "transition-all duration-300 ease-in-out",
                      isClickable ? "hover:bg-gray-900/90 hover:shadow-[0_8px_30px_rgb(185,28,28,0.15)]" : "",
                    )}>
                      <div className="h-full flex flex-col">
                        {/* Top section with flag */}
                        <div className="flex items-start justify-between p-4 border-b border-gray-800/60">
                          <div className="flex items-center">
                            <div className="w-12 h-8 rounded-md overflow-hidden mr-3 relative flex-shrink-0 bg-gray-800/80 flex items-center justify-center border border-gray-700/50 shadow-inner">
                              {race.countryCode && (
                                <img 
                                  src={`https://flagcdn.com/h40/${race.countryCode}.png`} 
                                  alt={race.Country || race.Location} 
                                  className="h-full w-auto object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23555555'/%3E%3Cpath d='M320 240h-47.5v47.5H320z' fill='%23333333'/%3E%3C/svg%3E";
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white leading-tight">{race.EventName}</h3>
                              <p className="text-sm text-gray-400">{race.Location}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${race.RoundNumber <= 5 ? 'bg-purple-500/30 text-purple-200' : race.RoundNumber >= 20 ? 'bg-orange-500/30 text-orange-200' : 'bg-blue-500/30 text-blue-200'}`}>
                            Round {race.RoundNumber}
                          </div>
                        </div>

                        {/* Middle section with date and status */}
                        <div className="p-4 flex-grow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-300">{race.displayDate}</span>
                            </div>
                            {race.isOngoing ? (
                              <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-xs">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">ONGOING</span>
                              </div>
                            ) : race.isUpcoming ? (
                              <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">UPCOMING</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs">
                                <Flag className="w-3 h-3" />
                                <span className="font-medium">COMPLETED</span>
                              </div>
                            )}
                          </div>

                          {/* Event format or Winner info */}
                          {race.isUpcoming || race.isOngoing ? (
                            <div className="text-sm text-gray-400">
                              <span className="font-medium text-gray-300">Format:</span> {race.EventFormat || "Standard"}
                            </div>
                          ) : race.result ? (
                            <div className="flex flex-col mt-1">
                              <div className="flex items-center mb-1">
                                <Medal className="h-4 w-4 text-yellow-500 mr-2" />
                                <span className="font-semibold text-white">{race.result.driver}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-500 mr-2" />
                                <span className={`text-f1-${teamColor} text-sm`}>{race.result.team}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">Results pending</div>
                          )}
                        </div>
                        
                        {/* Status bar */}
                        <div className={`h-1.5 w-full ${race.isOngoing ? 'bg-amber-500/70' : race.isUpcoming ? 'bg-blue-500/70' : `bg-f1-${teamColor}`}`}></div>
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
              No race results available for {selectedYear}.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Races;
