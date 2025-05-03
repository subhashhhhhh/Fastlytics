import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FloatingNavbar from '@/components/FloatingNavbar';
import RacingChart from '@/components/RacingChart';
import { LapTimeDataPoint } from '@/lib/api';
import {
  GitCompareArrows, Clock, Fuel, Users, Share2, Cpu,
  Database, Server, Gauge, ChevronRight, ArrowRight,
  LineChart, BarChart2, Trophy, Zap, Github, MessageCircle
} from 'lucide-react';

// Sample data for the showcase chart
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const shimmer = {
  hidden: { backgroundPosition: '200% 0', opacity: 0.7 },
  visible: {
    backgroundPosition: '-200% 0',
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "linear"
    }
  }
};

const Landing: React.FC = () => {
  // Refs for scroll-triggered animations
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const showcaseRef = useRef(null);
  const communityRef = useRef(null);
  
  // Check if sections are in view
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const isHowItWorksInView = useInView(howItWorksRef, { once: false, amount: 0.2 });
  const isShowcaseInView = useInView(showcaseRef, { once: false, amount: 0.2 });
  const isCommunityInView = useInView(communityRef, { once: false, amount: 0.2 });
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar transparent={true} />
      
      {/* Background Elements - decorative circuit lines */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0" 
          style={{ y }}
        />
        <motion.div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/10 to-red-600/0" 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }} 
        />
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[300px] h-[300px] rounded-full bg-red-900/10 blur-3xl" />
      </div>
      
        {/* Hero Section */}
      <motion.header 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-8 md:pt-12 text-center z-10"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        {/* Animated race line */}
        <motion.div 
          className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-700/0 via-red-700 to-red-700/0"
          variants={shimmer}
          style={{
            backgroundSize: '200% 100%'
          }}
        />
        
        {/* No Registration Notification - positioned above logo */}
        <motion.div 
          variants={fadeInUp} 
          className="mb-10 bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-md border border-red-500/40 rounded-xl px-5 py-4 max-w-xl mx-auto shadow-[0_4px_20px_rgba(185,28,28,0.15)] overflow-hidden relative"
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0"></div>
          
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <div className="flex items-center justify-center mb-1.5">
                <span className="bg-red-600/70 text-white text-xs font-bold px-2 py-0.5 rounded mr-2">ANNOUNCEMENT</span>
                <span className="text-red-300 text-xs">Now Live</span>
              </div>
              <h3 className="text-white font-bold text-base md:text-lg mb-1">No Registration Required!</h3>
              <p className="text-red-200/90 text-sm md:text-base max-w-md mx-auto">
                Fastlytics is now completely open to everyone - just dive in and explore.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="mb-6">
          <motion.div 
            className="inline-block mb-2"
            animate={{ 
              rotateZ: [0, 5, 0, -5, 0],
              transition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
          >
            <Gauge className="h-16 w-16 md:h-20 md:w-20 text-red-500 mx-auto" />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-4 mx-auto"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ backgroundSize: '200% 100%' }}
          >
            Fast<span className="text-red-500">lytics</span>
          </motion.h1>
        </motion.div>
        
        <motion.p 
          variants={fadeInUp} 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Unlock the speed. Dive deep into Formula 1 data with intuitive visualizations and powerful race analysis.
        </motion.p>

        {/* Remove Product Hunt Badge */}
        
        <motion.div variants={fadeInUp}>
            <Link to="/dashboard">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 text-lg">
                Explore Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <ChevronRight className="h-8 w-8 text-gray-400 rotate-90" />
        </motion.div>
      </motion.header>

        {/* Features Section */}
      <section 
        id="features" 
        className="relative py-20 md:py-32 px-4"
        ref={featuresRef}
      >
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
          variants={staggerChildren}
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Analyze Like a <span className="text-red-500">Pro</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Powerful tools and visualizations to understand every aspect of Formula 1 racing.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Feature Cards */}
            {[
              {
                icon: <GitCompareArrows className="text-red-500 h-10 w-10" />,
                title: "Lap Time Comparisons",
                description: "Pit drivers head-to-head on any circuit. See who truly had the edge, lap by lap."
              },
              {
                icon: <Fuel className="text-red-500 h-10 w-10" />,
                title: "Tire Strategy Breakdowns",
                description: "Visualize pit stop windows, compound performance, and stint lengths. Understand the race strategy."
              },
              {
                icon: <LineChart className="text-red-500 h-10 w-10" />,
                title: "Position Change Graphs",
                description: "Relive the overtakes and track position battles throughout the race with dynamic charts."
              },
              {
                icon: <Clock className="text-red-500 h-10 w-10" />,
                title: "Historical Data Access",
                description: "Explore decades of F1 history. Compare eras, drivers, and teams across different regulations."
              },
              {
                icon: <Trophy className="text-red-500 h-10 w-10" />,
                title: "Championship Standings",
                description: "Track driver and constructor points throughout the season with detailed standings."
              },
              {
                icon: <Zap className="text-red-500 h-10 w-10" />,
                title: "Telemetry Analysis",
                description: "Dive into detailed car telemetry data including throttle, brake, DRS usage and more."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={isFeaturesInView ? "visible" : "hidden"}
                whileHover="hover"
                custom={{
                  delay: index * 0.1
                }}
                transition={{ 
                  staggerChildren: 0.1,
                  delayChildren: index * 0.1
                }}
                className="bg-gray-900/60 hover:bg-gray-900/80 backdrop-blur-lg border border-gray-800 hover:border-red-900/50 rounded-2xl p-6 transition-colors duration-300 h-full flex flex-col"
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.8, 
                      ease: "easeOut",
                      delay: index * 0.1
                    } 
                  },
                  hover: { 
                    y: -10, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }
                }}
              >
                <div className="rounded-full bg-gray-800/50 w-16 h-16 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        className="relative py-20 md:py-32 px-4"
        ref={howItWorksRef}
      >
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isHowItWorksInView ? "visible" : "hidden"}
          variants={staggerChildren}
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Powerful infrastructure built to deliver F1 insights at lightning speed.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-700/0 via-red-700/50 to-red-700/0 transform -translate-y-1/2 z-0"></div>
            
            {/* Steps */}
            {[
              {
                icon: <Cpu className="text-red-500 h-10 w-10" />,
                title: "Backend Processing",
                description: "Our Python backend uses the FastF1 library to fetch raw data, processes it, and saves key insights into an optimized JSON cache."
              },
              {
                icon: <Server className="text-red-500 h-10 w-10" />,
                title: "API Layer",
                description: "A lightweight FastAPI server reads directly from the pre-processed cache, ensuring rapid responses for most data requests. Live telemetry is fetched on demand."
              },
              {
                icon: <Database className="text-red-500 h-10 w-10" />,
                title: "Frontend Interaction",
                description: "The React frontend calls our API and uses libraries like Recharts to render interactive charts and tables for your analysis."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={isHowItWorksInView ? "visible" : "hidden"}
                whileHover="hover"
                custom={{
                  delay: index * 0.1
                }}
                className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 relative z-10 h-full flex flex-col"
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.8, 
                      ease: "easeOut",
                      delay: index * 0.1
                    } 
                  },
                  hover: { 
                    y: -10, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }
                }}
              >
                <div className="mx-auto rounded-full bg-gray-800/50 w-20 h-20 flex items-center justify-center mb-5 relative">
                  {step.icon}
                  <div className="absolute -top-3 -right-3 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-gray-400 text-center">{step.description}</p>
              </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Showcase Section */}
      <section 
        id="showcase" 
        className="relative py-20 md:py-32 px-4"
        ref={showcaseRef}
      >
        <div className="absolute right-0 w-full md:w-1/2 h-full bg-red-900/5 -skew-x-12 transform -z-10"></div>
        
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isShowcaseInView ? "visible" : "hidden"}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See It In <span className="text-red-500">Action</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Interactive visualizations that bring Formula 1 data to life.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-900/70 border border-gray-800 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
          >
               <RacingChart
                 title="Example: VER vs LEC Lap Times (First 10 Laps)"
              year={2023}
              event="Sample Race"
              session="R"
                 initialDrivers={["VER", "LEC"]}
              staticData={sampleLapData}
              className="h-[400px]"
              hideDownloadButton={true}
            />
            <p className="text-gray-400 mt-6 pt-4 border-t border-gray-800/50 text-center">
              Interactive lap time comparison chart showing two drivers' performance across laps.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Community Section */}
      <section 
        id="community" 
        className="relative py-20 md:py-32 px-4"
        ref={communityRef}
      >
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isCommunityInView ? "visible" : "hidden"}
          variants={staggerChildren}
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our <span className="text-red-500">Community</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Connect with other Formula 1 fans and contribute to this open-source project.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Discord Card */}
            <motion.div
              initial="hidden"
              animate={isCommunityInView ? "visible" : "hidden"}
              whileHover="hover"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden"
              }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.8, 
                    ease: "easeOut",
                    delay: 0.1
                  } 
                },
                hover: { 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }
              }}
              className="bg-[#5865F2]/10 backdrop-blur-lg border border-[#5865F2]/20 rounded-2xl p-8 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <svg width="80" height="60" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60.1 5C55.5 2.9 50.5 1.3 45.3 0.3C45.2 0.3 45.1 0.3 45.1 0.4C44.5 1.5 43.8 2.9 43.3 4C37.6 3.1 32 3.1 26.4 4C25.9 2.9 25.2 1.5 24.6 0.4C24.6 0.3 24.5 0.3 24.4 0.3C19.2 1.3 14.2 2.9 9.6 5C9.6 5 9.5 5.1 9.5 5.1C1.4 17.5 -0.9 29.6 0.3 41.5C0.3 41.6 0.3 41.7 0.4 41.7C6.1 45.9 11.6 48.4 17 50.1C17.1 50.1 17.2 50.1 17.3 50C18.6 48.2 19.8 46.3 20.8 44.3C20.9 44.1 20.8 43.9 20.6 43.8C18.8 43.1 17.1 42.3 15.4 41.4C15.2 41.3 15.2 41 15.4 40.9C15.7 40.7 16.1 40.4 16.4 40.2C16.5 40.1 16.6 40.1 16.7 40.2C27.7 45.2 39.6 45.2 50.5 40.2C50.6 40.1 50.7 40.1 50.8 40.2C51.1 40.4 51.5 40.7 51.8 40.9C52 41 52 41.3 51.8 41.4C50.1 42.3 48.4 43.1 46.6 43.8C46.4 43.9 46.3 44.1 46.4 44.3C47.4 46.3 48.6 48.2 49.9 50C50 50.1 50.1 50.1 50.2 50.1C55.7 48.4 61.2 45.9 66.9 41.7C67 41.7 67 41.6 67 41.5C68.4 27.8 64.8 15.8 60.2 5.1C60.2 5.1 60.1 5 60.1 5ZM22.4 34.5C19.1 34.5 16.4 31.5 16.4 27.8C16.4 24.1 19.1 21.1 22.4 21.1C25.8 21.1 28.5 24.2 28.4 27.8C28.4 31.5 25.7 34.5 22.4 34.5ZM47.4 34.5C44.1 34.5 41.4 31.5 41.4 27.8C41.4 24.1 44.1 21.1 47.4 21.1C50.8 21.1 53.5 24.2 53.4 27.8C53.4 31.5 50.8 34.5 47.4 34.5Z" fill="#5865F2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Discord Community</h3>
              <p className="text-gray-300 mb-6">
                Connect with F1 enthusiasts, discuss races, share insights, and get updates from the Fastlytics team.
              </p>
              <a 
                href="https://discord.gg/bSEGSMwFDn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#5865F2] hover:bg-[#4752c4] text-white py-3 px-6 rounded-lg flex items-center transition-colors"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Join our Discord
              </a>
            </motion.div>
            
            {/* GitHub Card with Product Hunt link added */}
            <motion.div
              initial="hidden"
              animate={isCommunityInView ? "visible" : "hidden"}
              whileHover="hover"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden"
              }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.8, 
                    ease: "easeOut",
                    delay: 0.2
                  } 
                },
                hover: { 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }
              }}
              className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <Github className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Resources</h3>
              <p className="text-gray-300 mb-6">
                Fastlytics is built by the community, for the community. Contribute to the project, report issues, or explore the code.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a 
                  href="https://github.com/subhashhhhhh/Fastlytics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
                <a 
                  href="https://www.producthunt.com/posts/fastlytics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Product Hunt
                </a>
              </div>
            </motion.div>
            </div>
        </motion.div>
         </section>

        {/* Final CTA Section */}
      <section className="relative py-24 md:py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-black/50 z-0"></div>
        
        <motion.div
          className="max-w-4xl mx-auto relative z-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to <span className="text-red-500">Accelerate</span> Your F1 Analysis?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Dive into detailed race analytics, telemetry data, and championship insights today.
          </p>
             <Link to="/dashboard">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-6 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 text-xl">
                Explore Dashboard
              <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
        </motion.div>
        </section>
      </div>
  );
};

export default Landing;