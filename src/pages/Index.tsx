
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flag, Lock, Cpu, Timer, BarChart2, User, Gauge } from 'lucide-react';
import Navbar from '@/components/Navbar';
import F1Card from '@/components/F1Card';
import TrackProgress from '@/components/TrackProgress';
import { Button } from "@/components/ui/button";
import { 
  teamPerformanceData, 
  raceResultsData,
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  
  const handleRaceClick = (race: any) => {
    const raceId = race.event.toLowerCase().replace(/\s+/g, '-');
    navigate(`/race/${raceId}`);
  };
  
  const handleAuthNavigate = (tabValue: 'login' | 'signup') => {
    navigate(`/auth?tab=${tabValue}`);
  };
  
  return (
    <div className="min-h-screen bg-background carbon-fiber-bg">
      <Navbar />
      
      <div className="container py-6">
        {/* Title and season info */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">2023 Season Analysis</h1>
            <p className="text-muted-foreground">Real-time F1 data and analytics dashboard</p>
          </div>
          
          <div className="mt-4 md:mt-0 animate-slide-in-right flex items-center space-x-4">
            <div className="text-right">
              <p className="text-muted-foreground">Data Loading</p>
              <p className="text-sm text-primary/80">Telemetry synchronized</p>
            </div>
            <TrackProgress progress={85} />
          </div>
        </div>
        
        {/* Authentication CTA for premium features */}
        <div className="mb-8 bg-gradient-to-r from-black/80 to-card/80 rounded-lg p-6 border border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">Unlock Premium F1 Analytics</h2>
              <p className="text-muted-foreground mb-4">
                Sign up to access all 50+ advanced features including telemetry analysis, 
                strategy simulations, and historical comparisons.
              </p>
              <div className="flex space-x-4">
                <Button className="racing-button" onClick={() => handleAuthNavigate('signup')}>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
                <Button variant="outline" onClick={() => handleAuthNavigate('login')}>
                  Login
                </Button>
              </div>
            </div>
            <div className="bg-card/50 p-4 rounded-lg border border-border/30 w-full md:w-auto">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-primary" />
                Premium Features Include:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <BarChart2 className="h-3.5 w-3.5 mr-2 text-primary/70" />
                  Tire Strategy Optimization
                </li>
                <li className="flex items-center">
                  <Timer className="h-3.5 w-3.5 mr-2 text-primary/70" />
                  Live Telemetry Access
                </li>
                <li className="flex items-center">
                  <Cpu className="h-3.5 w-3.5 mr-2 text-primary/70" />
                  AI Pace Predictions
                </li>
                <li className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-2 text-primary/70" />
                  Driver Style Analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Key stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {teamPerformanceData.map((team, index) => (
            <F1Card
              key={team.shortName}
              title={team.team}
              value={`${team.points} PTS`}
              team={team.teamColor as any}
              icon={<Award className={`h-6 w-6 text-f1-${team.teamColor}`} />}
              change={team.change}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
        
        {/* Latest race results - now clickable */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">Latest Race Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {raceResultsData.map((race, index) => (
              <div 
                key={race.event}
                onClick={() => handleRaceClick(race)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <F1Card
                  title={race.event}
                  value={`Winner - ${race.driver}`}
                  team={race.team as any}
                  icon={<Flag className={`h-6 w-6 text-f1-${race.team}`} />}
                  change={race.change}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Feature categories showcase */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">Analytics Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard 
              title="Session Analysis" 
              description="Track evolution, weather impact, and safety car analysis"
              icon={<Timer className="h-10 w-10 text-primary/80" />}
              features={["Dynamic Track Evolution", "Weather Strategy", "Safety Car Delta"]}
            />
            
            <FeatureCard 
              title="Driver Performance" 
              description="Detailed driver metrics and style analysis"
              icon={<User className="h-10 w-10 text-f1-mclaren" />}
              features={["Throttle-Brake Overlap", "Tire Management", "Overtake Aggression"]}
            />
            
            <FeatureCard 
              title="Telemetry Physics" 
              description="Deep dive into car performance data"
              icon={<Gauge className="h-10 w-10 text-f1-redbull" />}
              features={["G-Force Analysis", "Aero Efficiency", "Engine Mode Detection"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  features 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  features: string[];
}) => {
  return (
    <Card className="bg-card/80 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            <Lock className="h-3 w-3 inline mr-1" /> Premium Feature
          </span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
