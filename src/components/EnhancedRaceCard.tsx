import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Flag } from 'lucide-react';

interface EnhancedRaceCardProps {
  raceName: string;
  date: string;
  location?: string;
  isUpcoming: boolean;
  isOngoing: boolean;
  winnerName?: string;
  winnerTeam?: string;
  onClick?: () => void;
  className?: string;
}

const EnhancedRaceCard: React.FC<EnhancedRaceCardProps> = ({
  raceName,
  date,
  location,
  isUpcoming,
  isOngoing,
  winnerName,
  winnerTeam = 'gray',
  onClick,
  className
}) => {
  // Determine status and styling
  const isWinner = !isUpcoming && !isOngoing && winnerName;
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card 
        className={cn(
          "bg-gray-900/60 backdrop-blur-lg border transition-all duration-300 rounded-xl overflow-hidden shadow-lg",
          isWinner ? `border-f1-${winnerTeam}/30` : 'border-gray-800',
          "hover:border-red-500/40",
          className
        )}
      >
        {/* Accent color bar for completed races */}
        {isWinner && (
          <div className={`h-1 w-full bg-f1-${winnerTeam}/80`}></div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold text-white">{raceName}</CardTitle>
                {isOngoing && (
                  <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">LIVE</Badge>
                )}
              </div>
              <CardDescription className="text-gray-400 text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 opacity-70" />
                {date}
                {location && (
                  <>
                    <span className="mx-1">•</span>
                    <MapPin className="h-3.5 w-3.5 opacity-70" />
                    {location}
                  </>
                )}
              </CardDescription>
            </div>
            <div className={`p-2.5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 text-f1-${winnerTeam}`}>
              <Flag className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex justify-between items-center">
            {isOngoing ? (
              <div className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" />
                <span className="font-medium">ONGOING</span>
              </div>
            ) : isUpcoming ? (
              <div className="flex items-center gap-1.5 text-blue-400">
                <Clock className="w-4 h-4" />
                <span className="font-medium">UPCOMING</span>
              </div>
            ) : winnerName ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">Winner: <span className={`text-f1-${winnerTeam}`}>{winnerName}</span></span>
              </div>
            ) : (
              <span className="text-sm text-gray-300 italic">Race in progress</span>
            )}
            <Badge className="bg-red-500/20 border-red-500/30 text-red-400 px-3 hover:bg-red-500/30">
              View Analysis
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedRaceCard; 