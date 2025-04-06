import React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { BarChart, GitCompareArrows, Clock, Fuel, Users, Share2, Cpu, Database, Server, Gauge } from 'lucide-react'; // Added Gauge icon
import LandingNavbar from '@/components/LandingNavbar'; // Import the Navbar
import RacingChart from '@/components/RacingChart'; // Import the chart component
import { LapTimeDataPoint } from '@/lib/api'; // Import the data type

// Sample static data for the showcase chart
const sampleLapData: LapTimeDataPoint[] = [
  { LapNumber: 1, VER: 95.3, LEC: 95.8 },
  { LapNumber: 2, VER: 94.1, LEC: 94.5 },
  { LapNumber: 3, VER: 93.8, LEC: 94.0 },
  { LapNumber: 4, VER: 93.9, LEC: 94.2 },
  { LapNumber: 5, VER: 94.5, LEC: 94.3 },
  { LapNumber: 6, VER: 94.2, LEC: 94.6 },
  { LapNumber: 7, VER: 94.0, LEC: 94.1 },
  { LapNumber: 8, VER: 93.7, LEC: 93.9 },
  { LapNumber: 9, VER: 93.5, LEC: 93.8 },
  { LapNumber: 10, VER: 93.6, LEC: 93.7 },
];


const Landing: React.FC = () => {
  const { user } = useAuth(); // Get user state

  return (
    <> {/* Wrap in fragment */}
      <LandingNavbar /> {/* Add the Navbar here */}
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white p-4 md:p-8 pt-0"> {/* Adjusted padding-top if needed due to sticky nav */}
        {/* Hero Section */}
        <header className="text-center pt-16 pb-12 md:pt-24 md:pb-20 w-full max-w-4xl mx-auto">
          {/* Optional: Add a subtle F1 car silhouette or track graphic here */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight flex items-center justify-center"> {/* Removed gap-3 */}
            <Gauge className="h-10 w-10 md:h-12 md:w-12 text-red-500 mr-2" /> {/* Added mr-2 */}
            <span className="transition-colors duration-200 hover:text-red-500">Fast</span><span className="text-red-500">lytics</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock the Speed. Dive deep into historical Formula 1 data with intuitive charts and powerful comparisons.
          </p>
          {/* Product Hunt Badge */}
          <div className="mb-8 flex justify-center">
            <a href="https://www.producthunt.com/posts/fastlytics?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-fastlytics" target="_blank" rel="noopener noreferrer"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=948509&theme=light&t=1743539982583" alt="Fastlytics - In-depth Formula 1 race analysis through data visualization | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" /></a>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Explore Dashboard
              </Button>
            </Link>
            {!user && ( // Conditionally render based on user state
              <Link to="/auth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300">
                  Sign Up / Log In
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl text-center py-16 px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10">Analyze Like a Pro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature Card 1 */}
            <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <GitCompareArrows className="text-red-500 h-6 w-6" />
                  Lap Time Comparisons
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Pit drivers head-to-head on any circuit. See who truly had the edge, lap by lap.
                </CardDescription>
              </CardHeader>
              {/* Optional: <CardContent> for a small visual/example </CardContent> */}
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Fuel className="text-red-500 h-6 w-6" />
                  Tire Strategy Breakdowns
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Visualize pit stop windows, compound performance, and stint lengths. Understand the race strategy.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <BarChart className="text-red-500 h-6 w-6" />
                  Position Change Graphs
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Relive the overtakes and track position battles throughout the race with dynamic charts.
                </CardDescription>
              </CardHeader>
            </Card>

             {/* Feature Card 4 (Example - Add more as needed) */}
             <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Clock className="text-red-500 h-6 w-6" />
                  Historical Data Access
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Explore decades of F1 history. Compare eras, drivers, and teams across different regulations.
                </CardDescription>
              </CardHeader>
            </Card>

             {/* Feature Card 5 */}
             <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Users className="text-red-500 h-6 w-6" />
                  User Accounts
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Save your favorite drivers, teams, and chart comparisons for quick access later.
                </CardDescription>
              </CardHeader>
            </Card>

             {/* Feature Card 6 */}
             <Card className="bg-gray-900 border-gray-800 text-left hover:border-red-500 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Share2 className="text-red-500 h-6 w-6" />
                  Social Sharing
                </CardTitle>
                <CardDescription className="text-gray-400 pt-1">
                  Easily share your findings and interesting charts with fellow F1 enthusiasts online.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-6xl text-center py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">How It Works: Speed & Simplicity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Step 1 Card */}
            <Card className="bg-gray-900 border-gray-800 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Cpu className="text-red-500 h-6 w-6" />
                  1. Backend Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our Python backend uses the FastF1 library to fetch raw data, processes it, and saves key insights into an optimized JSON cache.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 Card */}
            <Card className="bg-gray-900 border-gray-800 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Server className="text-red-500 h-6 w-6" />
                  2. API Layer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  A lightweight FastAPI server reads directly from the pre-processed cache, ensuring rapid responses for most data requests. Live telemetry is fetched on demand.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 Card */}
            <Card className="bg-gray-900 border-gray-800 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Database className="text-red-500 h-6 w-6" />
                  3. Frontend Interaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  The React frontend calls our API and uses libraries like Recharts to render interactive charts and tables for your analysis.
                </p>
            </CardContent>
          </Card>
        </div>
      </section>

        {/* Open Source Section */}
        <section id="open-source" className="w-full max-w-6xl text-center py-16 px-4 bg-gray-900/50 border-y border-gray-800/70 my-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Built by the Community, For the Community</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            Fastlytics is proud to be an open-source project! Platforms offering this depth of F1 data visualization are rare, and even fewer are built transparently in the open. We believe in collaboration and sharing knowledge with the F1 tech community.
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            Explore the code, contribute features, or report issues on our GitHub repository.
          </p>
          <a href="https://github.com/subhashhhhhh/Fastlytics" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="border-red-500 text-red-500 hover:bg-red-900/30 hover:text-red-400 font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-1.5 6-6.5.08-1.3-.32-2.7-.94-3.7a5.4 5.4 0 0 0-.62-4.3s-1-.3-3.3 1.3a12.3 12.3 0 0 0-6.2 0C5.1 2.8 4 3.1 4 3.1a5.4 5.4 0 0 0-.62 4.3c-.62 1-.94 2.4-.94 3.7 0 5 3 6.5 6 6.5-1 1-1 2.5-1 3.5V22"/></svg>
              View on GitHub
            </Button>
          </a>
        </section>

      {/* Visual Showcase Section */}
         <section id="showcase" className="w-full max-w-5xl text-center py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-semibold mb-10">See It In Action</h2>
            {/* Embed the RacingChart component with static data */}
            <div className="bg-gray-900/70 border border-gray-700/80 backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-xl mx-auto">
               <RacingChart
                 title="Example: VER vs LEC Lap Times (First 10 Laps)"
                 year={2023} // Dummy year for styling/context
                 event="Sample Race" // Dummy event
                 session="R" // Dummy session
                 initialDrivers={["VER", "LEC"]}
                 staticData={sampleLapData} // Pass the static data
                 className="h-[400px]" // Increase chart height to accommodate legend and text
                 hideDownloadButton={true} // Hide the download button in showcase
               />
               <p className="text-gray-400 mt-6 pt-2 border-t border-gray-800/50">Interactive lap time comparison chart showing two drivers' performance across laps.</p>
            </div>
         </section>

        {/* Final CTA Section */}
        <section id="get-started" className="w-full max-w-4xl text-center py-16 px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Ready to Dive In?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Explore the dashboard or create an account to save your favorite insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Explore Dashboard
              </Button>
            </Link>
            {!user && ( // Conditionally render based on user state
              <Link to="/auth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300">
                  Sign Up / Log In
                </Button>
              </Link>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default Landing;
