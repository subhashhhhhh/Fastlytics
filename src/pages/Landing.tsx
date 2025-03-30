import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { BarChart, GitCompareArrows, Clock, Fuel, Users, Share2, Cpu, Cloud, BarChart3 } from 'lucide-react'; // Added Cpu, Cloud, BarChart3 icons
import LandingNavbar from '@/components/LandingNavbar'; // Import the Navbar

const Landing: React.FC = () => {
  return (
    <> {/* Wrap in fragment */}
      <LandingNavbar /> {/* Add the Navbar here */}
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white p-4 md:p-8 pt-0"> {/* Adjusted padding-top if needed due to sticky nav */}
        {/* Hero Section */}
        <header className="text-center pt-16 pb-12 md:pt-24 md:pb-20 w-full max-w-4xl mx-auto">
          {/* Optional: Add a subtle F1 car silhouette or track graphic here */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            🏎️ Fast<span className="text-red-500">lytics</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock the Speed. Dive deep into historical Formula 1 data with intuitive charts and powerful comparisons.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Explore Dashboard
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300">
                Sign Up / Log In
              </Button>
            </Link>
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
                1. Data Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                We crunch complex historical F1 data behind the scenes, pre-generating insightful charts and visualizations for entire race sessions.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 Card */}
          <Card className="bg-gray-900 border-gray-800 text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Cloud className="text-red-500 h-6 w-6" />
                2. Optimized Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                These ready-to-view charts are stored efficiently in the cloud, optimized for rapid delivery across the globe.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 Card */}
          <Card className="bg-gray-900 border-gray-800 text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <BarChart3 className="text-red-500 h-6 w-6" />
                3. Instant Exploration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                You get lightning-fast access to browse, filter, and compare insights instantly – no waiting for calculations, just pure F1 analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Visual Showcase Section */}
        <section id="showcase" className="w-full max-w-5xl text-center py-16 px-4">
           <h2 className="text-3xl md:text-4xl font-semibold mb-10">See It In Action</h2>
           {/* Replace with an actual chart image or interactive demo component */}
           <img src="/placeholder.svg" alt="Example F1 Chart" className="rounded-lg shadow-xl mx-auto border border-gray-700" />
           <p className="text-gray-400 mt-4">Example: Lap time comparison between two drivers.</p>
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
            <Link to="/auth">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-300">
                Sign Up / Log In
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default Landing;
