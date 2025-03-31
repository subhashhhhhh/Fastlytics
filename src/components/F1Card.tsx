
import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, MinusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface F1CardProps {
  title: string;
  value: string | number;
  team:
    | 'ferrari'
    | 'mercedes'
    | 'mclaren'
    | 'redbull'
    | 'astonmartin'
    | 'alpine'
    | 'williams'
    | 'haas'
    | 'alfaromeo'
    | 'alphatauri'
    | 'gray';
  icon?: React.ReactNode;
  points_change?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: 'driver' | 'team'; // Add type prop
  id?: string; // Add id prop
}

const F1Card = ({ title, value, team, icon, points_change, className, style, type, id }: F1CardProps) => {

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

  let linkTo = '';
  if (type === 'driver' && id) {
    linkTo = `/driver/${id}`;
  } else if (type === 'team' && id) {
    linkTo = `/team/${id}`;
  }

  return (
    <Link to={linkTo} className="block no-underline hover:scale-[1.03] transition-transform duration-200 ease-in-out">
      <div className={cn(`team-card bg-f1-${team}-gradient border border-f1-${team}/30 rounded-lg p-4 shadow-md`, className)} style={style}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-300 font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white">{value}</div>

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
    </Link>
  );
};

export default F1Card;
