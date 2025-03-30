
import React from 'react';
import { cn } from "@/lib/utils";

interface F1CardProps {
  title: string;
  value: string | number;
  team: 'ferrari' | 'mercedes' | 'mclaren' | 'redbull' | 'astonmartin' | 'alpine' | 'williams';
  icon?: React.ReactNode;
  change?: number;
  className?: string;
  style?: React.CSSProperties;
}

const F1Card = ({ title, value, team, icon, change, className, style }: F1CardProps) => {
  return (
    <div className={cn(`team-card ${team}`, className)} style={style}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-muted-foreground font-medium mb-1">{title}</h3>
          <div className="text-2xl font-bold">{value}</div>
          
          {change !== undefined && (title.includes('McLaren') || title.includes('Mercedes') || title.includes('Red Bull Racing') || title.includes('Williams')) && (
            <div className={`text-sm mt-1 flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-background/50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default F1Card;
