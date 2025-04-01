
import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, MinusCircle } from 'lucide-react'; // Import icons

interface F1CardProps {
  title: string;
  value: string | number;
  team: 'ferrari' | 'mercedes' | 'mclaren' | 'redbull' | 'astonmartin' | 'alpine' | 'williams' | 'haas' | 'alfaromeo' | 'alphatauri' | 'gray'; // Added missing teams + gray
  icon?: React.ReactNode;
  points_change?: number; // Use points_change instead of change
  subValue?: string | null; // Optional sub-value (e.g., lap time)
  className?: string;
  style?: React.CSSProperties;
}

const F1Card = ({ title, value, team, icon, points_change, subValue, className, style }: F1CardProps) => {

  // Function to determine change indicator color and icon (copied from standings pages)
  const getChangeIndicator = (change: number | undefined) => {
    if (change === undefined) {
       return null;
    }
    if (change > 0) {
      return { color: 'text-green-500', icon: <ArrowUp className="h-4 w-4" /> };
    } else if (change < 0) {
      return { color: 'text-red-500', icon: <ArrowDown className="h-4 w-4" /> };
    } else { // change === 0
      return { color: 'text-gray-500', icon: <MinusCircle className="h-4 w-4" /> };
    }
  };

  const indicator = getChangeIndicator(points_change);

  return (
    <div className={cn(`team-card bg-f1-${team}-gradient border border-f1-${team}/30 rounded-lg p-4 shadow-md`, className)} style={style}> {/* Use team prop for styling */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-300 font-medium mb-1">{title}</h3>
          <div className="text-2xl font-bold text-white">{value}</div>
          {/* Display subValue (lap time) if available */}
          {subValue && (
            <div className="text-xs text-gray-400 font-mono mt-0.5">{subValue}</div>
          )}

          {/* Display points change indicator if available */}
          {indicator && (
            <div className={cn("text-sm mt-1 flex items-center gap-1", indicator.color)} title="Points Change Since Last Race">
              {indicator.icon}
              <span>{points_change !== 0 ? Math.abs(points_change ?? 0) : '-'}</span>
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
