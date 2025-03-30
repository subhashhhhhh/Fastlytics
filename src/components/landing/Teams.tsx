import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Teams = () => {
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);

  return (
    <section className="py-24 bg-f1-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-f1-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-f1-mercedes/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-racing font-bold text-white mb-4">
            <span className="text-f1-red">Team</span> Performance
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Track current team standings and compare historical performance data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <div 
              key={index}
              className="stat-card hover:shadow-2xl transition-all duration-300"
              onMouseEnter={() => setHoveredTeam(index)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <div className={`team-indicator bg-f1-${team.color}`}></div>
              <div className="pl-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold">{team.name}</h3>
                  <div className={`text-f1-${team.color} text-lg font-racing`}>{index + 1}</div>
                </div>
                <div className="text-3xl md:text-4xl font-racing text-white mb-1">{team.points} PTS</div>
                <div className={`text-sm ${team.change > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                  {team.change > 0 ? '↑' : '↓'} {Math.abs(team.change)}
                </div>
                
                <div className={`h-1 w-full bg-f1-light-gray/20 mt-4 overflow-hidden rounded-full`}>
                  <div 
                    className={`h-full bg-f1-${team.color} transition-all duration-500 rounded-full`}
                    style={{ 
                      width: `${hoveredTeam === index ? 100 : team.strength}%`,
                      transition: 'width 0.8s ease-out'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const teams = [
  { name: "McLaren", points: 78, change: 51, color: "mclaren", strength: 85 },
  { name: "Mercedes", points: 57, change: 30, color: "mercedes", strength: 65 },
  { name: "Red Bull Racing", points: 36, change: 18, color: "redbull", strength: 45 },
  { name: "Williams", points: 17, change: 7, color: "williams", strength: 25 }
];

export default Teams;