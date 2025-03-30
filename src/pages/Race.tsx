
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Flag, BarChart2, Clock, Cpu, ArrowRightLeft, Gauge, User, Lock, Droplets } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RacingChart from '@/components/RacingChart';
import TireStrategy from '@/components/TireStrategy';
import F1Card from '@/components/F1Card';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lapTimesData, tireStrategyData, raceResultsData } from '@/data/mockData';

const Race = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // Find the race data based on the raceId
  const race = raceResultsData.find(r => r.event.toLowerCase().replace(/\s+/g, '-') === raceId);
  
  if (!race) {
    return (
      <div className="min-h-screen bg-background carbon-fiber-bg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Race not found</h1>
        <Button onClick={() => navigate('/')} className="racing-button">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature === activeFeature ? null : feature);
  };

  return (
    <div className="min-h-screen bg-background carbon-fiber-bg">
      <Navbar />
      
      <div className="container py-6">
        {/* Back button and title */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4 hover:bg-primary/10" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{race.event}</h1>
            <p className="text-muted-foreground">2023 Season</p>
          </div>
        </div>
        
        {/* Race winner card */}
        <div className="mb-8">
          <F1Card
            title="Race Winner"
            value={race.driver}
            team={race.team as any}
            icon={<Trophy className={`h-6 w-6 text-f1-${race.team}`} />}
            change={race.change}
            className="animate-fade-in w-full md:w-1/3"
          />
        </div>

        {/* Race Analysis Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="driver">Driver Analysis</TabsTrigger>
            <TabsTrigger value="weather">Weather Impact</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RacingChart 
                data={lapTimesData} 
                title="Lap Time Comparison" 
                delay={0}
              />
              <TireStrategy 
                data={tireStrategyData} 
                delay={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="stat-card p-4 rounded-lg bg-card/80 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Flag className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium">Laps</h3>
                </div>
                <p className="text-2xl font-bold">58</p>
              </div>
              
              <div className="stat-card p-4 rounded-lg bg-card/80 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium">Fastest Lap</h3>
                </div>
                <p className="text-2xl font-bold">1:31.45</p>
                <p className="text-sm text-muted-foreground">{race.driver}</p>
              </div>
              
              <div className="stat-card p-4 rounded-lg bg-card/80 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium">Race Duration</h3>
                </div>
                <p className="text-2xl font-bold">1h 32m 15s</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="telemetry" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="G-Force Analysis"
                icon={<Gauge />}
                description="Explore lateral and longitudinal G-forces throughout the race"
              />
              <PremiumFeatureCard
                title="Brake Temperature"
                icon={<Cpu />}
                description="Animated brake temperature visualization during heavy braking zones"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="ERS Deployment"
                icon={<BarChart2 />}
                description="Energy deployment and harvesting patterns across the circuit"
              />
              <PremiumFeatureCard
                title="Aero Efficiency"
                icon={<ArrowRightLeft />}
                description="Downforce vs drag trade-off analysis at various circuit sections"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="strategy" className="pt-6">
            <TireStrategy 
              data={tireStrategyData} 
              delay={0}
              className="mb-6"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="Undercut Simulation"
                icon={<ArrowRightLeft />}
                description="Test hypothetical pit windows to see if strategies would have worked"
              />
              <PremiumFeatureCard
                title="Tire Degradation"
                icon={<BarChart2 />}
                description="Lap time analysis showing compound performance over stint length"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="driver" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="Throttle-Brake Overlap"
                icon={<User />}
                description="Identify drivers who trail brake into corners for faster exits"
              />
              <PremiumFeatureCard
                title="Overtake Analysis"
                icon={<ArrowRightLeft />}
                description="Detailed breakdown of race overtakes with risk assessment"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="weather" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="Weather Radar"
                icon={<Droplets />}
                description="Circuit weather conditions mapped against lap time variations"
              />
              <PremiumFeatureCard
                title="Wet Weather Performance"
                icon={<BarChart2 />}
                description="Driver performance comparison in varying precipitation levels"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="historical" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PremiumFeatureCard
                title="Track Records"
                icon={<Trophy />}
                description="Historical track records and race winning performance comparison"
              />
              <PremiumFeatureCard
                title="Driver Track History"
                icon={<User />}
                description="Selected driver's past performance at this circuit across seasons"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PremiumFeatureCard = ({ 
  title, 
  icon, 
  description 
}: { 
  title: string; 
  icon: React.ReactNode; 
  description: string 
}) => {
  return (
    <Card className="bg-card/60 border-border/50 overflow-hidden">
      <div className="absolute top-0 right-0 bg-primary/20 px-3 py-1 text-xs font-medium flex items-center rounded-bl-md">
        <Lock className="h-3 w-3 mr-1" />
        Premium
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-secondary/20 text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        <Button className="mt-4 w-full racing-button">Unlock Feature</Button>
      </CardContent>
    </Card>
  );
};

export default Race;
