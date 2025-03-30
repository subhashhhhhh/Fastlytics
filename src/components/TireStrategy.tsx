
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from "@/lib/utils";

interface TireStrategyProps {
  data: any[];
  className?: string;
  delay?: number;
}

const TireStrategy: React.FC<TireStrategyProps> = ({ 
  data, 
  className,
  delay = 0 
}) => {
  return (
    <div 
      className={cn("chart-container", className)}
      style={{ '--delay': delay } as React.CSSProperties}
    >
      <h2 className="text-lg font-semibold mb-4">Tire Strategy</h2>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="tire-indicator soft">Soft Compound</div>
        <div className="tire-indicator medium">Medium Compound</div>
        <div className="tire-indicator hard">Hard Compound</div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="driver" 
            stroke="rgba(255,255,255,0.5)" 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(10,10,10,0.9)', 
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
            labelStyle={{ color: 'white' }}
          />
          <Bar dataKey="soft" stackId="a" fill="#ff2800" name="Soft" />
          <Bar dataKey="medium" stackId="a" fill="#ffcc00" name="Medium" />
          <Bar dataKey="hard" stackId="a" fill="#ffffff" name="Hard" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TireStrategy;
