import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flag, Lock, Cpu, Timer, BarChart2, User, Gauge, ArrowRight, CreditCard } from 'lucide-react'; // Added CreditCard
import Navbar from '@/components/Navbar';
import F1Card from '@/components/F1Card';
import TrackProgress from '@/components/TrackProgress';
import { Button } from "@/components/ui/button";
import {
  teamPerformanceData,
  driverStandingsData,
  raceResultsData,
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user state

  const handleRaceClick = (race: any) => {
    const raceId = race.event.toLowerCase().replace(/\s+/g, '-');
    navigate(`/race/${raceId}`);
  };

  // This function might not be needed anymore if the CTA changes
  // const handleAuthNavigate = (tabValue: 'login' | 'signup') => {
  //   navigate(`/auth?tab=${tabValue}`);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />

      <div className="px-4 md:px-8 py-8">

        {/* --- Header Section --- */}
        <header className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">Dashboard</h1>
              <p className="text-lg text-gray-400">2025 Season Analysis Overview</p>
            </div>
            <div className="mt-4 md:mt-0 animate-slide-in-right flex items-center space-x-4 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-gray-400">Data Status</p>
                <p className="text-xs text-red-400">Telemetry Synced</p>
              </div>
              <TrackProgress progress={85} />
            </div>
          </div>
        </header>

        {/* --- Conditional CTA --- */}
        {/* Show Upgrade CTA only if user is logged in */}
        {user && (
          <div className="mb-10 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-red-600/10 via-gray-900/20 to-gray-900/10 border border-red-500/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
            <div className='flex-grow'>
              <h2 className="text-xl font-semibold mb-1 flex items-center"><Lock className="w-5 h-5 mr-2 text-red-400"/>Unlock Premium Analytics</h2>
              <p className="text-sm text-gray-300">
                Access advanced telemetry, AI predictions, and strategy simulations.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {/* Button now links to subscription page */}
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => navigate('/subscription')}>
                <CreditCard className="mr-2 h-4 w-4" /> Upgrade Plan
              </Button>
            </div>
          </div>
        )}
        {/* Optional: Show a different CTA or nothing if user is not logged in */}
        {/* {!user && ( <div> ... Sign up CTA ... </div> )} */}


        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">

          {/* Left Column (Team Standings & Recent Races) */}
          <div className="lg:col-span-2 space-y-10">

            {/* Team Standings Section */}
            <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">Team Standings</h2>
                 <Button variant="link" className="text-red-400 hover:text-red-300 px-0" onClick={() => navigate('/standings/teams')}>
                   See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                 </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {teamPerformanceData.slice(0, 4).map((team, index) => (
                  <F1Card
                    key={team.shortName}
                    title={team.team}
                    value={`${team.points} PTS`}
                    team={team.teamColor as any}
                    icon={<Award className={`h-5 w-5 text-f1-${team.teamColor}`} />}
                    change={team.change}
                    className="bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 transition-colors duration-200"
                  />
                ))}
              </div>
            </section>

            {/* Driver Standings Section */}
            <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">Driver Standings</h2>
                  <Button variant="link" className="text-red-400 hover:text-red-300 px-0" onClick={() => navigate('/standings/drivers')}>
                   See full standings <ArrowRight className="w-4 h-4 ml-1"/>
                 </Button>
               </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {driverStandingsData.slice(0, 4).map((driver, index) => (
                  <F1Card
                    key={driver.shortName}
                    title={driver.name}
                    value={`${driver.points} PTS`}
                    team={driver.teamColor as any}
                    icon={<Users className={`h-5 w-5 text-f1-${driver.teamColor}`} />}
                    change={driver.change}
                    className="bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 transition-colors duration-200"
                  />
                ))}
              </div>
            </section>

            {/* Recent Races Section */}
            <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-bold mb-4">Recent Race Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {raceResultsData.map((race, index) => (
                  <div
                    key={race.event}
                    onClick={() => handleRaceClick(race)}
                    className="cursor-pointer group transition-transform duration-200 ease-in-out hover:scale-[1.03]"
                  >
                    <F1Card
                      title={race.event}
                      value={`Winner: ${race.driver}`}
                      team={race.team as any}
                      icon={<Flag className={`h-5 w-5 text-f1-${race.team}`} />}
                      change={race.change}
                      className="bg-gray-900/80 border border-gray-700/80 group-hover:border-red-500/50 transition-colors duration-200"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Analytics Categories) */}
          <aside className="lg:col-span-1 space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold mb-4">Explore Analytics</h2>
            <FeatureCardRedesigned
              title="Session Analysis"
              description="Track evolution, weather, safety cars"
              icon={<Timer className="h-6 w-6 text-red-400" />}
              linkTo="/dashboard"
            />
            <FeatureCardRedesigned
              title="Driver Performance"
              description="Metrics, styles, comparisons"
              icon={<User className="h-6 w-6 text-blue-400" />}
              linkTo="/drivers"
            />
            <FeatureCardRedesigned
              title="Telemetry Deep Dive"
              description="Car data, G-forces, ERS usage"
              icon={<Gauge className="h-6 w-6 text-green-400" />}
              linkTo="/dashboard"
            />
             <FeatureCardRedesigned
              title="Strategy Insights"
              description="Pit stops, tire wear, simulations"
              icon={<Cpu className="h-6 w-6 text-yellow-400" />}
              linkTo="/dashboard"
            />
          </aside>

        </div>
      </div>
    </div>
  );
};

// Redesigned Feature Card Component
const FeatureCardRedesigned = ({
  title,
  description,
  icon,
  linkTo
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(linkTo)}
      className={cn(
        "bg-gray-900/70 border-gray-700/80 hover:border-gray-600",
        "cursor-pointer transition-all duration-200 ease-in-out",
        "hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1 group"
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-red-400 transition-colors">{title}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
          </div>
          <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
             {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
         <div className="flex justify-end items-center text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Explore
            <ArrowRight className="w-3 h-3 ml-1"/>
         </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
