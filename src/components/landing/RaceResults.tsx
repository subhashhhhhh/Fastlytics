import React, { useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Flag 
} from 'lucide-react';

const results = [
  {
    id: 1,
    position: "1",
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    time: "1:24:19.093",
    points: "25",
    teamColor: "bg-f1-redbull"
  },
  {
    id: 2,
    position: "2",
    driver: "Lando Norris",
    team: "McLaren",
    time: "+5.214s",
    points: "18",
    teamColor: "bg-f1-mclaren"
  },
  {
    id: 3,
    position: "3",
    driver: "Lewis Hamilton",
    team: "Mercedes",
    time: "+13.884s",
    points: "15",
    teamColor: "bg-f1-mercedes"
  },
  {
    id: 4,
    position: "4",
    driver: "Alexander Albon",
    team: "Williams",
    time: "+26.371s",
    points: "12",
    teamColor: "bg-f1-williams"
  }
];

const RaceResults = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.result-item');
    elements.forEach(item => {
      observer.observe(item);
    });

    return () => {
      elements.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section className="py-24 bg-f1-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-racing mb-4">Race <span className="text-f1-red">Results</span> & Analysis</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            See how FastLytics provides deep insights into race outcomes with detailed metrics and visualizations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Race results table */}
          <div className="stat-card">
            <div className="flex items-center mb-6">
              <Flag className="h-6 w-6 text-f1-red mr-2" />
              <h3 className="text-xl font-bold">Monaco Grand Prix 2023</h3>
            </div>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={result.id}
                  className="result-item relative bg-f1-gray/50 rounded-md p-4 opacity-0"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    transitionDelay: `${index * 0.1}s` 
                  }}
                >
                  <div className={`team-indicator ${result.teamColor}`}></div>
                  <div className="flex items-center justify-between ml-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-racing">{result.position}</span>
                      <div>
                        <p className="font-bold">{result.driver}</p>
                        <p className="text-sm text-gray-400">{result.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{result.time}</p>
                      <p className="text-sm text-f1-red">{result.points} pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance chart */}
          <div className="stat-card">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-f1-red mr-2" />
              <h3 className="text-xl font-bold">Performance Analysis</h3>
            </div>
            
            <div className="bg-f1-gray/30 p-6 rounded-lg h-[350px] flex flex-col">
              <div className="mb-4 flex items-center">
                <Clock className="h-5 w-5 text-f1-red mr-2" />
                <h4 className="font-bold">Lap Time Comparison</h4>
              </div>
              
              <div className="flex-1 relative" ref={chartRef}>
                {/* Placeholder for chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-center">
                    Interactive lap time comparison chart
                    <br />
                    <span className="text-sm">(Visualize with actual data in the live app)</span>
                  </p>
                </div>
                
                {/* Chart axes */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-700"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gray-700"></div>
                
                {/* Sample data lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <path 
                    className="race-line"
                    d="M0,280 C50,260 100,240 150,245 S250,265 300,230 S400,180 450,200" 
                  />
                  <path 
                    className="race-line"
                    d="M0,270 C50,250 100,230 150,235 S250,250 300,210 S400,190 450,215" 
                    style={{ strokeDasharray: "1000", strokeDashoffset: "1000", stroke: "#00d2be", animationDelay: "0.5s" }}
                  />
                </svg>
                
                {/* Legend */}
                <div className="absolute top-4 right-4 bg-f1-black/50 p-2 rounded text-xs">
                  <div className="flex items-center mb-1">
                    <span className="w-3 h-3 bg-f1-red rounded-full mr-2"></span>
                    <span>Verstappen</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-f1-mercedes rounded-full mr-2"></span>
                    <span>Hamilton</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RaceResults;