
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Flag, BarChart2, Clock, Cpu, ArrowRightLeft, Gauge, User, Lock, Droplets } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RacingChart from '@/components/RacingChart';
import TireStrategy from '@/components/TireStrategy';
import SpeedTraceChart from '@/components/SpeedTraceChart';
import GearMapChart from '@/components/GearMapChart'; // Import Gear Map chart
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
    // Apply the landing page background gradient and text color
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white"> 
      <Navbar />
      
      <div className="container py-6">
        {/* Back button and title */}
        <div className="flex items-center mb-6">
           {/* Adjusted Button style */}
          <Button 
            variant="ghost" 
            className="mr-4 text-gray-300 hover:bg-gray-800 hover:text-white" 
            onClick={() => navigate('/dashboard')} // Navigate back to dashboard
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{race.event}</h1> {/* Adjusted color */}
            <p className="text-gray-400">2023 Season</p> {/* Adjusted color */}
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
           {/* Adjusted TabsList background */}
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full bg-gray-800/80 rounded-lg">
             {/* Adjusted TabsTrigger active state and text color */}
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="telemetry" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Telemetry</TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Strategy</TabsTrigger>
            <TabsTrigger value="driver" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Driver Analysis</TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Weather Impact</TabsTrigger>
            <TabsTrigger value="historical" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md">Historical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pass drivers array to RacingChart */}
              <RacingChart
                year={2023} // Example Year - TODO: Make dynamic
                event={race.event}
                session="R"
                initialDrivers={["VER", "LEC"]} // Pass initial drivers as an array
                title="Lap Time Comparison" // Title can be more generic now
                delay={0}
              />
              {/* Update TireStrategy props */}
              <TireStrategy
                year={2023} // Example Year - TODO: Make dynamic
                event={race.event}
                session="R"
                delay={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {/* Adjusted Stat Card styles */}
              <div className="stat-card p-4 rounded-lg bg-gray-900/80 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Flag className="h-5 w-5 text-red-500" /> {/* Adjusted color */}
                  <h3 className="text-sm font-medium text-gray-400">Laps</h3> {/* Adjusted color */}
                </div>
                <p className="text-2xl font-bold text-white">58</p> {/* Adjusted color */}
              </div>
              
               {/* Adjusted Stat Card styles */}
              <div className="stat-card p-4 rounded-lg bg-gray-900/80 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart2 className="h-5 w-5 text-red-500" /> {/* Adjusted color */}
                  <h3 className="text-sm font-medium text-gray-400">Fastest Lap</h3> {/* Adjusted color */}
                </div>
                <p className="text-2xl font-bold text-white">1:31.45</p> {/* Adjusted color */}
                <p className="text-sm text-gray-500">{race.driver}</p> {/* Adjusted color */}
              </div>
              
               {/* Adjusted Stat Card styles */}
              <div className="stat-card p-4 rounded-lg bg-gray-900/80 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-red-500" /> {/* Adjusted color */}
                  <h3 className="text-sm font-medium text-gray-400">Race Duration</h3> {/* Adjusted color */}
                </div>
                <p className="text-2xl font-bold text-white">1h 32m 15s</p> {/* Adjusted color */}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="telemetry" className="pt-6">
             {/* Add SpeedTraceChart */}
             <SpeedTraceChart
                year={2023} // Example Year - TODO: Make dynamic
                event={race.event}
                session="R"
                initialDriver="VER" // Pass initialDriver instead of driver
                lap="fastest" // Example Lap - TODO: Make selectable
                title="Fastest Lap Speed Trace" // Title is now dynamic inside component
                className="mb-8"
             />
             {/* Add GearMapChart */}
             <GearMapChart
                year={2023} // Example Year - TODO: Make dynamic
                event={race.event}
                session="R"
                initialDriver="VER" // Pass initialDriver instead of driver
                lap="fastest" // Example Lap - TODO: Make selectable
                title="Fastest Lap Gear Shifts" // Title is now dynamic inside component
                className="mb-8"
             />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Keep Premium Feature placeholders for now */}
              {/* You might replace these with actual interactive charts later */}
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
             {/* Update TireStrategy props */}
            <TireStrategy
              year={2023} // Example Year - TODO: Make dynamic
              event={race.event}
              session="R"
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
  const navigate = useNavigate(); // Add navigate hook
  return (
     // Adjusted Premium Card styles
    <Card className="bg-gray-900/80 border-gray-700 overflow-hidden relative"> 
       {/* Adjusted Premium banner style */}
      <div className="absolute top-0 right-0 bg-red-600/80 px-3 py-1 text-xs font-medium flex items-center rounded-bl-md text-white"> 
        <Lock className="h-3 w-3 mr-1" />
        Premium
      </div>
      <CardHeader className="pb-2 pt-8"> {/* Added padding-top */}
        <div className="flex items-center gap-3">
           {/* Adjusted icon background and color */}
          <div className="p-2.5 rounded-full bg-red-500/10 text-red-500"> 
            {icon}
          </div>
          <CardTitle className="text-lg text-white">{title}</CardTitle> {/* Adjusted color */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p> {/* Adjusted color */}
         {/* Adjusted Button style and action */}
        <Button 
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white" 
          onClick={() => navigate('/subscription')} // Navigate to subscription page
        > 
          Unlock Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export default Race;
