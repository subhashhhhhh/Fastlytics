
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { cn } from "@/lib/utils";

interface RacingChartProps {
  data: any[];
  className?: string;
  delay?: number;
  title: string;
}

const RacingChart: React.FC<RacingChartProps> = ({ 
  data, 
  className,
  delay = 0,
  title
}) => {
  return (
    <div 
      className={cn("chart-container", className)}
      style={{ '--delay': delay } as React.CSSProperties}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="lap" 
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="verstappen" 
            stroke="#1e41ff" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Verstappen"
          />
          <Line 
            type="monotone" 
            dataKey="hamilton" 
            stroke="#6c779f" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Hamilton"
          />
          <Line 
            type="monotone" 
            dataKey="leclerc" 
            stroke="#ff2800" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Leclerc"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RacingChart;
