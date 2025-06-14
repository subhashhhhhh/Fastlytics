import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, Trophy, MinusCircle, Award, 
  AlertCircle, ArrowUp, ArrowDown, ChevronDown,
  Building, Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { fetchTeamStandings, TeamStanding } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
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

const TeamStandings = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useSeason();
  const standingsRef = useRef(null);
  const isStandingsInView = useInView(standingsRef, { once: true, amount: 0.2 });
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Fetch Team Standings for the selected year
  const { data: teamStandings, isLoading, error, isError } = useQuery<TeamStanding[]>({
    queryKey: ['teamStandings', selectedYear],
    queryFn: () => fetchTeamStandings(selectedYear),
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
      
      <div className="px-4 md:px-8 py-8 mx-auto relative z-10" ref={standingsRef}>
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
              data-umami-event="TeamStandings Back Button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                Constructor Standings
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
          ) : teamStandings && teamStandings.length > 0 ? (
            <div className="space-y-4">
              {teamStandings.map((team, index) => {
                const indicator = getChangeIndicator(team.points_change);
                const rank = team.rank || index + 1;
                const teamColor = team.teamColor || getTeamColorClass(team.team);
                
                // Determine podium/trophy backgrounds
                const isOnPodium = rank <= 3;
                const podiumBackground = 
                  rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30'
                  : rank === 2 ? 'bg-gray-300/10 border-gray-300/30'
                  : rank === 3 ? 'bg-amber-700/10 border-amber-700/30'
                  : '';
                
                return (
                  <motion.div
                    key={team.shortName || team.team}
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
                            rank === 1 ? "text-yellow-400" : 
                            rank === 2 ? "text-gray-300" : 
                            rank === 3 ? "text-amber-600" : 
                            "text-gray-500"
                          )}>
                            {rank}
                          </div>
                          <div className="text-xs font-medium uppercase text-gray-500 mt-1">P{rank}</div>
                        </div>
                        
                        {/* Team logo/icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          `bg-f1-${teamColor}/20 text-f1-${teamColor}`
                        )}>
                          <Building className="w-6 h-6" />
                        </div>
                        
                        {/* Team details */}
                        <div className="flex-grow">
                          <h2 className="text-xl font-bold text-white">{team.team}</h2>
                          <div className="mt-1 flex items-center gap-4">
                            {/* Wins */}
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{team.wins || 0}</span>
                              <span className="text-xs text-gray-600">wins</span>
                            </div>
                            
                            {/* Podiums */}
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Award className="w-4 h-4 text-amber-500" />
                              <span className="font-medium">{team.podiums || 0}</span>
                              <span className="text-xs text-gray-600">podiums</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Points */}
                        <div className="flex flex-col items-end">
                          <div className="font-bold text-2xl md:text-3xl text-white">{team.points}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-1.5">POINTS</span>
                            {indicator && (
                              <div className={cn("flex items-center gap-0.5", indicator.color)}>
                                {indicator.icon}
                                <span className="font-medium">
                                  {team.points_change !== 0 ? Math.abs(team.points_change ?? 0) : '-'}
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

export default TeamStandings;
