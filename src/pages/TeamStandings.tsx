import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, CheckCircle, MinusCircle, Award } from 'lucide-react'; // Added Award
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { teamPerformanceData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card'; // Use Card for structure

// Define the type for team data explicitly if needed
interface TeamStanding {
  team: string;
  shortName: string;
  points: number;
  change: number;
  wins: number;
  podiums: number;
  teamColor: string;
}

const TeamStandings = () => {
  const navigate = useNavigate();

  // Function to determine change indicator color and icon
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return { color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" /> };
    } else if (change < 0) {
      return { color: 'text-red-500', icon: <MinusCircle className="h-4 w-4" /> };
    } else {
      return { color: 'text-gray-500', icon: <MinusCircle className="h-4 w-4" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      {/* Use padding for layout */}
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <header className="flex items-center mb-8 md:mb-10">
          <Button
            variant="ghost"
            size="icon" // Make it icon only for cleaner look
            className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Constructor Standings</h1>
          <span className="ml-3 text-xl font-medium text-gray-500">2025</span>
        </header>

        {/* Standings List - Using Cards */}
        <div className="space-y-3 md:space-y-4">
          {teamPerformanceData
            .sort((a, b) => b.points - a.points) // Sort by points descending
            .map((team: TeamStanding, index: number) => {
              const indicator = getChangeIndicator(team.change);
              const rank = index + 1;
              const teamColorClass = `border-f1-${team.teamColor}`; // Class for team color border

              return (
                <Card
                  key={team.shortName}
                  className={cn(
                    "bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm",
                    "p-4 md:p-5 flex items-center gap-4 md:gap-6",
                    "transition-all duration-300 ease-in-out hover:bg-gray-800/80 hover:border-gray-600",
                    "animate-fade-in" // Entrance animation
                  )}
                  style={{ animationDelay: `${index * 75}ms` }} // Stagger animation
                >
                  {/* Rank */}
                  <div className="text-xl md:text-2xl font-bold text-gray-500 w-8 text-center">{rank}</div>

                  {/* Team Color Accent */}
                  <div className={cn("w-1.5 h-10 rounded-full", `bg-f1-${team.teamColor}`)}></div>

                  {/* Team Name */}
                  <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-semibold text-white">{team.team}</h2>
                    {/* Optional: Add short name or other info */}
                  </div>

                  {/* Stats Section */}
                  <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-400 flex-shrink-0">
                     <div className="flex items-center gap-1.5" title="Wins">
                       <Trophy className="w-4 h-4 text-yellow-500"/>
                       <span>{team.wins}</span>
                     </div>
                     <div className="flex items-center gap-1.5" title="Podiums">
                       <Award className="w-4 h-4 text-gray-400"/>
                       <span>{team.podiums}</span>
                     </div>
                     <div className={cn("flex items-center gap-1", indicator.color)} title="Points Change">
                       {indicator.icon}
                       <span>{team.change !== 0 ? Math.abs(team.change) : '-'}</span>
                     </div>
                  </div>

                   {/* Points */}
                   <div className="text-lg md:text-xl font-bold text-white w-20 text-right">
                     {team.points} <span className="text-xs font-normal text-gray-500">PTS</span>
                   </div>
                </Card>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamStandings;
