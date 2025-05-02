import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedStatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  iconColor?: string;
  accentColor?: string;
}

const EnhancedStatsCard: React.FC<EnhancedStatsCardProps> = ({
  icon,
  title,
  value,
  description,
  className,
  iconColor = "blue-400",
  accentColor = "blue-500/20"
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={cn(
        "bg-gray-900/60 backdrop-blur-lg border border-gray-800 hover:border-red-600/30",
        "transition-colors duration-200 rounded-xl shadow-lg overflow-hidden",
        className
      )}>
        <div className={`h-1 w-full bg-${accentColor} opacity-70`}></div>
        <CardHeader className="pb-2">
          <div className={`rounded-full bg-${accentColor} w-10 h-10 flex items-center justify-center mb-2`}>
            <div className={`text-${iconColor}`}>
              {icon}
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedStatsCard; 